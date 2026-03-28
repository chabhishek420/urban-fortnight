/**
 * Tests for OfferRepository
 * 
 * Tests offer database operations
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { OfferRepository, OfferFindOptions } from '../../../src/traffic/repository/offer-repository.js';
import { Offer } from '../../../src/traffic/model/offer.js';
import { EntityState } from '../../../src/core/entity/state.js';

describe('OfferRepository', () => {
  let repository: OfferRepository;

  beforeEach(() => {
    repository = new OfferRepository();
  });

  describe('getDefinition', () => {
    it('should return correct table name', () => {
      const definition = repository.getDefinition();
      
      expect(definition.tableName).toBe('offers');
    });

    it('should return correct entity name', () => {
      const definition = repository.getDefinition();
      
      expect(definition.entityName).toBe('offer');
    });

    it('should return correct model class', () => {
      const definition = repository.getDefinition();
      
      expect(definition.modelClass).toBe(Offer);
    });

    it('should have id field defined', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('id')).toBe(true);
      expect(definition.fields.get('id')?.type).toBe('number');
      expect(definition.fields.get('id')?.readonly).toBe(true);
    });

    it('should have url field defined', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('url')).toBe(true);
      expect(definition.fields.get('url')?.type).toBe('string');
      expect(definition.fields.get('url')?.nullable).toBe(true);
    });

    it('should have name field defined', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('name')).toBe(true);
      expect(definition.fields.get('name')?.type).toBe('string');
    });

    it('should have group_id field as nullable', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('group_id')).toBe(true);
      expect(definition.fields.get('group_id')?.nullable).toBe(true);
    });

    it('should have affiliate_network_id field as nullable', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('affiliate_network_id')).toBe(true);
      expect(definition.fields.get('affiliate_network_id')?.nullable).toBe(true);
    });

    it('should have offer_type field with default', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('offer_type')).toBe(true);
      expect(definition.fields.get('offer_type')?.default).toBe('external');
    });

    it('should have state field with default', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('state')).toBe(true);
      expect(definition.fields.get('state')?.default).toBe('active');
    });

    it('should have action_type field as nullable', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('action_type')).toBe(true);
      expect(definition.fields.get('action_type')?.nullable).toBe(true);
    });

    it('should have action_options field as json type', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('action_options')).toBe(true);
      expect(definition.fields.get('action_options')?.type).toBe('json');
    });

    it('should have payout_value field with default', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('payout_value')).toBe(true);
      expect(definition.fields.get('payout_value')?.default).toBe(0);
    });

    it('should have payout_auto field as boolean', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('payout_auto')).toBe(true);
      expect(definition.fields.get('payout_auto')?.type).toBe('boolean');
    });

    it('should have country field as nullable', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('country')).toBe(true);
      expect(definition.fields.get('country')?.nullable).toBe(true);
    });

    it('should have conversion_cap_enabled field as boolean', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('conversion_cap_enabled')).toBe(true);
      expect(definition.fields.get('conversion_cap_enabled')?.type).toBe('boolean');
    });

    it('should have daily_cap field with default', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('daily_cap')).toBe(true);
      expect(definition.fields.get('daily_cap')?.default).toBe(0);
    });

    it('should have alternative_offer_id field as nullable', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('alternative_offer_id')).toBe(true);
      expect(definition.fields.get('alternative_offer_id')?.nullable).toBe(true);
    });
  });

  describe('query methods', () => {
    it('should have findByGroupId method', () => {
      expect(typeof repository.findByGroupId).toBe('function');
    });

    it('should have findByAffiliateNetworkId method', () => {
      expect(typeof repository.findByAffiliateNetworkId).toBe('function');
    });

    it('should have findByCountry method', () => {
      expect(typeof repository.findByCountry).toBe('function');
    });

    it('should have findAllActiveOffers method', () => {
      expect(typeof repository.findAllActiveOffers).toBe('function');
    });

    it('should have findAlternativeOffer method', () => {
      expect(typeof repository.findAlternativeOffer).toBe('function');
    });

    it('should have findOffersAtDailyCap method', () => {
      expect(typeof repository.findOffersAtDailyCap).toBe('function');
    });
  });

  describe('OfferFindOptions', () => {
    it('should allow groupId option', () => {
      const options: OfferFindOptions = { groupId: 1 };
      expect(options.groupId).toBe(1);
    });

    it('should allow affiliateNetworkId option', () => {
      const options: OfferFindOptions = { affiliateNetworkId: 5 };
      expect(options.affiliateNetworkId).toBe(5);
    });

    it('should allow country option', () => {
      const options: OfferFindOptions = { country: 'US' };
      expect(options.country).toBe('US');
    });

    it('should allow state option', () => {
      const options: OfferFindOptions = { state: EntityState.ACTIVE };
      expect(options.state).toBe(EntityState.ACTIVE);
    });

    it('should allow multiple options', () => {
      const options: OfferFindOptions = {
        groupId: 1,
        affiliateNetworkId: 2,
        country: 'US',
        state: EntityState.ACTIVE
      };
      
      expect(options.groupId).toBe(1);
      expect(options.affiliateNetworkId).toBe(2);
      expect(options.country).toBe('US');
      expect(options.state).toBe(EntityState.ACTIVE);
    });
  });

  describe('field count', () => {
    it('should have all expected fields', () => {
      const definition = repository.getDefinition();
      const fieldCount = definition.fields.size;
      
      // Should have at least 20 fields for offers
      expect(fieldCount).toBeGreaterThanOrEqual(20);
    });
  });
});
