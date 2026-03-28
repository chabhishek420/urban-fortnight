/**
 * Click Context
 * 
 * Main click processing context. Handles regular traffic clicks
 * through the standard pipeline.
 * 
 * @see keitaro_source/application/Traffic/Context/ClickContext.php
 */
import { BaseContext } from '../../core/context/context-interface';
import type { ServerRequest } from '../request/server-request';
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface';
import type { Response } from '../response/response';
import { ClickDispatcher } from '../dispatcher/click-dispatcher';

export class ClickContext extends BaseContext {
  /**
   * Initialize click context - setup logging and traffic tracking
   */
  bootstrap(): void {
    // In production: Bootstrap::initClickContext()
    // In production: TrafficLoggerService::reset()
    // In production: Setup traffic log entry if enabled
  }

  /**
   * Modify request - resolve real IP address
   */
  modifyRequest(request: ServerRequest): ServerRequest {
    // Find real IP from various headers
    const realIp = this.findRealIp(request);
    return request.withServerParams({
      REMOTE_ADDR: realIp
    });
  }

  /**
   * Return click dispatcher
   */
  dispatcher(_request: ServerRequest): DispatcherInterface {
    // In production: TrafficLoggerService::instance()->entry()->add("[ClickContext]")
    return new ClickDispatcher();
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

  /**
   * Find real IP address from request
   */
  private findRealIp(request: ServerRequest): string {
    return request.getClientIp();
  }

  /**
   * Create error response
   */
  private createErrorResponse(error: Error): Response {
    const { Response } = require('../response/response');
    const { StatusCode } = require('../response/status-code');
    
    return Response.buildJson({
      status: StatusCode.INTERNAL_SERVER_ERROR,
      body: {
        error: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
}
