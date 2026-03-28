/**
 * Postback Context
 *
 * Handles postback/conversion tracking requests.
 * Receives conversion data from affiliate networks and advertisers.
 *
 * @see keitaro_source/application/Traffic/Context/PostbackContext.php
 */
import { BaseContext } from '../../core/context/context-interface.js';
import type { ServerRequest } from '../request/server-request.js';
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface.js';
import type { Response } from '../response/response.js';
export declare class PostbackContext extends BaseContext {
    /**
     * Initialize CLI context for postbacks
     */
    bootstrap(): void;
    /**
     * No request modification needed for postbacks
     */
    modifyRequest(request: ServerRequest): ServerRequest;
    /**
     * Return postback dispatcher
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
    /**
     * Create error response
     */
    private createErrorResponse;
}
//# sourceMappingURL=postback-context.d.ts.map