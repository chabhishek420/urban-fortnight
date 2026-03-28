/**
 * Traffic Router
 * 
 * Routes incoming traffic requests to appropriate contexts based on URL patterns
 * and request parameters. This is the main entry point for traffic handling.
 * 
 * @see keitaro_source/application/Core/Router/TrafficRouter.php
 */
import type { ServerRequest } from '../../traffic/request/server-request';
import type { ContextInterface } from '../context/context-interface';

// Import all contexts
import { ClickContext } from '../../traffic/context/click-context';
import { ClickApiContext } from '../../traffic/context/click-api-context';
import { PostbackContext } from '../../traffic/context/postback-context';
import { GatewayRedirectContext } from '../../traffic/context/gateway-redirect-context';
import { LandingOfferContext } from '../../traffic/context/landing-offer-context';
import { KtrkContext } from '../../traffic/context/ktrk-context';
import { KClientJSContext } from '../../traffic/context/kclient-js-context';
import { NotFoundContext } from '../../traffic/context/not-found-context';
import { RobotsContext } from '../../traffic/context/robots-context';
import { PingDomainContext } from '../../traffic/context/ping-domain-context';
import { UpdateTokensContext } from '../../traffic/context/update-tokens-context';

/**
 * Router parameter constants
 */
export const TrafficRouterParams = {
  VERSION: 'version',
  KEY: 'k_router_key',
  CAMPAIGN: 'k_router_campaign'
} as const;

/**
 * Route definition interface
 */
interface RouteDefinition {
  pattern?: RegExp;
  test?: (request: ServerRequest) => string | boolean | null;
  context: new () => ContextInterface;
  param?: string;
}

/**
 * Traffic router result
 */
export class TrafficRouterResult {
  constructor(
    public readonly request: ServerRequest,
    public readonly context: ContextInterface
  ) {}
}

/**
 * Traffic Router Class
 * 
 * Matches incoming requests to appropriate contexts for processing.
 */
export class TrafficRouter {
  private _routes: RouteDefinition[];

  static readonly PARAM_VERSION = TrafficRouterParams.VERSION;
  static readonly PARAM_KEY = TrafficRouterParams.KEY;
  static readonly PARAM_CAMPAIGN = TrafficRouterParams.CAMPAIGN;

  constructor() {
    this._routes = this.buildRoutes();
  }

  /**
   * Build route definitions
   */
  private buildRoutes(): RouteDefinition[] {
    return [
      // Admin API routes (not handled here, just placeholder)
      {
        pattern: /admin_api\/(v[0-9]+)/i,
        context: NotFoundContext,
        param: TrafficRouterParams.VERSION
      },

      // Postback routes
      {
        pattern: /\/([a-z0-9\-_]+)\/postback/i,
        context: PostbackContext,
        param: TrafficRouterParams.KEY
      },
      {
        test: (request: ServerRequest) => {
          const keys = Object.keys(request.getQueryParams());
          const first = keys[0];
          if (first === 'postback' || request.getParam('postback')) {
            return request.hasParam('key') ? request.getParam('key') ?? true : true;
          }
          return false;
        },
        context: PostbackContext,
        param: TrafficRouterParams.KEY
      },

      // Domain ping
      {
        test: (request: ServerRequest) => request.getParam('_ping') === 'domain',
        context: PingDomainContext
      },

      // License refresh (placeholder)
      {
        test: (request: ServerRequest) => request.getParam('_ping') === 'license',
        context: NotFoundContext
      },

      // Update tokens
      {
        test: (request: ServerRequest) => !!request.getParam('_update_tokens'),
        context: UpdateTokensContext
      },

      // Click API routes
      {
        pattern: /click_api\/v([0-9])+\/?/i,
        context: ClickApiContext,
        param: TrafficRouterParams.VERSION
      },
      {
        pattern: /[\/]*api\.php$/,
        context: ClickApiContext
      },

      // Landing/Offer flow
      {
        test: (request: ServerRequest) => !!request.getParam('_lp'),
        context: LandingOfferContext
      },

      // KTRK (JSONP tracking)
      {
        test: (request: ServerRequest) => {
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
        param: TrafficRouterParams.CAMPAIGN,
        context: KtrkContext
      },

      // KClient JS tracking
      {
        test: (request: ServerRequest) => {
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
        param: TrafficRouterParams.CAMPAIGN,
        context: KClientJSContext
      },

      // Default click route (campaign token in URL)
      {
        pattern: /\/([a-z0-9\-_]+)\/?$/i,
        context: ClickContext,
        param: TrafficRouterParams.CAMPAIGN
      },

      // Static routes
      {
        pattern: /^\/favicon\.ico/,
        context: NotFoundContext
      },
      {
        pattern: /^\/robots\.txt/,
        context: RobotsContext
      },
      {
        pattern: /^\/gateway\.php/,
        context: GatewayRedirectContext
      },

      // Default: ClickContext for root domain
      {
        context: ClickContext
      }
    ];
  }

  /**
   * Match request to a context
   */
  match(request: ServerRequest): TrafficRouterResult {
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
    return new TrafficRouterResult(request, new NotFoundContext());
  }

  /**
   * Test a route against the request
   */
  private testRoute(route: RouteDefinition, request: ServerRequest): string | boolean | null {
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
  private updateParams(
    request: ServerRequest,
    route: RouteDefinition,
    paramValue: string | boolean | null
  ): ServerRequest {
    if (route.param && paramValue !== null && paramValue !== false) {
      const queryParams = request.getQueryParams();
      queryParams[route.param] = String(paramValue);
      return request.withQueryParams(queryParams);
    }
    return request;
  }
}
