"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckDefaultCampaignStage = void 0;
const stage_interface_js_1 = require("../../../core/pipeline/stage-interface.js");
const response_js_1 = require("../../response/response.js");
const status_code_js_1 = require("../../response/status-code.js");
/**
 * Extra action types
 */
const ExtraAction = {
    PARAM_CAMPAIGN: 'campaign',
    PARAM_REDIRECT: 'redirect',
    PARAM_NOTHING: 'nothing'
};
/**
 * Check Default Campaign Stage
 */
class CheckDefaultCampaignStage {
    /**
     * Process the pipeline payload
     */
    process(payload, logEntry) {
        // Skip if campaign already set
        if (payload.getCampaign()) {
            return payload;
        }
        logEntry.add('Check default action from settings');
        const request = payload.getServerRequest();
        if (!request) {
            throw new stage_interface_js_1.StageException('Empty request', 'CheckDefaultCampaignStage');
        }
        // Get extra action setting
        const extraAction = this._getExtraAction();
        switch (extraAction) {
            case ExtraAction.PARAM_CAMPAIGN:
                return this._triggerCampaign(payload, logEntry);
            case ExtraAction.PARAM_REDIRECT:
                return this._triggerRedirect(payload, logEntry);
            default:
                return this._triggerNotFound(payload, logEntry);
        }
    }
    /**
     * Get extra action setting
     * @artifact ARTIFACT-014: Simplified settings access
     */
    _getExtraAction() {
        // In original: CachedSettingsRepository.instance().get(Setting::EXTRA_ACTION)
        return ExtraAction.PARAM_NOTHING;
    }
    /**
     * Trigger redirect to extra URL
     */
    _triggerRedirect(payload, logger) {
        const extraUrl = this._getExtraUrl();
        logger.add(`Redirecting to ${extraUrl}`);
        const response = payload.getResponse() ?? new response_js_1.Response();
        response.withStatus(status_code_js_1.StatusCode.MOVED_TEMPORARILY).withHeader('Location', extraUrl);
        payload.setResponse(response);
        payload.abort();
        return payload;
    }
    /**
     * Trigger 404 not found
     */
    _triggerNotFound(payload, logger) {
        const response = payload.getResponse() ?? new response_js_1.Response();
        response.withStatus(status_code_js_1.StatusCode.NOT_FOUND).withBody('404 Not Found');
        logger.add('Shows 404 NotFound');
        payload.setResponse(response);
        payload.abort();
        return payload;
    }
    /**
     * Trigger default campaign
     */
    _triggerCampaign(payload, logger) {
        const defaultCampaignId = this._getDefaultCampaignId();
        logger.add(`Sending to default campaign #${defaultCampaignId}`);
        if (!defaultCampaignId) {
            throw new stage_interface_js_1.StageException('Default campaign missing. Check default action settings', 'CheckDefaultCampaignStage');
        }
        // Check if campaign is active
        const campaign = this._findCampaignById(defaultCampaignId);
        if (!campaign || !campaign.isActive()) {
            logger.add(`Default campaign #${defaultCampaignId} is not active, redirecting to 404`);
            return this._triggerNotFound(payload, logger);
        }
        payload.setForcedCampaignId(defaultCampaignId);
        payload.abort();
        return payload;
    }
    /**
     * Get extra redirect URL
     * @artifact ARTIFACT-015: Simplified settings access
     */
    _getExtraUrl() {
        // In original: CachedSettingsRepository.instance().get("extra_url")
        return '/';
    }
    /**
     * Get default campaign ID
     * @artifact ARTIFACT-016: Simplified settings access
     */
    _getDefaultCampaignId() {
        // In original: CachedSettingsRepository.instance().get(Setting::EXTRA_CAMPAIGN)
        return null;
    }
    /**
     * Find campaign by ID
     * @artifact ARTIFACT-017: Placeholder - needs campaign repository
     */
    _findCampaignById(_id) {
        // TODO: Implement campaign repository integration
        return null;
    }
}
exports.CheckDefaultCampaignStage = CheckDefaultCampaignStage;
//# sourceMappingURL=check-default-campaign-stage.js.map