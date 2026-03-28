"use strict";
/**
 * Cached Offer Repository
 *
 * Repository for Offer entity with in-memory caching.
 * Provides fast lookups for frequently accessed offers.
 *
 * @see keitaro_source/application/Traffic/Repository/CachedOfferRepository.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedOfferRepository = void 0;
const offer_repository_js_1 = require("./offer-repository.js");
/**
 * Cached Offer Repository implementation
 */
// @ts-expect-error: getInstance override is intentional for cached repository singleton
class CachedOfferRepository extends offer_repository_js_1.OfferRepository {
    static _instance = null;
    /**
     * In-memory cache for offers by ID
     */
    _cacheById = new Map();
    /**
     * Cache TTL in milliseconds (5 minutes default)
     */
    _cacheTtl = 5 * 60 * 1000;
    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!CachedOfferRepository._instance) {
            CachedOfferRepository._instance = new CachedOfferRepository();
        }
        return CachedOfferRepository._instance;
    }
    /**
     * Reset singleton and clear cache
     */
    static reset() {
        if (CachedOfferRepository._instance) {
            CachedOfferRepository._instance.clearAllCache();
        }
        CachedOfferRepository._instance = null;
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
     * Find offer from cache by ID
     */
    async findCached(id) {
        const cached = this._cacheById.get(id);
        if (this.isCacheValid(cached)) {
            return cached.data;
        }
        // Load from database and cache
        const offer = await this.findActive(id);
        if (offer) {
            this._cacheById.set(id, {
                data: offer,
                timestamp: Date.now()
            });
        }
        return offer;
    }
    /**
     * Clear cache for specific offer
     */
    async clearCache(id) {
        this._cacheById.delete(id);
    }
    /**
     * Clear all cache
     */
    async clearAllCache() {
        this._cacheById.clear();
    }
    /**
     * Warm up cache with all active offers
     */
    async warmupCache() {
        const offers = await this.findAllActive();
        for (const offer of offers) {
            const id = offer.getId();
            if (id) {
                this._cacheById.set(id, {
                    data: offer,
                    timestamp: Date.now()
                });
            }
        }
    }
    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            offersCached: this._cacheById.size
        };
    }
}
exports.CachedOfferRepository = CachedOfferRepository;
//# sourceMappingURL=cached-offer-repository.js.map