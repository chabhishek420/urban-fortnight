/**
 * Traffic Router
 *
 * Routes incoming traffic requests to appropriate contexts based on URL patterns
 * and request parameters. This is the main entry point for traffic handling.
 *
 * @see keitaro_source/application/Core/Router/TrafficRouter.php
 */
import type { ServerRequest } from '../../traffic/request/server-request.js';
import type { ContextInterface } from '../context/context-interface.js';
/**
 * Router parameter constants
 */
export declare const TrafficRouterParams: {
    readonly VERSION: "version";
    readonly KEY: "k_router_key";
    readonly CAMPAIGN: "k_router_campaign";
};
/**
 * Traffic router result
 */
export declare class TrafficRouterResult {
    readonly request: ServerRequest;
    readonly context: ContextInterface;
    constructor(request: ServerRequest, context: ContextInterface);
}
/**
 * Traffic Router Class
 *
 * Matches incoming requests to appropriate contexts for processing.
 */
export declare class TrafficRouter {
    private _routes;
    static readonly PARAM_VERSION: "version";
    static readonly PARAM_KEY: "k_router_key";
    static readonly PARAM_CAMPAIGN: "k_router_campaign";
    constructor();
    /**
     * Build route definitions
     */
    private buildRoutes;
    /**
     * Match request to a context
     */
    match(request: ServerRequest): TrafficRouterResult;
    /**
     * Test a route against the request
     */
    private testRoute;
    /**
     * Update request params with extracted route parameter
     */
    private updateParams;
}
//# sourceMappingURL=traffic-router.d.ts.map