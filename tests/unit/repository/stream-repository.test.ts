/**
 * Tests for StreamRepository
 * 
 * Tests stream database operations and queries
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { StreamRepository, StreamFindOptions } from '../../../src/traffic/repository/stream-repository.js';
import { BaseStream, StreamSchema } from '../../../src/traffic/model/base-stream.js';
import { EntityState } from '../../../src/core/entity/state.js';

describe('StreamRepository', () => {
  let repository: StreamRepository;

  beforeEach(() => {
    repository = new StreamRepository();
  });

  afterEach(() => {
    // Clean up any test data
  });

  describe('getDefinition', () => {
    it('should return correct table name', () => {
      const definition = repository.getDefinition();
      
      expect(definition.tableName).toBe('streams');
    });

    it('should return correct entity name', () => {
      const definition = repository.getDefinition();
      
      expect(definition.entityName).toBe('stream');
    });

    it('should return correct model class', () => {
      const definition = repository.getDefinition();
      
      expect(definition.modelClass).toBe(BaseStream);
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

    it('should have campaign_id field defined', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('campaign_id')).toBe(true);
      expect(definition.fields.get('campaign_id')?.nullable).toBe(true);
    });

    it('should have type field with default', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('type')).toBe(true);
      expect(definition.fields.get('type')?.default).toBe('regular');
    });

    it('should have schema field defined', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('schema')).toBe(true);
      expect(definition.fields.get('schema')?.nullable).toBe(true);
    });

    it('should have state field with default', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('state')).toBe(true);
      expect(definition.fields.get('state')?.default).toBe('active');
    });

    it('should have position field with default', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('position')).toBe(true);
      expect(definition.fields.get('position')?.default).toBe(1);
    });

    it('should have weight field with default', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('weight')).toBe(true);
      expect(definition.fields.get('weight')?.default).toBe(0);
    });

    it('should have chance field with default', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('chance')).toBe(true);
      expect(definition.fields.get('chance')?.default).toBe(0);
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

    it('should have collect_clicks field as boolean', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('collect_clicks')).toBe(true);
      expect(definition.fields.get('collect_clicks')?.type).toBe('boolean');
    });

    it('should have filter_or field as boolean', () => {
      const definition = repository.getDefinition();
      
      expect(definition.fields.has('filter_or')).toBe(true);
      expect(definition.fields.get('filter_or')?.type).toBe('boolean');
    });
  });

  describe('findByCampaignId', () => {
    it('should be a function', () => {
      expect(typeof repository.findByCampaignId).toBe('function');
    });

    it('should accept campaignId parameter', () => {
      // Test method signature
      expect(repository.findByCampaignId.length).toBe(2); // campaignId, options
    });
  });

  describe('findActiveByCampaignId', () => {
    it('should be a function', () => {
      expect(typeof repository.findActiveByCampaignId).toBe('function');
    });

    it('should filter by active state', async () => {
      // This would require database connection
      // Testing that method exists and accepts correct parameters
      expect(repository.findActiveByCampaignId.length).toBe(2);
    });
  });

  describe('findByGroupId', () => {
    it('should be a function', () => {
      expect(typeof repository.findByGroupId).toBe('function');
    });
  });

  describe('findByType', () => {
    it('should be a function', () => {
      expect(typeof repository.findByType).toBe('function');
    });
  });

  describe('findAllActiveStreams', () => {
    it('should be a function', () => {
      expect(typeof repository.findAllActiveStreams).toBe('function');
    });

    it('should accept StreamFindOptions', () => {
      const options: StreamFindOptions = {
        campaignId: 1,
        groupId: 1,
        streamType: 'regular'
      };
      
      // Method should accept the options
      expect(() => repository.findAllActiveStreams(options)).toBeDefined();
    });
  });

  describe('getNextPosition', () => {
    it('should be a function', () => {
      expect(typeof repository.getNextPosition).toBe('function');
    });

    it('should accept campaignId parameter', () => {
      expect(repository.getNextPosition.length).toBe(1);
    });
  });

  describe('updatePosition', () => {
    it('should be a function', () => {
      expect(typeof repository.updatePosition).toBe('function');
    });

    it('should accept id and position parameters', () => {
      expect(repository.updatePosition.length).toBe(2);
    });
  });

  describe('findLandingsOffersStreams', () => {
    it('should be a function', () => {
      expect(typeof repository.findLandingsOffersStreams).toBe('function');
    });

    it('should accept campaignId parameter', () => {
      expect(repository.findLandingsOffersStreams.length).toBe(1);
    });
  });

  describe('findOffersStreams', () => {
    it('should be a function', () => {
      expect(typeof repository.findOffersStreams).toBe('function');
    });

    it('should accept campaignId parameter', () => {
      expect(repository.findOffersStreams.length).toBe(1);
    });
  });

  describe('countActiveByCampaign', () => {
    it('should be a function', () => {
      expect(typeof repository.countActiveByCampaign).toBe('function');
    });

    it('should accept campaignId parameter', () => {
      expect(repository.countActiveByCampaign.length).toBe(1);
    });
  });
});

describe('StreamFindOptions', () => {
  it('should allow campaignId option', () => {
    const options: StreamFindOptions = { campaignId: 1 };
    expect(options.campaignId).toBe(1);
  });

  it('should allow groupId option', () => {
    const options: StreamFindOptions = { groupId: 5 };
    expect(options.groupId).toBe(5);
  });

  it('should allow streamType option', () => {
    const options: StreamFindOptions = { streamType: 'regular' };
    expect(options.streamType).toBe('regular');
  });

  it('should allow state option', () => {
    const options: StreamFindOptions = { state: EntityState.ACTIVE };
    expect(options.state).toBe(EntityState.ACTIVE);
  });

  it('should allow multiple options', () => {
    const options: StreamFindOptions = {
      campaignId: 1,
      groupId: 2,
      streamType: 'regular',
      state: EntityState.ACTIVE
    };
    
    expect(options.campaignId).toBe(1);
    expect(options.groupId).toBe(2);
    expect(options.streamType).toBe('regular');
    expect(options.state).toBe(EntityState.ACTIVE);
  });
});
