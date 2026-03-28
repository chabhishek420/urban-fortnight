"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRawClickStage = void 0;
const stage_interface_js_1 = require("../../../core/pipeline/stage-interface.js");
/**
 * Update Raw Click Stage
 */
class UpdateRawClickStage {
    /**
     * Process the pipeline payload
     */
    process(payload, _logEntry) {
        const rawClick = payload.getRawClick();
        const campaign = payload.getCampaign();
        if (!rawClick) {
            throw new stage_interface_js_1.StageException('rawClick is not set', 'UpdateRawClickStage');
        }
        if (!campaign) {
            throw new stage_interface_js_1.StageException('campaign is not set', 'UpdateRawClickStage');
        }
        // Set campaign ID
        rawClick.setCampaignId(campaign.getId());
        // Set traffic source ID
        const trafficSourceId = campaign.getTrafficSourceId();
        if (trafficSourceId) {
            rawClick.set('ts_id', trafficSourceId);
        }
        // Generate visitor code
        const visitorCode = this._generateVisitorCode(rawClick);
        rawClick.set('visitor_code', visitorCode);
        // Generate sub ID
        const subId = this._generateSubId(visitorCode);
        rawClick.setSubId(subId);
        payload.setRawClick(rawClick);
        return payload;
    }
    /**
     * Generate visitor code
     */
    _generateVisitorCode(click) {
        // Simple hash of IP + UserAgent for visitor identification
        const ip = click.getIp();
        const ua = click.getUserAgent();
        const hash = this._simpleHash(`${ip}:${ua}`);
        return hash.toString(36);
    }
    /**
     * Generate sub ID from visitor code
     */
    _generateSubId(visitorCode) {
        const timestamp = Date.now().toString(36);
        return `${visitorCode}${timestamp}`.substring(0, 16);
    }
    /**
     * Simple hash function
     */
    _simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
}
exports.UpdateRawClickStage = UpdateRawClickStage;
//# sourceMappingURL=update-raw-click-stage.js.map