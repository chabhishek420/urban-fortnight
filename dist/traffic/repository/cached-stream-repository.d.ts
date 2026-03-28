/**
 * Cached Stream Repository
 *
 * Repository for BaseStream entity with in-memory caching.
 * Provides fast lookups for frequently accessed streams.
 *
 * @see keitaro_source/application/Traffic/Repository/CachedStreamRepository.php
 */
import { BaseStream } from '../model/base-stream.js';
import { StreamRepository } from './stream-repository.js';
import { Campaign } from '../model/campaign.js';
/**
 * Stream collection for campaign
 */
export declare class StreamCollection {
    private _streams;
    constructor(streams: BaseStream[]);
    /**
     * Get all streams
     */
    all(): BaseStream[];
    /**
     * Get first stream
     */
    first(): BaseStream | undefined;
    /**
     * Get stream count
     */
    count(): number;
    /**
     * Filter streams by predicate
     */
    filter(predicate: (stream: BaseStream) => boolean): StreamCollection;
    /**
     * Find stream by ID
     */
    find(id: number): BaseStream | undefined;
    /**
     * Get active streams only
     */
    active(): StreamCollection;
    /**
     * Iterate over streams
     */
    [Symbol.iterator](): Iterator<BaseStream>;
}
/**
 * Cached Stream Repository implementation
 */
export declare class CachedStreamRepository extends StreamRepository {
    private static _instance;
    /**
     * In-memory cache for streams by ID
     */
    private _cacheById;
    /**
     * Campaign streams cache (campaign_id -> StreamCollection)
     */
    private _campaignStreamsCache;
    /**
     * Cache TTL in milliseconds (5 minutes default)
     */
    private _cacheTtl;
    /**
     * Get singleton instance
     */
    static getInstance(): CachedStreamRepository;
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
     * Find stream from cache by ID
     */
    findCached(id: number): Promise<BaseStream | null>;
    /**
     * Get cached active streams for a campaign
     */
    getCachedActiveStreams(campaign: Campaign): Promise<StreamCollection>;
    /**
     * Clear cache for specific stream
     */
    clearCache(id: number): Promise<void>;
    /**
     * Clear all cache
     */
    clearAllCache(): Promise<void>;
    /**
     * Clear cache for specific campaign
     */
    clearCampaignCache(campaignId: number): Promise<void>;
    /**
     * Warm up cache with all active streams
     */
    warmupCache(): Promise<void>;
    /**
     * Get cache statistics
     */
    getCacheStats(): {
        streamsCached: number;
        campaignsCached: number;
    };
}
//# sourceMappingURL=cached-stream-repository.d.ts.map