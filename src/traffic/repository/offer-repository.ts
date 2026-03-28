/**
 * Offer Repository
 * 
 * Repository for Offer entity database operations.
 * 
 * @see keitaro_source/application/Traffic/Repository/OfferRepository.php
 */

import { BaseRepository, type RepositoryEntityDefinition } from '../../core/repository/base-repository';
import type { FindOptions } from '../../core/repository/repository-interface';
import { Offer } from '../model/offer';
import { EntityState } from '../../core/entity/state';

/**
 * Offer-specific find options
 */
export interface OfferFindOptions extends FindOptions {
  groupId?: number;
  affiliateNetworkId?: number;
  country?: string;
  state?: EntityState;
}

/**
 * Offer Repository implementation
 */
export class OfferRepository extends BaseRepository<Offer> {
  /**
   * Get entity definition
   */
  getDefinition(): RepositoryEntityDefinition {
    return {
      tableName: 'offers',
      entityName: 'offer',
      fields: new Map([
        ['id', { name: 'id', type: 'number', readonly: true }],
        ['name', { name: 'name', type: 'string' }],
        ['url', { name: 'url', type: 'string', nullable: true }],
        ['group_id', { name: 'group_id', type: 'number', nullable: true }],
        ['affiliate_network_id', { name: 'affiliate_network_id', type: 'number', nullable: true }],
        ['offer_type', { name: 'offer_type', type: 'string', default: 'external' }],
        ['state', { name: 'state', type: 'string', default: 'active' }],
        ['action_type', { name: 'action_type', type: 'string', nullable: true }],
        ['action_payload', { name: 'action_payload', type: 'string', nullable: true }],
        ['action_options', { name: 'action_options', type: 'json', nullable: true }],
        ['payout_value', { name: 'payout_value', type: 'decimal', default: 0 }],
        ['payout_currency', { name: 'payout_currency', type: 'string', nullable: true }],
        ['payout_type', { name: 'payout_type', type: 'string', nullable: true }],
        ['payout_auto', { name: 'payout_auto', type: 'boolean', default: false }],
        ['payout_upsell', { name: 'payout_upsell', type: 'boolean', default: false }],
        ['country', { name: 'country', type: 'string', nullable: true }],
        ['conversion_cap_enabled', { name: 'conversion_cap_enabled', type: 'boolean', default: false }],
        ['daily_cap', { name: 'daily_cap', type: 'number', default: 0 }],
        ['conversion_timezone', { name: 'conversion_timezone', type: 'string', default: 'UTC' }],
        ['alternative_offer_id', { name: 'alternative_offer_id', type: 'number', nullable: true }],
        ['notes', { name: 'notes', type: 'string', nullable: true }],
        ['created_at', { name: 'created_at', type: 'date' }],
        ['updated_at', { name: 'updated_at', type: 'date' }]
      ]),
      modelClass: Offer
    };
  }

  /**
   * Find offers by group
   */
  async findByGroupId(groupId: number, options?: FindOptions): Promise<Offer[]> {
    return this.findAll({
      ...options,
      where: { ...options?.where, group_id: groupId }
    });
  }

  /**
   * Find offers by affiliate network
   */
  async findByAffiliateNetworkId(affiliateNetworkId: number, options?: FindOptions): Promise<Offer[]> {
    return this.findAll({
      ...options,
      where: { ...options?.where, affiliate_network_id: affiliateNetworkId }
    });
  }

  /**
   * Find offers by country
   */
  async findByCountry(country: string, options?: FindOptions): Promise<Offer[]> {
    return this.findAll({
      ...options,
      where: { ...options?.where, country }
    });
  }

  /**
   * Find all active offers with optional filtering
   */
  async findAllActiveOffers(options?: OfferFindOptions): Promise<Offer[]> {
    const where: Record<string, unknown> = { state: EntityState.ACTIVE };
    
    if (options?.groupId) {
      where.group_id = options.groupId;
    }
    if (options?.affiliateNetworkId) {
      where.affiliate_network_id = options.affiliateNetworkId;
    }
    if (options?.country) {
      where.country = options.country;
    }

    return this.findAll({
      ...options,
      where
    });
  }

  /**
   * Find alternative offer for a given offer
   */
  async findAlternativeOffer(offerId: number): Promise<Offer | null> {
    const offer = await this.find(offerId);
    if (!offer) return null;
    
    const alternativeId = offer.getAlternativeOfferId();
    if (!alternativeId) return null;
    
    return this.findActive(alternativeId);
  }

  /**
   * Find offers that have reached daily conversion cap
   */
  async findOffersAtDailyCap(): Promise<Offer[]> {
    // This would typically join with conversion data
    // For now, return offers with conversion cap enabled
    return this.findAll({
      where: { 
        conversion_cap_enabled: true,
        state: EntityState.ACTIVE 
      }
    });
  }
}
