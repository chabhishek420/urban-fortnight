"use strict";
/**
 * Cached Campaign Repository
 *
 * Repository for Campaign entity with in-memory caching.
 * Provides fast lookups for frequently accessed campaigns.
 *
 * @see keitaro_source/application/Traffic/Repository/CachedCampaignRepository.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedCampaignRepository = void 0;
const campaign_repository_js_1 = require("./campaign-repository.js");
const state_js_1 = require("../../core/entity/state.js");
/**
 * Cached Campaign Repository implementation
 *
 * @artifact ARTIFACT-002: PHP used CachedDataRepository for cache management,
 * we implement local memory caching for simplicity and performance
 */
// @ts-expect-error: getInstance override is intentional for cached repository singleton
class CachedCampaignRepository extends campaign_repository_js_1.CampaignRepository {
    static _instance = null;
    /**
     * In-memory cache for campaigns by ID
     */
    _cacheById = new Map();
    /**
     * Token to ID mapping cache
     */
    _tokenToId = new Map();
    /**
     * Alias to ID mapping cache
     */
    _aliasToId = new Map();
    /**
     * Cache TTL in milliseconds (5 minutes default)
     */
    _cacheTtl = 5 * 60 * 1000;
    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!CachedCampaignRepository._instance) {
            CachedCampaignRepository._instance = new CachedCampaignRepository();
        }
        return CachedCampaignRepository._instance;
    }
    /**
     * Reset singleton and clear cache
     */
    static reset() {
        if (CachedCampaignRepository._instance) {
            CachedCampaignRepository._instance.clearAllCache();
        }
        CachedCampaignRepository._instance = null;
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
     * Find campaign from cache by ID
     */
    async findCached(id) {
        const cached = this._cacheById.get(id);
        if (this.isCacheValid(cached)) {
            return cached.data;
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
    async findByToken(token) {
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
    async findByAlias(alias) {
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
    async findActiveByToken(token) {
        const campaign = await this.findByToken(token);
        if (campaign && campaign.getState() === state_js_1.EntityState.ACTIVE) {
            return campaign;
        }
        return null;
    }
    /**
     * Find active campaign by alias (cached)
     */
    async findActiveByAlias(alias) {
        const campaign = await this.findByAlias(alias);
        if (campaign && campaign.getState() === state_js_1.EntityState.ACTIVE) {
            return campaign;
        }
        return null;
    }
    /**
     * Clear cache for specific campaign
     */
    async clearCache(id) {
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
    async clearAllCache() {
        this._cacheById.clear();
        this._tokenToId.clear();
        this._aliasToId.clear();
    }
    /**
     * Warm up cache with all active campaigns
     */
    async warmupCache() {
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
    getCacheStats() {
        return {
            campaignsCached: this._cacheById.size,
            tokensCached: this._tokenToId.size,
            aliasesCached: this._aliasToId.size
        };
    }
}
exports.CachedCampaignRepository = CachedCampaignRepository;
//# sourceMappingURL=cached-campaign-repository.js.map