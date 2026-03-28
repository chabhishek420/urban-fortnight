"use strict";
/**
 * Application Configuration
 *
 * Central configuration for the Keitaro tracker application.
 * Loads from environment variables with sensible defaults.
 *
 * @see keitaro_source/application/Domain/Settings.php (settings structure)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigSchema = exports.AppEnvironment = void 0;
exports.loadAppConfig = loadAppConfig;
exports.getAppConfig = getAppConfig;
exports.isDevelopment = isDevelopment;
exports.isProduction = isProduction;
exports.isTesting = isTesting;
const zod_1 = require("zod");
/**
 * Application environment enum
 */
exports.AppEnvironment = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TESTING: 'testing',
};
/**
 * Application configuration schema
 */
exports.AppConfigSchema = zod_1.z.object({
    // Application
    env: zod_1.z.enum(['development', 'production', 'testing']).default('development'),
    port: zod_1.z.number().int().min(1).max(65535).default(3000),
    host: zod_1.z.string().default('0.0.0.0'),
    appName: zod_1.z.string().default('Keitaro Tracker'),
    appVersion: zod_1.z.string().default('1.0.0'),
    secretKey: zod_1.z.string().min(32).default('change-this-secret-key-to-at-least-32-chars'),
    // Logging
    logLevel: zod_1.z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
    logPretty: zod_1.z.boolean().default(false),
    // Performance
    maxRequestBodySize: zod_1.z.number().default(1048576), // 1MB
    requestTimeout: zod_1.z.number().default(30000), // 30 seconds
    shutdownTimeout: zod_1.z.number().default(10000), // 10 seconds
    // Features
    corsEnabled: zod_1.z.boolean().default(true),
    rateLimitEnabled: zod_1.z.boolean().default(true),
    rateLimitMax: zod_1.z.number().default(100),
    rateLimitWindow: zod_1.z.number().default(60000), // 1 minute
    // Paths
    staticPath: zod_1.z.string().default('./public'),
    uploadsPath: zod_1.z.string().default('./uploads'),
});
/**
 * Load application configuration from environment
 */
function loadAppConfig() {
    return exports.AppConfigSchema.parse({
        env: process.env.NODE_ENV ?? process.env.APP_ENV ?? 'development',
        port: parseInt(process.env.PORT ?? '3000', 10),
        host: process.env.HOST ?? '0.0.0.0',
        appName: process.env.APP_NAME ?? 'Keitaro Tracker',
        appVersion: process.env.APP_VERSION ?? '1.0.0',
        secretKey: process.env.SECRET_KEY ?? 'change-this-secret-key-to-at-least-32-chars',
        logLevel: process.env.LOG_LEVEL ?? 'info',
        logPretty: process.env.LOG_PRETTY === 'true' || process.env.NODE_ENV === 'development',
        maxRequestBodySize: parseInt(process.env.MAX_REQUEST_BODY_SIZE ?? '1048576', 10),
        requestTimeout: parseInt(process.env.REQUEST_TIMEOUT ?? '30000', 10),
        shutdownTimeout: parseInt(process.env.SHUTDOWN_TIMEOUT ?? '10000', 10),
        corsEnabled: process.env.CORS_ENABLED !== 'false',
        rateLimitEnabled: process.env.RATE_LIMIT_ENABLED !== 'false',
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX ?? '100', 10),
        rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW ?? '60000', 10),
        staticPath: process.env.STATIC_PATH ?? './public',
        uploadsPath: process.env.UPLOADS_PATH ?? './uploads',
    });
}
/**
 * Application configuration singleton
 */
let appConfig = null;
/**
 * Get application configuration (singleton)
 */
function getAppConfig() {
    if (!appConfig) {
        appConfig = loadAppConfig();
    }
    return appConfig;
}
/**
 * Check if running in development mode
 */
function isDevelopment() {
    return getAppConfig().env === 'development';
}
/**
 * Check if running in production mode
 */
function isProduction() {
    return getAppConfig().env === 'production';
}
/**
 * Check if running in testing mode
 */
function isTesting() {
    return getAppConfig().env === 'testing';
}
//# sourceMappingURL=app.js.map