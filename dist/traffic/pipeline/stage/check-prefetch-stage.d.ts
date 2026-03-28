/**
 * Check Prefetch Stage
 *
 * Detects and blocks prefetch requests if configured.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/CheckPrefetchStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
/**
 * Check Prefetch Stage - blocks prefetch requests
 */
export declare class CheckPrefetchStage implements StageInterface {
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, logEntry: TrafficLogEntry): Payload;
    /**
     * Check if prefetch should be ignored
     */
    private _getIgnorePrefetchSetting;
    /**
     * Detect if request is a prefetch
     */
    private _isPrefetchDetected;
}
//# sourceMappingURL=check-prefetch-stage.d.ts.map