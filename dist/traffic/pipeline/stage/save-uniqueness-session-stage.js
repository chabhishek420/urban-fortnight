"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveUniquenessSessionStage = void 0;
const stage_interface_js_1 = require("../../../core/pipeline/stage-interface.js");
/**
 * Save Uniqueness Session Stage
 */
class SaveUniquenessSessionStage {
    /**
     * Process the pipeline payload
     */
    process(payload, logEntry) {
        const campaign = payload.getCampaign();
        const stream = payload.getStream();
        const rawClick = payload.getRawClick();
        const request = payload.getServerRequest();
        const response = payload.getResponse();
        if (!request) {
            throw new stage_interface_js_1.StageException('Error serverRequest is empty', 'SaveUniquenessSessionStage');
        }
        if (!response) {
            throw new stage_interface_js_1.StageException('response is empty', 'SaveUniquenessSessionStage');
        }
        if (!campaign) {
            throw new stage_interface_js_1.StageException('campaign is empty', 'SaveUniquenessSessionStage');
        }
        if (!rawClick) {
            throw new stage_interface_js_1.StageException('rawClick is empty', 'SaveUniquenessSessionStage');
        }
        // Save non-cookie uniqueness data
        this._saveNonCookies(rawClick, campaign, stream, logEntry);
        // Enable uniqueness ID saving
        payload.enableSaveUniquenessId();
        payload.setServerRequest(request);
        payload.setResponse(response);
        return payload;
    }
    /**
     * Save non-cookie uniqueness data
     * @artifact ARTIFACT-037: Simplified uniqueness storage
     */
    _saveNonCookies(_rawClick, campaign, _stream, logger) {
        // In original: UniquenessSessionService.instance().saveNonCookies()
        // Store uniqueness in local cache/session
        const campaignId = campaign.getId();
        // Note: stream ID would be used here for stream-level uniqueness tracking
        logger.add(`Saving uniqueness session for campaign ${campaignId}`);
    }
}
exports.SaveUniquenessSessionStage = SaveUniquenessSessionStage;
//# sourceMappingURL=save-uniqueness-session-stage.js.map