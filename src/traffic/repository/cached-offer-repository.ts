/**
 * Cached Offer Repository
 * 
 * Repository for Offer entity with in-memory caching.
 * Provides fast lookups for frequently accessed offers.
 * 
 * @see keitaro_source/application/Traffic/Repository/CachedOfferRepository.php
 */

import { Offer } from '../model/offer';
import { OfferRepository } from './offer-repository';

/**
 * Cache entry structure
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Cached Offer Repository implementation
 */
// @ts-expect-error: getInstance override is intentional for cached repository singleton
export class CachedOfferRepository extends OfferRepository {
  private static _instance: CachedOfferRepository | null = null;

  /**
   * In-memory cache for offers by ID
   */
  private _cacheById: Map<number, CacheEntry<Offer>> = new Map();

  /**
   * Cache TTL in milliseconds (5 minutes default)
   */
  private _cacheTtl: number = 5 * 60 * 1000;

  /**
   * Get singleton instance
   */
  static getInstance(): CachedOfferRepository {
    if (!CachedOfferRepository._instance) {
      CachedOfferRepository._instance = new CachedOfferRepository();
    }
    return CachedOfferRepository._instance;
  }

  /**
   * Reset singleton and clear cache
   */
  static reset(): void {
    if (CachedOfferRepository._instance) {
      CachedOfferRepository._instance.clearAllCache();
    }
    CachedOfferRepository._instance = null;
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
   * Find offer from cache by ID
   */
  async findCached(id: number): Promise<Offer | null> {
    const cached = this._cacheById.get(id);
    
    if (this.isCacheValid(cached)) {
      return cached!.data;
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
  async clearCache(id: number): Promise<void> {
    this._cacheById.delete(id);
  }

  /**
   * Clear all cache
   */
  async clearAllCache(): Promise<void> {
    this._cacheById.clear();
  }

  /**
   * Warm up cache with all active offers
   */
  async warmupCache(): Promise<void> {
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
  getCacheStats(): {
    offersCached: number;
  } {
    return {
      offersCached: this._cacheById.size
    };
  }
}
