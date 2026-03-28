/**
 * Click Dispatcher
 *
 * Main dispatcher for processing regular click traffic.
 * Runs the first level pipeline stages to process the click.
 *
 * @see keitaro_source/application/Traffic/Dispatcher/ClickDispatcher.php
 */
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface.js';
import type { ServerRequest } from '../request/server-request.js';
import type { Response } from '../response/response.js';
import type { ContextInterface } from '../../core/context/context-interface.js';
export declare class ClickDispatcher implements DispatcherInterface {
    /**
     * Dispatch the click request through the pipeline
     */
    dispatch(request: ServerRequest): Promise<Response>;
    /**
     * Process context through the pipeline (for DispatcherInterface)
     */
    process(context: ContextInterface): ContextInterface;
    /**
     * Check if license is expired
     */
    private isLicenseExpired;
    /**
     * Get error response
     */
    private getErrorResponse;
}
//# sourceMappingURL=click-dispatcher.d.ts.map