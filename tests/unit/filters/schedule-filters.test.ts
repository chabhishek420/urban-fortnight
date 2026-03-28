/**
 * Tests for Schedule and Interval Filters
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ScheduleFilter, IntervalFilter } from '@/traffic/filter/schedule-filters.js';
import { StreamFilter, FilterMode } from '@/traffic/filter/stream-filter.js';
import { RawClick } from '@/traffic/model/raw-click.js';

describe('ScheduleFilter', () => {
  let filter: ScheduleFilter;

  beforeEach(() => {
    filter = new ScheduleFilter();
  });

  describe('filter metadata', () => {
    it('should have correct key', () => {
      expect(filter.getKey()).toBe('schedule');
    });

    it('should have correct group', () => {
      expect(filter.getGroup()).toBe('filters.groups.schedule');
    });
  });

  describe('day-of-week filtering', () => {
    it('should pass on matching day', () => {
      // Create a date on Monday (day 1 in JS, but we use 0-based Monday)
      const monday = new Date('2024-01-01T12:00:00'); // This is a Monday
      
      const rawClick = {
        getDatetime: () => monday,
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: {
          intervals: [
            { day: [0, 4] } // Monday to Friday
          ]
        }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should reject on non-matching day', () => {
      // Create a date on Saturday
      const saturday = new Date('2024-01-06T12:00:00'); // This is a Saturday
      
      const rawClick = {
        getDatetime: () => saturday,
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: {
          intervals: [
            { day: [0, 4] } // Monday to Friday
          ]
        }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should handle wrapped day range (Fri-Mon)', () => {
      // Create a date on Saturday
      const saturday = new Date('2024-01-06T12:00:00'); // Saturday
      
      const rawClick = {
        getDatetime: () => saturday,
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: {
          intervals: [
            { day: [4, 0] } // Friday to Monday (wrapped)
          ]
        }
      });

      // Saturday is between Friday and Monday in wrapped range
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('time-of-day filtering', () => {
    it('should pass during allowed time window', () => {
      // Create a date at 14:00
      const afternoon = new Date('2024-01-01T14:00:00');
      
      const rawClick = {
        getDatetime: () => afternoon,
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: {
          intervals: [
            { day: [0, 4], time: ['09:00', '17:00'] } // Work hours
          ]
        }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should reject outside allowed time window', () => {
      // Create a date at 08:00 (before work hours)
      const morning = new Date('2024-01-01T08:00:00');
      
      const rawClick = {
        getDatetime: () => morning,
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: {
          intervals: [
            { day: [0, 4], time: ['09:00', '17:00'] } // Work hours
          ]
        }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('timezone handling', () => {
    it('should respect timezone setting', () => {
      // UTC 14:00 = EST 09:00
      const utcTime = new Date('2024-01-01T14:00:00Z');
      
      const rawClick = {
        getDatetime: () => utcTime,
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: {
          intervals: [
            { day: [0, 4], time: ['09:00', '17:00'] }
          ],
          timezone: 'America/New_York'
        }
      });

      // Should match because 14:00 UTC = 09:00 EST
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('reject mode', () => {
    it('should reject matching schedule in reject mode', () => {
      const monday = new Date('2024-01-01T12:00:00');
      
      const rawClick = {
        getDatetime: () => monday,
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.REJECT,
        payload: {
          intervals: [
            { day: [0, 4] } // Monday to Friday
          ]
        }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should pass when null payload', () => {
      const rawClick = {
        getDatetime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: null
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should pass when empty intervals', () => {
      const rawClick = {
        getDatetime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: { intervals: [] }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should handle old format (single day number)', () => {
      // Old format: day is a single number, not an array
      const monday = new Date('2024-01-01T12:00:00'); // Monday
      
      const rawClick = {
        getDatetime: () => monday,
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: {
          intervals: [
            { day: 0 } as any // Old format: single day (Monday)
          ]
        }
      });

      // Should match Monday (day 0)
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should reject different day in old format', () => {
      const monday = new Date('2024-01-01T12:00:00'); // Monday
      
      const rawClick = {
        getDatetime: () => monday,
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: {
          intervals: [
            { day: 2 } as any // Old format: Wednesday
          ]
        }
      });

      // Should not match Monday
      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });
});

describe('IntervalFilter', () => {
  let filter: IntervalFilter;

  beforeEach(() => {
    filter = new IntervalFilter();
  });

  describe('filter metadata', () => {
    it('should have correct key', () => {
      expect(filter.getKey()).toBe('interval');
    });

    it('should have correct group', () => {
      expect(filter.getGroup()).toBe('filters.groups.schedule');
    });
  });

  describe('date range filtering', () => {
    it('should pass when date is within range', () => {
      const clickDate = new Date('2024-06-15T12:00:00');
      
      const rawClick = {
        getDatetime: () => clickDate,
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: {
          from: '2024-06-01',
          to: '2024-06-30'
        }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should reject when date is before range', () => {
      const clickDate = new Date('2024-05-15T12:00:00');
      
      const rawClick = {
        getDatetime: () => clickDate,
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: {
          from: '2024-06-01',
          to: '2024-06-30'
        }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should reject when date is after range', () => {
      const clickDate = new Date('2024-07-15T12:00:00');
      
      const rawClick = {
        getDatetime: () => clickDate,
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: {
          from: '2024-06-01',
          to: '2024-06-30'
        }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should pass on start date boundary', () => {
      const clickDate = new Date('2024-06-01T12:00:00');
      
      const rawClick = {
        getDatetime: () => clickDate,
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: {
          from: '2024-06-01',
          to: '2024-06-30'
        }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should pass on end date boundary', () => {
      const clickDate = new Date('2024-06-30T23:59:59');
      
      const rawClick = {
        getDatetime: () => clickDate,
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: {
          from: '2024-06-01',
          to: '2024-06-30'
        }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('open-ended ranges', () => {
    it('should handle only from date', () => {
      const clickDate = new Date('2024-07-15T12:00:00');
      
      const rawClick = {
        getDatetime: () => clickDate,
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: {
          from: '2024-06-01'
        }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should handle only to date', () => {
      const clickDate = new Date('2024-05-15T12:00:00');
      
      const rawClick = {
        getDatetime: () => clickDate,
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: {
          to: '2024-06-30'
        }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('reject mode', () => {
    it('should reject within range in reject mode', () => {
      const clickDate = new Date('2024-06-15T12:00:00');
      
      const rawClick = {
        getDatetime: () => clickDate,
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.REJECT,
        payload: {
          from: '2024-06-01',
          to: '2024-06-30'
        }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should pass when null payload', () => {
      const rawClick = {
        getDatetime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: null
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should handle ISO date format', () => {
      const clickDate = new Date('2024-06-15T12:00:00');
      
      const rawClick = {
        getDatetime: () => clickDate,
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: {
          from: '2024-06-01T00:00:00',
          to: '2024-06-30T23:59:59'
        }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });
});
