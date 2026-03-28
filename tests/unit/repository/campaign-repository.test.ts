/**
 * Tests for CampaignRepository
 * 
 * Tests campaign database operations
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { CampaignRepository, CampaignFindOptions } from '../../../src/traffic/repository/campaign-repository.js';
import { Campaign } from '../../../src/traffic/model/campaign.js';
import { EntityState } from '../../../src/core/entity/state.js';

describe('CampaignRepository', () => {
  let repository: CampaignRepository;

  beforeEach(() => {
    repository = new CampaignRepository();
  });

  describe('getDefinition', () => {
    it('should return correct table name', () => {
      const definition = repository.getDefinition();
      
      expect(definition.tableName).toBe('campaigns');
    });

    it('should return correct entity name', () => {
      const definition = repository.getDefinition();
      
      expect(definition.entityName).toBe('campaign');
    });

    it('should return correct model class', () => {
      const definition = repository.getDefinition();
      
      expect(definition.modelClass).toBe(Campaign);
    });

    it('should have id field defined', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('id')).toBe(true);
      expect(definition.fields.get('id')?.type).toBe('number');
      expect(definition.fields.get('id')?.readonly).toBe(true);
    });

    it('should have name field defined', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('name')).toBe(true);
      expect(definition.fields.get('name')?.type).toBe('string');
    });

    it('should have alias field as nullable', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('alias')).toBe(true);
      expect(definition.fields.get('alias')?.nullable).toBe(true);
    });

    it('should have token field as nullable', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('token')).toBe(true);
      expect(definition.fields.get('token')?.nullable).toBe(true);
    });

    it('should have type field with default', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('type')).toBe(true);
      expect(definition.fields.get('type')?.default).toBe('position');
    });

    it('should have mode field with default', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('mode')).toBe(true);
      expect(definition.fields.get('mode')?.default).toBe('general');
    });

    it('should have state field with default', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('state')).toBe(true);
      expect(definition.fields.get('state')?.default).toBe('active');
    });

    it('should have position field with default', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('position')).toBe(true);
      expect(definition.fields.get('position')?.default).toBe(0);
    });

    it('should have cookies_ttl field with default', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('cookies_ttl')).toBe(true);
      expect(definition.fields.get('cookies_ttl')?.default).toBe(24);
    });

    it('should have uniqueness_method field with default', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('uniqueness_method')).toBe(true);
      expect(definition.fields.get('uniqueness_method')?.default).toBe('ip_ua');
    });

    it('should have action_type field as nullable', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('action_type')).toBe(true);
      expect(definition.fields.get('action_type')?.nullable).toBe(true);
    });

    it('should have action_payload field as nullable', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('action_payload')).toBe(true);
      expect(definition.fields.get('action_payload')?.nullable).toBe(true);
    });

    it('should have cost_type field with default', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('cost_type')).toBe(true);
      expect(definition.fields.get('cost_type')?.default).toBe('CPV');
    });

    it('should have cost_value field with default', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('cost_value')).toBe(true);
      expect(definition.fields.get('cost_value')?.default).toBe(0);
    });

    it('should have traffic_source_id field as nullable', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('traffic_source_id')).toBe(true);
      expect(definition.fields.get('traffic_source_id')?.nullable).toBe(true);
    });

    it('should have domain_id field as nullable', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('domain_id')).toBe(true);
      expect(definition.fields.get('domain_id')?.nullable).toBe(true);
    });

    it('should have parameters field as json type', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('parameters')).toBe(true);
      expect(definition.fields.get('parameters')?.type).toBe('json');
    });

    it('should have traffic_loss field with default', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('traffic_loss')).toBe(true);
      expect(definition.fields.get('traffic_loss')?.default).toBe(0);
    });
  });

  describe('query methods', () => {
    it('should have findByToken method', () => {
      expect(typeof repository.findByToken).toBe('function');
    });

    it('should have findByAlias method', () => {
      expect(typeof repository.findByAlias).toBe('function');
    });

    it('should have findActiveByToken method', () => {
      expect(typeof repository.findActiveByToken).toBe('function');
    });

    it('should have findActiveByAlias method', () => {
      expect(typeof repository.findActiveByAlias).toBe('function');
    });

    it('should have findByTrafficSourceId method', () => {
      expect(typeof repository.findByTrafficSourceId).toBe('function');
    });

    it('should have findByDomainId method', () => {
      expect(typeof repository.findByDomainId).toBe('function');
    });

    it('should have findByGroupId method', () => {
      expect(typeof repository.findByGroupId).toBe('function');
    });

    it('should have findAllActiveCampaigns method', () => {
      expect(typeof repository.findAllActiveCampaigns).toBe('function');
    });

    it('should have getNextPosition method', () => {
      expect(typeof repository.getNextPosition).toBe('function');
    });

    it('should have updatePosition method', () => {
      expect(typeof repository.updatePosition).toBe('function');
    });
  });

  describe('CampaignFindOptions', () => {
    it('should allow trafficSourceId option', () => {
      const options: CampaignFindOptions = { trafficSourceId: 1 };
      expect(options.trafficSourceId).toBe(1);
    });

    it('should allow domainId option', () => {
      const options: CampaignFindOptions = { domainId: 5 };
      expect(options.domainId).toBe(5);
    });

    it('should allow groupId option', () => {
      const options: CampaignFindOptions = { groupId: 10 };
      expect(options.groupId).toBe(10);
    });

    it('should allow state option', () => {
      const options: CampaignFindOptions = { state: EntityState.ACTIVE };
      expect(options.state).toBe(EntityState.ACTIVE);
    });

    it('should allow multiple options', () => {
      const options: CampaignFindOptions = {
        trafficSourceId: 1,
        domainId: 2,
        groupId: 3,
        state: EntityState.ACTIVE
      };
      
      expect(options.trafficSourceId).toBe(1);
      expect(options.domainId).toBe(2);
      expect(options.groupId).toBe(3);
      expect(options.state).toBe(EntityState.ACTIVE);
    });
  });

  describe('field count', () => {
    it('should have all expected fields', () => {
      const definition = repository.getDefinition();
      const fieldCount = definition.fields.size;
      
      // Should have at least 20 fields for campaigns
      expect(fieldCount).toBeGreaterThanOrEqual(20);
    });
  });
});
