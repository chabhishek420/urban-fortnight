/**
 * Application Kernel
 *
 * The kernel is the core of the application - it handles the request lifecycle:
 * bootstrap → modify → dispatch → shutdown
 *
 * @see keitaro_source/application/Core/Kernel/Kernel.php
 */
import type { ServerRequest } from '../../traffic/request/server-request';
import { Response } from '../../traffic/response/response';
import type { ContextInterface } from '../context/context-interface';
/**
 * Logger interface for kernel logging
 */
export interface KernelLogger {
    info(message: string, context?: Record<string, unknown>): void;
    error(message: string, context?: Record<string, unknown>): void;
    warn(message: string, context?: Record<string, unknown>): void;
    debug(message: string, context?: Record<string, unknown>): void;
}
/**
 * Kernel lifecycle hooks
 */
export interface KernelHooks {
    beforeBootstrap?: (kernel: Kernel) => void | Promise<void>;
    afterBootstrap?: (kernel: Kernel) => void | Promise<void>;
    beforeDispatch?: (kernel: Kernel, request: ServerRequest) => void | Promise<void>;
    afterDispatch?: (kernel: Kernel, request: ServerRequest, response: Response) => void | Promise<void>;
    beforeShutdown?: (kernel: Kernel) => void | Promise<void>;
    afterShutdown?: (kernel: Kernel) => void | Promise<void>;
    onError?: (kernel: Kernel, error: Error, request: ServerRequest) => void | Promise<void>;
}
/**
 * Kernel options
 */
export interface KernelOptions {
    logger?: KernelLogger;
    hooks?: KernelHooks;
    closeDbOnShutdown?: boolean;
}
/**
 * Application Kernel
 *
 * Handles the complete request lifecycle:
 * 1. Bootstrap the context
 * 2. Modify the request
 * 3. Dispatch to handler
 * 4. Return response
 * 5. Shutdown (cleanup)
 */
export declare class Kernel {
    private context;
    private request;
    private logger;
    private hooks;
    private closeDbOnShutdown;
    private contextName;
    constructor(options?: KernelOptions);
    /**
     * Static helper to run a request through the kernel
     *
     * @param request - The server request to process
     * @param context - The context to use for processing
     * @param options - Optional kernel options
     * @returns The response
     */
    static run(request: ServerRequest, context: ContextInterface, options?: KernelOptions): Promise<Response>;
    /**
     * Run a request through the application
     */
    runApplication(request: ServerRequest, context: ContextInterface): Promise<Response>;
    /**
     * Handle errors during request processing
     */
    private handleError;
    /**
     * Create a default error response
     */
    private createErrorResponse;
    /**
     * Shutdown the kernel
     */
    private shutdown;
    /**
     * Close the database connection
     */
    private closeDbConnection;
    /**
     * Update logger context name based on context class
     */
    private updateLoggerContext;
    /**
     * Execute a hook if it exists
     */
    private executeHook;
    /**
     * Get the current context name
     */
    getContextName(): string;
    /**
     * Get the current request
     */
    getRequest(): ServerRequest | null;
    /**
     * Get the current context
     */
    getContext(): ContextInterface | null;
}
//# sourceMappingURL=kernel.d.ts.map