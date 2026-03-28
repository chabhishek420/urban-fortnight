/**
 * Gateway Redirect Context
 *
 * Handles gateway redirects for landing page redirects.
 * Uses JWT tokens for secure URL encoding.
 *
 * @see keitaro_source/application/Traffic/Context/GatewayRedirectContext.php
 */
import { BaseContext } from '../../core/context/context-interface.js';
import type { ServerRequest } from '../request/server-request.js';
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface.js';
import type { Response } from '../response/response.js';
export declare class GatewayRedirectContext extends BaseContext {
    /**
     * Initialize click context
     */
    bootstrap(): void;
    /**
     * No request modification needed
     */
    modifyRequest(request: ServerRequest): ServerRequest;
    /**
     * Return gateway redirect dispatcher with token validation
     */
    dispatcher(request: ServerRequest): DispatcherInterface;
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
    private errorResponse;
    /**
     * Create generic error response
     */
    private createErrorResponse;
}
//# sourceMappingURL=gateway-redirect-context.d.ts.map