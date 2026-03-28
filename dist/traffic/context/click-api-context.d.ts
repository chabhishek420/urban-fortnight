/**
 * Click API Context
 *
 * Handles API-based click processing with version support.
 * Allows external systems to send clicks programmatically.
 *
 * @see keitaro_source/application/Traffic/Context/ClickApiContext.php
 */
import { BaseContext } from '../../core/context/context-interface.js';
import { ServerRequest } from '../request/server-request.js';
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface.js';
import type { Response } from '../response/response.js';
export declare class ClickApiContext extends BaseContext {
    static readonly API_KEY = "api_key";
    static readonly TOKEN_NAME = "token";
    static readonly DEFAULT_VERSION = 1;
    static readonly UNIQUENESS_COOKIE_PARAM = "uniqueness_cookie";
    private _apiParams;
    /**
     * Initialize click API context
     */
    bootstrap(): void;
    /**
     * Modify request - handle IP and uniqueness cookie
     */
    modifyRequest(request: ServerRequest): ServerRequest;
    /**
     * Return appropriate dispatcher based on request
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
    private removeCloudFlareIpCountry;
    private findToken;
    private replaceRawClickParams;
    private isApiKeyProvided;
    private isApiValid;
    private errorResponse;
    private findVersion;
    private setUniquenessCookie;
    private adaptPayloadByApiVersion;
}
//# sourceMappingURL=click-api-context.d.ts.map