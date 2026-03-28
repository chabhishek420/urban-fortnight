/**
 * KTRK Dispatcher (JSONP Tracking)
 *
 * Handles JSONP-based tracking requests.
 * Returns JavaScript responses for cross-domain tracking.
 *
 * @see keitaro_source/application/Traffic/Dispatcher/KtrkDispatcher.php
 */
import { ClickApiDispatcher } from './click-api-dispatcher.js';
import type { ServerRequest } from '../request/server-request.js';
import type { Response } from '../response/response.js';
import type { Payload } from '../pipeline/payload.js';
export declare class KtrkDispatcher extends ClickApiDispatcher {
    constructor(payload: Payload, version?: number);
    /**
     * Dispatch and return JSONP response
     */
    dispatch(request: ServerRequest): Response;
}
//# sourceMappingURL=ktrk-dispatcher.d.ts.map