/**
 * Update Campaign Uniqueness Session Stage
 *
 * Updates uniqueness session data for campaign-level uniqueness.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/UpdateCampaignUniquenessSessionStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index.js';
/**
 * Update Campaign Uniqueness Session Stage
 */
export declare class UpdateCampaignUniquenessSessionStage implements StageInterface {
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, logEntry: TrafficLogEntry): Payload;
    /**
     * Check if visitor is unique for campaign
     * @artifact ARTIFACT-020: Simplified uniqueness check
     */
    private _isUniqueForCampaign;
    /**
     * Check if visitor is unique globally
     * @artifact ARTIFACT-021: Simplified uniqueness check
     */
    private _isUniqueGlobal;
}
//# sourceMappingURL=update-campaign-uniqueness-session-stage.d.ts.map