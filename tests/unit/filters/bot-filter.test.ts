/**
 * Tests for BotFilter
 * 
 * Tests bot and proxy detection filters
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { IsBotFilter, ProxyFilter, UserAgentFilter, OperatorFilter } from '../../../src/traffic/filter/bot-filter.js';
import { RawClick } from '../../../src/traffic/model/raw-click.js';
import { FilterMode } from '../../../src/traffic/filter/stream-filter.js';
import { FilterGroup } from '../../../src/traffic/filter/filter-interface.js';

describe('Bot Filters', () => {
  describe('IsBotFilter', () => {
    let filter: IsBotFilter;

    beforeEach(() => {
      filter = new IsBotFilter();
    });

    it('should have correct key', () => {
      expect(filter.getKey()).toBe('is_bot');
    });

    it('should belong to DEVICE group', () => {
      expect(filter.getGroup()).toBe(FilterGroup.DEVICE);
    });

    it('should have tooltip', () => {
      expect(filter.getTooltip()).toBe('Filter visitors identified as bots');
    });

    it('should pass when mode is ACCEPT and visitor is bot', () => {
      const rawClick = new RawClick();
      rawClick.setIsBot(true);

      const streamFilter = createMockFilter(FilterMode.ACCEPT, null);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should fail when mode is ACCEPT and visitor is not bot', () => {
      const rawClick = new RawClick();
      rawClick.setIsBot(false);

      const streamFilter = createMockFilter(FilterMode.ACCEPT, null);

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should pass when mode is REJECT and visitor is not bot', () => {
      const rawClick = new RawClick();
      rawClick.setIsBot(false);

      const streamFilter = createMockFilter(FilterMode.REJECT, null);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should fail when mode is REJECT and visitor is bot', () => {
      const rawClick = new RawClick();
      rawClick.setIsBot(true);

      const streamFilter = createMockFilter(FilterMode.REJECT, null);

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('ProxyFilter', () => {
    let filter: ProxyFilter;

    beforeEach(() => {
      filter = new ProxyFilter();
    });

    it('should have correct key', () => {
      expect(filter.getKey()).toBe('is_using_proxy');
    });

    it('should belong to DEVICE group', () => {
      expect(filter.getGroup()).toBe(FilterGroup.DEVICE);
    });

    it('should have tooltip', () => {
      expect(filter.getTooltip()).toBe('Filter visitors using proxy/VPN');
    });

    it('should pass when mode is ACCEPT and visitor uses proxy', () => {
      const rawClick = new RawClick();
      rawClick.setIsProxy(true);

      const streamFilter = createMockFilter(FilterMode.ACCEPT, null);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should fail when mode is ACCEPT and visitor does not use proxy', () => {
      const rawClick = new RawClick();
      rawClick.setIsProxy(false);

      const streamFilter = createMockFilter(FilterMode.ACCEPT, null);

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should pass when mode is REJECT and visitor does not use proxy', () => {
      const rawClick = new RawClick();
      rawClick.setIsProxy(false);

      const streamFilter = createMockFilter(FilterMode.REJECT, null);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should fail when mode is REJECT and visitor uses proxy', () => {
      const rawClick = new RawClick();
      rawClick.setIsProxy(true);

      const streamFilter = createMockFilter(FilterMode.REJECT, null);

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('UserAgentFilter', () => {
    let filter: UserAgentFilter;

    beforeEach(() => {
      filter = new UserAgentFilter();
    });

    it('should have correct key', () => {
      expect(filter.getKey()).toBe('user_agent');
    });

    it('should belong to DEVICE group', () => {
      expect(filter.getGroup()).toBe(FilterGroup.DEVICE);
    });

    it('should pass when payload is not an array', () => {
      const rawClick = new RawClick();
      rawClick.setUserAgent('Mozilla/5.0');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, null);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should pass when user agent matches in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.setUserAgent('Mozilla/5.0 Chrome/100');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['chrome']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should fail when user agent does not match in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.setUserAgent('Mozilla/5.0 Firefox/100');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['chrome']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should pass when user agent does not match in REJECT mode', () => {
      const rawClick = new RawClick();
      rawClick.setUserAgent('Mozilla/5.0 Firefox/100');

      const streamFilter = createMockFilter(FilterMode.REJECT, ['chrome']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should fail when user agent matches in REJECT mode', () => {
      const rawClick = new RawClick();
      rawClick.setUserAgent('Mozilla/5.0 Chrome/100');

      const streamFilter = createMockFilter(FilterMode.REJECT, ['chrome']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should match any of multiple patterns', () => {
      const rawClick = new RawClick();
      rawClick.setUserAgent('Mozilla/5.0 Safari');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['chrome', 'safari', 'firefox']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should be case insensitive', () => {
      const rawClick = new RawClick();
      rawClick.setUserAgent('CHROME/100');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['Chrome']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should pass when user agent is empty', () => {
      const rawClick = new RawClick();

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['chrome']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('OperatorFilter', () => {
    let filter: OperatorFilter;

    beforeEach(() => {
      filter = new OperatorFilter();
    });

    it('should have correct key', () => {
      expect(filter.getKey()).toBe('operator');
    });

    it('should belong to GEO group', () => {
      expect(filter.getGroup()).toBe(FilterGroup.GEO);
    });

    it('should pass when payload is not an array', () => {
      const rawClick = new RawClick();
      rawClick.set('operator', 'Verizon');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, null);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should pass when operator matches in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.set('operator', 'Verizon Wireless');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['verizon', 'att']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should fail when operator does not match in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.set('operator', 'T-Mobile');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['verizon', 'att']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should be case insensitive', () => {
      const rawClick = new RawClick();
      rawClick.set('operator', 'VERIZON');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['verizon']);

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
