/**
 * Update Payout Stage
 *
 * Calculates and updates payout for CPC offers.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/UpdatePayoutStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index.js';
/**
 * Update Payout Stage
 */
export declare class UpdatePayoutStage implements StageInterface {
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, _logEntry: TrafficLogEntry): Payload;
    /**
     * Check if offer is CPC type
     */
    private _isCPC;
    /**
     * Exchange currency
     * @artifact ARTIFACT-035: Simplified currency exchange
     */
    private _exchangeCurrency;
    /**
     * Get system currency
     * @artifact ARTIFACT-036: Simplified settings access
     */
    private _getSystemCurrency;
}
//# sourceMappingURL=update-payout-stage.d.ts.map