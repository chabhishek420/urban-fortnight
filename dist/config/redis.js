"use strict";
/**
 * Redis Configuration
 *
 * Redis connection settings for caching and session management.
 *
 * @see keitaro_source/application/Core/Cache/RedisCache.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisConfigSchema = void 0;
exports.loadRedisConfig = loadRedisConfig;
exports.getRedisConfig = getRedisConfig;
const zod_1 = require("zod");
/**
 * Redis configuration schema
 */
exports.RedisConfigSchema = zod_1.z.object({
    enabled: zod_1.z.boolean().default(false),
    // Connection
    host: zod_1.z.string().default('localhost'),
    port: zod_1.z.number().int().min(1).max(65535).default(6379),
    password: zod_1.z.string().optional(),
    username: zod_1.z.string().optional(),
    database: zod_1.z.number().int().min(0).max(15).default(0),
    // Connection pool
    maxConnections: zod_1.z.number().int().min(1).default(50),
    minConnections: zod_1.z.number().int().min(0).default(5),
    // Timeouts
    connectTimeout: zod_1.z.number().default(10000),
    commandTimeout: zod_1.z.number().default(5000),
    keepAlive: zod_1.z.number().default(30000),
    // Retry
    retryAttempts: zod_1.z.number().default(3),
    retryDelay: zod_1.z.number().default(100),
    // TLS
    tlsEnabled: zod_1.z.boolean().default(false),
    // Keys prefix
    keyPrefix: zod_1.z.string().default('keitaro:'),
});
/**
 * Load Redis configuration from environment
 */
function loadRedisConfig() {
    const redisUrl = process.env.REDIS_URL;
    // Parse REDIS_URL if provided
    if (redisUrl) {
        try {
            const url = new URL(redisUrl);
            return exports.RedisConfigSchema.parse({
                enabled: true,
                host: url.hostname,
                port: parseInt(url.port, 10) || 6379,
                password: url.password || undefined,
                username: url.username || undefined,
                database: parseInt(url.pathname.slice(1), 10) || 0,
                maxConnections: parseInt(process.env.REDIS_MAX_CONNECTIONS ?? '50', 10),
                minConnections: parseInt(process.env.REDIS_MIN_CONNECTIONS ?? '5', 10),
                connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT ?? '10000', 10),
                commandTimeout: parseInt(process.env.REDIS_COMMAND_TIMEOUT ?? '5000', 10),
                keepAlive: parseInt(process.env.REDIS_KEEPALIVE ?? '30000', 10),
                retryAttempts: parseInt(process.env.REDIS_RETRY_ATTEMPTS ?? '3', 10),
                retryDelay: parseInt(process.env.REDIS_RETRY_DELAY ?? '100', 10),
                tlsEnabled: process.env.REDIS_TLS === 'true',
                keyPrefix: process.env.REDIS_KEY_PREFIX ?? 'keitaro:',
            });
        }
        catch {
            // Fall through to individual env vars
        }
    }
    return exports.RedisConfigSchema.parse({
        enabled: process.env.REDIS_ENABLED === 'true',
        host: process.env.REDIS_HOST ?? 'localhost',
        port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
        username: process.env.REDIS_USERNAME || undefined,
        database: parseInt(process.env.REDIS_DATABASE ?? '0', 10),
        maxConnections: parseInt(process.env.REDIS_MAX_CONNECTIONS ?? '50', 10),
        minConnections: parseInt(process.env.REDIS_MIN_CONNECTIONS ?? '5', 10),
        connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT ?? '10000', 10),
        commandTimeout: parseInt(process.env.REDIS_COMMAND_TIMEOUT ?? '5000', 10),
        keepAlive: parseInt(process.env.REDIS_KEEPALIVE ?? '30000', 10),
        retryAttempts: parseInt(process.env.REDIS_RETRY_ATTEMPTS ?? '3', 10),
        retryDelay: parseInt(process.env.REDIS_RETRY_DELAY ?? '100', 10),
        tlsEnabled: process.env.REDIS_TLS === 'true',
        keyPrefix: process.env.REDIS_KEY_PREFIX ?? 'keitaro:',
    });
}
/**
 * Redis configuration singleton
 */
let redisConfig = null;
/**
 * Get Redis configuration (singleton)
 */
function getRedisConfig() {
    if (!redisConfig) {
        redisConfig = loadRedisConfig();
    }
    return redisConfig;
}
//# sourceMappingURL=redis.js.map