/**
 * Ping Domain Context
 *
 * Handles domain ping requests for health checks.
 * Returns the tracker code for the domain.
 *
 * @see keitaro_source/application/Traffic/Context/PingDomainContext.php
 */
import { BaseContext } from '../../core/context/context-interface.js';
import type { ServerRequest } from '../request/server-request.js';
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface.js';
import type { Response } from '../response/response.js';
export declare class PingDomainContext extends BaseContext {
    /**
     * Initialize click context
     */
    bootstrap(): void;
    /**
     * No request modification needed
     */
    modifyRequest(request: ServerRequest): ServerRequest;
    /**
     * Return tracker code response
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
     * Get tracker code for domain
     */
    private getTrackerCode;
}
//# sourceMappingURL=ping-domain-context.d.ts.map