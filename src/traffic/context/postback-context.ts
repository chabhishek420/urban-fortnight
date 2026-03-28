/**
 * Postback Context
 * 
 * Handles postback/conversion tracking requests.
 * Receives conversion data from affiliate networks and advertisers.
 * 
 * @see keitaro_source/application/Traffic/Context/PostbackContext.php
 */
import { BaseContext } from '../../core/context/context-interface';
import type { ServerRequest } from '../request/server-request';
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface';
import type { Response } from '../response/response';
import { PostbackDispatcher } from '../dispatcher/postback-dispatcher';

export class PostbackContext extends BaseContext {
  /**
   * Initialize CLI context for postbacks
   */
  bootstrap(): void {
    // In production: Bootstrap::initCliContext()
  }

  /**
   * No request modification needed for postbacks
   */
  modifyRequest(request: ServerRequest): ServerRequest {
    return request;
  }

  /**
   * Return postback dispatcher
   */
  dispatcher(_request: ServerRequest): DispatcherInterface {
    return new PostbackDispatcher();
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
  private createErrorResponse(error: Error): Response {
    const { Response } = require('../response/response');
    const { StatusCode } = require('../response/status-code');
    
    return Response.buildJson({
      status: StatusCode.INTERNAL_SERVER_ERROR,
      body: {
        error: error.message
      }
    });
  }
}
