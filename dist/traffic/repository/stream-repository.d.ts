/**
 * Stream Repository
 *
 * Repository for BaseStream entity database operations.
 *
 * @see keitaro_source/application/Traffic/Repository/StreamRepository.php
 */
import { BaseRepository, type RepositoryEntityDefinition } from '../../core/repository/base-repository.js';
import type { FindOptions } from '../../core/repository/repository-interface.js';
import { BaseStream } from '../model/base-stream.js';
import { EntityState } from '../../core/entity/state.js';
/**
 * Stream-specific find options
 */
export interface StreamFindOptions extends FindOptions {
    campaignId?: number;
    groupId?: number;
    streamType?: string;
    state?: EntityState;
}
/**
 * Stream Repository implementation
 */
export declare class StreamRepository extends BaseRepository<BaseStream> {
    /**
     * Get entity definition
     */
    getDefinition(): RepositoryEntityDefinition;
    /**
     * Find streams by campaign
     */
    findByCampaignId(campaignId: number, options?: FindOptions): Promise<BaseStream[]>;
    /**
     * Find active streams by campaign
     */
    findActiveByCampaignId(campaignId: number, options?: FindOptions): Promise<BaseStream[]>;
    /**
     * Find streams by group
     */
    findByGroupId(groupId: number, options?: FindOptions): Promise<BaseStream[]>;
    /**
     * Find streams by type
     */
    findByType(streamType: string, options?: FindOptions): Promise<BaseStream[]>;
    /**
     * Find all active streams with optional filtering
     */
    findAllActiveStreams(options?: StreamFindOptions): Promise<BaseStream[]>;
    /**
     * Get stream position for ordering within a campaign
     */
    getNextPosition(campaignId: number): Promise<number>;
    /**
     * Update stream position
     */
    updatePosition(id: number, position: number): Promise<BaseStream>;
    /**
     * Find streams with landings and offers schema
     */
    findLandingsOffersStreams(campaignId: number): Promise<BaseStream[]>;
    /**
     * Find streams with offers only schema
     */
    findOffersStreams(campaignId: number): Promise<BaseStream[]>;
    /**
     * Count active streams for campaign
     */
    countActiveByCampaign(campaignId: number): Promise<number>;
}
//# sourceMappingURL=stream-repository.d.ts.map