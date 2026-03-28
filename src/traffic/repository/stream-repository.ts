/**
 * Stream Repository
 * 
 * Repository for BaseStream entity database operations.
 * 
 * @see keitaro_source/application/Traffic/Repository/StreamRepository.php
 */

import { BaseRepository, type RepositoryEntityDefinition } from '../../core/repository/base-repository';
import type { FindOptions } from '../../core/repository/repository-interface';
import { BaseStream } from '../model/base-stream';
import { EntityState } from '../../core/entity/state';

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
export class StreamRepository extends BaseRepository<BaseStream> {
  /**
   * Get entity definition
   */
  getDefinition(): RepositoryEntityDefinition {
    return {
      tableName: 'streams',
      entityName: 'stream',
      fields: new Map([
        ['id', { name: 'id', type: 'number', readonly: true }],
        ['name', { name: 'name', type: 'string' }],
        ['campaign_id', { name: 'campaign_id', type: 'number', nullable: true }],
        ['group_id', { name: 'group_id', type: 'number', nullable: true }],
        ['type', { name: 'type', type: 'string', default: 'regular' }],
        ['schema', { name: 'schema', type: 'string', nullable: true }],
        ['state', { name: 'state', type: 'string', default: 'active' }],
        ['position', { name: 'position', type: 'number', default: 1 }],
        ['weight', { name: 'weight', type: 'number', default: 0 }],
        ['chance', { name: 'chance', type: 'number', default: 0 }],
        ['action_type', { name: 'action_type', type: 'string', nullable: true }],
        ['action_payload', { name: 'action_payload', type: 'string', nullable: true }],
        ['action_options', { name: 'action_options', type: 'json', nullable: true }],
        ['collect_clicks', { name: 'collect_clicks', type: 'boolean', default: false }],
        ['filter_or', { name: 'filter_or', type: 'boolean', default: false }],
        ['comments', { name: 'comments', type: 'string', nullable: true }],
        ['created_at', { name: 'created_at', type: 'date' }],
        ['updated_at', { name: 'updated_at', type: 'date' }]
      ]),
      modelClass: BaseStream
    };
  }

  /**
   * Find streams by campaign
   */
  async findByCampaignId(campaignId: number, options?: FindOptions): Promise<BaseStream[]> {
    return this.findAll({
      ...options,
      where: { ...options?.where, campaignId: campaignId }
    });
  }

  /**
   * Find active streams by campaign
   */
  async findActiveByCampaignId(campaignId: number, options?: FindOptions): Promise<BaseStream[]> {
    return this.findAll({
      ...options,
      where: { ...options?.where, campaignId: campaignId, state: EntityState.ACTIVE },
      orderBy: { position: 'asc' }
    });
  }

  /**
   * Find streams by group
   */
  async findByGroupId(groupId: number, options?: FindOptions): Promise<BaseStream[]> {
    return this.findAll({
      ...options,
      where: { ...options?.where, groupId: groupId }
    });
  }

  /**
   * Find streams by type
   */
  async findByType(streamType: string, options?: FindOptions): Promise<BaseStream[]> {
    return this.findAll({
      ...options,
      where: { ...options?.where, type: streamType }
    });
  }

  /**
   * Find all active streams with optional filtering
   */
  async findAllActiveStreams(options?: StreamFindOptions): Promise<BaseStream[]> {
    const where: Record<string, unknown> = { state: EntityState.ACTIVE };
    
    if (options?.campaignId) {
      where.campaignId = options.campaignId;
    }
    if (options?.groupId) {
      where.groupId = options.groupId;
    }
    if (options?.streamType) {
      where.type = options.streamType;
    }

    return this.findAll({
      ...options,
      where,
      orderBy: { position: 'asc' }
    });
  }

  /**
   * Get stream position for ordering within a campaign
   */
  async getNextPosition(campaignId: number): Promise<number> {
    const streams = await this.findAll({
      where: { campaignId: campaignId },
      orderBy: { position: 'desc' },
      limit: 1
    });
    return streams.length > 0 ? (streams[0]?.getPosition() ?? 0) + 1 : 1;
  }

  /**
   * Update stream position
   */
  async updatePosition(id: number, position: number): Promise<BaseStream> {
    return this.update(id, { position });
  }

  /**
   * Find streams with landings and offers schema
   */
  async findLandingsOffersStreams(campaignId: number): Promise<BaseStream[]> {
    return this.findActiveByCampaignId(campaignId, {
      where: { schema: 'landing_offer' }
    });
  }

  /**
   * Find streams with offers only schema
   */
  async findOffersStreams(campaignId: number): Promise<BaseStream[]> {
    return this.findActiveByCampaignId(campaignId, {
      where: { schema: 'offer' }
    });
  }

  /**
   * Count active streams for campaign
   */
  async countActiveByCampaign(campaignId: number): Promise<number> {
    return this.count({
      where: { campaignId: campaignId, state: EntityState.ACTIVE }
    });
  }
}
