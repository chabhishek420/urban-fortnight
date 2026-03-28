/**
 * Robots Context
 * 
 * Handles robots.txt requests.
 * Returns allow/disallow directives based on domain settings.
 * 
 * @see keitaro_source/application/Traffic/Context/RobotsContext.php
 */
import { BaseContext } from '../../core/context/context-interface';
import type { ServerRequest } from '../request/server-request';
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface';
import type { Response } from '../response/response';
import { RobotsDispatcher } from '../dispatcher/robots-dispatcher';

export class RobotsContext extends BaseContext {
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
   * Return robots dispatcher
   */
  dispatcher(_request: ServerRequest): DispatcherInterface {
    return new RobotsDispatcher();
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
}
