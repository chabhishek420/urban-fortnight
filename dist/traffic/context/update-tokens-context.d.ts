/**
 * Update Tokens Context
 *
 * Handles token update requests.
 * Updates click tokens with additional parameters.
 *
 * @see keitaro_source/application/Traffic/Context/UpdateTokensContext.php
 */
import { BaseContext } from '../../core/context/context-interface.js';
import type { ServerRequest } from '../request/server-request.js';
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface.js';
import type { Response } from '../response/response.js';
export declare class UpdateTokensContext extends BaseContext {
    /**
     * Initialize click context
     */
    bootstrap(): void;
    /**
     * No request modification needed
     */
    modifyRequest(request: ServerRequest): ServerRequest;
    /**
     * Return update tokens dispatcher
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
//# sourceMappingURL=update-tokens-context.d.ts.map