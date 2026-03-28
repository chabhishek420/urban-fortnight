/**
 * Application Class
 * 
 * Manages application state, configuration, and lifecycle.
 * This is the main entry point for the application.
 * 
 * @see keitaro_source/application/Core/Application/Application.php
 */

import type { AppConfig, DatabaseConfig, RedisConfig } from '../../config/index';
import { getAppConfig, getDatabaseConfig, getRedisConfig, initializeConfig } from '../../config/index';
import { closeDb, getDb } from '../../lib/db';

/**
 * Application environment enum
 */
export const ApplicationEnvironment = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TESTING: 'testing',
} as const;

export type ApplicationEnvironmentType = typeof ApplicationEnvironment[keyof typeof ApplicationEnvironment];

/**
 * Application state
 */
export const ApplicationState = {
  IDLE: 'idle',
  BOOTING: 'booting',
  RUNNING: 'running',
  STOPPING: 'stopping',
  STOPPED: 'stopped',
  ERROR: 'error',
} as const;

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
 * Default service container implementation
 */
class DefaultServiceContainer implements ServiceContainer {
  private services: Map<string, unknown> = new Map();

  get<T>(name: string): T | undefined {
    return this.services.get(name) as T | undefined;
  }

  set<T>(name: string, service: T): void {
    this.services.set(name, service);
  }

  has(name: string): boolean {
    return this.services.has(name);
  }

  delete(name: string): boolean {
    return this.services.delete(name);
  }

  clear(): void {
    this.services.clear();
  }
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
export class Application {
  private static instance: Application | null = null;

  private _env: ApplicationEnvironmentType;
  private _state: ApplicationStateType = ApplicationState.IDLE;
  private _container: ServiceContainer;
  private _events: ApplicationEvents = {};
  private _startTime: Date | null = null;
  private _error: Error | null = null;

  // Configuration (loaded lazily)
  private _appConfig: AppConfig | null = null;
  private _dbConfig: DatabaseConfig | null = null;
  private _redisConfig: RedisConfig | null = null;

  private constructor(options: ApplicationOptions = {}) {
    this._env = options.env ?? ApplicationEnvironment.DEVELOPMENT;
    this._container = new DefaultServiceContainer();

    // Override config if provided
    if (options.config) {
      if (options.config.app) this._appConfig = options.config.app;
      if (options.config.database) this._dbConfig = options.config.database;
      if (options.config.redis) this._redisConfig = options.config.redis;
    }
  }

  /**
   * Get the application singleton instance
   */
  static getInstance(options?: ApplicationOptions): Application {
    if (!Application.instance) {
      Application.instance = new Application(options);
    }
    return Application.instance;
  }

  /**
   * Create a new application instance (for testing)
   */
  static create(options?: ApplicationOptions): Application {
    return new Application(options);
  }

  /**
   * Reset the singleton instance (for testing)
   */
  static reset(): void {
    if (Application.instance) {
      Application.instance._state = ApplicationState.STOPPED;
      Application.instance = null;
    }
  }

  /**
   * Get application environment
   */
  get env(): ApplicationEnvironmentType {
    return this._env;
  }

  /**
   * Set application environment
   */
  setEnv(env: ApplicationEnvironmentType): void {
    this._env = env;
  }

  /**
   * Get application state
   */
  get state(): ApplicationStateType {
    return this._state;
  }

  /**
   * Get application start time
   */
  get startTime(): Date | null {
    return this._startTime;
  }

  /**
   * Get application uptime in milliseconds
   */
  getUptime(): number | null {
    if (!this._startTime) return null;
    return Date.now() - this._startTime.getTime();
  }

  /**
   * Get the last error
   */
  get lastError(): Error | null {
    return this._error;
  }

  /**
   * Get the service container
   */
  get container(): ServiceContainer {
    return this._container;
  }

  /**
   * Get application configuration
   */
  get config(): AppConfig {
    if (!this._appConfig) {
      this._appConfig = getAppConfig();
    }
    return this._appConfig;
  }

  /**
   * Get database configuration
   */
  get dbConfig(): DatabaseConfig {
    if (!this._dbConfig) {
      this._dbConfig = getDatabaseConfig();
    }
    return this._dbConfig;
  }

  /**
   * Get Redis configuration
   */
  get redisConfig(): RedisConfig {
    if (!this._redisConfig) {
      this._redisConfig = getRedisConfig();
    }
    return this._redisConfig;
  }

  /**
   * Bootstrap the application
   */
  async boot(): Promise<void> {
    if (this._state !== ApplicationState.IDLE) {
      throw new Error(`Cannot boot application in state: ${this._state}`);
    }

    try {
      this._state = ApplicationState.BOOTING;
      this._startTime = new Date();

      // Emit before-boot event
      await this.emit('before-boot');

      // Initialize configuration
      initializeConfig();

      // Register core services
      this.registerCoreServices();

      // Emit after-boot event
      await this.emit('after-boot');

      this._state = ApplicationState.RUNNING;
    } catch (error) {
      this._state = ApplicationState.ERROR;
      this._error = error as Error;
      await this.emit('error');
      throw error;
    }
  }

  /**
   * Shutdown the application
   */
  async shutdown(): Promise<void> {
    if (this._state !== ApplicationState.RUNNING) {
      return;
    }

    try {
      this._state = ApplicationState.STOPPING;

      // Emit before-shutdown event
      await this.emit('before-shutdown');

      // Close database connection
      await closeDb();

      // Clear service container
      this._container.clear();

      // Emit after-shutdown event
      await this.emit('after-shutdown');

      this._state = ApplicationState.STOPPED;
    } catch (error) {
      this._state = ApplicationState.ERROR;
      this._error = error as Error;
      await this.emit('error');
      throw error;
    }
  }

  /**
   * Register an event handler
   */
  on(event: keyof ApplicationEvents, handler: ApplicationEventHandler): void {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event]!.push(handler);
  }

  /**
   * Remove an event handler
   */
  off(event: keyof ApplicationEvents, handler: ApplicationEventHandler): void {
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
  private async emit(event: keyof ApplicationEvents): Promise<void> {
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
  private registerCoreServices(): void {
    // Register database client
    this._container.set('db', getDb());

    // Register config
    this._container.set('config', this.config);
    this._container.set('dbConfig', this.dbConfig);
    this._container.set('redisConfig', this.redisConfig);
  }

  /**
   * Check if running in development mode
   */
  isDevelopment(): boolean {
    return this._env === ApplicationEnvironment.DEVELOPMENT;
  }

  /**
   * Check if running in production mode
   */
  isProduction(): boolean {
    return this._env === ApplicationEnvironment.PRODUCTION;
  }

  /**
   * Check if running in testing mode
   */
  isTesting(): boolean {
    return this._env === ApplicationEnvironment.TESTING;
  }

  /**
   * Check if application is running
   */
  isRunning(): boolean {
    return this._state === ApplicationState.RUNNING;
  }
}

/**
 * Get the application instance (shorthand)
 */
export function app(): Application {
  return Application.getInstance();
}

/**
 * Alias for Application.getInstance()
 */
export const application = Application.getInstance;
