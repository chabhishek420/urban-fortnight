"use strict";
/**
 * Application Kernel
 *
 * The kernel is the core of the application - it handles the request lifecycle:
 * bootstrap → modify → dispatch → shutdown
 *
 * @see keitaro_source/application/Core/Kernel/Kernel.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kernel = void 0;
const response_1 = require("../../traffic/response/response");
const db_1 = require("../../lib/db");
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
class Kernel {
    context = null;
    request = null;
    logger;
    hooks;
    closeDbOnShutdown;
    contextName = 'unknown';
    constructor(options = {}) {
        this.logger = options.logger ?? createDefaultLogger();
        this.hooks = options.hooks ?? {};
        this.closeDbOnShutdown = options.closeDbOnShutdown ?? true;
    }
    /**
     * Static helper to run a request through the kernel
     *
     * @param request - The server request to process
     * @param context - The context to use for processing
     * @param options - Optional kernel options
     * @returns The response
     */
    static async run(request, context, options = {}) {
        const kernel = new Kernel(options);
        return kernel.runApplication(request, context);
    }
    /**
     * Run a request through the application
     */
    async runApplication(request, context) {
        try {
            // Validate inputs
            if (!request) {
                throw new Error('ServerRequest is required');
            }
            if (!context) {
                throw new Error('Context is required');
            }
            // Store references
            this.request = request;
            this.context = context;
            // Update logger context name based on context class
            this.updateLoggerContext(context);
            // Before bootstrap hook
            await this.executeHook('beforeBootstrap');
            // Bootstrap the context
            this.logger.debug('Bootstrapping context', { context: this.contextName });
            await context.bootstrap();
            // After bootstrap hook
            await this.executeHook('afterBootstrap');
            // Modify the request (e.g., add headers, normalize)
            this.logger.debug('Modifying request');
            const modifiedRequest = context.modifyRequest(request);
            this.request = modifiedRequest;
            // Get the dispatcher
            const dispatcher = context.dispatcher(modifiedRequest);
            if (!dispatcher) {
                throw new Error(`Context ${context.constructor.name} must return a Dispatcher`);
            }
            // Before dispatch hook
            await this.executeHook('beforeDispatch', modifiedRequest);
            // Dispatch the request
            this.logger.debug('Dispatching request');
            const response = await dispatcher.dispatch(modifiedRequest);
            if (!response) {
                throw new Error(`${dispatcher.constructor.name}#dispatch must return a Response`);
            }
            // After dispatch hook
            await this.executeHook('afterDispatch', modifiedRequest, response);
            // Shutdown
            await this.shutdown();
            return response;
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    /**
     * Handle errors during request processing
     */
    async handleError(error) {
        this.logger.error('Error during request processing', {
            error: error.message,
            stack: error.stack,
        });
        // Execute error hook
        await this.executeHook('onError', error, this.request);
        // Let context handle the exception
        if (this.context && this.request) {
            try {
                return this.context.handleException(error, this.request);
            }
            catch (handlerError) {
                this.logger.error('Error in exception handler', {
                    error: handlerError.message,
                });
                // Fall through to default error response
            }
        }
        // Default error response
        return this.createErrorResponse(error);
    }
    /**
     * Create a default error response
     */
    createErrorResponse(error) {
        return new response_1.Response({
            status: response_1.StatusCode.INTERNAL_SERVER_ERROR,
            body: JSON.stringify({
                error: error.message,
                timestamp: new Date().toISOString(),
            }),
        }).withHeader(response_1.ContentType.HEADER, response_1.ContentType.JSON);
    }
    /**
     * Shutdown the kernel
     */
    async shutdown() {
        // Before shutdown hook
        await this.executeHook('beforeShutdown');
        // Call context shutdown
        if (this.context) {
            this.logger.debug('Shutting down context');
            await this.context.shutdown();
        }
        // Close database connection
        if (this.closeDbOnShutdown) {
            this.logger.debug('Closing database connection');
            await this.closeDbConnection();
        }
        // After shutdown hook
        await this.executeHook('afterShutdown');
        // Clear references
        this.context = null;
        this.request = null;
    }
    /**
     * Close the database connection
     */
    async closeDbConnection() {
        try {
            await (0, db_1.closeDb)();
        }
        catch (error) {
            this.logger.error('Error closing database connection', {
                error: error.message,
            });
        }
    }
    /**
     * Update logger context name based on context class
     */
    updateLoggerContext(context) {
        const className = context.constructor.name;
        // Extract context name from class name (e.g., "AdminContext" -> "admin")
        this.contextName = className
            .replace(/Context$/i, '')
            .toLowerCase();
    }
    /**
     * Execute a hook if it exists
     */
    async executeHook(name, ...args) {
        const hook = this.hooks[name];
        if (hook) {
            try {
                await hook(this, ...args);
            }
            catch (error) {
                this.logger.error(`Error in ${name} hook`, {
                    error: error.message,
                });
            }
        }
    }
    /**
     * Get the current context name
     */
    getContextName() {
        return this.contextName;
    }
    /**
     * Get the current request
     */
    getRequest() {
        return this.request;
    }
    /**
     * Get the current context
     */
    getContext() {
        return this.context;
    }
}
exports.Kernel = Kernel;
/**
 * Create a default console logger
 */
function createDefaultLogger() {
    return {
        info: (message, context) => console.info(`[INFO] ${message}`, context ?? ''),
        error: (message, context) => console.error(`[ERROR] ${message}`, context ?? ''),
        warn: (message, context) => console.warn(`[WARN] ${message}`, context ?? ''),
        debug: (message, context) => {
            if (process.env.DEBUG === 'true') {
                console.debug(`[DEBUG] ${message}`, context ?? '');
            }
        },
    };
}
//# sourceMappingURL=kernel.js.map