/**
 * Click API Dispatcher
 *
 * Handles API-based click processing with version support.
 * Returns JSON responses based on API version.
 *
 * @see keitaro_source/application/Traffic/Dispatcher/ClickApiDispatcher.php
 */
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface.js';
import type { ServerRequest } from '../request/server-request.js';
import type { Response } from '../response/response.js';
import type { Payload } from '../pipeline/payload.js';
export declare class ClickApiDispatcher implements DispatcherInterface {
    private _version;
    private _pipelinePayload;
    constructor(payload: Payload, version?: number);
    /**
     * Set API version
     */
    setVersion(version: number): void;
    /**
     * Get pipeline payload
     */
    getPipelinePayload(): Payload;
    /**
     * Dispatch the API request
     */
    dispatch(request: ServerRequest): Response;
    /**
     * Build version 1 response
     */
    private buildVersion1Response;
    /**
     * Build version 2 response
     */
    private buildVersion2Response;
    /**
     * Build version 3 response
     */
    private buildVersion3Response;
    /**
     * Build version 2 JSON data (helper for v3)
     */
    private buildVersion2Json;
    /**
     * Convert headers to list format
     */
    private headersToList;
    /**
     * Build error response
     */
    private buildErrorResponse;
}
//# sourceMappingURL=click-api-dispatcher.d.ts.map