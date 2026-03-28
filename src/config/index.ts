/**
 * Configuration Module
 * 
 * Central configuration management for the Keitaro tracker.
 * Loads settings from environment variables with validation.
 * 
 * @see keitaro_source/application/Domain/Settings.php
 */

// Application config
export {
  type AppConfig,
  AppConfigSchema,
  AppEnvironment,
  type AppEnvironmentType,
  loadAppConfig,
  getAppConfig,
  isDevelopment,
  isProduction,
  isTesting,
} from './app';

// Database config
export {
  type DatabaseConfig,
  DatabaseConfigSchema,
  DatabaseProvider,
  type DatabaseProviderType,
  loadDatabaseConfig,
  getDatabaseConfig,
  buildDatabaseUrl,
} from './database';

// Redis config
export {
  type RedisConfig,
  RedisConfigSchema,
  loadRedisConfig,
  getRedisConfig,
} from './redis';

// Import loader functions for re-export
import { loadAppConfig } from './app';
import { loadDatabaseConfig } from './database';
import { loadRedisConfig } from './redis';

/**
 * Load all configuration at once
 */
export function loadAllConfig() {
  return {
    app: loadAppConfig(),
    database: loadDatabaseConfig(),
    redis: loadRedisConfig(),
  };
}

/**
 * Initialize configuration (called at startup)
 */
export function initializeConfig(): void {
  // Pre-load all config to catch errors early
  loadAllConfig();
}

/**
 * Reset configuration (for testing)
 */
export function resetConfig(): void {
  // This is a no-op placeholder; actual reset handled by individual config modules
  // Config modules cache their values, so tests should call loadXxxConfig() directly
}
