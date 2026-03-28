/**
 * Tests for Limit Filter
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { LimitFilter, setHitLimitService, getHitLimitService, type HitLimitService } from '@/traffic/filter/limit-filter.js';
import { StreamFilter } from '@/traffic/filter/stream-filter.js';
import { RawClick } from '@/traffic/model/raw-click.js';

describe('LimitFilter', () => {
  let filter: LimitFilter;
  let perHourValue = 0;
  let perDayValue = 0;
  let totalValue = 0;
  let perHourCalls: Array<[number, Date]> = [];
  let perDayCalls: Array<[number, Date]> = [];
  let totalCalls: Array<[number]> = [];

  const mockHitLimitService: HitLimitService = {
    perHour: (streamId: number, date: Date) => {
      perHourCalls.push([streamId, date]);
      return perHourValue;
    },
    perDay: (streamId: number, date: Date) => {
      perDayCalls.push([streamId, date]);
      return perDayValue;
    },
    total: (streamId: number) => {
      totalCalls.push([streamId]);
      return totalValue;
    }
  };

  beforeEach(() => {
    filter = new LimitFilter();
    perHourValue = 0;
    perDayValue = 0;
    totalValue = 0;
    perHourCalls = [];
    perDayCalls = [];
    totalCalls = [];
    setHitLimitService(mockHitLimitService);
  });

  afterEach(() => {
    setHitLimitService(null as unknown as HitLimitService);
  });

  describe('filter metadata', () => {
    it('should have correct key', () => {
      expect(filter.getKey()).toBe('limit');
    });

    it('should have correct group', () => {
      expect(filter.getGroup()).toBe('filters.groups.limits');
    });
  });

  describe('per-hour limit', () => {
    it('should pass when under per-hour limit', () => {
      perHourValue = 50;
      
      const rawClick = {
        getDatetime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        payload: { per_hour: 100 }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
      expect(perHourCalls.length).toBe(1);
    });

    it('should reject when at per-hour limit', () => {
      perHourValue = 100;
      
      const rawClick = {
        getDatetime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        payload: { per_hour: 100 }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should reject when over per-hour limit', () => {
      perHourValue = 150;
      
      const rawClick = {
        getDatetime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        payload: { per_hour: 100 }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('per-day limit', () => {
    it('should pass when under per-day limit', () => {
      perDayValue = 500;
      
      const rawClick = {
        getDatetime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        payload: { per_day: 1000 }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should reject when at per-day limit', () => {
      perDayValue = 1000;
      
      const rawClick = {
        getDatetime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        payload: { per_day: 1000 }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('total limit', () => {
    it('should pass when under total limit', () => {
      totalValue = 5000;
      
      const rawClick = {
        getDatetime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        payload: { total: 10000 }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should reject when at total limit', () => {
      totalValue = 10000;
      
      const rawClick = {
        getDatetime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        payload: { total: 10000 }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('combined limits', () => {
    it('should check limits in order (hour, day, total)', () => {
      perHourValue = 100;
      perDayValue = 0;
      totalValue = 0;
      
      const rawClick = {
        getDatetime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        payload: { per_hour: 100, per_day: 1000, total: 10000 }
      });

      // Should fail on per-hour limit and not check others
      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
      expect(perHourCalls.length).toBe(1);
      expect(perDayCalls.length).toBe(0);
      expect(totalCalls.length).toBe(0);
    });

    it('should pass all limits when under all', () => {
      perHourValue = 50;
      perDayValue = 500;
      totalValue = 5000;
      
      const rawClick = {
        getDatetime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        payload: { per_hour: 100, per_day: 1000, total: 10000 }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
      expect(perHourCalls.length).toBe(1);
      expect(perDayCalls.length).toBe(1);
      expect(totalCalls.length).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should pass when null payload', () => {
      const rawClick = {
        getDatetime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        payload: null
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should reject when all limits are empty/zero', () => {
      const rawClick = {
        getDatetime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        payload: { per_hour: 0, per_day: 0, total: 0 }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should pass when limit is undefined', () => {
      totalValue = 50;
      
      const rawClick = {
        getDatetime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        payload: { total: 100 }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should allow when no hit limit service configured', () => {
      setHitLimitService(null as unknown as HitLimitService);
      
      const rawClick = {
        getDatetime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        streamId: 1,
        payload: { per_hour: 100 }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });
});

describe('HitLimitService', () => {
  it('should set and get service', () => {
    const service: HitLimitService = {
      perHour: () => 0,
      perDay: () => 0,
      total: () => 0
    };

    setHitLimitService(service);
    expect(getHitLimitService()).toBe(service);
  });
});
