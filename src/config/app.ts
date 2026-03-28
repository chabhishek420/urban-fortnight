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
export const AppEnvironment = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TESTING: 'testing',
} as const;

export type AppEnvironmentType = typeof AppEnvironment[keyof typeof AppEnvironment];

/**
 * Application configuration schema
 */
export const AppConfigSchema = z.object({
  // Application
  env: z.enum(['development', 'production', 'testing']).default('development'),
  port: z.number().int().min(1).max(65535).default(3000),
  host: z.string().default('0.0.0.0'),
  appName: z.string().default('Keitaro Tracker'),
  appVersion: z.string().default('1.0.0'),
  secretKey: z.string().min(32).default('change-this-secret-key-to-at-least-32-chars'),
  
  // Logging
  logLevel: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  logPretty: z.boolean().default(false),
  
  // Performance
  maxRequestBodySize: z.number().default(1048576), // 1MB
  requestTimeout: z.number().default(30000), // 30 seconds
  shutdownTimeout: z.number().default(10000), // 10 seconds
  
  // Features
  corsEnabled: z.boolean().default(true),
  rateLimitEnabled: z.boolean().default(true),
  rateLimitMax: z.number().default(100),
  rateLimitWindow: z.number().default(60000), // 1 minute
  
  // Paths
  staticPath: z.string().default('./public'),
  uploadsPath: z.string().default('./uploads'),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;

/**
 * Load application configuration from environment
 */
export function loadAppConfig(): AppConfig {
  return AppConfigSchema.parse({
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
let appConfig: AppConfig | null = null;

/**
 * Get application configuration (singleton)
 */
export function getAppConfig(): AppConfig {
  if (!appConfig) {
    appConfig = loadAppConfig();
  }
  return appConfig;
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return getAppConfig().env === 'development';
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return getAppConfig().env === 'production';
}

/**
 * Check if running in testing mode
 */
export function isTesting(): boolean {
  return getAppConfig().env === 'testing';
}
