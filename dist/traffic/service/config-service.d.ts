/**
 * Config Service
 *
 * Manages application configuration settings.
 *
 * @see keitaro_source/application/Traffic/Service/ConfigService.php
 */
import { AbstractService } from './abstract-service.js';
export interface ConfigScope {
    [key: string]: unknown;
}
export declare class ConfigService extends AbstractService {
    private _config;
    static readonly SANDBOX_ENGINE = "sandbox_engine";
    static readonly SANDBOX_FPM_PATH = "sandbox_fpm_path";
    static readonly SANDBOX_FCGI_PATH = "sandbox_fcgi_path";
    /**
     * Initialize configuration from an object
     */
    init(config: Record<string, ConfigScope>): void;
    /**
     * Set a configuration value
     */
    set(scope: string, key: string, value: unknown): void;
    /**
     * Get a configuration value
     */
    get<T = unknown>(scope: string, key?: string, defaultValue?: T): T | undefined;
    /**
     * Delete a configuration value
     */
    delete(scope: string, key: string): void;
    /**
     * Check if a configuration value exists
     */
    has(scope: string, key?: string): boolean;
    /**
     * Get debug value
     */
    getDebugValue(): boolean;
    /**
     * Check if running in demo mode
     */
    isDemo(): boolean;
    /**
     * Check if referrer redefine is allowed
     */
    isReferrerRedefineAllowed(): boolean;
    /**
     * Get all configuration as plain object
     */
    getAll(): Record<string, ConfigScope>;
}
//# sourceMappingURL=config-service.d.ts.map