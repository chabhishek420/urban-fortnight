/**
 * Update Raw Click Stage
 *
 * Updates raw click with campaign data after campaign is found.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/UpdateRawClickStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index.js';
/**
 * Update Raw Click Stage
 */
export declare class UpdateRawClickStage implements StageInterface {
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, _logEntry: TrafficLogEntry): Payload;
    /**
     * Generate visitor code
     */
    private _generateVisitorCode;
    /**
     * Generate sub ID from visitor code
     */
    private _generateSubId;
    /**
     * Simple hash function
     */
    private _simpleHash;
}
//# sourceMappingURL=update-raw-click-stage.d.ts.map