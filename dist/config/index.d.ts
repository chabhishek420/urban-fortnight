/**
 * Configuration Module
 *
 * Central configuration management for the Keitaro tracker.
 * Loads settings from environment variables with validation.
 *
 * @see keitaro_source/application/Domain/Settings.php
 */
export { AppConfig, AppConfigSchema, AppEnvironment, AppEnvironmentType, loadAppConfig, getAppConfig, isDevelopment, isProduction, isTesting, } from './app.js';
export { DatabaseConfig, DatabaseConfigSchema, DatabaseProvider, DatabaseProviderType, loadDatabaseConfig, getDatabaseConfig, buildDatabaseUrl, } from './database.js';
export { RedisConfig, RedisConfigSchema, loadRedisConfig, getRedisConfig, } from './redis.js';
/**
 * Load all configuration at once
 */
export declare function loadAllConfig(): {
    app: {
        env: "development" | "production" | "testing";
        port: number;
        host: string;
        appName: string;
        appVersion: string;
        secretKey: string;
        logLevel: "trace" | "debug" | "info" | "warn" | "error" | "fatal";
        logPretty: boolean;
        maxRequestBodySize: number;
        requestTimeout: number;
        shutdownTimeout: number;
        corsEnabled: boolean;
        rateLimitEnabled: boolean;
        rateLimitMax: number;
        rateLimitWindow: number;
        staticPath: string;
        uploadsPath: string;
    };
    database: {
        port: number;
        host: string;
        debug: boolean;
        provider: "mysql" | "sqlite" | "postgresql";
        database: string;
        username: string;
        password: string;
        sqlitePath: string;
        poolMin: number;
        poolMax: number;
        connectionTimeout: number;
        idleTimeout: number;
        sslEnabled: boolean;
        sslRejectUnauthorized: boolean;
        logQueries: boolean;
    };
    redis: {
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
    };
};
/**
 * Initialize configuration (called at startup)
 */
export declare function initializeConfig(): void;
/**
 * Reset configuration (for testing)
 */
export declare function resetConfig(): void;
//# sourceMappingURL=index.d.ts.map