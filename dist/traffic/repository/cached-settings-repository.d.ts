/**
 * Cached Settings Repository
 *
 * Repository for application settings with in-memory caching.
 * Provides fast access to configuration values.
 *
 * @see keitaro_source/application/Traffic/Repository/CachedSettingsRepository.php
 */
import { BaseRepository, type RepositoryEntityDefinition } from '../../core/repository/base-repository.js';
import type { EntityModelInterface } from '../../core/entity/entity-model-interface.js';
import { EntityState } from '../../core/entity/state.js';
/**
 * Setting model class that implements EntityModelInterface
 */
declare class SettingModel implements EntityModelInterface {
    private _data;
    constructor(data: Record<string, unknown>);
    getId(): number | undefined;
    get<T = unknown>(key: string): T | undefined;
    set(key: string, value: unknown): this;
    getData(): Record<string, unknown>;
    isNew(): boolean;
    getEntityName(): string;
    getTableName(): string;
    getState(): EntityState;
    isActive(): boolean;
    isDisabled(): boolean;
    isDeleted(): boolean;
    toJSON(): Record<string, unknown>;
    clone(): this;
}
/**
 * Cached Settings Repository implementation
 *
 * @artifact ARTIFACT-003: PHP used file-based cache for settings,
 * we implement in-memory caching with optional persistence
 */
export declare class CachedSettingsRepository extends BaseRepository<SettingModel> {
    private static _instance;
    /**
     * Cache key for settings
     */
    static readonly CACHE_KEY = "settings";
    /**
     * In-memory settings cache
     */
    private _cachedSettings;
    /**
     * Cache loaded flag
     */
    private _cacheLoaded;
    /**
     * Get singleton instance
     */
    static getInstance(): CachedSettingsRepository;
    /**
     * Reset singleton and clear cache
     */
    static reset(): void;
    /**
     * Get entity definition
     */
    getDefinition(): RepositoryEntityDefinition;
    /**
     * Load settings from database into cache
     */
    loadFromDatabase(): Promise<void>;
    /**
     * Ensure cache is loaded
     */
    private ensureCacheLoaded;
    /**
     * Check if setting exists
     */
    has(key: string): Promise<boolean>;
    /**
     * Get setting value
     */
    get(key: string, defaultValue?: string): Promise<string | null>;
    /**
     * Get setting value as number
     */
    getNumber(key: string, defaultValue?: number): Promise<number>;
    /**
     * Get setting value as boolean
     */
    getBoolean(key: string, defaultValue?: boolean): Promise<boolean>;
    /**
     * Get setting value as JSON
     */
    getJson<T = unknown>(key: string, defaultValue?: T): Promise<T | null>;
    /**
     * Set setting value
     */
    set(key: string, value: string): Promise<void>;
    /**
     * Set setting value as JSON
     */
    setJson(key: string, value: unknown): Promise<void>;
    /**
     * Delete setting
     */
    deleteSetting(key: string): Promise<boolean>;
    /**
     * Get all settings as object
     */
    getAll(): Promise<Record<string, string>>;
    /**
     * Set cached settings directly (for warmup)
     */
    setCachedSettings(settings: Record<string, string>): void;
    /**
     * Get cached settings (for serialization)
     */
    getCachedSettings(): Record<string, string>;
    /**
     * Clear cache
     */
    clearCache(): Promise<void>;
    /**
     * Clear all cache (implements CachedRepositoryInterface)
     */
    clearAllCache(): Promise<void>;
    /**
     * Warm up cache from database
     */
    warmupCache(): Promise<void>;
}
export {};
//# sourceMappingURL=cached-settings-repository.d.ts.map