/**
 * Pipeline Orchestrator
 * 
 * Executes stages in sequence, passing the payload through each stage.
 * Handles stage recursion for campaign forwarding and error handling.
 * 
 * @see keitaro_source/application/Traffic/Pipeline/Pipeline.php
 */

import type { StageInterface, Payload, TrafficLogEntry } from '../index';
import { StageException } from '../../core/pipeline/stage-interface';
import { RawClick } from '../model/raw-click';
import { getFirstLevelStages, getSecondLevelStages } from './stages';

/**
 * Maximum recursion limit for campaign forwarding
 */
const PIPELINE_LIMIT = 10;

/**
 * Exception thrown during pipeline execution
 */
export class PipelineException extends Error {
  constructor(
    message: string,
    public readonly stageName?: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'PipelineException';
  }
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
export class Pipeline implements PipelineInterface {
  private _stages: StageInterface[] = [];
  private _repeats: number = 0;
  private _stagesFrozen: boolean = false;

  /**
   * Create a new pipeline
   * @param stages - Initial stages (optional)
   */
  constructor(stages: StageInterface[] = []) {
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
  firstLevelStages(): this {
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
  secondLevelStages(): this {
    const stages = this._getSecondLevelStages();
    this.setStages(stages);
    return this;
  }

  /**
   * Get first level stages
   * Override this method to customize stage list
   */
  protected _getFirstLevelStages(): StageInterface[] {
    return getFirstLevelStages();
  }

  /**
   * Get second level stages
   * Override this method to customize stage list
   */
  protected _getSecondLevelStages(): StageInterface[] {
    return getSecondLevelStages();
  }

  /**
   * Freeze stages to prevent modification
   * Used when stages should not be reset during recursion
   */
  freezeStages(): void {
    this._stagesFrozen = true;
  }

  /**
   * Set the stages for this pipeline
   * @param stages - Array of stages to execute
   */
  setStages(stages: StageInterface[]): void {
    this._stages = stages;
  }

  /**
   * Add a stage to the pipeline
   * @param stage - Stage to add
   * @returns this (for method chaining)
   */
  addStage(stage: StageInterface): this {
    this._stages.push(stage);
    return this;
  }

  /**
   * Get current stages
   */
  getStages(): StageInterface[] {
    return [...this._stages];
  }

  /**
   * Get repeat count
   */
  getRepeats(): number {
    return this._repeats;
  }

  /**
   * Reset the pipeline state
   */
  reset(): void {
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
  async process(payload: Payload, logEntry: TrafficLogEntry): Promise<Payload> {
    if (this._stages.length === 0) {
      throw new PipelineException('No stages set');
    }

    logEntry.add('Starting pipeline');
    logEntry.startProfiling();

    try {
      payload = await this._run(payload, logEntry);
    } catch (error) {
      if (error instanceof PipelineException || error instanceof StageException) {
        throw error;
      }
      throw new PipelineException(
        `Pipeline execution failed: ${error instanceof Error ? error.message : String(error)}`,
        undefined,
        error instanceof Error ? error : undefined
      );
    } finally {
      logEntry.stopProfiling('Pipeline execution time');
    }

    return payload;
  }

  /**
   * Internal run method that executes stages
   */
  private async _run(payload: Payload, logEntry: TrafficLogEntry): Promise<Payload> {
    for (const stage of this._stages) {
      const stageName = this._getStageName(stage);
      
      try {
        // Process stage (handle both sync and async)
        const result = stage.process(payload, logEntry);
        payload = result instanceof Promise ? await result : result;
      } catch (error) {
        if (error instanceof StageException) {
          throw error;
        }
        throw new PipelineException(
          `Stage ${stageName} failed: ${error instanceof Error ? error.message : String(error)}`,
          stageName,
          error instanceof Error ? error : undefined
        );
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
  private _validatePayload(payload: Payload, stageName: string): void {
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
  private async _handleCampaignForwarding(payload: Payload, logEntry: TrafficLogEntry): Promise<Payload> {
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
  private _preparePayloadForCampaign(payload: Payload): Payload {
    const rawClick = payload.getRawClick();
    
    if (!rawClick) {
      throw new PipelineException('rawClick is empty');
    }

    // Create new RawClick with same data
    const nextRawClick = new RawClick(rawClick.getData());

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
    payload.setForcedStreamId(null as unknown as number);
    payload.abort(false);

    return payload;
  }

  /**
   * Get stage name for logging/errors
   */
  private _getStageName(stage: StageInterface): string {
    if (stage && stage.constructor) {
      return stage.constructor.name;
    }
    return 'UnknownStage';
  }
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
export class PipelineFactory {
  /**
   * Create a pipeline with first level stages
   */
  createFirstLevelPipeline(stages?: StageInterface[]): Pipeline {
    const pipeline = new Pipeline(stages);
    if (!stages) {
      pipeline.firstLevelStages();
    }
    return pipeline;
  }

  /**
   * Create a pipeline with second level stages
   */
  createSecondLevelPipeline(stages?: StageInterface[]): Pipeline {
    const pipeline = new Pipeline(stages);
    if (!stages) {
      pipeline.secondLevelStages();
    }
    return pipeline;
  }

  /**
   * Create a custom pipeline with provided stages
   */
  createCustomPipeline(stages: StageInterface[]): Pipeline {
    return new Pipeline(stages);
  }

  /**
   * Create a pipeline from a stage configuration
   */
  createFromConfig(config: PipelineConfig): Pipeline {
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

/**
 * Pipeline configuration interface
 */
export interface PipelineConfig {
  stages: StageInterface[];
  frozen?: boolean;
}

// Re-export for convenience
export { StageException } from '../../core/pipeline/stage-interface';
