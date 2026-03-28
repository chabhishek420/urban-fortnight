/**
 * Core Context Interface
 * 
 * Contexts define how requests are processed in different scenarios.
 * Each context implements the full request lifecycle: bootstrap → modify → dispatch → shutdown
 * 
 * @see keitaro_source/application/Core/Context/ContextInterface.php
 * @artifact ARTIFACT-002: Original declared as 'final class', corrected to interface
 */

import type { ServerRequest } from '../../traffic/request/server-request';
import { Response } from '../../traffic/response/response';
import type { DispatcherInterface } from '../dispatcher/dispatcher-interface';
import { StatusCode } from '../../traffic/response/status-code';

export interface ContextInterface {
  /**
   * Initialize the context (load settings, setup logging, etc.)
   */
  bootstrap(): Promise<void> | void;

  /**
   * Modify the incoming request before processing
   * Used for request normalization, adding headers, etc.
   */
  modifyRequest(request: ServerRequest): ServerRequest;

  /**
   * Return the appropriate dispatcher for this context
   * The dispatcher handles the actual request processing
   */
  dispatcher(request: ServerRequest): DispatcherInterface;

  /**
   * Cleanup after request processing
   * Close connections, flush logs, etc.
   */
  shutdown(): Promise<void> | void;

  /**
   * Handle exceptions that occur during request processing
   */
  handleException(error: Error, request: ServerRequest): Response;
}

/**
 * Base context implementation with common functionality
 */
export abstract class BaseContext implements ContextInterface {
  abstract bootstrap(): Promise<void> | void;
  abstract modifyRequest(request: ServerRequest): ServerRequest;
  abstract dispatcher(request: ServerRequest): DispatcherInterface;
  abstract shutdown(): Promise<void> | void;

  handleException(error: Error, _request: ServerRequest): Response {
    return Response.buildJson({
      status: StatusCode.INTERNAL_SERVER_ERROR,
      body: {
        error: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
}
