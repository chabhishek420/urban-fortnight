"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCampaignUniquenessSessionStage = void 0;
const stage_interface_js_1 = require("../../../core/pipeline/stage-interface.js");
/**
 * Update Campaign Uniqueness Session Stage
 */
class UpdateCampaignUniquenessSessionStage {
    /**
     * Process the pipeline payload
     */
    process(payload, logEntry) {
        const campaign = payload.getCampaign();
        const rawClick = payload.getRawClick();
        const serverRequest = payload.getServerRequest();
        if (!campaign) {
            throw new stage_interface_js_1.StageException('Empty campaign', 'UpdateCampaignUniquenessSessionStage');
        }
        if (!rawClick) {
            throw new stage_interface_js_1.StageException('Empty rawClick', 'UpdateCampaignUniquenessSessionStage');
        }
        // Bots are never unique
        if (rawClick.isBot()) {
            rawClick.set('is_unique_campaign', false);
            return payload;
        }
        // Check uniqueness for campaign
        const isUniqueCampaign = this._isUniqueForCampaign(serverRequest, rawClick, campaign);
        rawClick.set('is_unique_campaign', isUniqueCampaign);
        // Check global uniqueness
        const isUniqueGlobal = this._isUniqueGlobal(serverRequest, rawClick, campaign);
        rawClick.set('is_unique_global', isUniqueGlobal);
        if (!isUniqueCampaign) {
            logEntry.add('Is not unique for campaign');
        }
        return payload;
    }
    /**
     * Check if visitor is unique for campaign
     * @artifact ARTIFACT-020: Simplified uniqueness check
     */
    _isUniqueForCampaign(request, _click, campaign) {
        // Check cookie for campaign uniqueness
        const cookies = request.getCookies();
        const campaignId = campaign.getId();
        const uniquenessCookie = cookies[`u_campaign_${campaignId}`];
        if (uniquenessCookie) {
            return false;
        }
        return true;
    }
    /**
     * Check if visitor is unique globally
     * @artifact ARTIFACT-021: Simplified uniqueness check
     */
    _isUniqueGlobal(request, _click, _campaign) {
        // Check global uniqueness cookie
        const cookies = request.getCookies();
        const globalCookie = cookies['u_global'];
        if (globalCookie) {
            return false;
        }
        return true;
    }
}
exports.UpdateCampaignUniquenessSessionStage = UpdateCampaignUniquenessSessionStage;
//# sourceMappingURL=update-campaign-uniqueness-session-stage.js.map