/**
 * Cached Offer Repository
 *
 * Repository for Offer entity with in-memory caching.
 * Provides fast lookups for frequently accessed offers.
 *
 * @see keitaro_source/application/Traffic/Repository/CachedOfferRepository.php
 */
import { Offer } from '../model/offer.js';
import { OfferRepository } from './offer-repository.js';
/**
 * Cached Offer Repository implementation
 */
export declare class CachedOfferRepository extends OfferRepository {
    private static _instance;
    /**
     * In-memory cache for offers by ID
     */
    private _cacheById;
    /**
     * Cache TTL in milliseconds (5 minutes default)
     */
    private _cacheTtl;
    /**
     * Get singleton instance
     */
    static getInstance(): CachedOfferRepository;
    /**
     * Reset singleton and clear cache
     */
    static reset(): void;
    /**
     * Set cache TTL
     */
    setCacheTtl(ttlMs: number): void;
    /**
     * Check if cache entry is valid
     */
    private isCacheValid;
    /**
     * Find offer from cache by ID
     */
    findCached(id: number): Promise<Offer | null>;
    /**
     * Clear cache for specific offer
     */
    clearCache(id: number): Promise<void>;
    /**
     * Clear all cache
     */
    clearAllCache(): Promise<void>;
    /**
     * Warm up cache with all active offers
     */
    warmupCache(): Promise<void>;
    /**
     * Get cache statistics
     */
    getCacheStats(): {
        offersCached: number;
    };
}
//# sourceMappingURL=cached-offer-repository.d.ts.map