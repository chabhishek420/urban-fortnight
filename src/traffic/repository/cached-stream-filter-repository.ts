/**
 * Cached Stream Filter Repository
 * 
 * Repository for StreamFilter entity with in-memory caching.
 * Provides fast lookups for frequently accessed stream filters.
 * 
 * @see keitaro_source/application/Traffic/Repository/CachedStreamFilterRepository.php
 */

import { StreamFilter } from '../model/stream-filter';
import { StreamFilterRepository } from './stream-filter-repository';
import type { BaseStream } from '../model/base-stream';

/**
 * Cache entry structure
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Cached Stream Filter Repository
 * 
 * Caches filters per stream for fast access during click processing.
 */
export class CachedStreamFilterRepository extends StreamFilterRepository {
  private static _cachedInstance: CachedStreamFilterRepository | null = null;

  /**
   * Cache for stream filters (streamId -> StreamFilter[])
   */
  private _cacheByStreamId: Map<number, CacheEntry<StreamFilter[]>> = new Map();

  /**
   * Cache TTL in milliseconds (5 minutes default)
   */
  private _cacheTtl: number = 5 * 60 * 1000;

  /**
   * Get singleton instance
   */
  static getInstance(): CachedStreamFilterRepository {
    if (!CachedStreamFilterRepository._cachedInstance) {
      CachedStreamFilterRepository._cachedInstance = new CachedStreamFilterRepository();
    }
    return CachedStreamFilterRepository._cachedInstance;
  }

  /**
   * Reset singleton and clear cache
   */
  static reset(): void {
    if (CachedStreamFilterRepository._cachedInstance) {
      CachedStreamFilterRepository._cachedInstance.clearAllCache();
    }
    CachedStreamFilterRepository._cachedInstance = null;
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
   * Get all cached filters for a stream
   * 
   * This is the main method used during click processing.
   * Corresponds to PHP: CachedStreamFilterRepository::instance()->allCached($stream)
   */
  async allCached(stream: BaseStream): Promise<StreamFilter[]> {
    const streamId = stream.getId();
    if (!streamId) {
      return [];
    }

    return this.getByStreamIdCached(streamId);
  }

  /**
   * Get cached filters by stream ID
   */
  async getByStreamIdCached(streamId: number): Promise<StreamFilter[]> {
    const cached = this._cacheByStreamId.get(streamId);
    
    if (this.isCacheValid(cached)) {
      return cached!.data;
    }

    // Load from database and cache
    const filters = await this.findByStreamId(streamId);
    
    this._cacheByStreamId.set(streamId, {
      data: filters,
      timestamp: Date.now()
    });

    return filters;
  }

  /**
   * Get cached filters for multiple streams
   */
  async getCachedByStreamIds(streamIds: number[]): Promise<Map<number, StreamFilter[]>> {
    const result = new Map<number, StreamFilter[]>();
    const uncachedIds: number[] = [];

    // Check cache first
    for (const streamId of streamIds) {
      const cached = this._cacheByStreamId.get(streamId);
      if (this.isCacheValid(cached)) {
        result.set(streamId, cached!.data);
      } else {
        uncachedIds.push(streamId);
      }
    }

    // Load uncached from database
    if (uncachedIds.length > 0) {
      const dbFilters = await this.findByStreamIds(uncachedIds);
      
      for (const [streamId, filters] of dbFilters) {
        this._cacheByStreamId.set(streamId, {
          data: filters,
          timestamp: Date.now()
        });
        result.set(streamId, filters);
      }

      // Cache empty arrays for streams with no filters
      for (const streamId of uncachedIds) {
        if (!result.has(streamId)) {
          this._cacheByStreamId.set(streamId, {
            data: [],
            timestamp: Date.now()
          });
          result.set(streamId, []);
        }
      }
    }

    return result;
  }

  /**
   * Clear cache for specific stream
   */
  async clearStreamCache(streamId: number): Promise<void> {
    this._cacheByStreamId.delete(streamId);
  }

  /**
   * Clear all cache
   */
  async clearAllCache(): Promise<void> {
    this._cacheByStreamId.clear();
  }

  /**
   * Warm up cache for streams
   */
  async warmupCache(streamIds: number[]): Promise<void> {
    await this.getCachedByStreamIds(streamIds);
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    streamsCached: number;
    totalFilters: number;
  } {
    let totalFilters = 0;
    for (const entry of this._cacheByStreamId.values()) {
      totalFilters += entry.data.length;
    }

    return {
      streamsCached: this._cacheByStreamId.size,
      totalFilters
    };
  }
}
