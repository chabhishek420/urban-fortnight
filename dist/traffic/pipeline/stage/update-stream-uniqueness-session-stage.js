"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStreamUniquenessSessionStage = void 0;
const stage_interface_js_1 = require("../../../core/pipeline/stage-interface.js");
/**
 * Update Stream Uniqueness Session Stage
 */
class UpdateStreamUniquenessSessionStage {
    /**
     * Process the pipeline payload
     */
    process(payload, logEntry) {
        const campaign = payload.getCampaign();
        const stream = payload.getStream();
        const rawClick = payload.getRawClick();
        const serverRequest = payload.getServerRequest();
        if (!campaign) {
            throw new stage_interface_js_1.StageException('Empty campaign', 'UpdateStreamUniquenessSessionStage');
        }
        if (!rawClick) {
            throw new stage_interface_js_1.StageException('Empty rawClick', 'UpdateStreamUniquenessSessionStage');
        }
        // Skip if no stream
        if (!stream) {
            return payload;
        }
        // Bots are never unique
        if (rawClick.isBot()) {
            rawClick.set('is_unique_stream', false);
            return payload;
        }
        // Check uniqueness for stream
        const isUniqueStream = this._isUniqueForStream(serverRequest, rawClick, campaign, stream);
        rawClick.set('is_unique_stream', isUniqueStream);
        if (!isUniqueStream) {
            logEntry.add('Is not unique for stream');
        }
        return payload;
    }
    /**
     * Check if visitor is unique for stream
     * @artifact ARTIFACT-024: Simplified uniqueness check
     */
    _isUniqueForStream(request, _click, _campaign, stream) {
        // Check cookie for stream uniqueness
        const cookies = request.getCookies();
        const streamId = stream.getId();
        const uniquenessCookie = cookies[`u_stream_${streamId}`];
        if (uniquenessCookie) {
            return false;
        }
        return true;
    }
}
exports.UpdateStreamUniquenessSessionStage = UpdateStreamUniquenessSessionStage;
//# sourceMappingURL=update-stream-uniqueness-session-stage.js.map