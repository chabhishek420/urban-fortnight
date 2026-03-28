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
export declare abstract class AbstractStage implements StageInterface {
    /**
     * Stage name for logging
     */
    get name(): string;
    /**
     * Log a message to the traffic log
     */
    protected log(logEntry: TrafficLogEntry, message: string): void;
    /**
     * Process the payload - must be implemented by subclasses
     */
    abstract process(payload: Payload, logEntry: TrafficLogEntry): Payload | Promise<Payload>;
}
/**
 * Exception thrown during stage processing
 */
export declare class StageException extends Error {
    readonly stageName?: string | undefined;
    constructor(message: string, stageName?: string | undefined);
}
/**
 * Exception thrown when campaign is not found
 */
export declare class CampaignNotFoundException extends StageException {
    constructor(message?: string);
}
/**
 * Exception thrown when sending to another campaign
 */
export declare class SendToCampaignException extends StageException {
    readonly campaignId: number;
    constructor(campaignId: number, message?: string);
}
//# sourceMappingURL=stage-interface.d.ts.map