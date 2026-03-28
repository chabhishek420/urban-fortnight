/**
 * Check Sending To Another Campaign Stage
 *
 * Handles campaign chaining - when an action redirects to another campaign.
 * Sets the forced campaign ID and aborts the current pipeline execution.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/CheckSendingToAnotherCampaign.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index.js';
/**
 * Check Sending To Another Campaign Stage
 *
 * Responsible for detecting and handling campaign-to-campaign redirects.
 */
export declare class CheckSendingToAnotherCampaign implements StageInterface {
    /**
     * Action types that trigger campaign chaining
     */
    private static readonly CAMPAIGN_ACTION_TYPES;
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, _logEntry: TrafficLogEntry): Payload;
    /**
     * Extract campaign ID from action payload
     */
    private _extractCampaignId;
}
//# sourceMappingURL=check-sending-to-another-campaign.d.ts.map