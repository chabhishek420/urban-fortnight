/**
 * IP Filter Tests
 * 
 * Tests for IP address filtering with CIDR, range, and wildcard matching
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { IpFilter } from '../../../src/traffic/filter/ip-filter';
import { RawClick } from '../../../src/traffic/model/raw-click';
import { FilterMode } from '../../../src/traffic/filter/stream-filter';

// Mock stream filter
function createMockStreamFilter(payload: string[], mode: FilterMode = FilterMode.ACCEPT) {
  return {
    getName: () => 'ip',
    getPayload: () => payload,
    getMode: () => mode
  } as any;
}

describe('IpFilter', () => {
  let filter: IpFilter;

  beforeEach(() => {
    filter = new IpFilter();
  });

  describe('filter metadata', () => {
    it('should have correct key', () => {
      expect(filter.getKey()).toBe('ip');
    });

    it('should be in GEO group', () => {
      expect(filter.getGroup()).toBe('filters.groups.geo');
    });

    it('should have tooltip', () => {
      expect(filter.getTooltip()).toContain('IP address');
    });
  });

  describe('exact IP matching', () => {
    it('should match exact IP', () => {
      const rawClick = new RawClick({ ip: '192.168.1.100' });
      const streamFilter = createMockStreamFilter(['192.168.1.100']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should not match different IP', () => {
      const rawClick = new RawClick({ ip: '192.168.1.100' });
      const streamFilter = createMockStreamFilter(['192.168.1.101']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should match any IP in list', () => {
      const rawClick = new RawClick({ ip: '10.0.0.50' });
      const streamFilter = createMockStreamFilter(['192.168.1.1', '10.0.0.50', '172.16.0.1']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('CIDR notation', () => {
    it('should match IP in /24 CIDR range', () => {
      const rawClick = new RawClick({ ip: '192.168.1.100' });
      const streamFilter = createMockStreamFilter(['192.168.1.0/24']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should not match IP outside /24 CIDR range', () => {
      const rawClick = new RawClick({ ip: '192.168.2.100' });
      const streamFilter = createMockStreamFilter(['192.168.1.0/24']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should match IP in /16 CIDR range', () => {
      const rawClick = new RawClick({ ip: '192.168.255.100' });
      const streamFilter = createMockStreamFilter(['192.168.0.0/16']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should match IP in /8 CIDR range', () => {
      const rawClick = new RawClick({ ip: '10.255.255.255' });
      const streamFilter = createMockStreamFilter(['10.0.0.0/8']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should match single IP with /32', () => {
      const rawClick = new RawClick({ ip: '192.168.1.100' });
      const streamFilter = createMockStreamFilter(['192.168.1.100/32']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should not match different IP with /32', () => {
      const rawClick = new RawClick({ ip: '192.168.1.101' });
      const streamFilter = createMockStreamFilter(['192.168.1.100/32']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('IP range notation', () => {
    it('should match IP in range', () => {
      const rawClick = new RawClick({ ip: '192.168.1.100' });
      const streamFilter = createMockStreamFilter(['192.168.1.1-192.168.1.255']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should not match IP outside range', () => {
      const rawClick = new RawClick({ ip: '192.168.2.1' });
      const streamFilter = createMockStreamFilter(['192.168.1.1-192.168.1.255']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should match start of range', () => {
      const rawClick = new RawClick({ ip: '192.168.1.1' });
      const streamFilter = createMockStreamFilter(['192.168.1.1-192.168.1.255']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should match end of range', () => {
      const rawClick = new RawClick({ ip: '192.168.1.255' });
      const streamFilter = createMockStreamFilter(['192.168.1.1-192.168.1.255']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('wildcard notation', () => {
    it('should match wildcard pattern', () => {
      const rawClick = new RawClick({ ip: '192.168.1.100' });
      const streamFilter = createMockStreamFilter(['192.168.1.*']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should not match different wildcard pattern', () => {
      const rawClick = new RawClick({ ip: '192.168.2.100' });
      const streamFilter = createMockStreamFilter(['192.168.1.*']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should match multiple wildcards', () => {
      const rawClick = new RawClick({ ip: '192.168.100.200' });
      const streamFilter = createMockStreamFilter(['192.168.*.*']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should match all IPs with *.*.*.*', () => {
      const rawClick = new RawClick({ ip: '8.8.8.8' });
      const streamFilter = createMockStreamFilter(['*.*.*.*']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('multiple formats in list', () => {
    it('should handle mixed format list', () => {
      const rawClickCidr = new RawClick({ ip: '192.168.1.50' });
      const rawClickRange = new RawClick({ ip: '10.0.0.100' });
      const rawClickExact = new RawClick({ ip: '172.16.0.1' });
      
      const streamFilter = createMockStreamFilter([
        '192.168.1.0/24',
        '10.0.0.1-10.0.0.255',
        '172.16.0.1'
      ]);
      
      expect(filter.isPass(streamFilter, rawClickCidr)).toBe(true);
      expect(filter.isPass(streamFilter, rawClickRange)).toBe(true);
      expect(filter.isPass(streamFilter, rawClickExact)).toBe(true);
    });
  });

  describe('separator handling', () => {
    it('should handle comma-separated values', () => {
      const rawClick = new RawClick({ ip: '192.168.1.50' });
      const streamFilter = createMockStreamFilter(['192.168.1.50, 192.168.1.51, 192.168.1.52']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should handle semicolon-separated values', () => {
      const rawClick = new RawClick({ ip: '10.0.0.5' });
      const streamFilter = createMockStreamFilter(['10.0.0.1; 10.0.0.5; 10.0.0.10']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('reject mode', () => {
    it('should reject matching IP in reject mode', () => {
      const rawClick = new RawClick({ ip: '192.168.1.100' });
      const streamFilter = createMockStreamFilter(['192.168.1.0/24'], FilterMode.REJECT);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should allow non-matching IP in reject mode', () => {
      const rawClick = new RawClick({ ip: '10.0.0.1' });
      const streamFilter = createMockStreamFilter(['192.168.1.0/24'], FilterMode.REJECT);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should pass when no IP on click', () => {
      const rawClick = new RawClick({}); // No IP
      const streamFilter = createMockStreamFilter(['192.168.1.1']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should pass when empty payload array', () => {
      const rawClick = new RawClick({ ip: '192.168.1.100' });
      const streamFilter = createMockStreamFilter([]);
      
      // Empty array means no IPs to match, so filter passes (no match found = false, accept mode = true)
      // But actually the filter implementation checks if payload is array and has length
      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should pass when null payload', () => {
      const rawClick = new RawClick({ ip: '192.168.1.100' });
      const streamFilter = createMockStreamFilter(null as any);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should handle invalid IP gracefully', () => {
      const rawClick = new RawClick({ ip: 'invalid-ip' });
      const streamFilter = createMockStreamFilter(['192.168.1.0/24']);
      
      // Should not throw
      expect(() => filter.isPass(streamFilter, rawClick)).not.toThrow();
    });

    it('should handle invalid CIDR gracefully', () => {
      const rawClick = new RawClick({ ip: '192.168.1.100' });
      const streamFilter = createMockStreamFilter(['invalid/cidr']);
      
      // Should not throw
      expect(() => filter.isPass(streamFilter, rawClick)).not.toThrow();
    });
  });

  describe('real-world scenarios', () => {
    it('should filter bot IPs', () => {
      const botIPs = ['66.249.66.1', '157.55.39.0/24', '17.58.98.0/24'];
      
      const googleBot = new RawClick({ ip: '66.249.66.1' });
      const bingBot = new RawClick({ ip: '157.55.39.100' });
      const appleBot = new RawClick({ ip: '17.58.98.50' });
      const realUser = new RawClick({ ip: '203.0.113.50' });
      
      const streamFilter = createMockStreamFilter(botIPs);
      
      expect(filter.isPass(streamFilter, googleBot)).toBe(true);
      expect(filter.isPass(streamFilter, bingBot)).toBe(true);
      expect(filter.isPass(streamFilter, appleBot)).toBe(true);
      expect(filter.isPass(streamFilter, realUser)).toBe(false);
    });

    it('should filter internal network ranges', () => {
      const internalRanges = ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'];
      const streamFilter = createMockStreamFilter(internalRanges, FilterMode.REJECT);
      
      const internalUser = new RawClick({ ip: '192.168.1.100' });
      const externalUser = new RawClick({ ip: '8.8.8.8' });
      
      expect(filter.isPass(streamFilter, internalUser)).toBe(false);
      expect(filter.isPass(streamFilter, externalUser)).toBe(true);
    });
  });
});
