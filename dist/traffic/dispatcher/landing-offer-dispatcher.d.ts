/**
 * Landing Offer Dispatcher
 *
 * Handles landing page to offer transitions.
 * Runs second level pipeline stages for offer processing.
 *
 * @see keitaro_source/application/Traffic/Dispatcher/LandingOfferDispatcher.php
 */
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface.js';
import type { ServerRequest } from '../request/server-request.js';
import type { Response } from '../response/response.js';
import type { RawClick } from '../model/raw-click.js';
export declare class LandingOfferDispatcher implements DispatcherInterface {
    private _rawClick;
    constructor(rawClick: RawClick);
    /**
     * Get raw click
     */
    getRawClick(): RawClick;
    /**
     * Dispatch the landing offer request
     */
    dispatch(request: ServerRequest): Response;
    /**
     * Save landing page click
     */
    private saveLpClick;
    /**
     * Get error response
     */
    private getErrorResponse;
}
//# sourceMappingURL=landing-offer-dispatcher.d.ts.map