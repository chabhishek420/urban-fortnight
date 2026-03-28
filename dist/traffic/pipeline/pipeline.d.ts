/**
 * Pipeline Orchestrator
 *
 * Executes stages in sequence, passing the payload through each stage.
 * Handles stage recursion for campaign forwarding and error handling.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Pipeline.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../index.js';
/**
 * Exception thrown during pipeline execution
 */
export declare class PipelineException extends Error {
    readonly stageName?: string | undefined;
    readonly cause?: Error | undefined;
    constructor(message: string, stageName?: string | undefined, cause?: Error | undefined);
}
/**
 * Pipeline Interface
 *
 * Defines the contract for pipeline implementations
 */
export interface PipelineInterface {
    /**
     * Add a stage to the pipeline
     * @returns this (for method chaining)
     */
    addStage(stage: StageInterface): this;
    /**
     * Process the payload through all stages
     * @returns The final payload after all stages have processed it
     */
    process(payload: Payload, logEntry: TrafficLogEntry): Promise<Payload>;
}
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
export declare class Pipeline implements PipelineInterface {
    private _stages;
    private _repeats;
    private _stagesFrozen;
    /**
     * Create a new pipeline
     * @param stages - Initial stages (optional)
     */
    constructor(stages?: StageInterface[]);
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
    firstLevelStages(): this;
    /**
     * Set the second level stages for campaign forwarding
     *
     * Second level stages are used when redirecting to another campaign.
     * They skip initial click building and domain checks.
     *
     * @returns this (for method chaining)
     */
    secondLevelStages(): this;
    /**
     * Get first level stages
     * Override this method to customize stage list
     */
    protected _getFirstLevelStages(): StageInterface[];
    /**
     * Get second level stages
     * Override this method to customize stage list
     */
    protected _getSecondLevelStages(): StageInterface[];
    /**
     * Freeze stages to prevent modification
     * Used when stages should not be reset during recursion
     */
    freezeStages(): void;
    /**
     * Set the stages for this pipeline
     * @param stages - Array of stages to execute
     */
    setStages(stages: StageInterface[]): void;
    /**
     * Add a stage to the pipeline
     * @param stage - Stage to add
     * @returns this (for method chaining)
     */
    addStage(stage: StageInterface): this;
    /**
     * Get current stages
     */
    getStages(): StageInterface[];
    /**
     * Get repeat count
     */
    getRepeats(): number;
    /**
     * Reset the pipeline state
     */
    reset(): void;
    /**
     * Start processing the payload through all stages
     *
     * @param payload - The initial payload
     * @param logEntry - Traffic log entry for debugging
     * @returns The final payload after all stages
     * @throws PipelineException if stages are empty or execution fails
     */
    process(payload: Payload, logEntry: TrafficLogEntry): Promise<Payload>;
    /**
     * Internal run method that executes stages
     */
    private _run;
    /**
     * Validate payload after stage processing
     */
    private _validatePayload;
    /**
     * Handle campaign forwarding (recursion)
     */
    private _handleCampaignForwarding;
    /**
     * Prepare payload for new campaign processing
     */
    private _preparePayloadForCampaign;
    /**
     * Get stage name for logging/errors
     */
    private _getStageName;
}
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
export declare class PipelineFactory {
    /**
     * Create a pipeline with first level stages
     */
    createFirstLevelPipeline(stages?: StageInterface[]): Pipeline;
    /**
     * Create a pipeline with second level stages
     */
    createSecondLevelPipeline(stages?: StageInterface[]): Pipeline;
    /**
     * Create a custom pipeline with provided stages
     */
    createCustomPipeline(stages: StageInterface[]): Pipeline;
    /**
     * Create a pipeline from a stage configuration
     */
    createFromConfig(config: PipelineConfig): Pipeline;
}
/**
 * Pipeline configuration interface
 */
export interface PipelineConfig {
    stages: StageInterface[];
    frozen?: boolean;
}
export { StageException } from '../../core/pipeline/stage-interface.js';
//# sourceMappingURL=pipeline.d.ts.map