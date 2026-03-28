/**
 * Cached Stream Repository
 * 
 * Repository for BaseStream entity with in-memory caching.
 * Provides fast lookups for frequently accessed streams.
 * 
 * @see keitaro_source/application/Traffic/Repository/CachedStreamRepository.php
 */

import { BaseStream } from '../model/base-stream';
import { StreamRepository } from './stream-repository';
import { Campaign } from '../model/campaign';
import { EntityState } from '../../core/entity/state';

/**
 * Cache entry structure
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Stream collection for campaign
 */
export class StreamCollection {
  private _streams: BaseStream[];

  constructor(streams: BaseStream[]) {
    this._streams = streams;
  }

  /**
   * Get all streams
   */
  all(): BaseStream[] {
    return this._streams;
  }

  /**
   * Get first stream
   */
  first(): BaseStream | undefined {
    return this._streams[0];
  }

  /**
   * Get stream count
   */
  count(): number {
    return this._streams.length;
  }

  /**
   * Filter streams by predicate
   */
  filter(predicate: (stream: BaseStream) => boolean): StreamCollection {
    return new StreamCollection(this._streams.filter(predicate));
  }

  /**
   * Find stream by ID
   */
  find(id: number): BaseStream | undefined {
    return this._streams.find(s => s.getId() === id);
  }

  /**
   * Get active streams only
   */
  active(): StreamCollection {
    return this.filter(s => s.getState() === EntityState.ACTIVE);
  }

  /**
   * Iterate over streams
   */
  [Symbol.iterator](): Iterator<BaseStream> {
    return this._streams[Symbol.iterator]();
  }
}

/**
 * Cached Stream Repository implementation
 */
// @ts-expect-error: getInstance override is intentional for cached repository singleton
export class CachedStreamRepository extends StreamRepository {
  private static _instance: CachedStreamRepository | null = null;

  /**
   * In-memory cache for streams by ID
   */
  private _cacheById: Map<number, CacheEntry<BaseStream>> = new Map();

  /**
   * Campaign streams cache (campaign_id -> StreamCollection)
   */
  private _campaignStreamsCache: Map<number, CacheEntry<StreamCollection>> = new Map();

  /**
   * Cache TTL in milliseconds (5 minutes default)
   */
  private _cacheTtl: number = 5 * 60 * 1000;

  /**
   * Get singleton instance
   */
  static getInstance(): CachedStreamRepository {
    if (!CachedStreamRepository._instance) {
      CachedStreamRepository._instance = new CachedStreamRepository();
    }
    return CachedStreamRepository._instance;
  }

  /**
   * Reset singleton and clear cache
   */
  static reset(): void {
    if (CachedStreamRepository._instance) {
      CachedStreamRepository._instance.clearAllCache();
    }
    CachedStreamRepository._instance = null;
  }

  /**
   * Set cache TTL
   */
  setCacheTtl(ttlMs: number): void {
    this._cacheTtl = ttlMs;
  }

  /**
   * Check if cache entry is valid
   */
  private isCacheValid<T>(entry: CacheEntry<T> | undefined): boolean {
    if (!entry) return false;
    return Date.now() - entry.timestamp < this._cacheTtl;
  }

  /**
   * Find stream from cache by ID
   */
  async findCached(id: number): Promise<BaseStream | null> {
    const cached = this._cacheById.get(id);
    
    if (this.isCacheValid(cached)) {
      return cached!.data;
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
  async getCachedActiveStreams(campaign: Campaign): Promise<StreamCollection> {
    const campaignId = campaign.getId();
    if (!campaignId) {
      return new StreamCollection([]);
    }

    const cached = this._campaignStreamsCache.get(campaignId);
    
    if (this.isCacheValid(cached)) {
      return cached!.data;
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
  async clearCache(id: number): Promise<void> {
    this._cacheById.delete(id);
    
    // Also invalidate campaign cache for this stream's campaign
    // This requires looking up the stream, but we'll clear all campaign caches
    // for simplicity
    this._campaignStreamsCache.clear();
  }

  /**
   * Clear all cache
   */
  async clearAllCache(): Promise<void> {
    this._cacheById.clear();
    this._campaignStreamsCache.clear();
  }

  /**
   * Clear cache for specific campaign
   */
  async clearCampaignCache(campaignId: number): Promise<void> {
    this._campaignStreamsCache.delete(campaignId);
  }

  /**
   * Warm up cache with all active streams
   */
  async warmupCache(): Promise<void> {
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
  getCacheStats(): {
    streamsCached: number;
    campaignsCached: number;
  } {
    return {
      streamsCached: this._cacheById.size,
      campaignsCached: this._campaignStreamsCache.size
    };
  }
}
