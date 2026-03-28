"use strict";
/**
 * Check Sending To Another Campaign Stage
 *
 * Handles campaign chaining - when an action redirects to another campaign.
 * Sets the forced campaign ID and aborts the current pipeline execution.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/CheckSendingToAnotherCampaign.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckSendingToAnotherCampaign = void 0;
const stage_interface_js_1 = require("../../../core/pipeline/stage-interface.js");
/**
 * Check Sending To Another Campaign Stage
 *
 * Responsible for detecting and handling campaign-to-campaign redirects.
 */
class CheckSendingToAnotherCampaign {
    /**
     * Action types that trigger campaign chaining
     */
    static CAMPAIGN_ACTION_TYPES = ['campaign', 'group'];
    /**
     * Process the pipeline payload
     */
    process(payload, _logEntry) {
        const actionType = payload.getActionType();
        // Check if action type is campaign or group
        if (actionType && CheckSendingToAnotherCampaign.CAMPAIGN_ACTION_TYPES.includes(actionType)) {
            const actionPayload = payload.getActionPayload();
            const campaignId = this._extractCampaignId(actionPayload);
            if (campaignId !== null) {
                // Set the forced campaign ID for the next pipeline iteration
                payload.setForcedCampaignId(campaignId);
                // Abort current pipeline execution
                payload.abort();
                // Throw exception to signal the restart
                throw new stage_interface_js_1.SendToCampaignException(campaignId);
            }
        }
        return payload;
    }
    /**
     * Extract campaign ID from action payload
     */
    _extractCampaignId(actionPayload) {
        if (typeof actionPayload === 'number') {
            return actionPayload;
        }
        if (typeof actionPayload === 'string') {
            const parsed = parseInt(actionPayload, 10);
            if (!isNaN(parsed) && parsed > 0) {
                return parsed;
            }
        }
        if (typeof actionPayload === 'object' && actionPayload !== null) {
            const payload = actionPayload;
            if (typeof payload.campaignId === 'number') {
                return payload.campaignId;
            }
            if (typeof payload.id === 'number') {
                return payload.id;
            }
        }
        return null;
    }
}
exports.CheckSendingToAnotherCampaign = CheckSendingToAnotherCampaign;
//# sourceMappingURL=check-sending-to-another-campaign.js.map