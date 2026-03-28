"use strict";
/**
 * Fastify Application Factory
 *
 * Creates and configures the Fastify server instance.
 *
 * @see keitaro_source/server.php (RoadRunner server setup)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
exports.startServer = startServer;
exports.shutdownServer = shutdownServer;
const fastify_1 = __importDefault(require("fastify"));
const pino_1 = require("pino");
const index_1 = require("../config/index");
const routes_1 = require("./routes");
const plugins_1 = require("./plugins");
/**
 * Create and configure the Fastify application
 */
async function createApp(options = {}) {
    const config = options.config ?? (0, index_1.getAppConfig)();
    // Create Fastify instance
    const fastify = (0, fastify_1.default)({
        logger: options.logger ?? createLogger(config),
        trustProxy: options.trustProxy ?? true,
        bodyLimit: options.bodyLimit ?? config.maxRequestBodySize,
        requestTimeout: options.requestTimeout ?? config.requestTimeout,
        ignoreTrailingSlash: true,
        disableRequestLogging: !config.logLevel.includes('debug'),
    });
    // Store config reference
    fastify.decorate('config', config);
    // Register core plugins
    await (0, plugins_1.registerPlugins)(fastify, config);
    // Register routes
    await (0, routes_1.registerRoutes)(fastify);
    // Error handler
    fastify.setErrorHandler(errorHandler);
    // 404 handler
    fastify.setNotFoundHandler(notFoundHandler);
    return fastify;
}
/**
 * Create a Pino logger
 */
function createLogger(config) {
    const options = {
        level: config.logLevel,
    };
    if (config.logPretty) {
        options.transport = {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
            },
        };
    }
    return (0, pino_1.pino)(options);
}
/**
 * Global error handler
 */
function errorHandler(error, request, reply) {
    const statusCode = error.statusCode ?? 500;
    const config = request.server.config;
    // Log error
    request.log.error({
        error: {
            message: error.message,
            stack: config?.logLevel === 'debug' ? error.stack : undefined,
        },
        request: {
            method: request.method,
            url: request.url,
            headers: request.headers,
        },
    });
    // Validation errors
    if (error.validation) {
        reply.status(400).send({
            error: 'Validation Error',
            message: error.message,
            details: error.validation,
        });
        return;
    }
    // HTTP errors
    reply.status(statusCode).send({
        error: statusCode >= 500 && !(0, index_1.isDevelopment)()
            ? 'Internal Server Error'
            : error.message,
        statusCode,
        timestamp: new Date().toISOString(),
    });
}
/**
 * 404 Not Found handler
 */
function notFoundHandler(request, reply) {
    reply.status(404).send({
        error: 'Not Found',
        message: `Route ${request.method} ${request.url} not found`,
        statusCode: 404,
        timestamp: new Date().toISOString(),
    });
}
/**
 * Start the server
 */
async function startServer(fastify, config) {
    const appConfig = config ?? fastify.config;
    try {
        // Start listening
        await fastify.listen({
            port: appConfig?.port ?? 3000,
            host: appConfig?.host ?? '0.0.0.0',
        });
        fastify.log.info(`Server started on ${appConfig?.host}:${appConfig?.port}`);
    }
    catch (error) {
        fastify.log.error(error);
        throw error;
    }
}
/**
 * Graceful shutdown
 */
async function shutdownServer(fastify) {
    try {
        await fastify.close();
        fastify.log.info('Server shutdown complete');
    }
    catch (error) {
        fastify.log.error(error, 'Error during shutdown');
        throw error;
    }
}
//# sourceMappingURL=app.js.map