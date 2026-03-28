/**
 * Update Tokens Dispatcher
 *
 * Handles token update requests.
 * Updates click tokens with additional parameters.
 *
 * @see keitaro_source/application/Traffic/Dispatcher/UpdateTokensDispatcher.php
 */
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface.js';
import type { ServerRequest } from '../request/server-request.js';
import type { Response } from '../response/response.js';
export declare class UpdateTokensDispatcher implements DispatcherInterface {
    /**
     * Dispatch token update request
     */
    dispatch(request: ServerRequest): Response;
    /**
     * Update tokens for a click
     */
    private updateTokens;
}
//# sourceMappingURL=update-tokens-dispatcher.d.ts.map