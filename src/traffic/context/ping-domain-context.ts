/**
 * Ping Domain Context
 * 
 * Handles domain ping requests for health checks.
 * Returns the tracker code for the domain.
 * 
 * @see keitaro_source/application/Traffic/Context/PingDomainContext.php
 */
import { BaseContext } from '../../core/context/context-interface';
import type { ServerRequest } from '../request/server-request';
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface';
import type { Response } from '../response/response';
import { SimpleDispatcher } from '../../core/dispatcher/dispatcher-interface';
import { Response as HttpResponse } from '../response/response';

export class PingDomainContext extends BaseContext {
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
   * Return tracker code response
   */
  dispatcher(_request: ServerRequest): DispatcherInterface {
    // In production: Get tracker code from DomainService
    const trackerCode = this.getTrackerCode();
    
    const response = new HttpResponse({
      disableCache: true,
      body: trackerCode
    });
    
    return new SimpleDispatcher(response);
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
    const { Response } = require('../response/response');
    const { StatusCode } = require('../response/status-code');
    
    return Response.buildJson({
      status: StatusCode.INTERNAL_SERVER_ERROR,
      body: {
        error: error.message
      }
    });
  }

  /**
   * Get tracker code for domain
   */
  private getTrackerCode(): string {
    // In production: DomainService::instance()->getTrackerCode()
    return 'OK';
  }
}
