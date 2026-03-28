/**
 * KClient JS Dispatcher
 *
 * Handles JavaScript client tracking requests.
 * Generates JavaScript code for client-side tracking integration.
 *
 * @see keitaro_source/application/Traffic/Dispatcher/KClientJSDispatcher.php
 */
import { ClickApiDispatcher } from './click-api-dispatcher.js';
import type { ServerRequest } from '../request/server-request.js';
import type { Response } from '../response/response.js';
import type { Payload } from '../pipeline/payload.js';
export declare class KClientJSDispatcher extends ClickApiDispatcher {
    constructor(payload: Payload, version?: number);
    /**
     * Dispatch and return JS client code
     */
    dispatch(request: ServerRequest): Response;
    /**
     * Get code for new visitors (no sub_id)
     */
    private getCodeWithoutSubId;
    /**
     * Get code for existing visitors (with sub_id)
     */
    private getCodeWithSubId;
    /**
     * Generate JavaScript client code
     */
    private generateClientCode;
}
//# sourceMappingURL=kclient-js-dispatcher.d.ts.map