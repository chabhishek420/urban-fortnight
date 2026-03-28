/**
 * Application Class
 *
 * Manages application state, configuration, and lifecycle.
 * This is the main entry point for the application.
 *
 * @see keitaro_source/application/Core/Application/Application.php
 */
import type { AppConfig, DatabaseConfig, RedisConfig } from '../../config/index';
/**
 * Application environment enum
 */
export declare const ApplicationEnvironment: {
    readonly DEVELOPMENT: "development";
    readonly PRODUCTION: "production";
    readonly TESTING: "testing";
};
export type ApplicationEnvironmentType = typeof ApplicationEnvironment[keyof typeof ApplicationEnvironment];
/**
 * Application state
 */
export declare const ApplicationState: {
    readonly IDLE: "idle";
    readonly BOOTING: "booting";
    readonly RUNNING: "running";
    readonly STOPPING: "stopping";
    readonly STOPPED: "stopped";
    readonly ERROR: "error";
};
export type ApplicationStateType = typeof ApplicationState[keyof typeof ApplicationState];
/**
 * Application events
 */
export type ApplicationEventHandler = (app: Application) => void | Promise<void>;
export interface ApplicationEvents {
    'before-boot'?: ApplicationEventHandler[];
    'after-boot'?: ApplicationEventHandler[];
    'before-shutdown'?: ApplicationEventHandler[];
    'after-shutdown'?: ApplicationEventHandler[];
    'error'?: ApplicationEventHandler[];
}
/**
 * Service container interface
 */
export interface ServiceContainer {
    get<T>(name: string): T | undefined;
    set<T>(name: string, service: T): void;
    has(name: string): boolean;
    delete(name: string): boolean;
    clear(): void;
}
/**
 * Application options
 */
export interface ApplicationOptions {
    env?: ApplicationEnvironmentType;
    config?: {
        app?: AppConfig;
        database?: DatabaseConfig;
        redis?: RedisConfig;
    };
}
/**
 * Application singleton
 *
 * Manages the entire application lifecycle and provides access to
 * configuration, services, and shared resources.
 */
export declare class Application {
    private static instance;
    private _env;
    private _state;
    private _container;
    private _events;
    private _startTime;
    private _error;
    private _appConfig;
    private _dbConfig;
    private _redisConfig;
    private constructor();
    /**
     * Get the application singleton instance
     */
    static getInstance(options?: ApplicationOptions): Application;
    /**
     * Create a new application instance (for testing)
     */
    static create(options?: ApplicationOptions): Application;
    /**
     * Reset the singleton instance (for testing)
     */
    static reset(): void;
    /**
     * Get application environment
     */
    get env(): ApplicationEnvironmentType;
    /**
     * Set application environment
     */
    setEnv(env: ApplicationEnvironmentType): void;
    /**
     * Get application state
     */
    get state(): ApplicationStateType;
    /**
     * Get application start time
     */
    get startTime(): Date | null;
    /**
     * Get application uptime in milliseconds
     */
    getUptime(): number | null;
    /**
     * Get the last error
     */
    get lastError(): Error | null;
    /**
     * Get the service container
     */
    get container(): ServiceContainer;
    /**
     * Get application configuration
     */
    get config(): AppConfig;
    /**
     * Get database configuration
     */
    get dbConfig(): DatabaseConfig;
    /**
     * Get Redis configuration
     */
    get redisConfig(): RedisConfig;
    /**
     * Bootstrap the application
     */
    boot(): Promise<void>;
    /**
     * Shutdown the application
     */
    shutdown(): Promise<void>;
    /**
     * Register an event handler
     */
    on(event: keyof ApplicationEvents, handler: ApplicationEventHandler): void;
    /**
     * Remove an event handler
     */
    off(event: keyof ApplicationEvents, handler: ApplicationEventHandler): void;
    /**
     * Emit an event
     */
    private emit;
    /**
     * Register core services
     */
    private registerCoreServices;
    /**
     * Check if running in development mode
     */
    isDevelopment(): boolean;
    /**
     * Check if running in production mode
     */
    isProduction(): boolean;
    /**
     * Check if running in testing mode
     */
    isTesting(): boolean;
    /**
     * Check if application is running
     */
    isRunning(): boolean;
}
/**
 * Get the application instance (shorthand)
 */
export declare function app(): Application;
/**
 * Alias for Application.getInstance()
 */
export declare const application: typeof Application.getInstance;
//# sourceMappingURL=application.d.ts.map