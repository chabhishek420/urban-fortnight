/**
 * Update Stream Uniqueness Session Stage
 *
 * Updates uniqueness session data for stream-level uniqueness.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/UpdateStreamUniquenessSessionStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index.js';
/**
 * Update Stream Uniqueness Session Stage
 */
export declare class UpdateStreamUniquenessSessionStage implements StageInterface {
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, logEntry: TrafficLogEntry): Payload;
    /**
     * Check if visitor is unique for stream
     * @artifact ARTIFACT-024: Simplified uniqueness check
     */
    private _isUniqueForStream;
}
//# sourceMappingURL=update-stream-uniqueness-session-stage.d.ts.map