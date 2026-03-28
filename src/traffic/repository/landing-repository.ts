/**
 * Landing Repository
 * 
 * Repository for Landing entity database operations.
 * 
 * @see keitaro_source/application/Traffic/Repository/LandingRepository.php
 */

import { BaseRepository, type RepositoryEntityDefinition } from '../../core/repository/base-repository';
import type { FindOptions } from '../../core/repository/repository-interface';
import { Landing } from '../model/landing';
import { EntityState } from '../../core/entity/state';

/**
 * Landing-specific find options
 */
export interface LandingFindOptions extends FindOptions {
  groupId?: number;
  landingType?: string;
  state?: EntityState;
}

/**
 * Landing Repository implementation
 */
export class LandingRepository extends BaseRepository<Landing> {
  /**
   * Get entity definition
   */
  getDefinition(): RepositoryEntityDefinition {
    return {
      tableName: 'landings',
      entityName: 'landing',
      fields: new Map([
        ['id', { name: 'id', type: 'number', readonly: true }],
        ['name', { name: 'name', type: 'string' }],
        ['url', { name: 'url', type: 'string', nullable: true }],
        ['group_id', { name: 'group_id', type: 'number', nullable: true }],
        ['landing_type', { name: 'landing_type', type: 'string', default: 'external' }],
        ['state', { name: 'state', type: 'string', default: 'active' }],
        ['action_type', { name: 'action_type', type: 'string', nullable: true }],
        ['action_payload', { name: 'action_payload', type: 'string', nullable: true }],
        ['action_options', { name: 'action_options', type: 'json', nullable: true }],
        ['offer_count', { name: 'offer_count', type: 'number', default: 1 }],
        ['notes', { name: 'notes', type: 'string', nullable: true }],
        ['created_at', { name: 'created_at', type: 'date' }],
        ['updated_at', { name: 'updated_at', type: 'date' }]
      ]),
      modelClass: Landing
    };
  }

  /**
   * Find landings by group
   */
  async findByGroupId(groupId: number, options?: FindOptions): Promise<Landing[]> {
    return this.findAll({
      ...options,
      where: { ...options?.where, group_id: groupId }
    });
  }

  /**
   * Find landings by type
   */
  async findByType(landingType: string, options?: FindOptions): Promise<Landing[]> {
    return this.findAll({
      ...options,
      where: { ...options?.where, landing_type: landingType }
    });
  }

  /**
   * Find all active landings with optional filtering
   */
  async findAllActiveLandings(options?: LandingFindOptions): Promise<Landing[]> {
    const where: Record<string, unknown> = { state: EntityState.ACTIVE };
    
    if (options?.groupId) {
      where.group_id = options.groupId;
    }
    if (options?.landingType) {
      where.landing_type = options.landingType;
    }

    return this.findAll({
      ...options,
      where
    });
  }

  /**
   * Find external landings
   */
  async findExternalLandings(options?: FindOptions): Promise<Landing[]> {
    return this.findByType('external', options);
  }

  /**
   * Find local landings
   */
  async findLocalLandings(options?: FindOptions): Promise<Landing[]> {
    return this.findByType('local', options);
  }

  /**
   * Get landing URLs as a map
   */
  async getLandingUrls(): Promise<Map<number, string>> {
    const landings = await this.findAllActive();
    const urlMap = new Map<number, string>();
    
    for (const landing of landings) {
      const id = landing.getId();
      const url = landing.getUrl();
      if (id && url) {
        urlMap.set(id, url);
      }
    }
    
    return urlMap;
  }
}
