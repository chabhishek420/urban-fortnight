"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChooseLandingStage = void 0;
const stage_interface_js_1 = require("../../../core/pipeline/stage-interface.js");
const base_stream_js_1 = require("../../model/base-stream.js");
/**
 * Choose Landing Stage
 */
class ChooseLandingStage {
    /**
     * Process the pipeline payload
     */
    process(payload, logEntry) {
        const stream = payload.getStream();
        const campaign = payload.getCampaign();
        const rawClick = payload.getRawClick();
        const currentLanding = payload.getLanding();
        const serverRequest = payload.getServerRequest();
        const response = payload.getResponse();
        if (!response) {
            throw new stage_interface_js_1.StageException('response is not set', 'ChooseLandingStage');
        }
        if (!serverRequest) {
            throw new stage_interface_js_1.StageException('serverRequest is not defined', 'ChooseLandingStage');
        }
        // No stream - skip
        if (!stream) {
            logEntry.add('No stream, skip choosing landing');
            return payload;
        }
        // Check schema
        const schema = stream.getSchema();
        if (schema !== base_stream_js_1.StreamSchema.LANDING_OFFER && schema !== 'landings') {
            logEntry.add(`Schema is ${schema}, skip choosing landings`);
            return payload;
        }
        if (!campaign) {
            throw new stage_interface_js_1.StageException('campaign is not defined', 'ChooseLandingStage');
        }
        if (!rawClick) {
            throw new stage_interface_js_1.StageException('rawClick is not defined', 'ChooseLandingStage');
        }
        // Landing already selected
        if (currentLanding) {
            logEntry.add(`Landing is preselected #${currentLanding.getId()}`);
            return payload;
        }
        // Choose landing
        let landing = null;
        const landingAssociations = this._getLandingAssociations(stream);
        if (!landingAssociations || landingAssociations.length === 0) {
            logEntry.add('No landings');
        }
        else {
            landing = this._getRandom(serverRequest, landingAssociations, logEntry);
            // Enable cookie binding for landing
            if (campaign.isBindVisitorsLandingEnabled() && landing) {
                payload.enableCookieBindLanding();
            }
        }
        if (landing) {
            logEntry.add(`LP #${landing.getId()} is chosen`);
            this._updatePayload(payload, landing);
        }
        else {
            logEntry.add('No LP selected');
        }
        return payload;
    }
    /**
     * Update payload with landing data
     */
    _updatePayload(payload, landing) {
        payload.setActionPayload(landing.getUrl() ?? landing.getActionPayload());
        payload.getRawClick()?.setLandingId(landing.getId());
        payload.setLanding(landing);
        payload.setActionType(landing.getActionType() ?? null);
        payload.setActionOptions(landing.getActionOptions() ?? null);
        // Check if token is needed
        const stream = payload.getStream();
        if (stream && this._hasOffers(stream)) {
            payload.setNeedToken(true);
            payload.setAddTokenToUrl(true);
        }
    }
    /**
     * Get random landing from associations
     */
    _getRandom(_request, associations, _logger) {
        if (associations.length === 0)
            return null;
        if (associations.length === 1)
            return associations[0]?.landing ?? null;
        // Weighted random selection
        const totalWeight = associations.reduce((sum, a) => sum + a.weight, 0);
        if (totalWeight === 0)
            return associations[0]?.landing ?? null;
        let random = Math.random() * totalWeight;
        for (const assoc of associations) {
            random -= assoc.weight;
            if (random <= 0) {
                return assoc.landing;
            }
        }
        return associations[associations.length - 1]?.landing ?? null;
    }
    /**
     * Get landing associations for stream
     * @artifact ARTIFACT-025: Placeholder - needs repository
     */
    _getLandingAssociations(_stream) {
        // TODO: Implement stream landing association repository
        return [];
    }
    /**
     * Check if stream has offers
     * @artifact ARTIFACT-026: Placeholder - needs repository
     */
    _hasOffers(_stream) {
        // TODO: Implement stream offer association repository
        return false;
    }
}
exports.ChooseLandingStage = ChooseLandingStage;
//# sourceMappingURL=choose-landing-stage.js.map