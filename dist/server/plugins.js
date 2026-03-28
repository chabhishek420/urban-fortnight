"use strict";
/**
 * Fastify Plugins
 *
 * Registers all Fastify plugins for the application.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPlugins = registerPlugins;
const cors_1 = __importDefault(require("@fastify/cors"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const formbody_1 = __importDefault(require("@fastify/formbody"));
const static_1 = __importDefault(require("@fastify/static"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const path_1 = __importDefault(require("path"));
/**
 * Register all Fastify plugins
 */
async function registerPlugins(fastify, config) {
    // CORS
    if (config.corsEnabled) {
        await fastify.register(cors_1.default, {
            origin: true, // Allow all origins in development
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
            credentials: true,
        });
    }
    // Cookie parser
    await fastify.register(cookie_1.default, {
        secret: config.secretKey,
        hook: 'onRequest',
    });
    // Form body parser
    await fastify.register(formbody_1.default);
    // Rate limiting
    if (config.rateLimitEnabled) {
        await fastify.register(rate_limit_1.default, {
            max: config.rateLimitMax,
            timeWindow: config.rateLimitWindow,
            keyGenerator: (request) => {
                return request.ip;
            },
            errorResponseBuilder: () => ({
                error: 'Too Many Requests',
                message: 'Rate limit exceeded. Please try again later.',
                statusCode: 429,
            }),
        });
    }
    // Static file serving
    try {
        const staticPath = path_1.default.resolve(process.cwd(), config.staticPath);
        await fastify.register(static_1.default, {
            root: staticPath,
            prefix: '/static/',
            decorateReply: true,
        });
    }
    catch {
        fastify.log.warn(`Static path not found: ${config.staticPath}`);
    }
    // Swagger documentation (only in development)
    if (config.env === 'development') {
        await fastify.register(swagger_1.default, {
            openapi: {
                openapi: '3.0.0',
                info: {
                    title: config.appName,
                    description: 'Keitaro Tracker API Documentation',
                    version: config.appVersion,
                },
                servers: [
                    {
                        url: `http://${config.host}:${config.port}`,
                        description: 'Development server',
                    },
                ],
                tags: [
                    { name: 'tracking', description: 'Tracking endpoints' },
                    { name: 'admin', description: 'Admin panel endpoints' },
                    { name: 'api', description: 'REST API endpoints' },
                ],
            },
        });
        await fastify.register(swagger_ui_1.default, {
            routePrefix: '/docs',
            uiConfig: {
                docExpansion: 'list',
                deepLinking: true,
            },
            staticCSP: true,
        });
    }
    // Request context plugin
    fastify.addHook('onRequest', async (request) => {
        // Add timing
        request.startTime = Date.now();
    });
    // Response time header
    fastify.addHook('onSend', async (request, reply) => {
        if (request.startTime) {
            const duration = Date.now() - request.startTime;
            reply.header('X-Response-Time', `${duration}ms`);
        }
    });
    // Health check plugin
    fastify.get('/health', {
        schema: {
            description: 'Health check endpoint',
            response: {
                200: {
                    type: 'object',
                    properties: {
                        status: { type: 'string' },
                        uptime: { type: 'number' },
                        timestamp: { type: 'string' },
                    },
                },
            },
        },
    }, async () => ({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    }));
    // Readiness check plugin
    fastify.get('/ready', {
        schema: {
            description: 'Readiness check endpoint',
            response: {
                200: {
                    type: 'object',
                    properties: {
                        ready: { type: 'boolean' },
                        timestamp: { type: 'string' },
                    },
                },
            },
        },
    }, async () => ({
        ready: true,
        timestamp: new Date().toISOString(),
    }));
}
//# sourceMappingURL=plugins.js.map