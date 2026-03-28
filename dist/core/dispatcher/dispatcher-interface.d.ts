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
export declare class SimpleDispatcher implements DispatcherInterface {
    private readonly response;
    constructor(response: Response);
    dispatch(_request: ServerRequest): Response;
}
/**
 * Base dispatcher with common functionality
 */
export declare abstract class AbstractDispatcher implements DispatcherInterface {
    /**
     * Create an error response
     */
    protected errorResponse(message: string, status?: number): Response;
    /**
     * Create an HTML response
     */
    protected htmlResponse(body: string, status?: number): Response;
    /**
     * Create a JSON response
     */
    protected jsonResponse(body: unknown, status?: number): Response;
    /**
     * Dispatch the request - must be implemented by subclasses
     */
    abstract dispatch(request: ServerRequest): Response | Promise<Response>;
}
//# sourceMappingURL=dispatcher-interface.d.ts.map