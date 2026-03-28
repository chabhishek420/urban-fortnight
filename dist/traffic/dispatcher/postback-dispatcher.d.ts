/**
 * Postback Dispatcher
 *
 * Handles postback/conversion tracking requests.
 * Processes conversion data from affiliate networks and advertisers.
 *
 * @see keitaro_source/application/Traffic/Dispatcher/PostbackDispatcher.php
 */
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface.js';
import type { ServerRequest } from '../request/server-request.js';
import type { Response } from '../response/response.js';
export declare class PostbackDispatcher implements DispatcherInterface {
    static readonly JSONP = "jsonp";
    static readonly GIF = "gif";
    /**
     * Dispatch the postback request
     */
    dispatch(request: ServerRequest): Response;
    /**
     * Log postback message
     */
    log(message: string): void;
    /**
     * Convert custom headers for special integrations
     */
    convertCustomHeaders(request: ServerRequest): ServerRequest;
    /**
     * Find postback key from request
     */
    private findKey;
    /**
     * Validate postback key
     */
    private isKeyValid;
    /**
     * Build postback object from request params
     */
    private buildPostbackFromParams;
    /**
     * Process the postback
     */
    private processPostback;
    /**
     * Update response body based on return format
     */
    private updateBody;
    /**
     * Escape HTML entities
     */
    private escapeHtml;
}
//# sourceMappingURL=postback-dispatcher.d.ts.map