"use strict";
/**
 * Cached Stream Repository
 *
 * Repository for BaseStream entity with in-memory caching.
 * Provides fast lookups for frequently accessed streams.
 *
 * @see keitaro_source/application/Traffic/Repository/CachedStreamRepository.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedStreamRepository = exports.StreamCollection = void 0;
const stream_repository_js_1 = require("./stream-repository.js");
const state_js_1 = require("../../core/entity/state.js");
/**
 * Stream collection for campaign
 */
class StreamCollection {
    _streams;
    constructor(streams) {
        this._streams = streams;
    }
    /**
     * Get all streams
     */
    all() {
        return this._streams;
    }
    /**
     * Get first stream
     */
    first() {
        return this._streams[0];
    }
    /**
     * Get stream count
     */
    count() {
        return this._streams.length;
    }
    /**
     * Filter streams by predicate
     */
    filter(predicate) {
        return new StreamCollection(this._streams.filter(predicate));
    }
    /**
     * Find stream by ID
     */
    find(id) {
        return this._streams.find(s => s.getId() === id);
    }
    /**
     * Get active streams only
     */
    active() {
        return this.filter(s => s.getState() === state_js_1.EntityState.ACTIVE);
    }
    /**
     * Iterate over streams
     */
    [Symbol.iterator]() {
        return this._streams[Symbol.iterator]();
    }
}
exports.StreamCollection = StreamCollection;
/**
 * Cached Stream Repository implementation
 */
// @ts-expect-error: getInstance override is intentional for cached repository singleton
class CachedStreamRepository extends stream_repository_js_1.StreamRepository {
    static _instance = null;
    /**
     * In-memory cache for streams by ID
     */
    _cacheById = new Map();
    /**
     * Campaign streams cache (campaign_id -> StreamCollection)
     */
    _campaignStreamsCache = new Map();
    /**
     * Cache TTL in milliseconds (5 minutes default)
     */
    _cacheTtl = 5 * 60 * 1000;
    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!CachedStreamRepository._instance) {
            CachedStreamRepository._instance = new CachedStreamRepository();
        }
        return CachedStreamRepository._instance;
    }
    /**
     * Reset singleton and clear cache
     */
    static reset() {
        if (CachedStreamRepository._instance) {
            CachedStreamRepository._instance.clearAllCache();
        }
        CachedStreamRepository._instance = null;
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
     * Find stream from cache by ID
     */
    async findCached(id) {
        const cached = this._cacheById.get(id);
        if (this.isCacheValid(cached)) {
            return cached.data;
        }
        // Load from database and cache
        const stream = await this.findActive(id);
        if (stream) {
            this._cacheById.set(id, {
                data: stream,
                timestamp: Date.now()
            });
        }
        return stream;
    }
    /**
     * Get cached active streams for a campaign
     */
    async getCachedActiveStreams(campaign) {
        const campaignId = campaign.getId();
        if (!campaignId) {
            return new StreamCollection([]);
        }
        const cached = this._campaignStreamsCache.get(campaignId);
        if (this.isCacheValid(cached)) {
            return cached.data;
        }
        // Load from database and cache
        const streams = await this.findActiveByCampaignId(campaignId);
        const collection = new StreamCollection(streams);
        this._campaignStreamsCache.set(campaignId, {
            data: collection,
            timestamp: Date.now()
        });
        // Also cache individual streams
        for (const stream of streams) {
            const streamId = stream.getId();
            if (streamId) {
                this._cacheById.set(streamId, {
                    data: stream,
                    timestamp: Date.now()
                });
            }
        }
        return collection;
    }
    /**
     * Clear cache for specific stream
     */
    async clearCache(id) {
        this._cacheById.delete(id);
        // Also invalidate campaign cache for this stream's campaign
        // This requires looking up the stream, but we'll clear all campaign caches
        // for simplicity
        this._campaignStreamsCache.clear();
    }
    /**
     * Clear all cache
     */
    async clearAllCache() {
        this._cacheById.clear();
        this._campaignStreamsCache.clear();
    }
    /**
     * Clear cache for specific campaign
     */
    async clearCampaignCache(campaignId) {
        this._campaignStreamsCache.delete(campaignId);
    }
    /**
     * Warm up cache with all active streams
     */
    async warmupCache() {
        const streams = await this.findAllActive();
        for (const stream of streams) {
            const id = stream.getId();
            if (id) {
                this._cacheById.set(id, {
                    data: stream,
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
            streamsCached: this._cacheById.size,
            campaignsCached: this._campaignStreamsCache.size
        };
    }
}
exports.CachedStreamRepository = CachedStreamRepository;
//# sourceMappingURL=cached-stream-repository.js.map