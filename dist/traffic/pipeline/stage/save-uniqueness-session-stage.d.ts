/**
 * Save Uniqueness Session Stage
 *
 * Saves uniqueness session data for tracking unique visitors.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/SaveUniquenessSessionStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index.js';
/**
 * Save Uniqueness Session Stage
 */
export declare class SaveUniquenessSessionStage implements StageInterface {
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, logEntry: TrafficLogEntry): Payload;
    /**
     * Save non-cookie uniqueness data
     * @artifact ARTIFACT-037: Simplified uniqueness storage
     */
    private _saveNonCookies;
}
//# sourceMappingURL=save-uniqueness-session-stage.d.ts.map