/**
 * Cached Landing Repository
 * 
 * Repository for Landing entity with in-memory caching.
 * Provides fast lookups for frequently accessed landings.
 * 
 * @see keitaro_source/application/Traffic/Repository/CachedLandingRepository.php
 */

import { Landing } from '../model/landing';
import { LandingRepository } from './landing-repository';

/**
 * Cache entry structure
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Cached Landing Repository implementation
 */
// @ts-expect-error: getInstance override is intentional for cached repository singleton
export class CachedLandingRepository extends LandingRepository {
  private static _instance: CachedLandingRepository | null = null;

  /**
   * In-memory cache for landings by ID
   */
  private _cacheById: Map<number, CacheEntry<Landing>> = new Map();

  /**
   * URL cache for quick lookups
   */
  private _urlsCache: Map<number, string> | null = null;

  /**
   * Cache TTL in milliseconds (5 minutes default)
   */
  private _cacheTtl: number = 5 * 60 * 1000;

  /**
   * Get singleton instance
   */
  static getInstance(): CachedLandingRepository {
    if (!CachedLandingRepository._instance) {
      CachedLandingRepository._instance = new CachedLandingRepository();
    }
    return CachedLandingRepository._instance;
  }

  /**
   * Reset singleton and clear cache
   */
  static reset(): void {
    if (CachedLandingRepository._instance) {
      CachedLandingRepository._instance.clearAllCache();
    }
    CachedLandingRepository._instance = null;
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
   * Find landing from cache by ID
   */
  async findCached(id: number): Promise<Landing | null> {
    const cached = this._cacheById.get(id);
    
    if (this.isCacheValid(cached)) {
      return cached!.data;
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
  async urls(): Promise<Map<number, string>> {
    if (this._urlsCache) {
      return this._urlsCache;
    }

    this._urlsCache = await this.getLandingUrls();
    return this._urlsCache;
  }

  /**
   * Clear cache for specific landing
   */
  async clearCache(id: number): Promise<void> {
    this._cacheById.delete(id);
    this._urlsCache = null; // Invalidate URLs cache
  }

  /**
   * Clear all cache
   */
  async clearAllCache(): Promise<void> {
    this._cacheById.clear();
    this._urlsCache = null;
  }

  /**
   * Warm up cache with all active landings
   */
  async warmupCache(): Promise<void> {
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
  getCacheStats(): {
    landingsCached: number;
    urlsCached: boolean;
  } {
    return {
      landingsCached: this._cacheById.size,
      urlsCached: this._urlsCache !== null
    };
  }
}
