/**
 * Check Default Campaign Stage
 *
 * Handles cases where no campaign is found by triggering default actions.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/CheckDefaultCampaignStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
/**
 * Check Default Campaign Stage
 */
export declare class CheckDefaultCampaignStage implements StageInterface {
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, logEntry: TrafficLogEntry): Payload;
    /**
     * Get extra action setting
     * @artifact ARTIFACT-014: Simplified settings access
     */
    private _getExtraAction;
    /**
     * Trigger redirect to extra URL
     */
    private _triggerRedirect;
    /**
     * Trigger 404 not found
     */
    private _triggerNotFound;
    /**
     * Trigger default campaign
     */
    private _triggerCampaign;
    /**
     * Get extra redirect URL
     * @artifact ARTIFACT-015: Simplified settings access
     */
    private _getExtraUrl;
    /**
     * Get default campaign ID
     * @artifact ARTIFACT-016: Simplified settings access
     */
    private _getDefaultCampaignId;
    /**
     * Find campaign by ID
     * @artifact ARTIFACT-017: Placeholder - needs campaign repository
     */
    private _findCampaignById;
}
//# sourceMappingURL=check-default-campaign-stage.d.ts.map