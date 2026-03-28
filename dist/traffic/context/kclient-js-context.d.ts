/**
 * KClient JS Context
 *
 * Handles JavaScript client tracking requests.
 * Generates JavaScript code for client-side tracking integration.
 *
 * @see keitaro_source/application/Traffic/Context/KClientJSContext.php
 */
import { BaseContext } from '../../core/context/context-interface.js';
import type { ServerRequest } from '../request/server-request.js';
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface.js';
import type { Response } from '../response/response.js';
export declare class KClientJSContext extends BaseContext {
    static readonly CAMPAIGN_NOT_FOUND = "Campaign not found";
    /**
     * Initialize click context with logging
     */
    bootstrap(): void;
    /**
     * No request modification needed
     */
    modifyRequest(request: ServerRequest): ServerRequest;
    /**
     * Return KClient JS dispatcher with pipeline payload
     */
    dispatcher(request: ServerRequest): DispatcherInterface;
    /**
     * Cleanup after request
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
//# sourceMappingURL=kclient-js-context.d.ts.map