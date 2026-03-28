/**
 * Not Found Context
 * 
 * Handles 404 Not Found responses.
 * Used when no matching route is found for the request.
 * 
 * @see keitaro_source/application/Traffic/Context/NotFoundContext.php
 */
import { BaseContext } from '../../core/context/context-interface';
import type { ServerRequest } from '../request/server-request';
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface';
import type { Response } from '../response/response';
import { SimpleDispatcher } from '../../core/dispatcher/dispatcher-interface';
import { Response as HttpResponse } from '../response/response';
import { StatusCode } from '../response/status-code';
import { ContentType } from '../response/content-type';

export class NotFoundContext extends BaseContext {
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
   * Return simple 404 response
   */
  dispatcher(_request: ServerRequest): DispatcherInterface {
    const response = new HttpResponse({
      status: StatusCode.NOT_FOUND,
      disableCache: true
    })
      .withHeader(ContentType.HEADER, ContentType.HTML)
      .withBody('Not Found');
    
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
    return HttpResponse.buildJson({
      status: StatusCode.INTERNAL_SERVER_ERROR,
      body: {
        error: error.message
      }
    });
  }
}
