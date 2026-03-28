/**
 * Click Context
 *
 * Main click processing context. Handles regular traffic clicks
 * through the standard pipeline.
 *
 * @see keitaro_source/application/Traffic/Context/ClickContext.php
 */
import { BaseContext } from '../../core/context/context-interface.js';
import type { ServerRequest } from '../request/server-request.js';
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface.js';
import type { Response } from '../response/response.js';
export declare class ClickContext extends BaseContext {
    /**
     * Initialize click context - setup logging and traffic tracking
     */
    bootstrap(): void;
    /**
     * Modify request - resolve real IP address
     */
    modifyRequest(request: ServerRequest): ServerRequest;
    /**
     * Return click dispatcher
     */
    dispatcher(_request: ServerRequest): DispatcherInterface;
    /**
     * Cleanup after request
     */
    shutdown(): void;
    /**
     * Handle exceptions
     */
    handleException(error: Error, _request: ServerRequest): Response;
    /**
     * Find real IP address from request
     */
    private findRealIp;
    /**
     * Create error response
     */
    private createErrorResponse;
}
//# sourceMappingURL=click-context.d.ts.map