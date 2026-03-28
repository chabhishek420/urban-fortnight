/**
 * Config Service
 * 
 * Manages application configuration settings.
 * 
 * @see keitaro_source/application/Traffic/Service/ConfigService.php
 */
import { AbstractService } from './abstract-service';

export interface ConfigScope {
  [key: string]: unknown;
}

export class ConfigService extends AbstractService {
  private _config: Map<string, ConfigScope> = new Map();

  // Configuration keys
  static readonly SANDBOX_ENGINE = 'sandbox_engine';
  static readonly SANDBOX_FPM_PATH = 'sandbox_fpm_path';
  static readonly SANDBOX_FCGI_PATH = 'sandbox_fcgi_path';

  /**
   * Initialize configuration from an object
   */
  public init(config: Record<string, ConfigScope>): void {
    for (const [scope, values] of Object.entries(config)) {
      this._config.set(scope, { ...values });
    }
  }

  /**
   * Set a configuration value
   */
  public set(scope: string, key: string, value: unknown): void {
    if (!this._config.has(scope)) {
      this._config.set(scope, {});
    }
    this._config.get(scope)![key] = value;
  }

  /**
   * Get a configuration value
   */
  public get<T = unknown>(scope: string, key?: string, defaultValue?: T): T | undefined {
    if (this.has(scope, key)) {
      const scopeData = this._config.get(scope);
      if (key !== undefined) {
        return scopeData![key] as T;
      }
      return scopeData as unknown as T;
    }
    return defaultValue;
  }

  /**
   * Delete a configuration value
   */
  public delete(scope: string, key: string): void {
    const scopeData = this._config.get(scope);
    if (scopeData) {
      delete scopeData[key];
    }
  }

  /**
   * Check if a configuration value exists
   */
  public has(scope: string, key?: string): boolean {
    const scopeData = this._config.get(scope);
    if (!scopeData) {
      return false;
    }
    if (key === undefined) {
      return true;
    }
    return key in scopeData;
  }

  /**
   * Get debug value
   */
  public getDebugValue(): boolean {
    return this.get<number>('system', 'debug') === 1;
  }

  /**
   * Check if running in demo mode
   */
  public isDemo(): boolean {
    return this.get<number>('system', 'demo') === 1;
  }

  /**
   * Check if referrer redefine is allowed
   */
  public isReferrerRedefineAllowed(): boolean {
    return this.get<boolean>('system', 'allow_change_referrer') === true;
  }

  /**
   * Get all configuration as plain object
   */
  public getAll(): Record<string, ConfigScope> {
    const result: Record<string, ConfigScope> = {};
    for (const [scope, values] of this._config) {
      result[scope] = { ...values };
    }
    return result;
  }
}
