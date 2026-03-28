/**
 * Click API Context
 * 
 * Handles API-based click processing with version support.
 * Allows external systems to send clicks programmatically.
 * 
 * @see keitaro_source/application/Traffic/Context/ClickApiContext.php
 */
import { BaseContext } from '../../core/context/context-interface';
import { ServerRequest } from '../request/server-request';
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface';
import type { Response } from '../response/response';
import { SimpleDispatcher } from '../../core/dispatcher/dispatcher-interface';
import { ClickApiDispatcher } from '../dispatcher/click-api-dispatcher';
import { Payload } from '../pipeline/payload';
import { RawClick } from '../model/raw-click';
import type { Campaign } from '../model/campaign';
import { Response as HttpResponse } from '../response/response';
import { StatusCode } from '../response/status-code';
import { ContentType } from '../response/content-type';

/**
 * API parameter mappings
 */
const API_PARAMS: Record<string, string[]> = {
  language: ['lang', 'language'],
  referrer: ['referrer', 'referer'],
  user_agent: ['ua', 'user_agent'],
  search_engine: ['search_engine', 'se'],
  landing_id: ['landing_id'],
  datetime: ['datetime'],
  always_empty_cookies: ['always_empty_cookies']
};

export class ClickApiContext extends BaseContext {
  static readonly API_KEY = 'api_key';
  static readonly TOKEN_NAME = 'token';
  static readonly DEFAULT_VERSION = 1;
  static readonly UNIQUENESS_COOKIE_PARAM = 'uniqueness_cookie';

  private _apiParams = API_PARAMS;

  /**
   * Initialize click API context
   */
  bootstrap(): void {
    // In production: Bootstrap::initClickContext()
    // In production: TrafficLoggerService::reset()
    // In production: Setup traffic log entry if enabled
  }

  /**
   * Modify request - handle IP and uniqueness cookie
   */
  modifyRequest(request: ServerRequest): ServerRequest {
    let modifiedRequest = this.setUniquenessCookie(request);
    modifiedRequest = this.removeCloudFlareIpCountry(modifiedRequest);
    
    // Set IP from parameter if provided
    const ip = request.getParam('ip');
    if (ip) {
      modifiedRequest = modifiedRequest.withHeaders({
        [ServerRequest.HEADER_X_REAL_IP]: ip,
        [ServerRequest.HEADER_CF_CONNECTING_IP]: ip
      });
      modifiedRequest = modifiedRequest.withServerParams({
        [ServerRequest.REMOTE_ADDR]: ip
      });
    }
    
    return modifiedRequest;
  }

  /**
   * Return appropriate dispatcher based on request
   */
  dispatcher(request: ServerRequest): DispatcherInterface {
    // In production: TrafficLoggerService::instance()->entry()->add("[ClickApiContext]")
    
    const version = this.findVersion(request);
    const rawClick = new RawClick();
    
    // Replace raw click params from request
    this.replaceRawClickParams(request, rawClick);
    
    let campaign: Campaign | undefined = undefined;
    
    // Check if API key is provided
    if (this.isApiKeyProvided(request)) {
      if (!this.isApiValid(request)) {
        return new SimpleDispatcher(this.errorResponse(403, 'Invalid token or api key'));
      }
    } else {
      // Find campaign by token
      const token = this.findToken(request);
      if (!token) {
        return new SimpleDispatcher(this.errorResponse(404, 'No campaign token'));
      }
      
      // In production: Find campaign by token from repository
      // campaign = CachedCampaignRepository::instance()->findByToken(token);
    }
    
    const payloadOptions: import('../pipeline/payload').PayloadOptions = {
      serverRequest: request,
      rawClick
    };
    if (campaign) {
      payloadOptions.campaign = campaign;
    }
    
    const pipelinePayload = new Payload(payloadOptions);
    
    // Adapt payload by API version
    this.adaptPayloadByApiVersion(pipelinePayload, version);
    
    // Check if requested URI
    if (request.hasParam('uri')) {
      // In production: TrafficLoggerService::instance()->entry()->add("Requested: " + request.getParam('uri'))
    }
    
    return new ClickApiDispatcher(pipelinePayload, version);
  }

  /**
   * Cleanup after request
   */
  shutdown(): void {
    // In production: TrafficLoggerService::instance()->flush()
  }

  /**
   * Handle exceptions
   */
  handleException(error: Error, _request: ServerRequest): Response {
    const body: Record<string, unknown> = {
      error: error.message
    };
    
    // In production: Log error
    
    return HttpResponse.buildJson({
      status: StatusCode.INTERNAL_SERVER_ERROR,
      body
    });
  }

  // === Private helper methods ===

  private removeCloudFlareIpCountry(request: ServerRequest): ServerRequest {
    return request.withoutHeader(ServerRequest.HEADER_CF_IPCOUNTRY);
  }

  private findToken(request: ServerRequest): string | undefined {
    return request.getParam(ClickApiContext.TOKEN_NAME);
  }

  private replaceRawClickParams(request: ServerRequest, rawClick: RawClick): void {
    for (const [attr, variations] of Object.entries(this._apiParams)) {
      for (const param of variations) {
        if (request.hasParam(param)) {
          rawClick.set(attr, request.getParam(param));
          break;
        }
      }
    }
  }

  private isApiKeyProvided(request: ServerRequest): boolean {
    return !!request.getParam(ClickApiContext.API_KEY);
  }

  private isApiValid(request: ServerRequest): boolean {
    // In production: Compare with stored API key
    const providedKey = request.getParam(ClickApiContext.API_KEY);
    return !!providedKey; // Simplified for now
  }

  private errorResponse(status: number, error: string): Response {
    return HttpResponse.build()
      .withStatus(status)
      .withHeader(ContentType.HEADER, ContentType.JSON)
      .withBody(JSON.stringify({ error }));
  }

  private findVersion(request: ServerRequest): number {
    const version = request.getParam('version');
    if (version && ['1', '2', '3'].includes(version)) {
      return parseInt(version, 10);
    }
    return ClickApiContext.DEFAULT_VERSION;
  }

  private setUniquenessCookie(request: ServerRequest): ServerRequest {
    if (request.hasParam(ClickApiContext.UNIQUENESS_COOKIE_PARAM)) {
      const cookieValue = request.getParam(ClickApiContext.UNIQUENESS_COOKIE_PARAM);
      if (cookieValue) {
        // In production: Set cookie with proper name from CookiesStorage
        return request.withCookieParam('keitaro_visitor', cookieValue);
      }
    }
    return request;
  }

  private adaptPayloadByApiVersion(payload: Payload, version: number): void {
    if (version < 3 || payload.getServerRequest().getParam('force_redirect_offer')) {
      payload.setForceRedirectOffer(true);
    } else {
      payload.setForceRedirectOffer(false);
    }
    
    if (version < 3 && payload.getServerRequest().getParam('force_choose_offer')) {
      payload.setForceChooseOffer(true);
    }
  }
}
