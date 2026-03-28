/**
 * Campaign Repository
 *
 * Repository for Campaign entity database operations.
 *
 * @see keitaro_source/application/Traffic/Repository/CampaignRepository.php
 */
import { BaseRepository, type RepositoryEntityDefinition } from '../../core/repository/base-repository.js';
import type { FindOptions } from '../../core/repository/repository-interface.js';
import { Campaign } from '../model/campaign.js';
import { EntityState } from '../../core/entity/state.js';
/**
 * Campaign-specific find options
 */
export interface CampaignFindOptions extends FindOptions {
    trafficSourceId?: number;
    domainId?: number;
    groupId?: number;
    state?: EntityState;
}
/**
 * Campaign Repository implementation
 */
export declare class CampaignRepository extends BaseRepository<Campaign> {
    /**
     * Get entity definition
     */
    getDefinition(): RepositoryEntityDefinition;
    /**
     * Find campaign by token
     */
    findByToken(token: string): Promise<Campaign | null>;
    /**
     * Find campaign by alias
     */
    findByAlias(alias: string): Promise<Campaign | null>;
    /**
     * Find active campaign by token
     */
    findActiveByToken(token: string): Promise<Campaign | null>;
    /**
     * Find active campaign by alias
     */
    findActiveByAlias(alias: string): Promise<Campaign | null>;
    /**
     * Find campaigns by traffic source
     */
    findByTrafficSourceId(trafficSourceId: number, options?: FindOptions): Promise<Campaign[]>;
    /**
     * Find campaigns by domain
     */
    findByDomainId(domainId: number, options?: FindOptions): Promise<Campaign[]>;
    /**
     * Find campaigns by group
     */
    findByGroupId(groupId: number, options?: FindOptions): Promise<Campaign[]>;
    /**
     * Find all active campaigns with optional filtering
     */
    findAllActiveCampaigns(options?: CampaignFindOptions): Promise<Campaign[]>;
    /**
     * Get campaign position for ordering
     */
    getNextPosition(): Promise<number>;
    /**
     * Update campaign position
     */
    updatePosition(id: number, position: number): Promise<Campaign>;
}
//# sourceMappingURL=campaign-repository.d.ts.map