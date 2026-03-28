/**
 * Tests for Device Filters
 * 
 * Tests device-based filtering functionality
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { 
  DeviceTypeFilter, 
  OsFilter, 
  BrowserFilter, 
  BrowserVersionFilter,
  LanguageFilter,
  ConnectionTypeFilter,
  IspFilter 
} from '../../../src/traffic/filter/device-filters.js';
import { RawClick } from '../../../src/traffic/model/raw-click.js';
import { FilterMode } from '../../../src/traffic/filter/stream-filter.js';
import { FilterGroup } from '../../../src/traffic/filter/filter-interface.js';

describe('Device Filters', () => {
  describe('DeviceTypeFilter', () => {
    let filter: DeviceTypeFilter;

    beforeEach(() => {
      filter = new DeviceTypeFilter();
    });

    it('should have correct key', () => {
      expect(filter.getKey()).toBe('device_type');
    });

    it('should belong to DEVICE group', () => {
      expect(filter.getGroup()).toBe(FilterGroup.DEVICE);
    });

    it('should pass when device type matches in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.setDeviceType('mobile');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['mobile', 'tablet']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should fail when device type does not match in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.setDeviceType('desktop');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['mobile', 'tablet']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should pass when device type does not match in REJECT mode', () => {
      const rawClick = new RawClick();
      rawClick.setDeviceType('desktop');

      const streamFilter = createMockFilter(FilterMode.REJECT, ['mobile', 'tablet']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should be case insensitive', () => {
      const rawClick = new RawClick();
      rawClick.setDeviceType('MOBILE');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['mobile']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should pass when payload is not an array', () => {
      const rawClick = new RawClick();
      rawClick.setDeviceType('mobile');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, null);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('OsFilter', () => {
    let filter: OsFilter;

    beforeEach(() => {
      filter = new OsFilter();
    });

    it('should have correct key', () => {
      expect(filter.getKey()).toBe('os');
    });

    it('should belong to DEVICE group', () => {
      expect(filter.getGroup()).toBe(FilterGroup.DEVICE);
    });

    it('should pass when OS matches in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.setOs('Windows 10');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['windows', 'macos']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should fail when OS does not match in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.setOs('Linux');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['windows', 'macos']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should use partial matching', () => {
      const rawClick = new RawClick();
      rawClick.setOs('Android 12');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['android']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should be case insensitive', () => {
      const rawClick = new RawClick();
      rawClick.setOs('WINDOWS 10');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['windows']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('BrowserFilter', () => {
    let filter: BrowserFilter;

    beforeEach(() => {
      filter = new BrowserFilter();
    });

    it('should have correct key', () => {
      expect(filter.getKey()).toBe('browser');
    });

    it('should belong to DEVICE group', () => {
      expect(filter.getGroup()).toBe(FilterGroup.DEVICE);
    });

    it('should pass when browser matches in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.setBrowser('Chrome');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['chrome', 'firefox']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should fail when browser does not match in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.setBrowser('Safari');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['chrome', 'firefox']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should use partial matching', () => {
      const rawClick = new RawClick();
      rawClick.setBrowser('Chrome Mobile');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['chrome']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should be case insensitive', () => {
      const rawClick = new RawClick();
      rawClick.setBrowser('CHROME');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['chrome']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('BrowserVersionFilter', () => {
    let filter: BrowserVersionFilter;

    beforeEach(() => {
      filter = new BrowserVersionFilter();
    });

    it('should have correct key', () => {
      expect(filter.getKey()).toBe('browser_version');
    });

    it('should belong to DEVICE group', () => {
      expect(filter.getGroup()).toBe(FilterGroup.DEVICE);
    });

    it('should pass when version is within range in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.setBrowserVersion('95');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, { min: '90', max: '100' });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should fail when version is below minimum in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.setBrowserVersion('85');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, { min: '90', max: '100' });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should fail when version is above maximum in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.setBrowserVersion('105');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, { min: '90', max: '100' });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should pass when version is above minimum (no max) in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.setBrowserVersion('100');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, { min: '90' });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should pass when version is below maximum (no min) in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.setBrowserVersion('85');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, { max: '100' });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should pass when payload is null', () => {
      const rawClick = new RawClick();
      rawClick.setBrowserVersion('95');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, null);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should pass when browser version is empty', () => {
      const rawClick = new RawClick();

      const streamFilter = createMockFilter(FilterMode.ACCEPT, { min: '90' });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should handle REJECT mode for out of range', () => {
      const rawClick = new RawClick();
      rawClick.setBrowserVersion('85');

      const streamFilter = createMockFilter(FilterMode.REJECT, { min: '90', max: '100' });

      // Below min should pass in REJECT mode (rejecting means excluding the range)
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('LanguageFilter', () => {
    let filter: LanguageFilter;

    beforeEach(() => {
      filter = new LanguageFilter();
    });

    it('should have correct key', () => {
      expect(filter.getKey()).toBe('language');
    });

    it('should belong to DEVICE group', () => {
      expect(filter.getGroup()).toBe(FilterGroup.DEVICE);
    });

    it('should pass when language matches in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.setLanguage('en-US');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['en', 'es', 'fr']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should fail when language does not match in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.setLanguage('de-DE');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['en', 'es', 'fr']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should use partial matching', () => {
      const rawClick = new RawClick();
      rawClick.setLanguage('en-GB');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['en']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should be case insensitive', () => {
      const rawClick = new RawClick();
      rawClick.setLanguage('EN-US');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['en']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('ConnectionTypeFilter', () => {
    let filter: ConnectionTypeFilter;

    beforeEach(() => {
      filter = new ConnectionTypeFilter();
    });

    it('should have correct key', () => {
      expect(filter.getKey()).toBe('connection_type');
    });

    it('should belong to DEVICE group', () => {
      expect(filter.getGroup()).toBe(FilterGroup.DEVICE);
    });

    it('should pass when connection type matches in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.setConnectionType('wifi');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['wifi', 'ethernet']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should fail when connection type does not match in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.setConnectionType('mobile');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['wifi', 'ethernet']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should use exact matching (not partial)', () => {
      const rawClick = new RawClick();
      rawClick.setConnectionType('wifi');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['mobile']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should be case insensitive', () => {
      const rawClick = new RawClick();
      rawClick.setConnectionType('WIFI');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['wifi']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('IspFilter', () => {
    let filter: IspFilter;

    beforeEach(() => {
      filter = new IspFilter();
    });

    it('should have correct key', () => {
      expect(filter.getKey()).toBe('isp');
    });

    it('should belong to GEO group', () => {
      expect(filter.getGroup()).toBe(FilterGroup.GEO);
    });

    it('should pass when ISP matches in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.setIsp('Comcast Cable');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['comcast', 'verizon']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should fail when ISP does not match in ACCEPT mode', () => {
      const rawClick = new RawClick();
      rawClick.setIsp('AT&T');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['comcast', 'verizon']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should use partial matching', () => {
      const rawClick = new RawClick();
      rawClick.setIsp('Verizon Wireless');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['verizon']);

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should be case insensitive', () => {
      const rawClick = new RawClick();
      rawClick.setIsp('COMCAST');

      const streamFilter = createMockFilter(FilterMode.ACCEPT, ['comcast']);

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
