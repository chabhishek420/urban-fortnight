/**
 * Dispatcher Interface
 * 
 * Dispatchers handle the actual request processing for each context.
 * They coordinate the pipeline execution and return the final response.
 * 
 * @see keitaro_source/application/Core/Dispatcher/DispatcherInterface.php
 */

import type { ServerRequest } from '../../traffic/request/server-request';
import { Response } from '../../traffic/response/response';
import { StatusCode } from '../../traffic/response/status-code';

export interface DispatcherInterface {
  /**
   * Dispatch the request and return a response
   * 
   * @param request - The server request to process
   * @returns The response to send back to the client
   */
  dispatch(request: ServerRequest): Response | Promise<Response>;
}

/**
 * Simple dispatcher that returns a pre-built response
 * Used for error responses and simple cases
 */
export class SimpleDispatcher implements DispatcherInterface {
  constructor(private readonly response: Response) {}

  dispatch(_request: ServerRequest): Response {
    return this.response;
  }
}

/**
 * Base dispatcher with common functionality
 */
export abstract class AbstractDispatcher implements DispatcherInterface {
  /**
   * Create an error response
   */
  protected errorResponse(message: string, status: number = StatusCode.INTERNAL_SERVER_ERROR): Response {
    return Response.buildJson({
      status,
      body: { error: message }
    });
  }

  /**
   * Create an HTML response
   */
  protected htmlResponse(body: string, status: number = StatusCode.OK): Response {
    return Response.buildHtml({ body, status });
  }

  /**
   * Create a JSON response
   */
  protected jsonResponse(body: unknown, status: number = StatusCode.OK): Response {
    return Response.buildJson({ body, status });
  }

  /**
   * Dispatch the request - must be implemented by subclasses
   */
  abstract dispatch(request: ServerRequest): Response | Promise<Response>;
}
