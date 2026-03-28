/**
 * Cached Campaign Repository
 *
 * Repository for Campaign entity with in-memory caching.
 * Provides fast lookups for frequently accessed campaigns.
 *
 * @see keitaro_source/application/Traffic/Repository/CachedCampaignRepository.php
 */
import { Campaign } from '../model/campaign.js';
import { CampaignRepository } from './campaign-repository.js';
/**
 * Cached Campaign Repository implementation
 *
 * @artifact ARTIFACT-002: PHP used CachedDataRepository for cache management,
 * we implement local memory caching for simplicity and performance
 */
export declare class CachedCampaignRepository extends CampaignRepository {
    private static _instance;
    /**
     * In-memory cache for campaigns by ID
     */
    private _cacheById;
    /**
     * Token to ID mapping cache
     */
    private _tokenToId;
    /**
     * Alias to ID mapping cache
     */
    private _aliasToId;
    /**
     * Cache TTL in milliseconds (5 minutes default)
     */
    private _cacheTtl;
    /**
     * Get singleton instance
     */
    static getInstance(): CachedCampaignRepository;
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
     * Find campaign from cache by ID
     */
    findCached(id: number): Promise<Campaign | null>;
    /**
     * Find campaign by token (cached)
     */
    findByToken(token: string): Promise<Campaign | null>;
    /**
     * Find campaign by alias (cached)
     */
    findByAlias(alias: string): Promise<Campaign | null>;
    /**
     * Find active campaign by token (cached)
     */
    findActiveByToken(token: string): Promise<Campaign | null>;
    /**
     * Find active campaign by alias (cached)
     */
    findActiveByAlias(alias: string): Promise<Campaign | null>;
    /**
     * Clear cache for specific campaign
     */
    clearCache(id: number): Promise<void>;
    /**
     * Clear all cache
     */
    clearAllCache(): Promise<void>;
    /**
     * Warm up cache with all active campaigns
     */
    warmupCache(): Promise<void>;
    /**
     * Get cache statistics
     */
    getCacheStats(): {
        campaignsCached: number;
        tokensCached: number;
        aliasesCached: number;
    };
}
//# sourceMappingURL=cached-campaign-repository.d.ts.map