/**
 * Tests for Miscellaneous Filters (IPv6, DeviceModel, OsVersion)
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { Ipv6Filter, DeviceModelFilter, OsVersionFilter, HideClickDetectFilter } from '@/traffic/filter/misc-filters.js';
import { StreamFilter, FilterMode } from '@/traffic/filter/stream-filter.js';
import { RawClick } from '@/traffic/model/raw-click.js';

describe('Ipv6Filter', () => {
  let filter: Ipv6Filter;

  beforeEach(() => {
    filter = new Ipv6Filter();
  });

  describe('filter metadata', () => {
    it('should have correct key', () => {
      expect(filter.getKey()).toBe('ipv6');
    });

    it('should have correct group', () => {
      expect(filter.getGroup()).toBe('filters.groups.geo');
    });
  });

  describe('IPv6 address filtering', () => {
    it('should pass matching IPv6 address', () => {
      const rawClick = {
        getIp: () => '2001:db8::1',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: ['2001:db8::1']
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should reject non-matching IPv6 address', () => {
      const rawClick = {
        getIp: () => '2001:db8::2',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: ['2001:db8::1']
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should reject IPv4 address when filtering IPv6', () => {
      const rawClick = {
        getIp: () => '192.168.1.1',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: ['2001:db8::1']
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('CIDR notation', () => {
    it('should match IPv6 in CIDR range', () => {
      const rawClick = {
        getIp: () => '2001:db8:85a3::8a2e:370:7334',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: ['2001:db8::/32']
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should not match IPv6 outside CIDR range', () => {
      const rawClick = {
        getIp: () => '3001:db8::1',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: ['2001:db8::/32']
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('reject mode', () => {
    it('should reject matching IPv6 in reject mode', () => {
      const rawClick = {
        getIp: () => '2001:db8::1',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.REJECT,
        payload: ['2001:db8::1']
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should pass when null payload', () => {
      const rawClick = {
        getIp: () => '2001:db8::1',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: null
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should pass when empty IP', () => {
      const rawClick = {
        getIp: () => '',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: ['2001:db8::1']
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });
});

describe('DeviceModelFilter', () => {
  let filter: DeviceModelFilter;

  beforeEach(() => {
    filter = new DeviceModelFilter();
  });

  describe('filter metadata', () => {
    it('should have correct key', () => {
      expect(filter.getKey()).toBe('device_model');
    });

    it('should have correct group', () => {
      expect(filter.getGroup()).toBe('filters.groups.device');
    });
  });

  describe('device model filtering', () => {
    it('should pass matching device model', () => {
      const rawClick = {
        getDeviceModel: () => 'iPhone 14 Pro',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: ['iPhone']
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should reject non-matching device model', () => {
      const rawClick = {
        getDeviceModel: () => 'Samsung Galaxy S23',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: ['iPhone']
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should match case-insensitively', () => {
      const rawClick = {
        getDeviceModel: () => 'IPHONE 14 PRO',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: ['iphone']
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should support wildcard patterns', () => {
      const rawClick = {
        getDeviceModel: () => 'Galaxy S23 Ultra',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: ['Galaxy S*']
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('multiple values', () => {
    it('should match any device model in list', () => {
      const rawClick = {
        getDeviceModel: () => 'Pixel 7',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: ['iPhone', 'Samsung', 'Pixel']
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('reject mode', () => {
    it('should reject matching device model in reject mode', () => {
      const rawClick = {
        getDeviceModel: () => 'iPhone 14',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.REJECT,
        payload: ['iPhone']
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should pass when null payload', () => {
      const rawClick = {
        getDeviceModel: () => 'iPhone 14',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: null
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should pass when empty device model', () => {
      const rawClick = {
        getDeviceModel: () => '',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: ['iPhone']
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });
});

describe('OsVersionFilter', () => {
  let filter: OsVersionFilter;

  beforeEach(() => {
    filter = new OsVersionFilter();
  });

  describe('filter metadata', () => {
    it('should have correct key', () => {
      expect(filter.getKey()).toBe('os_version');
    });

    it('should have correct group', () => {
      expect(filter.getGroup()).toBe('filters.groups.device');
    });
  });

  describe('version comparison', () => {
    it('should pass matching OS version', () => {
      const rawClick = {
        getOsVersion: () => '14.5',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: ['14']
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should support greater than comparison', () => {
      const rawClick = {
        getOsVersion: () => '15.0',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: ['>14']
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should support less than comparison', () => {
      const rawClick = {
        getOsVersion: () => '13.0',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: ['<14']
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should support greater than or equal comparison', () => {
      const rawClick = {
        getOsVersion: () => '14.0',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: ['>=14']
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should support less than or equal comparison', () => {
      const rawClick = {
        getOsVersion: () => '14.0',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: ['<=14']
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('wildcard support', () => {
    it('should support wildcard version matching', () => {
      const rawClick = {
        getOsVersion: () => '14.5.1',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: ['14.*']
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('reject mode', () => {
    it('should reject matching version in reject mode', () => {
      const rawClick = {
        getOsVersion: () => '14.0',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.REJECT,
        payload: ['14']
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should pass when null payload', () => {
      const rawClick = {
        getOsVersion: () => '14.0',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: null
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should pass when empty OS version', () => {
      const rawClick = {
        getOsVersion: () => '',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: ['14']
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });
});

describe('HideClickDetectFilter', () => {
  let filter: HideClickDetectFilter;

  beforeEach(() => {
    filter = new HideClickDetectFilter();
  });

  describe('filter metadata', () => {
    it('should have correct key', () => {
      expect(filter.getKey()).toBe('hide_click_detect');
    });

    it('should have correct group', () => {
      expect(filter.getGroup()).toBe('filters.groups.device');
    });
  });

  describe('hidden click detection', () => {
    it('should pass normal clicks with user agent', () => {
      const rawClick = {
        getUserAgent: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: null
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should detect hidden clicks with empty user agent', () => {
      const rawClick = {
        getUserAgent: () => '',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: null
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should detect hidden clicks with null user agent', () => {
      const rawClick = {
        getUserAgent: () => null,
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: null
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should detect hidden clicks with whitespace user agent', () => {
      const rawClick = {
        getUserAgent: () => '   ',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.ACCEPT,
        payload: null
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('reject mode', () => {
    it('should reject normal clicks in reject mode', () => {
      const rawClick = {
        getUserAgent: () => 'Mozilla/5.0',
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: FilterMode.REJECT,
        payload: null
      });

      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });
});
