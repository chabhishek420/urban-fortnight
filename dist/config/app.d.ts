/**
 * Application Configuration
 *
 * Central configuration for the Keitaro tracker application.
 * Loads from environment variables with sensible defaults.
 *
 * @see keitaro_source/application/Domain/Settings.php (settings structure)
 */
import { z } from 'zod';
/**
 * Application environment enum
 */
export declare const AppEnvironment: {
    readonly DEVELOPMENT: "development";
    readonly PRODUCTION: "production";
    readonly TESTING: "testing";
};
export type AppEnvironmentType = typeof AppEnvironment[keyof typeof AppEnvironment];
/**
 * Application configuration schema
 */
export declare const AppConfigSchema: z.ZodObject<{
    env: z.ZodDefault<z.ZodEnum<["development", "production", "testing"]>>;
    port: z.ZodDefault<z.ZodNumber>;
    host: z.ZodDefault<z.ZodString>;
    appName: z.ZodDefault<z.ZodString>;
    appVersion: z.ZodDefault<z.ZodString>;
    secretKey: z.ZodDefault<z.ZodString>;
    logLevel: z.ZodDefault<z.ZodEnum<["trace", "debug", "info", "warn", "error", "fatal"]>>;
    logPretty: z.ZodDefault<z.ZodBoolean>;
    maxRequestBodySize: z.ZodDefault<z.ZodNumber>;
    requestTimeout: z.ZodDefault<z.ZodNumber>;
    shutdownTimeout: z.ZodDefault<z.ZodNumber>;
    corsEnabled: z.ZodDefault<z.ZodBoolean>;
    rateLimitEnabled: z.ZodDefault<z.ZodBoolean>;
    rateLimitMax: z.ZodDefault<z.ZodNumber>;
    rateLimitWindow: z.ZodDefault<z.ZodNumber>;
    staticPath: z.ZodDefault<z.ZodString>;
    uploadsPath: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
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
}, {
    env?: "development" | "production" | "testing" | undefined;
    port?: number | undefined;
    host?: string | undefined;
    appName?: string | undefined;
    appVersion?: string | undefined;
    secretKey?: string | undefined;
    logLevel?: "trace" | "debug" | "info" | "warn" | "error" | "fatal" | undefined;
    logPretty?: boolean | undefined;
    maxRequestBodySize?: number | undefined;
    requestTimeout?: number | undefined;
    shutdownTimeout?: number | undefined;
    corsEnabled?: boolean | undefined;
    rateLimitEnabled?: boolean | undefined;
    rateLimitMax?: number | undefined;
    rateLimitWindow?: number | undefined;
    staticPath?: string | undefined;
    uploadsPath?: string | undefined;
}>;
export type AppConfig = z.infer<typeof AppConfigSchema>;
/**
 * Load application configuration from environment
 */
export declare function loadAppConfig(): AppConfig;
/**
 * Get application configuration (singleton)
 */
export declare function getAppConfig(): AppConfig;
/**
 * Check if running in development mode
 */
export declare function isDevelopment(): boolean;
/**
 * Check if running in production mode
 */
export declare function isProduction(): boolean;
/**
 * Check if running in testing mode
 */
export declare function isTesting(): boolean;
//# sourceMappingURL=app.d.ts.map