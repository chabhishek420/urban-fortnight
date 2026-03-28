/**
 * Cached Landing Repository
 *
 * Repository for Landing entity with in-memory caching.
 * Provides fast lookups for frequently accessed landings.
 *
 * @see keitaro_source/application/Traffic/Repository/CachedLandingRepository.php
 */
import { Landing } from '../model/landing.js';
import { LandingRepository } from './landing-repository.js';
/**
 * Cached Landing Repository implementation
 */
export declare class CachedLandingRepository extends LandingRepository {
    private static _instance;
    /**
     * In-memory cache for landings by ID
     */
    private _cacheById;
    /**
     * URL cache for quick lookups
     */
    private _urlsCache;
    /**
     * Cache TTL in milliseconds (5 minutes default)
     */
    private _cacheTtl;
    /**
     * Get singleton instance
     */
    static getInstance(): CachedLandingRepository;
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
     * Find landing from cache by ID
     */
    findCached(id: number): Promise<Landing | null>;
    /**
     * Get all landing URLs (cached)
     */
    urls(): Promise<Map<number, string>>;
    /**
     * Clear cache for specific landing
     */
    clearCache(id: number): Promise<void>;
    /**
     * Clear all cache
     */
    clearAllCache(): Promise<void>;
    /**
     * Warm up cache with all active landings
     */
    warmupCache(): Promise<void>;
    /**
     * Get cache statistics
     */
    getCacheStats(): {
        landingsCached: number;
        urlsCached: boolean;
    };
}
//# sourceMappingURL=cached-landing-repository.d.ts.map