/**
 * Cached Settings Repository
 * 
 * Repository for application settings with in-memory caching.
 * Provides fast access to configuration values.
 * 
 * @see keitaro_source/application/Traffic/Repository/CachedSettingsRepository.php
 */

import { BaseRepository, type RepositoryEntityDefinition } from '../../core/repository/base-repository';
import type { EntityModelInterface } from '../../core/entity/entity-model-interface';
import { EntityState } from '../../core/entity/state';

/**
 * Setting model class that implements EntityModelInterface
 */
class SettingModel implements EntityModelInterface {
  private _data: Record<string, unknown>;

  constructor(data: Record<string, unknown>) {
    this._data = data;
  }

  getId(): number | undefined { return this._data.id as number | undefined; }
  get<T = unknown>(key: string): T | undefined { return this._data[key] as T | undefined; }
  set(key: string, value: unknown): this { this._data[key] = value; return this; }
  getData(): Record<string, unknown> { return { ...this._data }; }
  isNew(): boolean { return !this.getId(); }
  getEntityName(): string { return 'setting'; }
  getTableName(): string { return 'settings'; }
  getState(): EntityState { return EntityState.ACTIVE; }
  isActive(): boolean { return true; }
  isDisabled(): boolean { return false; }
  isDeleted(): boolean { return false; }
  toJSON(): Record<string, unknown> { return this.getData(); }
  clone(): this { return new SettingModel(this._data) as this; }
}

/**
 * Cached Settings Repository implementation
 * 
 * @artifact ARTIFACT-003: PHP used file-based cache for settings,
 * we implement in-memory caching with optional persistence
 */
// @ts-expect-error: getInstance override is intentional for cached repository singleton
export class CachedSettingsRepository extends BaseRepository<SettingModel> {
  private static _instance: CachedSettingsRepository | null = null;

  /**
   * Cache key for settings
   */
  static readonly CACHE_KEY = 'settings';

  /**
   * In-memory settings cache
   */
  private _cachedSettings: Map<string, string> = new Map();

  /**
   * Cache loaded flag
   */
  private _cacheLoaded: boolean = false;

  /**
   * Get singleton instance
   */
  static getInstance(): CachedSettingsRepository {
    if (!CachedSettingsRepository._instance) {
      CachedSettingsRepository._instance = new CachedSettingsRepository();
    }
    return CachedSettingsRepository._instance;
  }

  /**
   * Reset singleton and clear cache
   */
  static reset(): void {
    if (CachedSettingsRepository._instance) {
      CachedSettingsRepository._instance.clearAllCache();
    }
    CachedSettingsRepository._instance = null;
  }

  /**
   * Get entity definition
   */
  getDefinition(): RepositoryEntityDefinition {
    return {
      tableName: 'settings',
      entityName: 'setting',
      fields: new Map([
        ['id', { name: 'id', type: 'number', readonly: true }],
        ['key', { name: 'key', type: 'string' }],
        ['value', { name: 'value', type: 'string' }],
        ['type', { name: 'type', type: 'string', nullable: true }],
        ['created_at', { name: 'created_at', type: 'date' }],
        ['updated_at', { name: 'updated_at', type: 'date' }]
      ]),
      modelClass: SettingModel
    };
  }

  /**
   * Load settings from database into cache
   */
  async loadFromDatabase(): Promise<void> {
    const settings = await this.findAll();
    this._cachedSettings.clear();
    
    for (const setting of settings) {
      const key = setting.get<string>('key');
      const value = setting.get<string>('value');
      if (key) {
        this._cachedSettings.set(key, value ?? '');
      }
    }
    
    this._cacheLoaded = true;
  }

  /**
   * Ensure cache is loaded
   */
  private async ensureCacheLoaded(): Promise<void> {
    if (!this._cacheLoaded) {
      await this.loadFromDatabase();
    }
  }

  /**
   * Check if setting exists
   */
  async has(key: string): Promise<boolean> {
    await this.ensureCacheLoaded();
    return this._cachedSettings.has(key);
  }

  /**
   * Get setting value
   */
  async get(key: string, defaultValue?: string): Promise<string | null> {
    await this.ensureCacheLoaded();
    
    if (this._cachedSettings.has(key)) {
      return this._cachedSettings.get(key) ?? null;
    }
    
    return defaultValue ?? null;
  }

  /**
   * Get setting value as number
   */
  async getNumber(key: string, defaultValue: number = 0): Promise<number> {
    const value = await this.get(key);
    if (value === null) return defaultValue;
    
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * Get setting value as boolean
   */
  async getBoolean(key: string, defaultValue: boolean = false): Promise<boolean> {
    const value = await this.get(key);
    if (value === null) return defaultValue;
    
    return value === '1' || value.toLowerCase() === 'true' || value.toLowerCase() === 'yes';
  }

  /**
   * Get setting value as JSON
   */
  async getJson<T = unknown>(key: string, defaultValue?: T): Promise<T | null> {
    const value = await this.get(key);
    if (value === null) return defaultValue ?? null;
    
    try {
      return JSON.parse(value) as T;
    } catch {
      return defaultValue ?? null;
    }
  }

  /**
   * Set setting value
   */
  async set(key: string, value: string): Promise<void> {
    // Update database
    const existing = await this.findFirst({ where: { key } });
    
    if (existing) {
      await this.update(existing.getId()!, { value });
    } else {
      await this.create({ key, value });
    }
    
    // Update cache
    this._cachedSettings.set(key, value);
  }

  /**
   * Set setting value as JSON
   */
  async setJson(key: string, value: unknown): Promise<void> {
    await this.set(key, JSON.stringify(value));
  }

  /**
   * Delete setting
   */
  async deleteSetting(key: string): Promise<boolean> {
    const existing = await this.findFirst({ where: { key } });
    
    if (existing) {
      const result = await this.hardDelete(existing.getId()!);
      if (result) {
        this._cachedSettings.delete(key);
      }
      return result;
    }
    
    this._cachedSettings.delete(key);
    return true;
  }

  /**
   * Get all settings as object
   */
  async getAll(): Promise<Record<string, string>> {
    await this.ensureCacheLoaded();
    
    const result: Record<string, string> = {};
    for (const [key, value] of this._cachedSettings) {
      result[key] = value;
    }
    return result;
  }

  /**
   * Set cached settings directly (for warmup)
   */
  setCachedSettings(settings: Record<string, string>): void {
    this._cachedSettings.clear();
    for (const [key, value] of Object.entries(settings)) {
      this._cachedSettings.set(key, value);
    }
    this._cacheLoaded = true;
  }

  /**
   * Get cached settings (for serialization)
   */
  getCachedSettings(): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of this._cachedSettings) {
      result[key] = value;
    }
    return result;
  }

  /**
   * Clear cache
   */
  async clearCache(): Promise<void> {
    this._cachedSettings.clear();
    this._cacheLoaded = false;
  }

  /**
   * Clear all cache (implements CachedRepositoryInterface)
   */
  async clearAllCache(): Promise<void> {
    await this.clearCache();
  }

  /**
   * Warm up cache from database
   */
  async warmupCache(): Promise<void> {
    await this.loadFromDatabase();
  }
}
