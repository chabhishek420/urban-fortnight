"use strict";
/**
 * Configuration Module
 *
 * Central configuration management for the Keitaro tracker.
 * Loads settings from environment variables with validation.
 *
 * @see keitaro_source/application/Domain/Settings.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisConfig = exports.loadRedisConfig = exports.RedisConfigSchema = exports.buildDatabaseUrl = exports.getDatabaseConfig = exports.loadDatabaseConfig = exports.DatabaseProvider = exports.DatabaseConfigSchema = exports.isTesting = exports.isProduction = exports.isDevelopment = exports.getAppConfig = exports.loadAppConfig = exports.AppEnvironment = exports.AppConfigSchema = void 0;
exports.loadAllConfig = loadAllConfig;
exports.initializeConfig = initializeConfig;
exports.resetConfig = resetConfig;
// Application config
var app_js_1 = require("./app.js");
Object.defineProperty(exports, "AppConfigSchema", { enumerable: true, get: function () { return app_js_1.AppConfigSchema; } });
Object.defineProperty(exports, "AppEnvironment", { enumerable: true, get: function () { return app_js_1.AppEnvironment; } });
Object.defineProperty(exports, "loadAppConfig", { enumerable: true, get: function () { return app_js_1.loadAppConfig; } });
Object.defineProperty(exports, "getAppConfig", { enumerable: true, get: function () { return app_js_1.getAppConfig; } });
Object.defineProperty(exports, "isDevelopment", { enumerable: true, get: function () { return app_js_1.isDevelopment; } });
Object.defineProperty(exports, "isProduction", { enumerable: true, get: function () { return app_js_1.isProduction; } });
Object.defineProperty(exports, "isTesting", { enumerable: true, get: function () { return app_js_1.isTesting; } });
// Database config
var database_js_1 = require("./database.js");
Object.defineProperty(exports, "DatabaseConfigSchema", { enumerable: true, get: function () { return database_js_1.DatabaseConfigSchema; } });
Object.defineProperty(exports, "DatabaseProvider", { enumerable: true, get: function () { return database_js_1.DatabaseProvider; } });
Object.defineProperty(exports, "loadDatabaseConfig", { enumerable: true, get: function () { return database_js_1.loadDatabaseConfig; } });
Object.defineProperty(exports, "getDatabaseConfig", { enumerable: true, get: function () { return database_js_1.getDatabaseConfig; } });
Object.defineProperty(exports, "buildDatabaseUrl", { enumerable: true, get: function () { return database_js_1.buildDatabaseUrl; } });
// Redis config
var redis_js_1 = require("./redis.js");
Object.defineProperty(exports, "RedisConfigSchema", { enumerable: true, get: function () { return redis_js_1.RedisConfigSchema; } });
Object.defineProperty(exports, "loadRedisConfig", { enumerable: true, get: function () { return redis_js_1.loadRedisConfig; } });
Object.defineProperty(exports, "getRedisConfig", { enumerable: true, get: function () { return redis_js_1.getRedisConfig; } });
// Import loader functions for re-export
const app_1 = require("./app");
const database_1 = require("./database");
const redis_1 = require("./redis");
/**
 * Load all configuration at once
 */
function loadAllConfig() {
    return {
        app: (0, app_1.loadAppConfig)(),
        database: (0, database_1.loadDatabaseConfig)(),
        redis: (0, redis_1.loadRedisConfig)(),
    };
}
/**
 * Initialize configuration (called at startup)
 */
function initializeConfig() {
    // Pre-load all config to catch errors early
    loadAllConfig();
}
/**
 * Reset configuration (for testing)
 */
function resetConfig() {
    // This is a no-op placeholder; actual reset handled by individual config modules
    // Config modules cache their values, so tests should call loadXxxConfig() directly
}
//# sourceMappingURL=index.js.map