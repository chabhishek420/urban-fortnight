/**
 * Gateway Redirect Context
 * 
 * Handles gateway redirects for landing page redirects.
 * Uses JWT tokens for secure URL encoding.
 * 
 * @see keitaro_source/application/Traffic/Context/GatewayRedirectContext.php
 */
import { BaseContext } from '../../core/context/context-interface';
import type { ServerRequest } from '../request/server-request';
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface';
import type { Response } from '../response/response';
import { SimpleDispatcher } from '../../core/dispatcher/dispatcher-interface';
import { GatewayRedirectDispatcher } from '../dispatcher/gateway-redirect-dispatcher';
import { Response as HttpResponse } from '../response/response';
import { StatusCode } from '../response/status-code';

export class GatewayRedirectContext extends BaseContext {
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
   * Return gateway redirect dispatcher with token validation
   */
  dispatcher(request: ServerRequest): DispatcherInterface {
    const token = request.getParam('token');
    
    if (!token) {
      return new SimpleDispatcher(this.errorResponse('Empty token', StatusCode.BAD_REQUEST));
    }
    
    return new GatewayRedirectDispatcher();
  }

  /**
   * No cleanup needed
   */
  shutdown(): void {
    // No-op
  }

  /**
   * Handle exceptions
   */
  handleException(error: Error, _request: ServerRequest): Response {
    return this.createErrorResponse(error);
  }

  /**
   * Create error response
   */
  private errorResponse(message: string, status: number = StatusCode.INTERNAL_SERVER_ERROR): Response {
    return HttpResponse.buildHtml({
      body: message,
      status
    });
  }

  /**
   * Create generic error response
   */
  private createErrorResponse(error: Error): Response {
    return HttpResponse.buildJson({
      status: StatusCode.INTERNAL_SERVER_ERROR,
      body: {
        error: error.message
      }
    });
  }
}
