/**
 * Update Hit Limit Stage
 *
 * Updates hit limit counters for streams with limit filters.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/UpdateHitLimitStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index.js';
/**
 * Update Hit Limit Stage
 */
export declare class UpdateHitLimitStage implements StageInterface {
    static readonly LIMIT = "limit";
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, _logEntry: TrafficLogEntry): Payload;
    /**
     * Check if stream has limit filter
     */
    private _hasLimitFilter;
    /**
     * Store hit for rate limiting
     * @artifact ARTIFACT-033: Placeholder - needs hit limit service
     */
    private _storeHit;
    /**
     * Get stream filters
     * @artifact ARTIFACT-034: Placeholder - needs filter repository
     */
    private _getStreamFilters;
}
//# sourceMappingURL=update-hit-limit-stage.d.ts.map