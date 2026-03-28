"use strict";
/**
 * Pipeline Orchestrator
 *
 * Executes stages in sequence, passing the payload through each stage.
 * Handles stage recursion for campaign forwarding and error handling.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Pipeline.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageException = exports.PipelineFactory = exports.Pipeline = exports.PipelineException = void 0;
const stage_interface_js_1 = require("../../core/pipeline/stage-interface.js");
const raw_click_js_1 = require("../model/raw-click.js");
/**
 * Maximum recursion limit for campaign forwarding
 */
const PIPELINE_LIMIT = 10;
/**
 * Exception thrown during pipeline execution
 */
class PipelineException extends Error {
    stageName;
    cause;
    constructor(message, stageName, cause) {
        super(message);
        this.stageName = stageName;
        this.cause = cause;
        this.name = 'PipelineException';
    }
}
exports.PipelineException = PipelineException;
/**
 * Pipeline Orchestrator
 *
 * Main pipeline implementation that executes stages in sequence.
 * Supports:
 * - Sequential stage execution
 * - Payload transformation
 * - Campaign recursion handling
 * - Error handling and logging
 *
 * @example
 * ```typescript
 * const pipeline = new Pipeline()
 *   .firstLevelStages();
 *
 * const result = await pipeline.process(payload, logEntry);
 * ```
 */
