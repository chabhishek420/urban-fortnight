/**
 * Pipeline Stage Interface
 * 
 * Stages are the building blocks of the traffic processing pipeline.
 * Each stage processes the payload and passes it to the next stage.
 * 
 * @see keitaro_source/application/Traffic/Pipeline/Stage/StageInterface.php
 * @artifact ARTIFACT-003: Original declared as 'final class', corrected to interface
 */

import type { Payload } from '../../traffic/pipeline/payload';
import type { TrafficLogEntry } from '../../traffic/logging/traffic-log-entry';

export interface StageInterface {
  /**
   * Process the pipeline payload
   * 
   * @param payload - The current pipeline state
   * @param logEntry - Traffic log entry for debugging
   * @returns Modified payload (must always return payload)
   * @throws StageException if processing fails
   */
  process(payload: Payload, logEntry: TrafficLogEntry): Payload | Promise<Payload>;
}

/**
 * Base stage implementation with common functionality
 */
export abstract class AbstractStage implements StageInterface {
  /**
   * Stage name for logging
   */
  get name(): string {
    return this.constructor.name;
  }

  /**
   * Log a message to the traffic log
   */
  protected log(logEntry: TrafficLogEntry, message: string): void {
    logEntry.add(`[${this.name}] ${message}`);
  }

  /**
   * Process the payload - must be implemented by subclasses
   */
  abstract process(payload: Payload, logEntry: TrafficLogEntry): Payload | Promise<Payload>;
}

/**
 * Exception thrown during stage processing
 */
export class StageException extends Error {
  constructor(message: string, public readonly stageName?: string) {
    super(message);
    this.name = 'StageException';
  }
}

/**
 * Exception thrown when campaign is not found
 */
export class CampaignNotFoundException extends StageException {
  constructor(message: string = 'Campaign not found') {
    super(message, 'FindCampaignStage');
    this.name = 'CampaignNotFoundException';
  }
}

/**
 * Exception thrown when sending to another campaign
 */
export class SendToCampaignException extends StageException {
  constructor(
    public readonly campaignId: number,
    message: string = `Redirecting to campaign ${campaignId}`
  ) {
    super(message, 'CheckSendingToAnotherCampaign');
    this.name = 'SendToCampaignException';
  }
}
