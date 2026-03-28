/**
 * Redis Configuration
 *
 * Redis connection settings for caching and session management.
 *
 * @see keitaro_source/application/Core/Cache/RedisCache.php
 */
import { z } from 'zod';
/**
 * Redis configuration schema
 */
export declare const RedisConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    host: z.ZodDefault<z.ZodString>;
    port: z.ZodDefault<z.ZodNumber>;
    password: z.ZodOptional<z.ZodString>;
    username: z.ZodOptional<z.ZodString>;
    database: z.ZodDefault<z.ZodNumber>;
    maxConnections: z.ZodDefault<z.ZodNumber>;
    minConnections: z.ZodDefault<z.ZodNumber>;
    connectTimeout: z.ZodDefault<z.ZodNumber>;
    commandTimeout: z.ZodDefault<z.ZodNumber>;
    keepAlive: z.ZodDefault<z.ZodNumber>;
    retryAttempts: z.ZodDefault<z.ZodNumber>;
    retryDelay: z.ZodDefault<z.ZodNumber>;
    tlsEnabled: z.ZodDefault<z.ZodBoolean>;
    keyPrefix: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    port: number;
    host: string;
    database: number;
    enabled: boolean;
    maxConnections: number;
    minConnections: number;
    connectTimeout: number;
    commandTimeout: number;
    keepAlive: number;
    retryAttempts: number;
    retryDelay: number;
    tlsEnabled: boolean;
    keyPrefix: string;
    username?: string | undefined;
    password?: string | undefined;
}, {
    port?: number | undefined;
    host?: string | undefined;
    database?: number | undefined;
    username?: string | undefined;
    password?: string | undefined;
    enabled?: boolean | undefined;
    maxConnections?: number | undefined;
    minConnections?: number | undefined;
    connectTimeout?: number | undefined;
    commandTimeout?: number | undefined;
    keepAlive?: number | undefined;
    retryAttempts?: number | undefined;
    retryDelay?: number | undefined;
    tlsEnabled?: boolean | undefined;
    keyPrefix?: string | undefined;
}>;
export type RedisConfig = z.infer<typeof RedisConfigSchema>;
/**
 * Load Redis configuration from environment
 */
export declare function loadRedisConfig(): RedisConfig;
/**
 * Get Redis configuration (singleton)
 */
export declare function getRedisConfig(): RedisConfig;
//# sourceMappingURL=redis.d.ts.map