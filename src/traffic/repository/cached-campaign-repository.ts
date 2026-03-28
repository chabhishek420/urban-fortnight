/**
 * Cached Campaign Repository
 * 
 * Repository for Campaign entity with in-memory caching.
 * Provides fast lookups for frequently accessed campaigns.
 * 
 * @see keitaro_source/application/Traffic/Repository/CachedCampaignRepository.php
 */

import { Campaign } from '../model/campaign';
import { CampaignRepository } from './campaign-repository';
import { EntityState } from '../../core/entity/state';

/**
 * Cache entry structure
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Cached Campaign Repository implementation
 * 
 * @artifact ARTIFACT-002: PHP used CachedDataRepository for cache management,
 * we implement local memory caching for simplicity and performance
 */
// @ts-expect-error: getInstance override is intentional for cached repository singleton
export class CachedCampaignRepository extends CampaignRepository {
  private static _instance: CachedCampaignRepository | null = null;

  /**
   * In-memory cache for campaigns by ID
   */
  private _cacheById: Map<number, CacheEntry<Campaign>> = new Map();

  /**
   * Token to ID mapping cache
   */
  private _tokenToId: Map<string, number> = new Map();

  /**
   * Alias to ID mapping cache
   */
  private _aliasToId: Map<string, number> = new Map();

  /**
   * Cache TTL in milliseconds (5 minutes default)
   */
  private _cacheTtl: number = 5 * 60 * 1000;

  /**
   * Get singleton instance
   */
  static getInstance(): CachedCampaignRepository {
    if (!CachedCampaignRepository._instance) {
      CachedCampaignRepository._instance = new CachedCampaignRepository();
    }
    return CachedCampaignRepository._instance;
  }

  /**
   * Reset singleton and clear cache
   */
  static reset(): void {
    if (CachedCampaignRepository._instance) {
      CachedCampaignRepository._instance.clearAllCache();
    }
    CachedCampaignRepository._instance = null;
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
   * Find campaign from cache by ID
   */
  async findCached(id: number): Promise<Campaign | null> {
    const cached = this._cacheById.get(id);
    
    if (this.isCacheValid(cached)) {
      return cached!.data;
    }

    // Load from database and cache
    const campaign = await this.findActive(id);
    if (campaign) {
      this._cacheById.set(id, {
        data: campaign,
        timestamp: Date.now()
      });
    }
    
    return campaign;
  }

  /**
   * Find campaign by token (cached)
   */
  override async findByToken(token: string): Promise<Campaign | null> {
    // Check token cache first
    const cachedId = this._tokenToId.get(token);
    if (cachedId) {
      return this.findCached(cachedId);
    }

    // Load from database
    const campaign = await super.findByToken(token);
    if (campaign) {
      const id = campaign.getId();
      if (id) {
        this._tokenToId.set(token, id);
        this._cacheById.set(id, {
          data: campaign,
          timestamp: Date.now()
        });
      }
    }
    
    return campaign;
  }

  /**
   * Find campaign by alias (cached)
   */
  override async findByAlias(alias: string): Promise<Campaign | null> {
    // Check alias cache first
    const cachedId = this._aliasToId.get(alias);
    if (cachedId) {
      return this.findCached(cachedId);
    }

    // Load from database
    const campaign = await super.findByAlias(alias);
    if (campaign) {
      const id = campaign.getId();
      if (id) {
        this._aliasToId.set(alias, id);
        this._cacheById.set(id, {
          data: campaign,
          timestamp: Date.now()
        });
      }
    }
    
    return campaign;
  }

  /**
   * Find active campaign by token (cached)
   */
  override async findActiveByToken(token: string): Promise<Campaign | null> {
    const campaign = await this.findByToken(token);
    if (campaign && campaign.getState() === EntityState.ACTIVE) {
      return campaign;
    }
    return null;
  }

  /**
   * Find active campaign by alias (cached)
   */
  override async findActiveByAlias(alias: string): Promise<Campaign | null> {
    const campaign = await this.findByAlias(alias);
    if (campaign && campaign.getState() === EntityState.ACTIVE) {
      return campaign;
    }
    return null;
  }

  /**
   * Clear cache for specific campaign
   */
  async clearCache(id: number): Promise<void> {
    const campaign = this._cacheById.get(id)?.data;
    
    // Clear token mapping
    if (campaign) {
      const token = campaign.getToken();
      if (token) {
        this._tokenToId.delete(token);
      }
      const alias = campaign.getAlias();
      if (alias) {
        this._aliasToId.delete(alias);
      }
    }
    
    this._cacheById.delete(id);
  }

  /**
   * Clear all cache
   */
  async clearAllCache(): Promise<void> {
    this._cacheById.clear();
    this._tokenToId.clear();
    this._aliasToId.clear();
  }

  /**
   * Warm up cache with all active campaigns
   */
  async warmupCache(): Promise<void> {
    const campaigns = await this.findAllActive();
    
    for (const campaign of campaigns) {
      const id = campaign.getId();
      if (id) {
        this._cacheById.set(id, {
          data: campaign,
          timestamp: Date.now()
        });
        
        const token = campaign.getToken();
        if (token) {
          this._tokenToId.set(token, id);
        }
        
        const alias = campaign.getAlias();
        if (alias) {
          this._aliasToId.set(alias, id);
        }
      }
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    campaignsCached: number;
    tokensCached: number;
    aliasesCached: number;
  } {
    return {
      campaignsCached: this._cacheById.size,
      tokensCached: this._tokenToId.size,
      aliasesCached: this._aliasToId.size
    };
  }
}
