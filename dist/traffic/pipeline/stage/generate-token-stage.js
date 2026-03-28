"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateTokenStage = void 0;
const stage_interface_js_1 = require("../../../core/pipeline/stage-interface.js");
/**
 * Generate Token Stage
 */
class GenerateTokenStage {
    static TOKEN_PARAM = '_token';
    static SUBID_PARAM = '_subid';
    /**
     * Process the pipeline payload
     */
    process(payload, logEntry) {
        const serverRequest = payload.getServerRequest();
        const response = payload.getResponse();
        const rawClick = payload.getRawClick();
        const stream = payload.getStream();
        // Check if token is needed
        if (!payload.isTokenNeeded()) {
            logEntry.add('Token is not needed.');
            return payload;
        }
        // Skip if already has token
        if (rawClick?.get('token')) {
            return payload;
        }
        if (!rawClick) {
            throw new stage_interface_js_1.StageException('GenerateTokenStage: Empty rawClick', 'GenerateTokenStage');
        }
        if (!serverRequest) {
            throw new stage_interface_js_1.StageException('serverRequest is not set', 'GenerateTokenStage');
        }
        if (!response) {
            throw new stage_interface_js_1.StageException('response is not set', 'GenerateTokenStage');
        }
        if (!stream) {
            return payload;
        }
        // Check if stream has offers
        const offers = this._getStreamOffers(stream);
        if (!offers || offers.length === 0) {
            logEntry.add('Token is not needed because the stream does not contain any offers');
            return payload;
        }
        // Enable token saving
        payload.enableSaveToken();
        // Generate and store token
        const token = this._storeRawClick(rawClick);
        rawClick.set('token', token);
        // Add token to URL if redirect action
        if (payload.shouldAddTokenToUrl() && this._isRedirect(payload.getActionType())) {
            let actionPayload = payload.getActionPayload();
            if (typeof actionPayload === 'string') {
                const subidParam = `${GenerateTokenStage.SUBID_PARAM}=${rawClick.getSubId()}`;
                const tokenParam = `${GenerateTokenStage.TOKEN_PARAM}=${token}`;
                actionPayload = this._addParameterToUrl(actionPayload, subidParam);
                actionPayload = this._addParameterToUrl(actionPayload, tokenParam);
                payload.setActionPayload(actionPayload);
            }
        }
        return payload;
    }
    /**
     * Store raw click and return token
     */
    _storeRawClick(click) {
        // Generate a unique token
        const subId = click.getSubId();
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 10);
        return `${subId}_${timestamp}_${random}`;
    }
    /**
     * Add parameter to URL
     */
    _addParameterToUrl(url, param) {
        if (!url)
            return url;
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}${param}`;
    }
    /**
     * Check if action is a redirect
     */
    _isRedirect(actionType) {
        const redirectTypes = ['http', 'https', 'location', 'redirect', 'remote'];
        return actionType ? redirectTypes.includes(actionType.toLowerCase()) : false;
    }
    /**
     * Get offers for stream
     * @artifact ARTIFACT-031: Placeholder - needs repository
     */
    _getStreamOffers(_stream) {
        // TODO: Implement stream offer repository
        return [];
    }
}
exports.GenerateTokenStage = GenerateTokenStage;
//# sourceMappingURL=generate-token-stage.js.map