class Pipeline {
    _stages = [];
    _repeats = 0;
    _stagesFrozen = false;
    /**
     * Create a new pipeline
     * @param stages - Initial stages (optional)
     */
    constructor(stages = []) {
        this._stages = stages;
    }
    /**
     * Set the first level stages for standard click processing
     *
     * The first level stages handle:
     * 1. Domain-level redirects
     * 2. Prefetch detection
     * 3. Click data construction
     * 4. Campaign resolution
     * 5. Stream selection
     * 6. Landing/Offer selection
     * 7. Action execution
     * 8. Click storage
     *
     * @returns this (for method chaining)
     */
    firstLevelStages() {
        // Import stages dynamically to avoid circular dependencies
        // These stages are imported here to allow for stage injection
        const stages = this._getFirstLevelStages();
        this.setStages(stages);
        return this;
    }
    /**
     * Set the second level stages for campaign forwarding
     *
     * Second level stages are used when redirecting to another campaign.
     * They skip initial click building and domain checks.
     *
     * @returns this (for method chaining)
     */
    secondLevelStages() {
        const stages = this._getSecondLevelStages();
        this.setStages(stages);
        return this;
    }
    /**
     * Get first level stages
     * Override this method to customize stage list
     */
    _getFirstLevelStages() {
        // Import stages from factory
        const { getFirstLevelStages } = require('./stages.js');
        return getFirstLevelStages();
    }
    /**
     * Get second level stages
     * Override this method to customize stage list
     */
    _getSecondLevelStages() {
        const { getSecondLevelStages } = require('./stages.js');
        return getSecondLevelStages();
    }
    /**
     * Freeze stages to prevent modification
     * Used when stages should not be reset during recursion
     */
    freezeStages() {
        this._stagesFrozen = true;
    }
    /**
     * Set the stages for this pipeline
     * @param stages - Array of stages to execute
     */
    setStages(stages) {
        this._stages = stages;
    }
    /**
     * Add a stage to the pipeline
     * @param stage - Stage to add
     * @returns this (for method chaining)
     */
    addStage(stage) {
        this._stages.push(stage);
        return this;
    }
    /**
     * Get current stages
     */
    getStages() {
        return [...this._stages];
    }
    /**
     * Get repeat count
     */
    getRepeats() {
        return this._repeats;
    }
    /**
     * Reset the pipeline state
     */
    reset() {
        this._repeats = 0;
        this._stagesFrozen = false;
    }
    /**
     * Start processing the payload through all stages
     *
     * @param payload - The initial payload
     * @param logEntry - Traffic log entry for debugging
     * @returns The final payload after all stages
     * @throws PipelineException if stages are empty or execution fails
     */
    async process(payload, logEntry) {
        if (this._stages.length === 0) {
            throw new PipelineException('No stages set');
        }
        logEntry.add('Starting pipeline');
        logEntry.startProfiling();
        try {
            payload = await this._run(payload, logEntry);
        }
        catch (error) {
            if (error instanceof PipelineException || error instanceof stage_interface_js_1.StageException) {
                throw error;
            }
            throw new PipelineException(`Pipeline execution failed: ${error instanceof Error ? error.message : String(error)}`, undefined, error instanceof Error ? error : undefined);
        }
        finally {
            logEntry.stopProfiling('Pipeline execution time');
        }
        return payload;
    }
    /**
     * Internal run method that executes stages
     */
    async _run(payload, logEntry) {
        for (const stage of this._stages) {
            const stageName = this._getStageName(stage);
            try {
                // Process stage (handle both sync and async)
                const result = stage.process(payload, logEntry);
                payload = result instanceof Promise ? await result : result;
            }
            catch (error) {
                if (error instanceof stage_interface_js_1.StageException) {
                    throw error;
                }
                throw new PipelineException(`Stage ${stageName} failed: ${error instanceof Error ? error.message : String(error)}`, stageName, error instanceof Error ? error : undefined);
            }
            // Validate payload after each stage
            this._validatePayload(payload, stageName);
            // Handle aborted payload (campaign forwarding)
            if (payload.isAborted()) {
                if (payload.getForcedCampaignId()) {
                    return this._handleCampaignForwarding(payload, logEntry);
                }
                return payload;
            }
        }
        return payload;
    }
    /**
     * Validate payload after stage processing
     */
    _validatePayload(payload, stageName) {
        if (!payload) {
            throw new PipelineException(`${stageName} doesn't return payload`, stageName);
        }
        if (!payload.getServerRequest()) {
            throw new PipelineException(`${stageName} set serverRequest as null`, stageName);
        }
        if (!payload.getResponse()) {
            throw new PipelineException(`${stageName} set response as null`, stageName);
        }
    }
    /**
     * Handle campaign forwarding (recursion)
     */
    async _handleCampaignForwarding(payload, logEntry) {
        // Reset to first level stages if not frozen
        if (!this._stagesFrozen) {
            this.firstLevelStages();
        }
        this._repeats++;
        if (this._repeats >= PIPELINE_LIMIT) {
            const streamId = payload.getStream()?.getId() ?? 'X';
            const campaignId = payload.getCampaign()?.getId() ?? '';
            const msg = `Stream #${streamId} in campaign "${campaignId}" makes infinite recursion. Aborting.`;
            logEntry.add(msg);
            throw new PipelineException(msg);
        }
        payload = this._preparePayloadForCampaign(payload);
        return this._run(payload, logEntry);
    }
    /**
     * Prepare payload for new campaign processing
     */
    _preparePayloadForCampaign(payload) {
        const rawClick = payload.getRawClick();
        if (!rawClick) {
            throw new PipelineException('rawClick is empty');
        }
        // Create new RawClick with same data
        const nextRawClick = new raw_click_js_1.RawClick(rawClick.getData());
        // Set parent campaign info
        if (payload.getCampaign()) {
            const campaignId = payload.getCampaign()?.getId();
            if (campaignId !== undefined) {
                nextRawClick.setParentCampaignId(campaignId);
            }
        }
        nextRawClick.setParentSubId(rawClick.getSubId());
        // Clear payload state for new campaign
        payload.setCampaign(null);
        payload.setOffer(null);
        payload.setLanding(null);
        payload.setStream(null);
        payload.setActionPayload(null);
        payload.setActionType(null);
        payload.setActionOptions(null);
        payload.setRawClick(nextRawClick);
        payload.setForcedStreamId(null);
        payload.abort(false);
        return payload;
    }
    /**
     * Get stage name for logging/errors
     */
    _getStageName(stage) {
        if (stage && stage.constructor) {
            return stage.constructor.name;
        }
        return 'UnknownStage';
    }
}
exports.Pipeline = Pipeline;
/**
 * Pipeline Factory
 *
 * Creates configured pipelines for different use cases.
 *
 * @example
 * ```typescript
 * const factory = new PipelineFactory();
 * const pipeline = factory.createFirstLevelPipeline();
 * ```
 */
class PipelineFactory {
    /**
     * Create a pipeline with first level stages
     */
    createFirstLevelPipeline(stages) {
        const pipeline = new Pipeline(stages);
        if (!stages) {
            pipeline.firstLevelStages();
        }
        return pipeline;
    }
    /**
     * Create a pipeline with second level stages
     */
    createSecondLevelPipeline(stages) {
        const pipeline = new Pipeline(stages);
        if (!stages) {
            pipeline.secondLevelStages();
        }
        return pipeline;
    }
    /**
     * Create a custom pipeline with provided stages
     */
    createCustomPipeline(stages) {
        return new Pipeline(stages);
    }
    /**
     * Create a pipeline from a stage configuration
     */
    createFromConfig(config) {
        const pipeline = new Pipeline();
        for (const stage of config.stages) {
            pipeline.addStage(stage);
        }
        if (config.frozen) {
            pipeline.freezeStages();
        }
        return pipeline;
    }
}
exports.PipelineFactory = PipelineFactory;
// Re-export for convenience
var stage_interface_js_2 = require("../../core/pipeline/stage-interface.js");
Object.defineProperty(exports, "StageException", { enumerable: true, get: function () { return stage_interface_js_2.StageException; } });
//# sourceMappingURL=pipeline.js.map