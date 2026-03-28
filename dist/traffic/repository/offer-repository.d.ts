/**
 * Offer Repository
 *
 * Repository for Offer entity database operations.
 *
 * @see keitaro_source/application/Traffic/Repository/OfferRepository.php
 */
import { BaseRepository, type RepositoryEntityDefinition } from '../../core/repository/base-repository.js';
import type { FindOptions } from '../../core/repository/repository-interface.js';
import { Offer } from '../model/offer.js';
import { EntityState } from '../../core/entity/state.js';
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
export declare class OfferRepository extends BaseRepository<Offer> {
    /**
     * Get entity definition
     */
    getDefinition(): RepositoryEntityDefinition;
    /**
     * Find offers by group
     */
    findByGroupId(groupId: number, options?: FindOptions): Promise<Offer[]>;
    /**
     * Find offers by affiliate network
     */
    findByAffiliateNetworkId(affiliateNetworkId: number, options?: FindOptions): Promise<Offer[]>;
    /**
     * Find offers by country
     */
    findByCountry(country: string, options?: FindOptions): Promise<Offer[]>;
    /**
     * Find all active offers with optional filtering
     */
    findAllActiveOffers(options?: OfferFindOptions): Promise<Offer[]>;
    /**
     * Find alternative offer for a given offer
     */
    findAlternativeOffer(offerId: number): Promise<Offer | null>;
    /**
     * Find offers that have reached daily conversion cap
     */
    findOffersAtDailyCap(): Promise<Offer[]>;
}
//# sourceMappingURL=offer-repository.d.ts.map