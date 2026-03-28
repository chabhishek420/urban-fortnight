"use strict";
/**
 * Check Sending To Another Campaign Stage
 *
 * Handles campaign chaining (redirecting to another campaign).
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/CheckSendingToAnotherCampaign.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckSendingToAnotherCampaignStage = void 0;
const stage_interface_1 = require("../../../core/pipeline/stage-interface");
class CheckSendingToAnotherCampaignStage {
    /**
     * Process the pipeline payload
     */
    process(payload, logEntry) {
        const forcedCampaignId = payload.getForcedCampaignId();
        if (!forcedCampaignId) {
            return payload;
        }
        const currentCampaign = payload.getCampaign();
        // Check if we're redirecting to a different campaign
        if (currentCampaign && currentCampaign.getId() === forcedCampaignId) {
            // Same campaign, no need to redirect
            return payload;
        }
        logEntry.add(`Redirecting to campaign #${forcedCampaignId}`);
        // Throw exception to trigger re-processing with new campaign
        throw new stage_interface_1.SendToCampaignException(forcedCampaignId);
    }
}
exports.CheckSendingToAnotherCampaignStage = CheckSendingToAnotherCampaignStage;
//# sourceMappingURL=check-sending-to-another-campaign-stage.js.map