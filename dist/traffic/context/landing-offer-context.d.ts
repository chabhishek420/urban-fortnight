/**
 * Landing Offer Context
 *
 * Handles landing page to offer transitions.
 * Restores raw click data from tokens and processes offer selection.
 *
 * @see keitaro_source/application/Traffic/Context/LandingOfferContext.php
 */
import { BaseContext } from '../../core/context/context-interface.js';
import type { ServerRequest } from '../request/server-request.js';
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface.js';
import type { Response } from '../response/response.js';
export declare class LandingOfferContext extends BaseContext {
    /**
     * Initialize click context
     */
    bootstrap(): void;
    /**
     * No request modification needed
     */
    modifyRequest(request: ServerRequest): ServerRequest;
    /**
     * Return appropriate dispatcher based on token presence
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
    private getToken;
    private errorResponse;
    private restoreRawClick;
    private restoreByToken;
    private findInDatabase;
    private createErrorResponse;
}
//# sourceMappingURL=landing-offer-context.d.ts.map