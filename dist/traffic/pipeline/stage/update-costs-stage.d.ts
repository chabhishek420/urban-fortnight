/**
 * Update Costs Stage
 *
 * Calculates and updates click costs based on campaign settings.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/UpdateCostsStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index.js';
/**
 * Update Costs Stage
 */
export declare class UpdateCostsStage implements StageInterface {
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, logEntry: TrafficLogEntry): Payload;
    /**
     * Parse cost value
     */
    private _parseCost;
    /**
     * Patch for Megapush cost format
     */
    private _patchMegapush;
    /**
     * Check if cost is valid
     */
    private _isValidCost;
    /**
     * Apply traffic loss adjustment
     */
    private _applyTrafficLoss;
    /**
     * Check if cost type is CPA, CPS, or RevShare
     */
    private _isCPAorCPSorRevShare;
    /**
     * Check if cost per thousand
     */
    private _isCostPerThousand;
    /**
     * Check if cost per click
     */
    private _isCostPerClick;
}
//# sourceMappingURL=update-costs-stage.d.ts.map