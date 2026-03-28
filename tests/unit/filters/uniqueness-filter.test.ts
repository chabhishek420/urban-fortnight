/**
 * Tests for Uniqueness Filter
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { 
  UniquenessFilter, 
  setUniquenessService, 
  getUniquenessService,
  UniquenessScope,
  type UniquenessService 
} from '@/traffic/filter/uniqueness-filter.js';
import { StreamFilter, FilterMode } from '@/traffic/filter/stream-filter.js';
import { RawClick } from '@/traffic/model/raw-click.js';

describe('UniquenessFilter', () => {
  let filter: UniquenessFilter;
  let isUniqueForStreamValue = true;
  let isUniqueForCampaignValue = true;
  let isUniqueGlobalValue = true;
  let streamUniquenessCalls: Array<[unknown, RawClick, number, number]> = [];

  const mockUniquenessService: UniquenessService = {
    isUniqueStream: (request: unknown, rawClick: RawClick, campaignId: number, streamId: number) => {
      streamUniquenessCalls.push([request, rawClick, campaignId, streamId]);
      return isUniqueForStreamValue;
    },
    isUniqueForCampaign: () => isUniqueForCampaignValue,
    isUniqueGlobal: () => isUniqueGlobalValue
  };

  beforeEach(() => {
    filter = new UniquenessFilter();
    isUniqueForStreamValue = true;
    isUniqueForCampaignValue = true;
    isUniqueGlobalValue = true;
    streamUniquenessCalls = [];
    setUniquenessService(mockUniquenessService);
  });

  afterEach(() => {
    setUniquenessService(null as unknown as UniquenessService);
  });

  describe('filter metadata', () => {
    it('should have correct key', () => {
      expect(filter.getKey()).toBe('uniqueness');
    });

    it('should have correct group', () => {
      expect(filter.getGroup()).toBe('filters.groups.device');
    });

    it('should have default scope', () => {
      expect(filter.getDefaults()).toBe('stream');
    });
  });

  describe('stream scope', () => {
    it('should pass unique visitor for stream', () => {
      isUniqueForStreamValue = true;
      
      const rawClick = {
        getDatetime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        mode: FilterMode.ACCEPT,
        payload: UniquenessScope.STREAM
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should reject non-unique visitor for stream', () => {
      isUniqueForStreamValue = false;
      
      const rawClick = {
        getDatetime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        mode: FilterMode.ACCEPT,
        payload: UniquenessScope.STREAM
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('campaign scope', () => {
    it('should pass unique visitor for campaign', () => {
      const rawClick = {
        getDatetime: () => new Date(),
        isUniqueCampaign: () => true,
      } as unknown as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        mode: FilterMode.ACCEPT,
        payload: UniquenessScope.CAMPAIGN
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should reject non-unique visitor for campaign', () => {
      const rawClick = {
        getDatetime: () => new Date(),
        isUniqueCampaign: () => false,
      } as unknown as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        mode: FilterMode.ACCEPT,
        payload: UniquenessScope.CAMPAIGN
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('global scope', () => {
    it('should pass globally unique visitor', () => {
      const rawClick = {
        getDatetime: () => new Date(),
        isUniqueGlobal: () => true,
      } as unknown as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        mode: FilterMode.ACCEPT,
        payload: UniquenessScope.GLOBAL
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should reject globally non-unique visitor', () => {
      const rawClick = {
        getDatetime: () => new Date(),
        isUniqueGlobal: () => false,
      } as unknown as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        mode: FilterMode.ACCEPT,
        payload: UniquenessScope.GLOBAL
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('reject mode', () => {
    it('should reject unique visitor in reject mode', () => {
      const rawClick = {
        getDatetime: () => new Date(),
        isUniqueCampaign: () => true,
      } as unknown as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        mode: FilterMode.REJECT,
        payload: UniquenessScope.CAMPAIGN
      });

      // REJECT mode: reject if unique, pass if not unique
      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should pass non-unique visitor in reject mode', () => {
      const rawClick = {
        getDatetime: () => new Date(),
        isUniqueCampaign: () => false,
      } as unknown as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        mode: FilterMode.REJECT,
        payload: UniquenessScope.CAMPAIGN
      });

      // REJECT mode: reject if unique, pass if not unique
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('default scope', () => {
    it('should use stream scope when no payload', () => {
      isUniqueForStreamValue = true;
      
      const rawClick = {
        getDatetime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        mode: FilterMode.ACCEPT,
        payload: null
      });

      // Should use default 'stream' scope and pass
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should reject unknown scope in ACCEPT mode', () => {
      const rawClick = {
        getDatetime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        mode: FilterMode.ACCEPT,
        payload: 'unknown_scope'
      });

      // Unknown scope should return false in ACCEPT mode
      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should pass unknown scope in REJECT mode', () => {
      const rawClick = {
        getDatetime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        mode: FilterMode.REJECT,
        payload: 'unknown_scope'
      });

      // Unknown scope should return true in REJECT mode
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });
});

describe('UniquenessService', () => {
  it('should set and get service', () => {
    const service: UniquenessService = {
      isUniqueForStream: () => true,
      isUniqueForCampaign: () => true,
      isUniqueGlobal: () => true
    };

    setUniquenessService(service);
    expect(getUniquenessService()).toBe(service);
  });
});
