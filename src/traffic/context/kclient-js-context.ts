/**
 * KClient JS Context
 * 
 * Handles JavaScript client tracking requests.
 * Generates JavaScript code for client-side tracking integration.
 * 
 * @see keitaro_source/application/Traffic/Context/KClientJSContext.php
 */
import { BaseContext } from '../../core/context/context-interface';
import type { ServerRequest } from '../request/server-request';
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface';
import type { Response } from '../response/response';
import { KClientJSDispatcher } from '../dispatcher/kclient-js-dispatcher';
import { Payload } from '../pipeline/payload';
import { RawClick } from '../model/raw-click';

export class KClientJSContext extends BaseContext {
  static readonly CAMPAIGN_NOT_FOUND = 'Campaign not found';

  /**
   * Initialize click context with logging
   */
  bootstrap(): void {
    // In production: Bootstrap::initClickContext()
    // In production: TrafficLoggerService::reset()
    // In production: Setup traffic log entry if enabled
  }

  /**
   * No request modification needed
   */
  modifyRequest(request: ServerRequest): ServerRequest {
    return request;
  }

  /**
   * Return KClient JS dispatcher with pipeline payload
   */
  dispatcher(request: ServerRequest): DispatcherInterface {
    // In production: TrafficLoggerService::instance()->entry()->add("[KClientJSContext]")
    
    const pipelinePayload = new Payload({
      serverRequest: request,
      rawClick: new RawClick()
    });
    
    pipelinePayload.setNeedToken(true);
    pipelinePayload.setForceRedirectOffer(true);
    
    return new KClientJSDispatcher(pipelinePayload, 2);
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
