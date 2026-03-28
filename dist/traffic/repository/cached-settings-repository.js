"use strict";
/**
 * Cached Settings Repository
 *
 * Repository for application settings with in-memory caching.
 * Provides fast access to configuration values.
 *
 * @see keitaro_source/application/Traffic/Repository/CachedSettingsRepository.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedSettingsRepository = void 0;
const base_repository_js_1 = require("../../core/repository/base-repository.js");
const state_js_1 = require("../../core/entity/state.js");
/**
 * Setting model class that implements EntityModelInterface
 */
class SettingModel {
    _data;
    constructor(data) {
        this._data = data;
    }
    getId() { return this._data.id; }
    get(key) { return this._data[key]; }
    set(key, value) { this._data[key] = value; return this; }
    getData() { return { ...this._data }; }
    isNew() { return !this.getId(); }
    getEntityName() { return 'setting'; }
    getTableName() { return 'settings'; }
    getState() { return state_js_1.EntityState.ACTIVE; }
    isActive() { return true; }
    isDisabled() { return false; }
    isDeleted() { return false; }
    toJSON() { return this.getData(); }
    clone() { return new SettingModel(this._data); }
}
/**
 * Cached Settings Repository implementation
 *
 * @artifact ARTIFACT-003: PHP used file-based cache for settings,
 * we implement in-memory caching with optional persistence
 */
// @ts-expect-error: getInstance override is intentional for cached repository singleton
class CachedSettingsRepository extends base_repository_js_1.BaseRepository {
    static _instance = null;
    /**
     * Cache key for settings
     */
    static CACHE_KEY = 'settings';
    /**
     * In-memory settings cache
     */
    _cachedSettings = new Map();
    /**
     * Cache loaded flag
     */
    _cacheLoaded = false;
    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!CachedSettingsRepository._instance) {
            CachedSettingsRepository._instance = new CachedSettingsRepository();
        }
        return CachedSettingsRepository._instance;
    }
    /**
     * Reset singleton and clear cache
     */
    static reset() {
        if (CachedSettingsRepository._instance) {
            CachedSettingsRepository._instance.clearAllCache();
        }
        CachedSettingsRepository._instance = null;
    }
    /**
     * Get entity definition
     */
    getDefinition() {
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
    async loadFromDatabase() {
        const settings = await this.findAll();
        this._cachedSettings.clear();
        for (const setting of settings) {
            const key = setting.get('key');
            const value = setting.get('value');
            if (key) {
                this._cachedSettings.set(key, value ?? '');
            }
        }
        this._cacheLoaded = true;
    }
    /**
     * Ensure cache is loaded
     */
    async ensureCacheLoaded() {
        if (!this._cacheLoaded) {
            await this.loadFromDatabase();
        }
    }
    /**
     * Check if setting exists
     */
    async has(key) {
        await this.ensureCacheLoaded();
        return this._cachedSettings.has(key);
    }
    /**
     * Get setting value
     */
    async get(key, defaultValue) {
        await this.ensureCacheLoaded();
        if (this._cachedSettings.has(key)) {
            return this._cachedSettings.get(key) ?? null;
        }
        return defaultValue ?? null;
    }
    /**
     * Get setting value as number
     */
    async getNumber(key, defaultValue = 0) {
        const value = await this.get(key);
        if (value === null)
            return defaultValue;
        const parsed = parseFloat(value);
        return isNaN(parsed) ? defaultValue : parsed;
    }
    /**
     * Get setting value as boolean
     */
    async getBoolean(key, defaultValue = false) {
        const value = await this.get(key);
        if (value === null)
            return defaultValue;
        return value === '1' || value.toLowerCase() === 'true' || value.toLowerCase() === 'yes';
    }
    /**
     * Get setting value as JSON
     */
    async getJson(key, defaultValue) {
        const value = await this.get(key);
        if (value === null)
            return defaultValue ?? null;
        try {
            return JSON.parse(value);
        }
        catch {
            return defaultValue ?? null;
        }
    }
    /**
     * Set setting value
     */
    async set(key, value) {
        // Update database
        const existing = await this.findFirst({ where: { key } });
        if (existing) {
            await this.update(existing.getId(), { value });
        }
        else {
            await this.create({ key, value });
        }
        // Update cache
        this._cachedSettings.set(key, value);
    }
    /**
     * Set setting value as JSON
     */
    async setJson(key, value) {
        await this.set(key, JSON.stringify(value));
    }
    /**
     * Delete setting
     */
    async deleteSetting(key) {
        const existing = await this.findFirst({ where: { key } });
        if (existing) {
            const result = await this.hardDelete(existing.getId());
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
    async getAll() {
        await this.ensureCacheLoaded();
        const result = {};
        for (const [key, value] of this._cachedSettings) {
            result[key] = value;
        }
        return result;
    }
    /**
     * Set cached settings directly (for warmup)
     */
    setCachedSettings(settings) {
        this._cachedSettings.clear();
        for (const [key, value] of Object.entries(settings)) {
            this._cachedSettings.set(key, value);
        }
        this._cacheLoaded = true;
    }
    /**
     * Get cached settings (for serialization)
     */
    getCachedSettings() {
        const result = {};
        for (const [key, value] of this._cachedSettings) {
            result[key] = value;
        }
        return result;
    }
    /**
     * Clear cache
     */
    async clearCache() {
        this._cachedSettings.clear();
        this._cacheLoaded = false;
    }
    /**
     * Clear all cache (implements CachedRepositoryInterface)
     */
    async clearAllCache() {
        await this.clearCache();
    }
    /**
     * Warm up cache from database
     */
    async warmupCache() {
        await this.loadFromDatabase();
    }
}
exports.CachedSettingsRepository = CachedSettingsRepository;
//# sourceMappingURL=cached-settings-repository.js.map