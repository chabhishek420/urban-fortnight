/**
 * Not Found Context
 *
 * Handles 404 Not Found responses.
 * Used when no matching route is found for the request.
 *
 * @see keitaro_source/application/Traffic/Context/NotFoundContext.php
 */
import { BaseContext } from '../../core/context/context-interface.js';
import type { ServerRequest } from '../request/server-request.js';
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface.js';
import type { Response } from '../response/response.js';
export declare class NotFoundContext extends BaseContext {
    /**
     * Initialize click context
     */
    bootstrap(): void;
    /**
     * No request modification needed
     */
    modifyRequest(request: ServerRequest): ServerRequest;
    /**
     * Return simple 404 response
     */
    dispatcher(_request: ServerRequest): DispatcherInterface;
    /**
     * No cleanup needed
     */
    shutdown(): void;
    /**
     * Handle exceptions
     */
    handleException(error: Error, _request: ServerRequest): Response;
}
//# sourceMappingURL=not-found-context.d.ts.map