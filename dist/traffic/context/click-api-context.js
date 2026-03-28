"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClickApiContext = void 0;
/**
 * Click API Context
 *
 * Handles API-based click processing with version support.
 * Allows external systems to send clicks programmatically.
 *
 * @see keitaro_source/application/Traffic/Context/ClickApiContext.php
 */
const context_interface_js_1 = require("../../core/context/context-interface.js");
const server_request_js_1 = require("../request/server-request.js");
const dispatcher_interface_js_1 = require("../../core/dispatcher/dispatcher-interface.js");
const click_api_dispatcher_js_1 = require("../dispatcher/click-api-dispatcher.js");
const payload_js_1 = require("../pipeline/payload.js");
const raw_click_js_1 = require("../model/raw-click.js");
const response_js_1 = require("../response/response.js");
const status_code_js_1 = require("../response/status-code.js");
const content_type_js_1 = require("../response/content-type.js");
/**
 * API parameter mappings
 */
const API_PARAMS = {
    language: ['lang', 'language'],
    referrer: ['referrer', 'referer'],
    user_agent: ['ua', 'user_agent'],
    search_engine: ['search_engine', 'se'],
    landing_id: ['landing_id'],
    datetime: ['datetime'],
    always_empty_cookies: ['always_empty_cookies']
};
class ClickApiContext extends context_interface_js_1.BaseContext {
    static API_KEY = 'api_key';
    static TOKEN_NAME = 'token';
    static DEFAULT_VERSION = 1;
    static UNIQUENESS_COOKIE_PARAM = 'uniqueness_cookie';
    _apiParams = API_PARAMS;
    /**
     * Initialize click API context
     */
    bootstrap() {
        // In production: Bootstrap::initClickContext()
        // In production: TrafficLoggerService::reset()
        // In production: Setup traffic log entry if enabled
    }
    /**
     * Modify request - handle IP and uniqueness cookie
     */
    modifyRequest(request) {
        let modifiedRequest = this.setUniquenessCookie(request);
        modifiedRequest = this.removeCloudFlareIpCountry(modifiedRequest);
        // Set IP from parameter if provided
        const ip = request.getParam('ip');
        if (ip) {
            modifiedRequest = modifiedRequest.withHeaders({
                [server_request_js_1.ServerRequest.HEADER_X_REAL_IP]: ip,
                [server_request_js_1.ServerRequest.HEADER_CF_CONNECTING_IP]: ip
            });
            modifiedRequest = modifiedRequest.withServerParams({
                [server_request_js_1.ServerRequest.REMOTE_ADDR]: ip
            });
        }
        return modifiedRequest;
    }
    /**
     * Return appropriate dispatcher based on request
     */
    dispatcher(request) {
        // In production: TrafficLoggerService::instance()->entry()->add("[ClickApiContext]")
        const version = this.findVersion(request);
        const rawClick = new raw_click_js_1.RawClick();
        // Replace raw click params from request
        this.replaceRawClickParams(request, rawClick);
        let campaign = undefined;
        // Check if API key is provided
        if (this.isApiKeyProvided(request)) {
            if (!this.isApiValid(request)) {
                return new dispatcher_interface_js_1.SimpleDispatcher(this.errorResponse(403, 'Invalid token or api key'));
            }
        }
        else {
            // Find campaign by token
            const token = this.findToken(request);
            if (!token) {
                return new dispatcher_interface_js_1.SimpleDispatcher(this.errorResponse(404, 'No campaign token'));
            }
            // In production: Find campaign by token from repository
            // campaign = CachedCampaignRepository::instance()->findByToken(token);
        }
        const payloadOptions = {
            serverRequest: request,
            rawClick
        };
        if (campaign) {
            payloadOptions.campaign = campaign;
        }
        const pipelinePayload = new payload_js_1.Payload(payloadOptions);
        // Adapt payload by API version
        this.adaptPayloadByApiVersion(pipelinePayload, version);
        // Check if requested URI
        if (request.hasParam('uri')) {
            // In production: TrafficLoggerService::instance()->entry()->add("Requested: " + request.getParam('uri'))
        }
        return new click_api_dispatcher_js_1.ClickApiDispatcher(pipelinePayload, version);
    }
    /**
     * Cleanup after request
     */
    shutdown() {
        // In production: TrafficLoggerService::instance()->flush()
    }
    /**
     * Handle exceptions
     */
    handleException(error, _request) {
        const body = {
            error: error.message
        };
        // In production: Log error
        return response_js_1.Response.buildJson({
            status: status_code_js_1.StatusCode.INTERNAL_SERVER_ERROR,
            body
        });
    }
    // === Private helper methods ===
    removeCloudFlareIpCountry(request) {
        return request.withoutHeader(server_request_js_1.ServerRequest.HEADER_CF_IPCOUNTRY);
    }
    findToken(request) {
        return request.getParam(ClickApiContext.TOKEN_NAME);
    }
    replaceRawClickParams(request, rawClick) {
        for (const [attr, variations] of Object.entries(this._apiParams)) {
            for (const param of variations) {
                if (request.hasParam(param)) {
                    rawClick.set(attr, request.getParam(param));
                    break;
                }
            }
        }
    }
    isApiKeyProvided(request) {
        return !!request.getParam(ClickApiContext.API_KEY);
    }
    isApiValid(request) {
        // In production: Compare with stored API key
        const providedKey = request.getParam(ClickApiContext.API_KEY);
        return !!providedKey; // Simplified for now
    }
    errorResponse(status, error) {
        return response_js_1.Response.build()
            .withStatus(status)
            .withHeader(content_type_js_1.ContentType.HEADER, content_type_js_1.ContentType.JSON)
            .withBody(JSON.stringify({ error }));
    }
    findVersion(request) {
        const version = request.getParam('version');
        if (version && ['1', '2', '3'].includes(version)) {
            return parseInt(version, 10);
        }
        return ClickApiContext.DEFAULT_VERSION;
    }
    setUniquenessCookie(request) {
        if (request.hasParam(ClickApiContext.UNIQUENESS_COOKIE_PARAM)) {
            const cookieValue = request.getParam(ClickApiContext.UNIQUENESS_COOKIE_PARAM);
            if (cookieValue) {
                // In production: Set cookie with proper name from CookiesStorage
                return request.withCookieParam('keitaro_visitor', cookieValue);
            }
        }
        return request;
    }
    adaptPayloadByApiVersion(payload, version) {
        if (version < 3 || payload.getServerRequest().getParam('force_redirect_offer')) {
            payload.setForceRedirectOffer(true);
        }
        else {
            payload.setForceRedirectOffer(false);
        }
        if (version < 3 && payload.getServerRequest().getParam('force_choose_offer')) {
            payload.setForceChooseOffer(true);
        }
    }
}
exports.ClickApiContext = ClickApiContext;
//# sourceMappingURL=click-api-context.js.map