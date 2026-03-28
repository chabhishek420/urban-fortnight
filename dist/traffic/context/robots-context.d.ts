/**
 * Robots Context
 *
 * Handles robots.txt requests.
 * Returns allow/disallow directives based on domain settings.
 *
 * @see keitaro_source/application/Traffic/Context/RobotsContext.php
 */
import { BaseContext } from '../../core/context/context-interface.js';
import type { ServerRequest } from '../request/server-request.js';
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface.js';
import type { Response } from '../response/response.js';
export declare class RobotsContext extends BaseContext {
    /**
     * Initialize click context
     */
    bootstrap(): void;
    /**
     * No request modification needed
     */
    modifyRequest(request: ServerRequest): ServerRequest;
    /**
     * Return robots dispatcher
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
//# sourceMappingURL=robots-context.d.ts.map