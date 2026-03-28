/**
 * Tests for Parameter and Related Filters
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ParameterFilter, AnyParamFilter, EmptyReferrerFilter } from '@/traffic/filter/parameter-filter.js';
import { StreamFilter, FilterMode } from '@/traffic/filter/stream-filter.js';
import { RawClick } from '@/traffic/model/raw-click.js';
import { AbstractFilter } from '@/traffic/filter/filter-interface.js';

describe('ParameterFilter', () => {
  let filter: ParameterFilter;

  beforeEach(() => {
    filter = new ParameterFilter();
  });

  // Mock ServerRequest
  const createMockRequest = (queryParams: Record<string, string> = {}, bodyParams: Record<string, string> = {}) => ({
    getQueryParam: (name: string) => queryParams[name] ?? null,
    getBodyParam: (name: string) => bodyParams[name] ?? null,
    getQueryParams: () => queryParams
  });

  describe('filter metadata', () => {
    it('should have correct key', () => {
      expect(filter.getKey()).toBe('parameter');
    });

    it('should have correct group', () => {
      expect(filter.getGroup()).toBe('filters.groups.traffic');
    });
  });

  describe('query parameter filtering', () => {
    it('should pass when parameter matches', () => {
      const mockRequest = createMockRequest({ utm_source: 'google' });
      filter.setServerRequest(mockRequest as unknown as Parameters<AbstractFilter['setServerRequest']>[0]);
      
      const rawClick = {} as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: { name: 'utm_source', value: 'google' }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should reject when parameter does not match', () => {
      const mockRequest = createMockRequest({ utm_source: 'bing' });
      filter.setServerRequest(mockRequest as unknown as Parameters<AbstractFilter['setServerRequest']>[0]);
      
      const rawClick = {} as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: { name: 'utm_source', value: 'google' }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should match any value in array', () => {
      const mockRequest = createMockRequest({ utm_source: 'bing' });
      filter.setServerRequest(mockRequest as unknown as Parameters<AbstractFilter['setServerRequest']>[0]);
      
      const rawClick = {} as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: { name: 'utm_source', value: ['google', 'bing', 'yahoo'] }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('regex support', () => {
    it('should support regex patterns', () => {
      const mockRequest = createMockRequest({ keyword: 'buy-now-cheap' });
      filter.setServerRequest(mockRequest as unknown as Parameters<AbstractFilter['setServerRequest']>[0]);
      
      const rawClick = {} as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: { name: 'keyword', value: '/buy.*cheap/' }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should support wildcard patterns', () => {
      const mockRequest = createMockRequest({ source: 'traffic_source_123' });
      filter.setServerRequest(mockRequest as unknown as Parameters<AbstractFilter['setServerRequest']>[0]);
      
      const rawClick = {} as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: { name: 'source', value: 'traffic_*' }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('case insensitive matching', () => {
    it('should match case-insensitively', () => {
      const mockRequest = createMockRequest({ utm_source: 'GOOGLE' });
      filter.setServerRequest(mockRequest as unknown as Parameters<AbstractFilter['setServerRequest']>[0]);
      
      const rawClick = {} as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: { name: 'utm_source', value: 'google' }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('reject mode', () => {
    it('should reject matching parameter in reject mode', () => {
      const mockRequest = createMockRequest({ utm_source: 'google' });
      filter.setServerRequest(mockRequest as unknown as Parameters<AbstractFilter['setServerRequest']>[0]);
      
      const rawClick = {} as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.REJECT,
        payload: { name: 'utm_source', value: 'google' }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle missing parameter', () => {
      const mockRequest = createMockRequest({});
      filter.setServerRequest(mockRequest as unknown as Parameters<AbstractFilter['setServerRequest']>[0]);
      
      const rawClick = {} as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: { name: 'utm_source', value: 'google' }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should pass when null payload', () => {
      const rawClick = {} as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: null
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should pass when missing parameter name', () => {
      const rawClick = {} as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: { value: 'google' }
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });
});

describe('AnyParamFilter', () => {
  let filter: AnyParamFilter;

  beforeEach(() => {
    filter = new AnyParamFilter();
  });

  const createMockRequest = (queryParams: Record<string, string> = {}) => ({
    getQueryParam: (name: string) => queryParams[name] ?? null,
    getBodyParam: () => null,
    getQueryParams: () => queryParams
  });

  describe('filter metadata', () => {
    it('should have correct key', () => {
      expect(filter.getKey()).toBe('any_param');
    });
  });

  describe('any parameter detection', () => {
    it('should pass when query parameters exist', () => {
      const mockRequest = createMockRequest({ utm_source: 'google' });
      filter.setServerRequest(mockRequest as unknown as Parameters<AbstractFilter['setServerRequest']>[0]);
      
      const rawClick = {} as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: null
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should reject when no query parameters', () => {
      const mockRequest = createMockRequest({});
      filter.setServerRequest(mockRequest as unknown as Parameters<AbstractFilter['setServerRequest']>[0]);
      
      const rawClick = {} as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: null
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should reject when parameters exist in reject mode', () => {
      const mockRequest = createMockRequest({ utm_source: 'google' });
      filter.setServerRequest(mockRequest as unknown as Parameters<AbstractFilter['setServerRequest']>[0]);
      
      const rawClick = {} as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.REJECT,
        payload: null
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });
});

describe('EmptyReferrerFilter', () => {
  let filter: EmptyReferrerFilter;

  beforeEach(() => {
    filter = new EmptyReferrerFilter();
  });

  describe('filter metadata', () => {
    it('should have correct key', () => {
      expect(filter.getKey()).toBe('empty_referrer');
    });
  });

  describe('empty referrer detection', () => {
    it('should pass when referrer is empty (accept mode)', () => {
      const rawClick = {
        getReferrer: () => '',
      } as unknown as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: null
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should pass when referrer is null (accept mode)', () => {
      const rawClick = {
        getReferrer: () => null,
      } as unknown as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: null
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should reject when referrer exists (accept mode)', () => {
      const rawClick = {
        getReferrer: () => 'https://google.com',
      } as unknown as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: null
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should reject empty referrer in reject mode', () => {
      const rawClick = {
        getReferrer: () => '',
      } as unknown as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.REJECT,
        payload: null
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should pass non-empty referrer in reject mode', () => {
      const rawClick = {
        getReferrer: () => 'https://google.com',
      } as unknown as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.REJECT,
        payload: null
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });
});
