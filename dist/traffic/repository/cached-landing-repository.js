"use strict";
/**
 * Cached Landing Repository
 *
 * Repository for Landing entity with in-memory caching.
 * Provides fast lookups for frequently accessed landings.
 *
 * @see keitaro_source/application/Traffic/Repository/CachedLandingRepository.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedLandingRepository = void 0;
const landing_repository_js_1 = require("./landing-repository.js");
/**
 * Cached Landing Repository implementation
 */
// @ts-expect-error: getInstance override is intentional for cached repository singleton
class CachedLandingRepository extends landing_repository_js_1.LandingRepository {
    static _instance = null;
    /**
     * In-memory cache for landings by ID
     */
    _cacheById = new Map();
    /**
     * URL cache for quick lookups
     */
    _urlsCache = null;
    /**
     * Cache TTL in milliseconds (5 minutes default)
     */
    _cacheTtl = 5 * 60 * 1000;
    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!CachedLandingRepository._instance) {
            CachedLandingRepository._instance = new CachedLandingRepository();
        }
        return CachedLandingRepository._instance;
    }
    /**
     * Reset singleton and clear cache
     */
    static reset() {
        if (CachedLandingRepository._instance) {
            CachedLandingRepository._instance.clearAllCache();
        }
        CachedLandingRepository._instance = null;
    }
    /**
     * Set cache TTL
     */
    setCacheTtl(ttlMs) {
        this._cacheTtl = ttlMs;
    }
    /**
     * Check if cache entry is valid
     */
    isCacheValid(entry) {
        if (!entry)
            return false;
        return Date.now() - entry.timestamp < this._cacheTtl;
    }
    /**
     * Find landing from cache by ID
     */
    async findCached(id) {
        const cached = this._cacheById.get(id);
        if (this.isCacheValid(cached)) {
            return cached.data;
        }
        // Load from database and cache
        const landing = await this.findActive(id);
        if (landing) {
            this._cacheById.set(id, {
                data: landing,
                timestamp: Date.now()
            });
        }
        return landing;
    }
    /**
     * Get all landing URLs (cached)
     */
    async urls() {
        if (this._urlsCache) {
            return this._urlsCache;
        }
        this._urlsCache = await this.getLandingUrls();
        return this._urlsCache;
    }
    /**
     * Clear cache for specific landing
     */
    async clearCache(id) {
        this._cacheById.delete(id);
        this._urlsCache = null; // Invalidate URLs cache
    }
    /**
     * Clear all cache
     */
    async clearAllCache() {
        this._cacheById.clear();
        this._urlsCache = null;
    }
    /**
     * Warm up cache with all active landings
     */
    async warmupCache() {
        const landings = await this.findAllActive();
        for (const landing of landings) {
            const id = landing.getId();
            if (id) {
                this._cacheById.set(id, {
                    data: landing,
                    timestamp: Date.now()
                });
            }
        }
        // Pre-cache URLs
        this._urlsCache = await this.getLandingUrls();
    }
    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            landingsCached: this._cacheById.size,
            urlsCached: this._urlsCache !== null
        };
    }
}
exports.CachedLandingRepository = CachedLandingRepository;
//# sourceMappingURL=cached-landing-repository.js.map