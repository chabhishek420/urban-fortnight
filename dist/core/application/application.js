"use strict";
/**
 * Application Class
 *
 * Manages application state, configuration, and lifecycle.
 * This is the main entry point for the application.
 *
 * @see keitaro_source/application/Core/Application/Application.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.application = exports.Application = exports.ApplicationState = exports.ApplicationEnvironment = void 0;
exports.app = app;
const index_1 = require("../../config/index");
const db_1 = require("../../lib/db");
/**
 * Application environment enum
 */
exports.ApplicationEnvironment = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TESTING: 'testing',
};
/**
 * Application state
 */
exports.ApplicationState = {
    IDLE: 'idle',
    BOOTING: 'booting',
    RUNNING: 'running',
    STOPPING: 'stopping',
    STOPPED: 'stopped',
    ERROR: 'error',
};
/**
 * Default service container implementation
 */
class DefaultServiceContainer {
    services = new Map();
    get(name) {
        return this.services.get(name);
    }
    set(name, service) {
        this.services.set(name, service);
    }
    has(name) {
        return this.services.has(name);
    }
    delete(name) {
        return this.services.delete(name);
    }
    clear() {
        this.services.clear();
    }
}
/**
 * Application singleton
 *
 * Manages the entire application lifecycle and provides access to
 * configuration, services, and shared resources.
 */
class Application {
    static instance = null;
    _env;
    _state = exports.ApplicationState.IDLE;
    _container;
    _events = {};
    _startTime = null;
    _error = null;
    // Configuration (loaded lazily)
    _appConfig = null;
    _dbConfig = null;
    _redisConfig = null;
    constructor(options = {}) {
        this._env = options.env ?? exports.ApplicationEnvironment.DEVELOPMENT;
        this._container = new DefaultServiceContainer();
        // Override config if provided
        if (options.config) {
            if (options.config.app)
                this._appConfig = options.config.app;
            if (options.config.database)
                this._dbConfig = options.config.database;
            if (options.config.redis)
                this._redisConfig = options.config.redis;
        }
    }
    /**
     * Get the application singleton instance
     */
    static getInstance(options) {
        if (!Application.instance) {
            Application.instance = new Application(options);
        }
        return Application.instance;
    }
    /**
     * Create a new application instance (for testing)
     */
    static create(options) {
        return new Application(options);
    }
    /**
     * Reset the singleton instance (for testing)
     */
    static reset() {
        if (Application.instance) {
            Application.instance._state = exports.ApplicationState.STOPPED;
            Application.instance = null;
        }
    }
    /**
     * Get application environment
     */
    get env() {
        return this._env;
    }
    /**
     * Set application environment
     */
    setEnv(env) {
        this._env = env;
    }
    /**
     * Get application state
     */
    get state() {
        return this._state;
    }
    /**
     * Get application start time
     */
    get startTime() {
        return this._startTime;
    }
    /**
     * Get application uptime in milliseconds
     */
    getUptime() {
        if (!this._startTime)
            return null;
        return Date.now() - this._startTime.getTime();
    }
    /**
     * Get the last error
     */
    get lastError() {
        return this._error;
    }
    /**
     * Get the service container
     */
    get container() {
        return this._container;
    }
    /**
     * Get application configuration
     */
    get config() {
        if (!this._appConfig) {
            this._appConfig = (0, index_1.getAppConfig)();
        }
        return this._appConfig;
    }
    /**
     * Get database configuration
     */
    get dbConfig() {
        if (!this._dbConfig) {
            this._dbConfig = (0, index_1.getDatabaseConfig)();
        }
        return this._dbConfig;
    }
    /**
     * Get Redis configuration
     */
    get redisConfig() {
        if (!this._redisConfig) {
            this._redisConfig = (0, index_1.getRedisConfig)();
        }
        return this._redisConfig;
    }
    /**
     * Bootstrap the application
     */
    async boot() {
        if (this._state !== exports.ApplicationState.IDLE) {
            throw new Error(`Cannot boot application in state: ${this._state}`);
        }
        try {
            this._state = exports.ApplicationState.BOOTING;
            this._startTime = new Date();
            // Emit before-boot event
            await this.emit('before-boot');
            // Initialize configuration
            (0, index_1.initializeConfig)();
            // Register core services
            this.registerCoreServices();
            // Emit after-boot event
            await this.emit('after-boot');
            this._state = exports.ApplicationState.RUNNING;
        }
        catch (error) {
            this._state = exports.ApplicationState.ERROR;
            this._error = error;
            await this.emit('error');
            throw error;
        }
    }
    /**
     * Shutdown the application
     */
    async shutdown() {
        if (this._state !== exports.ApplicationState.RUNNING) {
            return;
        }
        try {
            this._state = exports.ApplicationState.STOPPING;
            // Emit before-shutdown event
            await this.emit('before-shutdown');
            // Close database connection
            await (0, db_1.closeDb)();
            // Clear service container
            this._container.clear();
            // Emit after-shutdown event
            await this.emit('after-shutdown');
            this._state = exports.ApplicationState.STOPPED;
        }
        catch (error) {
            this._state = exports.ApplicationState.ERROR;
            this._error = error;
            await this.emit('error');
            throw error;
        }
    }
    /**
     * Register an event handler
     */
    on(event, handler) {
        if (!this._events[event]) {
            this._events[event] = [];
        }
        this._events[event].push(handler);
    }
    /**
     * Remove an event handler
     */
    off(event, handler) {
        const handlers = this._events[event];
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        }
    }
    /**
     * Emit an event
     */
    async emit(event) {
        const handlers = this._events[event];
        if (handlers) {
            for (const handler of handlers) {
                await handler(this);
            }
        }
    }
    /**
     * Register core services
     */
    registerCoreServices() {
        // Register database client
        this._container.set('db', (0, db_1.getDb)());
        // Register config
        this._container.set('config', this.config);
        this._container.set('dbConfig', this.dbConfig);
        this._container.set('redisConfig', this.redisConfig);
    }
    /**
     * Check if running in development mode
     */
    isDevelopment() {
        return this._env === exports.ApplicationEnvironment.DEVELOPMENT;
    }
    /**
     * Check if running in production mode
     */
    isProduction() {
        return this._env === exports.ApplicationEnvironment.PRODUCTION;
    }
    /**
     * Check if running in testing mode
     */
    isTesting() {
        return this._env === exports.ApplicationEnvironment.TESTING;
    }
    /**
     * Check if application is running
     */
    isRunning() {
        return this._state === exports.ApplicationState.RUNNING;
    }
}
exports.Application = Application;
/**
 * Get the application instance (shorthand)
 */
function app() {
    return Application.getInstance();
}
/**
 * Alias for Application.getInstance()
 */
exports.application = Application.getInstance;
//# sourceMappingURL=application.js.map