/**
 * Landing Offer Context
 * 
 * Handles landing page to offer transitions.
 * Restores raw click data from tokens and processes offer selection.
 * 
 * @see keitaro_source/application/Traffic/Context/LandingOfferContext.php
 */
import { BaseContext } from '../../core/context/context-interface';
import type { ServerRequest } from '../request/server-request';
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface';
import type { Response } from '../response/response';
import { SimpleDispatcher } from '../../core/dispatcher/dispatcher-interface';
import { ClickDispatcher } from '../dispatcher/click-dispatcher';
import { LandingOfferDispatcher } from '../dispatcher/landing-offer-dispatcher';
import { Response as HttpResponse } from '../response/response';
import { StatusCode } from '../response/status-code';
import { ContentType } from '../response/content-type';
import type { RawClick } from '../model/raw-click';

/**
 * UUID prefix for LP tokens
 */
const UUID_PREFIX = 'ktrk';

export class LandingOfferContext extends BaseContext {
  /**
   * Initialize click context
   */
  bootstrap(): void {
    // In production: Bootstrap::initClickContext()
  }

  /**
   * No request modification needed
   */
  modifyRequest(request: ServerRequest): ServerRequest {
    return request;
  }

  /**
   * Return appropriate dispatcher based on token presence
   */
  dispatcher(request: ServerRequest): DispatcherInterface {
    const token = this.getToken(request);
    
    // Validate token format
    if (token && !token.includes(UUID_PREFIX)) {
      // In production: LoggerService::instance()->warning("Someone sent incorrect uuid token: " + token)
      return new SimpleDispatcher(this.errorResponse(441, 'Page is unavailable'));
    }
    
    // In production: TrafficLoggerService::instance()->entry()->add("[LandingOfferContext]")
    
    // No token - treat as new visit
    if (!token) {
      // In production: TrafficLoggerService::instance()->entry()->add("Warning! Param '_token' is empty. Running campaign assigned to the domain as new visit.")
      return new ClickDispatcher();
    }
    
    // Try to restore raw click from token
    const rawClick = this.restoreRawClick(token);
    
    if (!rawClick) {
      return new SimpleDispatcher(this.errorResponse(422, `Failed to restore rawClick by uuid ${token}`));
    }
    
    return new LandingOfferDispatcher(rawClick);
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
    return this.createErrorResponse(error);
  }

  // === Private helper methods ===

  private getToken(request: ServerRequest): string | undefined {
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

  private errorResponse(status: number, _message: string): Response {
    const error = 'Sorry. The link is outdated or incorrect. Please read page Maintenance > Logs.';
    
    return HttpResponse.build()
      .withStatus(status)
      .withHeader(ContentType.HEADER, ContentType.HTML)
      .withBody(error);
  }

  private restoreRawClick(token: string): RawClick | null {
    // Try to restore from token service first
    const rawClick = this.restoreByToken(token);
    if (rawClick) {
      return rawClick;
    }
    
    // Fallback to database lookup
    return this.findInDatabase(token);
  }

  private restoreByToken(_token: string): RawClick | null {
    // In production: LpTokenService::instance()->getRawClickByToken(token)
    return null;
  }

  private findInDatabase(_token: string): RawClick | null {
    // In production: Extract subId from token and query database
    // const subId = LpTokenService::instance()->subIdFromToken(token)
    // return RawClickRepository::instance()->findBySubId(subId)
    return null;
  }

  private createErrorResponse(error: Error): Response {
    return HttpResponse.buildJson({
      status: StatusCode.INTERNAL_SERVER_ERROR,
      body: {
        error: error.message
      }
    });
  }
}
