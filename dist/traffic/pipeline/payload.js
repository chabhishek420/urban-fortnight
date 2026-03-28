"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payload = void 0;
/**
 * Pipeline Payload
 *
 * Carries state through the traffic processing pipeline.
 * Each stage can read and modify the payload.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Payload.php
 */
class Payload {
    // Core request/response
    _serverRequest = null;
    _response = null;
    // Raw click data
    _rawClick = null;
    _rawClicksToStore = [];
    // Entity references
    _campaign = null;
    _stream = null;
    _landing = null;
    _offer = null;
    // Action data
    _actionType = null;
    _actionPayload = null;
    _actionOptions = null;
    // Forced values
    _forcedOfferId = null;
    _forcedCampaignId = null;
    _forcedStreamId = null;
    // Flags
    _tokenNeeded = false;
    _addTokenToUrl = false;
    _forceRedirectOffer = false;
    _forceChooseOffer = false;
    _aborted = false;
    // Cookie binding flags
    _cookieBindStream = false;
    _cookieBindLanding = false;
    _cookieBindOffer = false;
    _saveToken = false;
    _saveUniquenessId = false;
    constructor(options = {}) {
        if (options.serverRequest)
            this._serverRequest = options.serverRequest;
        if (options.response)
            this._response = options.response;
        if (options.rawClick)
            this._rawClick = options.rawClick;
        if (options.campaign)
            this._campaign = options.campaign;
        if (options.stream)
            this._stream = options.stream;
        if (options.landing)
            this._landing = options.landing;
        if (options.offer)
            this._offer = options.offer;
        if (options.forceRedirectOffer)
            this._forceRedirectOffer = options.forceRedirectOffer;
    }
    // === Server Request ===
    getServerRequest() {
        if (!this._serverRequest) {
            throw new Error('ServerRequest not set');
        }
        return this._serverRequest;
    }
    setServerRequest(request) {
        if (!request) {
            throw new Error('Cannot set empty ServerRequest');
        }
        this._serverRequest = request;
    }
    // === Response ===
    getResponse() {
        return this._response;
    }
    setResponse(response) {
        if (!response) {
            throw new Error('Cannot set empty Response');
        }
        this._response = response;
    }
    // === Raw Click ===
    getRawClick() {
        return this._rawClick;
    }
    setRawClick(click) {
        this._rawClick = click;
    }
    addRawClickToStore(click) {
        this._rawClicksToStore.push(click);
    }
    getRawClicksToStore() {
        return this._rawClicksToStore;
    }
    // === Campaign ===
    getCampaign() {
        return this._campaign;
    }
    setCampaign(campaign) {
        this._campaign = campaign;
    }
    // === Stream ===
    getStream() {
        return this._stream;
    }
    setStream(stream) {
        this._stream = stream;
    }
    // === Landing ===
    getLanding() {
        return this._landing;
    }
    setLanding(landing) {
        this._landing = landing;
    }
    // === Offer ===
    getOffer() {
        return this._offer;
    }
    setOffer(offer) {
        this._offer = offer;
    }
    // === Action ===
    getActionType() {
        return this._actionType;
    }
    setActionType(type) {
        this._actionType = type;
    }
    getActionPayload() {
        return this._actionPayload;
    }
    setActionPayload(payload) {
        this._actionPayload = payload;
    }
    getActionOptions() {
        return this._actionOptions;
    }
    getActionOption(key) {
        return this._actionOptions?.[key] ?? null;
    }
    setActionOptions(options) {
        this._actionOptions = options;
    }
    // === Forced IDs ===
    getForcedOfferId() {
        return this._forcedOfferId;
    }
    setForcedOfferId(id) {
        this._forcedOfferId = id;
    }
    getForcedCampaignId() {
        return this._forcedCampaignId;
    }
    setForcedCampaignId(id) {
        this._forcedCampaignId = id;
    }
    getForcedStreamId() {
        return this._forcedStreamId;
    }
    setForcedStreamId(id) {
        this._forcedStreamId = id;
    }
    // === Flags ===
    isTokenNeeded() {
        return this._tokenNeeded;
    }
    setNeedToken(needed = true) {
        this._tokenNeeded = needed;
    }
    shouldAddTokenToUrl() {
        return this._addTokenToUrl;
    }
    setAddTokenToUrl(add = true) {
        this._addTokenToUrl = add;
    }
    isForceRedirectOffer() {
        return this._forceRedirectOffer;
    }
    setForceRedirectOffer(force = true) {
        this._forceRedirectOffer = force;
    }
    isForceChooseOffer() {
        return this._forceChooseOffer;
    }
    setForceChooseOffer(force = true) {
        this._forceChooseOffer = force;
    }
    isAborted() {
        return this._aborted;
    }
    abort(status = true) {
        this._aborted = status;
    }
    // === Cookie Binding ===
    enableCookieBindStream() {
        this._cookieBindStream = true;
    }
    isCookieStreamBinded() {
        return this._cookieBindStream;
    }
    enableCookieBindLanding() {
        this._cookieBindLanding = true;
    }
    isCookieLandingBinded() {
        return this._cookieBindLanding;
    }
    enableCookieBindOffer() {
        this._cookieBindOffer = true;
    }
    isCookieOfferBinded() {
        return this._cookieBindOffer;
    }
    enableSaveToken() {
        this._saveToken = true;
    }
    isSaveTokenRequired() {
        return this._saveToken;
    }
    enableSaveUniquenessId() {
        this._saveUniquenessId = true;
    }
    isSaveUniquenessRequired() {
        return this._saveUniquenessId;
    }
}
exports.Payload = Payload;
//# sourceMappingURL=payload.js.map