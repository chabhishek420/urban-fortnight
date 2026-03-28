"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetCookieStage = void 0;
const stage_interface_js_1 = require("../../../core/pipeline/stage-interface.js");
const generate_token_stage_js_1 = require("./generate-token-stage.js");
/**
 * Set Cookie Stage
 */
class SetCookieStage {
    static HEADER_LIMIT_FOR_COOKIES = 3060;
    /**
     * Process the pipeline payload
     */
    process(payload, logEntry) {
        // Check if cookies are enabled
        if (!this._areCookiesEnabled()) {
            return payload;
        }
        // Set generic cookies
        payload = this._setGenericCookies(payload, logEntry);
        // Set landing binding cookies
        if (payload.isCookieLandingBinded()) {
            const landing = payload.getLanding();
            if (landing) {
                payload = this._setBindingCookies(payload, logEntry, 'landing_binding', landing.getId());
            }
        }
        // Set offer binding cookies
        if (payload.isCookieOfferBinded()) {
            const offer = payload.getOffer();
            if (offer) {
                payload = this._setBindingCookies(payload, logEntry, 'offer_binding', offer.getId());
            }
        }
        // Set stream binding cookies
        if (payload.isCookieStreamBinded()) {
            const stream = payload.getStream();
            if (stream) {
                payload = this._setBindingCookies(payload, logEntry, 'stream_binding', stream.getId());
            }
        }
        // Set token cookie
        payload = this._setTokenCookie(payload, logEntry);
        // Set uniqueness ID cookie
        payload = this._setUniquenessId(payload, logEntry);
        return payload;
    }
    /**
     * Check if cookies are enabled
     */
    _areCookiesEnabled() {
        // In original: CachedSettingsRepository.instance().get("cookies_enabled", 1)
        return true;
    }
    /**
     * Set generic cookies (sub ID)
     */
    _setGenericCookies(payload, _logEntry) {
        const rawClick = payload.getRawClick();
        const response = payload.getResponse();
        if (!response) {
            throw new stage_interface_js_1.StageException('response is not set', 'SetCookieStage');
        }
        if (rawClick) {
            const subId = rawClick.getSubId();
            // Set cookie header
            response.withHeader('Set-Cookie', `subid=${subId}; Path=/; HttpOnly`);
        }
        return payload;
    }
    /**
     * Set binding cookies
     */
    _setBindingCookies(payload, _logEntry, type, entityId) {
        const response = payload.getResponse();
        if (response) {
            response.withHeader('Set-Cookie', `${type}=${entityId}; Path=/; HttpOnly`);
        }
        return payload;
    }
    /**
     * Set token cookie
     */
    _setTokenCookie(payload, _logEntry) {
        if (!payload.isSaveTokenRequired()) {
            return payload;
        }
        const rawClick = payload.getRawClick();
        const response = payload.getResponse();
        if (!rawClick || !response) {
            return payload;
        }
        const token = rawClick.get('token');
        if (token && token.length < SetCookieStage.HEADER_LIMIT_FOR_COOKIES) {
            response.withHeader('Set-Cookie', `${generate_token_stage_js_1.GenerateTokenStage.TOKEN_PARAM}=${token}; Path=/; HttpOnly`);
        }
        return payload;
    }
    /**
     * Set uniqueness ID cookie
     */
    _setUniquenessId(payload, _logEntry) {
        if (!payload.isSaveUniquenessRequired()) {
            return payload;
        }
        const rawClick = payload.getRawClick();
        const campaign = payload.getCampaign();
        const stream = payload.getStream();
        const response = payload.getResponse();
        if (!rawClick || !campaign || !response) {
            return payload;
        }
        // Set uniqueness cookies
        const subId = rawClick.getSubId();
        const campaignId = campaign.getId();
        response.withHeader('Set-Cookie', `u_global=${subId}; Path=/; HttpOnly`);
        if (campaignId) {
            response.withHeader('Set-Cookie', `u_campaign_${campaignId}=${subId}; Path=/; HttpOnly`);
        }
        if (stream) {
            const streamId = stream.getId();
            if (streamId) {
                response.withHeader('Set-Cookie', `u_stream_${streamId}=${subId}; Path=/; HttpOnly`);
            }
        }
        return payload;
    }
}
exports.SetCookieStage = SetCookieStage;
//# sourceMappingURL=set-cookie-stage.js.map