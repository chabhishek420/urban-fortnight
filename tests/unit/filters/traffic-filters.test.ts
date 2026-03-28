/**
 * Tests for Traffic Filters
 * 
 * Tests keyword, source, and referrer filtering
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { KeywordFilter, SourceFilter, ReferrerFilter } from '../../../src/traffic/filter/traffic-filters.js';
import { RawClick } from '../../../src/traffic/model/raw-click.js';
import { FilterMode } from '../../../src/traffic/filter/stream-filter.js';
import { FilterGroup } from '../../../src/traffic/filter/filter-interface.js';

describe('Traffic Filters', () => {
  describe('KeywordFilter', () => {
    let filter: KeywordFilter;

    beforeEach(() => {
      filter = new KeywordFilter();
    });

    it('should have correct key', () => {
      expect(filter.getKey()).toBe('keyword');
    });

    it('should belong to TRAFFIC group', () => {
      expect(filter.getGroup()).toBe(FilterGroup.TRAFFIC);
    });

    it('should have tooltip', () => {
      expect(filter.getTooltip()).toBe('Filter by keyword or search term');
    });

    it('should pass when payload is not an array', () => {
      const rawClick = new RawClick();
      rawClick.setKeyword('test');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, null);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should match keyword in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.setKeyword('buy shoes online');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['shoes', 'boots']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should not match keyword in ACCEPT mode when not present', () => {
      const rawClick = new RawClick();
      rawClick.setKeyword('buy clothes online');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['shoes', 'boots']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should pass in REJECT mode when keyword not present', () => {
      const rawClick = new RawClick();
      rawClick.setKeyword('buy clothes');

      const streamFilter = createMockFilter(FilterMode.REJECT, ['shoes', 'boots']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should fail in REJECT mode when keyword present', () => {
      const rawClick = new RawClick();
      rawClick.setKeyword('buy shoes online');

      const streamFilter = createMockFilter(FilterMode.REJECT, ['shoes']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should match empty keyword with empty value', () => {
      const rawClick = new RawClick();
      rawClick.setKeyword('');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['', 'null']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should be case insensitive', () => {
      const rawClick = new RawClick();
      rawClick.setKeyword('BUY SHOES ONLINE');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['shoes']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should use partial matching', () => {
      const rawClick = new RawClick();
      rawClick.setKeyword('buy running shoes online');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['run']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should match any value in array', () => {
      const rawClick = new RawClick();
      rawClick.setKeyword('buy boots');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['shoes', 'boots', 'sandals']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should handle undefined keyword', () => {
      const rawClick = new RawClick();

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['test']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should match null as empty in payload', () => {
      const rawClick = new RawClick();
      rawClick.setKeyword('');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['null']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('SourceFilter', () => {
    let filter: SourceFilter;

    beforeEach(() => {
      filter = new SourceFilter();
    });

    it('should have correct key', () => {
      expect(filter.getKey()).toBe('source');
    });

    it('should belong to TRAFFIC group', () => {
      expect(filter.getGroup()).toBe(FilterGroup.TRAFFIC);
    });

    it('should pass when payload is not an array', () => {
      const rawClick = new RawClick();
      rawClick.setSource('google');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, null);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should match source in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.setSource('google_ads');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['google', 'facebook']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should not match source in ACCEPT mode when not present', () => {
      const rawClick = new RawClick();
      rawClick.setSource('bing');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['google', 'facebook']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should pass in REJECT mode when source not present', () => {
      const rawClick = new RawClick();
      rawClick.setSource('bing');

      const streamFilter = createMockFilter(FilterMode.REJECT, ['google', 'facebook']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should fail in REJECT mode when source present', () => {
      const rawClick = new RawClick();
      rawClick.setSource('google');

      const streamFilter = createMockFilter(FilterMode.REJECT, ['google']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should be case insensitive', () => {
      const rawClick = new RawClick();
      rawClick.setSource('GOOGLE_ADS');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['google']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should match exact or partial', () => {
      const rawClick = new RawClick();
      rawClick.setSource('google_search');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['google']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should handle empty source', () => {
      const rawClick = new RawClick();
      rawClick.setSource('');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['', 'empty']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('ReferrerFilter', () => {
    let filter: ReferrerFilter;

    beforeEach(() => {
      filter = new ReferrerFilter();
    });

    it('should have correct key', () => {
      expect(filter.getKey()).toBe('referrer');
    });

    it('should belong to TRAFFIC group', () => {
      expect(filter.getGroup()).toBe(FilterGroup.TRAFFIC);
    });

    it('should pass when payload is not an array', () => {
      const rawClick = new RawClick();
      rawClick.setReferrer('https://google.com');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, null);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should match referrer in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.setReferrer('https://www.google.com/search?q=test');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['google', 'bing']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should not match referrer in ACCEPT mode when not present', () => {
      const rawClick = new RawClick();
      rawClick.setReferrer('https://example.com/page');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['google', 'bing']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should pass in REJECT mode when referrer not present', () => {
      const rawClick = new RawClick();
      rawClick.setReferrer('https://example.com');

      const streamFilter = createMockFilter(FilterMode.REJECT, ['google', 'facebook']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should fail in REJECT mode when referrer present', () => {
      const rawClick = new RawClick();
      rawClick.setReferrer('https://google.com/search');

      const streamFilter = createMockFilter(FilterMode.REJECT, ['google']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should be case insensitive', () => {
      const rawClick = new RawClick();
      rawClick.setReferrer('HTTPS://GOOGLE.COM');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['google']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should use partial matching', () => {
      const rawClick = new RawClick();
      rawClick.setReferrer('https://www.googleadservices.com/pagead');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['google']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should handle empty referrer', () => {
      const rawClick = new RawClick();
      rawClick.setReferrer('');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['', 'empty']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should handle direct traffic (no referrer)', () => {
      const rawClick = new RawClick();
      // No referrer set

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['null', '']);

      // Direct traffic has undefined referrer which is treated as empty string
      // and matches 'null' in EMPTY_QUERIES
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });
});

/**
 * Helper to create mock stream filter
 */
function createMockFilter(mode: FilterMode, payload: unknown): StreamFilter {
  return {
    getMode: () => mode,
    getPayload: () => payload
  } as unknown as StreamFilter;
}
