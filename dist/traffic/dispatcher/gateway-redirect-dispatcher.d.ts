/**
 * Gateway Redirect Dispatcher
 *
 * Handles gateway redirects for secure landing page redirects.
 * Decodes JWT tokens and returns redirect pages.
 *
 * @see keitaro_source/application/Traffic/Dispatcher/GatewayRedirectDispatcher.php
 */
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface.js';
import type { ServerRequest } from '../request/server-request.js';
import type { Response } from '../response/response.js';
export declare class GatewayRedirectDispatcher implements DispatcherInterface {
    /**
     * Dispatch the gateway redirect request
     */
    dispatch(request: ServerRequest): Response;
    /**
     * Decode JWT token
     */
    private decodeToken;
    /**
     * Generate redirect HTML code
     */
    private generateRedirectCode;
    /**
     * Return bad request response
     */
    private badRequest;
}
//# sourceMappingURL=gateway-redirect-dispatcher.d.ts.map