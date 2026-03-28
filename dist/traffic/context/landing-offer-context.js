"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingOfferContext = void 0;
/**
 * Landing Offer Context
 *
 * Handles landing page to offer transitions.
 * Restores raw click data from tokens and processes offer selection.
 *
 * @see keitaro_source/application/Traffic/Context/LandingOfferContext.php
 */
const context_interface_js_1 = require("../../core/context/context-interface.js");
const dispatcher_interface_js_1 = require("../../core/dispatcher/dispatcher-interface.js");
const click_dispatcher_js_1 = require("../dispatcher/click-dispatcher.js");
const landing_offer_dispatcher_js_1 = require("../dispatcher/landing-offer-dispatcher.js");
const response_js_1 = require("../response/response.js");
const status_code_js_1 = require("../response/status-code.js");
const content_type_js_1 = require("../response/content-type.js");
/**
 * UUID prefix for LP tokens
 */
const UUID_PREFIX = 'ktrk';
class LandingOfferContext extends context_interface_js_1.BaseContext {
    /**
     * Initialize click context
     */
    bootstrap() {
        // In production: Bootstrap::initClickContext()
    }
    /**
     * No request modification needed
     */
    modifyRequest(request) {
        return request;
    }
    /**
     * Return appropriate dispatcher based on token presence
     */
    dispatcher(request) {
        const token = this.getToken(request);
        // Validate token format
        if (token && !token.includes(UUID_PREFIX)) {
            // In production: LoggerService::instance()->warning("Someone sent incorrect uuid token: " + token)
            return new dispatcher_interface_js_1.SimpleDispatcher(this.errorResponse(441, 'Page is unavailable'));
        }
        // In production: TrafficLoggerService::instance()->entry()->add("[LandingOfferContext]")
        // No token - treat as new visit
        if (!token) {
            // In production: TrafficLoggerService::instance()->entry()->add("Warning! Param '_token' is empty. Running campaign assigned to the domain as new visit.")
            return new click_dispatcher_js_1.ClickDispatcher();
        }
        // Try to restore raw click from token
        const rawClick = this.restoreRawClick(token);
        if (!rawClick) {
            return new dispatcher_interface_js_1.SimpleDispatcher(this.errorResponse(422, `Failed to restore rawClick by uuid ${token}`));
        }
        return new landing_offer_dispatcher_js_1.LandingOfferDispatcher(rawClick);
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
        return this.createErrorResponse(error);
    }
    // === Private helper methods ===
    getToken(request) {
        // Check query param first
        const token = request.getParam('_token');
        if (token) {
            return token;
        }
        // Check cookie
        const cookieToken = request.getCookie('ktrk_token');
        if (cookieToken) {
            // In production: TrafficLoggerService::instance()->info("The token '" + cookieToken + "' found in cookies")
            return cookieToken;
        }
        return undefined;
    }
    errorResponse(status, _message) {
        const error = 'Sorry. The link is outdated or incorrect. Please read page Maintenance > Logs.';
        return response_js_1.Response.build()
            .withStatus(status)
            .withHeader(content_type_js_1.ContentType.HEADER, content_type_js_1.ContentType.HTML)
            .withBody(error);
    }
    restoreRawClick(token) {
        // Try to restore from token service first
        const rawClick = this.restoreByToken(token);
        if (rawClick) {
            return rawClick;
        }
        // Fallback to database lookup
        return this.findInDatabase(token);
    }
    restoreByToken(_token) {
        // In production: LpTokenService::instance()->getRawClickByToken(token)
        return null;
    }
    findInDatabase(_token) {
        // In production: Extract subId from token and query database
        // const subId = LpTokenService::instance()->subIdFromToken(token)
        // return RawClickRepository::instance()->findBySubId(subId)
        return null;
    }
    createErrorResponse(error) {
        return response_js_1.Response.buildJson({
            status: status_code_js_1.StatusCode.INTERNAL_SERVER_ERROR,
            body: {
                error: error.message
            }
        });
    }
}
exports.LandingOfferContext = LandingOfferContext;
//# sourceMappingURL=landing-offer-context.js.map