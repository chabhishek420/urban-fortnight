"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrafficRouter = exports.TrafficRouterResult = exports.TrafficRouterParams = void 0;
// Import all contexts
const click_context_js_1 = require("../../traffic/context/click-context.js");
const click_api_context_js_1 = require("../../traffic/context/click-api-context.js");
const postback_context_js_1 = require("../../traffic/context/postback-context.js");
const gateway_redirect_context_js_1 = require("../../traffic/context/gateway-redirect-context.js");
const landing_offer_context_js_1 = require("../../traffic/context/landing-offer-context.js");
const ktrk_context_js_1 = require("../../traffic/context/ktrk-context.js");
const kclient_js_context_js_1 = require("../../traffic/context/kclient-js-context.js");
const not_found_context_js_1 = require("../../traffic/context/not-found-context.js");
const robots_context_js_1 = require("../../traffic/context/robots-context.js");
const ping_domain_context_js_1 = require("../../traffic/context/ping-domain-context.js");
const update_tokens_context_js_1 = require("../../traffic/context/update-tokens-context.js");
/**
 * Router parameter constants
 */
exports.TrafficRouterParams = {
    VERSION: 'version',
    KEY: 'k_router_key',
    CAMPAIGN: 'k_router_campaign'
};
/**
 * Traffic router result
 */
class TrafficRouterResult {
    request;
    context;
    constructor(request, context) {
        this.request = request;
        this.context = context;
    }
}
exports.TrafficRouterResult = TrafficRouterResult;
/**
 * Traffic Router Class
 *
 * Matches incoming requests to appropriate contexts for processing.
 */
class TrafficRouter {
    _routes;
    static PARAM_VERSION = exports.TrafficRouterParams.VERSION;
    static PARAM_KEY = exports.TrafficRouterParams.KEY;
    static PARAM_CAMPAIGN = exports.TrafficRouterParams.CAMPAIGN;
    constructor() {
        this._routes = this.buildRoutes();
    }
    /**
     * Build route definitions
     */
    buildRoutes() {
        return [
            // Admin API routes (not handled here, just placeholder)
            {
                pattern: /admin_api\/(v[0-9]+)/i,
                context: not_found_context_js_1.NotFoundContext,
                param: exports.TrafficRouterParams.VERSION
            },
            // Postback routes
            {
                pattern: /\/([a-z0-9\-_]+)\/postback/i,
                context: postback_context_js_1.PostbackContext,
                param: exports.TrafficRouterParams.KEY
            },
            {
                test: (request) => {
                    const keys = Object.keys(request.getQueryParams());
                    const first = keys[0];
                    if (first === 'postback' || request.getParam('postback')) {
                        return request.hasParam('key') ? request.getParam('key') ?? true : true;
                    }
                    return false;
                },
                context: postback_context_js_1.PostbackContext,
                param: exports.TrafficRouterParams.KEY
            },
            // Domain ping
            {
                test: (request) => request.getParam('_ping') === 'domain',
                context: ping_domain_context_js_1.PingDomainContext
            },
            // License refresh (placeholder)
            {
                test: (request) => request.getParam('_ping') === 'license',
                context: not_found_context_js_1.NotFoundContext
            },
            // Update tokens
            {
                test: (request) => !!request.getParam('_update_tokens'),
                context: update_tokens_context_js_1.UpdateTokensContext
            },
            // Click API routes
            {
                pattern: /click_api\/v([0-9])+\/?/i,
                context: click_api_context_js_1.ClickApiContext,
                param: exports.TrafficRouterParams.VERSION
            },
            {
                pattern: /[\/]*api\.php$/,
                context: click_api_context_js_1.ClickApiContext
            },
            // Landing/Offer flow
            {
                test: (request) => !!request.getParam('_lp'),
                context: landing_offer_context_js_1.LandingOfferContext
            },
            // KTRK (JSONP tracking)
            {
                test: (request) => {
                    if (request.getParam('return') === 'jsonp') {
                        const path = request.getPath();
                        const match = path.match(/\/([a-z0-9\-_]+)\/?$/i);
                        if (match) {
                            return match[1] ?? null;
                        }
                        const params = request.getQueryParams();
                        const keys = Object.keys(params);
                        return keys[0] ?? null;
                    }
                    return null;
                },
                param: exports.TrafficRouterParams.CAMPAIGN,
                context: ktrk_context_js_1.KtrkContext
            },
            // KClient JS tracking
            {
                test: (request) => {
                    if (request.getParam('return') === 'js.client') {
                        const path = request.getPath();
                        const match = path.match(/\/([a-z0-9\-_]+)\/?$/i);
                        if (match) {
                            return match[1] ?? null;
                        }
                        const params = request.getQueryParams();
                        const keys = Object.keys(params);
                        return keys[0] ?? null;
                    }
                    return null;
                },
                param: exports.TrafficRouterParams.CAMPAIGN,
                context: kclient_js_context_js_1.KClientJSContext
            },
            // Default click route (campaign token in URL)
            {
                pattern: /\/([a-z0-9\-_]+)\/?$/i,
                context: click_context_js_1.ClickContext,
                param: exports.TrafficRouterParams.CAMPAIGN
            },
            // Static routes
            {
                pattern: /^\/favicon\.ico/,
                context: not_found_context_js_1.NotFoundContext
            },
            {
                pattern: /^\/robots\.txt/,
                context: robots_context_js_1.RobotsContext
            },
            {
                pattern: /^\/gateway\.php/,
                context: gateway_redirect_context_js_1.GatewayRedirectContext
            },
            // Default: ClickContext for root domain
            {
                context: click_context_js_1.ClickContext
            }
        ];
    }
    /**
     * Match request to a context
     */
    match(request) {
        for (const route of this._routes) {
            const paramValue = this.testRoute(route, request);
            if (paramValue !== false) {
                // Create context instance
                const context = new route.context();
                // Update request params if needed
                const updatedRequest = this.updateParams(request, route, paramValue);
                return new TrafficRouterResult(updatedRequest, context);
            }
        }
        // Fallback to NotFoundContext
        return new TrafficRouterResult(request, new not_found_context_js_1.NotFoundContext());
    }
    /**
     * Test a route against the request
     */
    testRoute(route, request) {
        // Pattern-based matching
        if (route.pattern) {
            const match = request.getPath().match(route.pattern);
            if (match) {
                return match[1] ?? true;
            }
            return false;
        }
        // Custom test function
        if (route.test) {
            return route.test(request);
        }
        // Default: matches all
        return true;
    }
    /**
     * Update request params with extracted route parameter
     */
    updateParams(request, route, paramValue) {
        if (route.param && paramValue !== null && paramValue !== false) {
            const queryParams = request.getQueryParams();
            queryParams[route.param] = String(paramValue);
            return request.withQueryParams(queryParams);
        }
        return request;
    }
}
exports.TrafficRouter = TrafficRouter;
//# sourceMappingURL=traffic-router.js.map