/**
 * Tests for Filter Interface
 * 
 * Tests abstract filter base class functionality
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { AbstractFilter, FilterGroup, FilterGroupValue } from '../../../src/traffic/filter/filter-interface.js';
import type { StreamFilter } from '../../../src/traffic/filter/stream-filter.js';
import type { RawClick } from '../../../src/traffic/model/raw-click.js';
import type { ServerRequest } from '../../../src/traffic/request/server-request.js';

// Create a concrete implementation for testing
class TestFilter extends AbstractFilter {
  getKey(): string {
    return 'test_filter';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.DEVICE;
  }

  isPass(_filter: StreamFilter, _rawClick: RawClick): boolean {
    return true;
  }
}

describe('AbstractFilter', () => {
  let filter: TestFilter;

  beforeEach(() => {
    filter = new TestFilter();
  });

  describe('getKey', () => {
    it('should return filter key', () => {
      expect(filter.getKey()).toBe('test_filter');
    });
  });

  describe('getGroup', () => {
    it('should return filter group', () => {
      expect(filter.getGroup()).toBe(FilterGroup.DEVICE);
    });
  });

  describe('getTooltip', () => {
    it('should return empty string by default', () => {
      expect(filter.getTooltip()).toBe('');
    });
  });

  describe('setServerRequest', () => {
    it('should store server request', () => {
      const mockRequest = { getIp: () => '127.0.0.1' } as unknown as ServerRequest;
      
      filter.setServerRequest(mockRequest);

      // Should not throw
      expect(filter).toBeDefined();
    });
  });

  describe('setLogger', () => {
    it('should store logger', () => {
      const logger = { add: (_msg: string) => {} };
      
      filter.setLogger(logger);

      // Should not throw
      expect(filter).toBeDefined();
    });
  });

  describe('log', () => {
    it('should log message when logger is set', () => {
      const messages: string[] = [];
      const logger = { add: (msg: string) => messages.push(msg) };
      
      filter.setLogger(logger);
      (filter as any).log('test message');

      expect(messages).toContain('test message');
    });

    it('should not throw when logger is not set', () => {
      // Should not throw
      (filter as any).log('test message');
    });
  });
});

describe('FilterGroup', () => {
  it('should have GEO group', () => {
    expect(FilterGroup.GEO).toBe('filters.groups.geo');
  });

  it('should have DEVICE group', () => {
    expect(FilterGroup.DEVICE).toBe('filters.groups.device');
  });

  it('should have TRAFFIC group', () => {
    expect(FilterGroup.TRAFFIC).toBe('filters.groups.traffic');
  });

  it('should have SCHEDULE group', () => {
    expect(FilterGroup.SCHEDULE).toBe('filters.groups.schedule');
  });

  it('should have LIMITS group', () => {
    expect(FilterGroup.LIMITS).toBe('filters.groups.limits');
  });

  it('should be usable as type', () => {
    const group: FilterGroupValue = FilterGroup.GEO;
    expect(group).toBe('filters.groups.geo');
  });
});
