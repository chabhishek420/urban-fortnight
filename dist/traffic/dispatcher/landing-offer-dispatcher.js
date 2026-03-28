"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingOfferDispatcher = void 0;
const response_js_1 = require("../response/response.js");
const status_code_js_1 = require("../response/status-code.js");
const payload_js_1 = require("../pipeline/payload.js");
class LandingOfferDispatcher {
    _rawClick;
    constructor(rawClick) {
        if (!rawClick) {
            throw new Error('rawclick is not provided');
        }
        this._rawClick = rawClick;
    }
    /**
     * Get raw click
     */
    getRawClick() {
        return this._rawClick;
    }
    /**
     * Dispatch the landing offer request
     */
    dispatch(request) {
        const response = new response_js_1.Response({
            disableCache: true
        });
        // Check for forced offer_id
        const offerIdParam = request.getParam('offer_id');
        if (offerIdParam) {
            this._rawClick.setOfferId(parseInt(offerIdParam, 10));
        }
        // Create pipeline payload with forced values
        const pipelinePayload = new payload_js_1.Payload({
            serverRequest: request,
            response,
            rawClick: this._rawClick
        });
        const streamId = this._rawClick.getStreamId();
        const campaignId = this._rawClick.getCampaignId();
        const offerId = this._rawClick.getOfferId();
        if (streamId !== null && streamId !== undefined) {
            pipelinePayload.setForcedStreamId(streamId);
        }
        if (campaignId !== null && campaignId !== undefined) {
            pipelinePayload.setForcedCampaignId(campaignId);
        }
        if (offerId !== null && offerId !== undefined) {
            pipelinePayload.setForcedOfferId(offerId);
        }
        pipelinePayload.setForceRedirectOffer(true);
        try {
            // In production: Run second level pipeline stages
            // const pipeline = new Pipeline();
            // pipelinePayload = pipeline.secondLevelStages().start(pipelinePayload, logEntry);
            // Save LP click if offer was selected
            const rawClick = pipelinePayload.getRawClick();
            if (rawClick?.getOfferId()) {
                this.saveLpClick(rawClick, request);
            }
            return pipelinePayload.getResponse() ?? response;
        }
        catch {
            return this.getErrorResponse();
        }
    }
    /**
     * Save landing page click
     */
    saveLpClick(_rawClick, _request) {
        // In production: UpdateClickCommand::saveLpClick(rawClick.getSubId(), rawClick.getOfferId(), params, landingId)
    }
    /**
     * Get error response
     */
    getErrorResponse() {
        return new response_js_1.Response({
            body: 'Sorry. Some internal problems. Please read System Log.',
            status: status_code_js_1.StatusCode.NOT_IMPLEMENTED
        });
    }
}
exports.LandingOfferDispatcher = LandingOfferDispatcher;
//# sourceMappingURL=landing-offer-dispatcher.js.map