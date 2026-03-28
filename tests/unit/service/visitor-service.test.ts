/**
 * Tests for VisitorService
 * 
 * Tests visitor identification and tracking functionality
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { VisitorService } from '../../../src/traffic/service/visitor-service.js';
import { RawClick } from '../../../src/traffic/model/raw-click.js';

describe('VisitorService', () => {
  let service: VisitorService;

  beforeEach(() => {
    service = new VisitorService();
  });

  describe('generateCode', () => {
    it('should generate consistent hash for same input', () => {
      const rawClick = new RawClick();
      rawClick.setIp('192.168.1.1');
      rawClick.setUserAgent('Mozilla/5.0');

      const code1 = service.generateCode(rawClick);
      const code2 = service.generateCode(rawClick);

      expect(code1).toBe(code2);
    });

    it('should generate different hash for different IP', () => {
      const rawClick1 = new RawClick();
      rawClick1.setIp('192.168.1.1');
      rawClick1.setUserAgent('Mozilla/5.0');

      const rawClick2 = new RawClick();
      rawClick2.setIp('192.168.1.2');
      rawClick2.setUserAgent('Mozilla/5.0');

      const code1 = service.generateCode(rawClick1);
      const code2 = service.generateCode(rawClick2);

      expect(code1).not.toBe(code2);
    });

    it('should generate different hash for different user agent', () => {
      const rawClick1 = new RawClick();
      rawClick1.setIp('192.168.1.1');
      rawClick1.setUserAgent('Mozilla/5.0');

      const rawClick2 = new RawClick();
      rawClick2.setIp('192.168.1.1');
      rawClick2.setUserAgent('Chrome/100');

      const code1 = service.generateCode(rawClick1);
      const code2 = service.generateCode(rawClick2);

      expect(code1).not.toBe(code2);
    });

    it('should return 8 character hex string', () => {
      const rawClick = new RawClick();
      rawClick.setIp('192.168.1.1');

      const code = service.generateCode(rawClick);

      expect(code).toHaveLength(8);
      expect(/^[0-9a-f]+$/.test(code)).toBe(true);
    });

    it('should use all click data for hash', () => {
      const rawClick1 = new RawClick();
      rawClick1.setIp('192.168.1.1');
      rawClick1.setUserAgent('Mozilla');
      rawClick1.setCountry('US');

      const rawClick2 = new RawClick();
      rawClick2.setIp('192.168.1.1');
      rawClick2.setUserAgent('Mozilla');
      rawClick2.setCountry('UK');

      const code1 = service.generateCode(rawClick1);
      const code2 = service.generateCode(rawClick2);

      expect(code1).not.toBe(code2);
    });

    it('should use city in hash', () => {
      const rawClick1 = new RawClick();
      rawClick1.setIp('192.168.1.1');
      rawClick1.setCity('New York');

      const rawClick2 = new RawClick();
      rawClick2.setIp('192.168.1.1');
      rawClick2.setCity('Los Angeles');

      const code1 = service.generateCode(rawClick1);
      const code2 = service.generateCode(rawClick2);

      expect(code1).not.toBe(code2);
    });

    it('should use device model in hash', () => {
      const rawClick1 = new RawClick();
      rawClick1.setIp('192.168.1.1');
      rawClick1.setDeviceModel('iPhone');

      const rawClick2 = new RawClick();
      rawClick2.setIp('192.168.1.1');
      rawClick2.setDeviceModel('Android');

      const code1 = service.generateCode(rawClick1);
      const code2 = service.generateCode(rawClick2);

      expect(code1).not.toBe(code2);
    });

    it('should use connection type in hash', () => {
      const rawClick1 = new RawClick();
      rawClick1.setIp('192.168.1.1');
      rawClick1.setConnectionType('wifi');

      const rawClick2 = new RawClick();
      rawClick2.setIp('192.168.1.1');
      rawClick2.setConnectionType('mobile');

      const code1 = service.generateCode(rawClick1);
      const code2 = service.generateCode(rawClick2);

      expect(code1).not.toBe(code2);
    });

    it('should handle empty fields', () => {
      const rawClick = new RawClick();
      // No fields set

      const code = service.generateCode(rawClick);

      expect(code).toHaveLength(8);
      expect(/^[0-9a-f]+$/.test(code)).toBe(true);
    });

    it('should generate same code for same visitor profile', () => {
      const rawClick1 = new RawClick();
      rawClick1.setIp('10.0.0.1');
      rawClick1.setUserAgent('Chrome/100');
      rawClick1.setCountry('US');
      rawClick1.setCity('San Francisco');
      rawClick1.setDeviceModel('Desktop');
      rawClick1.setConnectionType('fiber');

      const rawClick2 = new RawClick();
      rawClick2.setIp('10.0.0.1');
      rawClick2.setUserAgent('Chrome/100');
      rawClick2.setCountry('US');
      rawClick2.setCity('San Francisco');
      rawClick2.setDeviceModel('Desktop');
      rawClick2.setConnectionType('fiber');

      expect(service.generateCode(rawClick1)).toBe(service.generateCode(rawClick2));
    });
  });

  describe('isReturningVisitor', () => {
    it('should return true when visitor code is in stored codes', () => {
      const visitorCode = 'abc12345';
      const storedCodes = ['xyz98765', 'abc12345', 'def45678'];

      expect(service.isReturningVisitor(visitorCode, storedCodes)).toBe(true);
    });

    it('should return false when visitor code is not in stored codes', () => {
      const visitorCode = 'new12345';
      const storedCodes = ['abc12345', 'def45678'];

      expect(service.isReturningVisitor(visitorCode, storedCodes)).toBe(false);
    });

    it('should return false for empty stored codes', () => {
      const visitorCode = 'abc12345';
      const storedCodes: string[] = [];

      expect(service.isReturningVisitor(visitorCode, storedCodes)).toBe(false);
    });

    it('should handle exact match at start', () => {
      const visitorCode = 'firstcode';
      const storedCodes = ['firstcode', 'second', 'third'];

      expect(service.isReturningVisitor(visitorCode, storedCodes)).toBe(true);
    });

    it('should handle exact match at end', () => {
      const visitorCode = 'lastcode';
      const storedCodes = ['first', 'second', 'lastcode'];

      expect(service.isReturningVisitor(visitorCode, storedCodes)).toBe(true);
    });

    it('should not match partial codes', () => {
      const visitorCode = 'abc';
      const storedCodes = ['abc123', '123abc', 'xabcy'];

      expect(service.isReturningVisitor(visitorCode, storedCodes)).toBe(false);
    });

    it('should be case sensitive', () => {
      const visitorCode = 'ABC12345';
      const storedCodes = ['abc12345'];

      expect(service.isReturningVisitor(visitorCode, storedCodes)).toBe(false);
    });
  });

  describe('generateVisitorId', () => {
    it('should generate consistent ID for same IP and user agent', () => {
      const ip = '192.168.1.1';
      const userAgent = 'Mozilla/5.0';

      const id1 = service.generateVisitorId(ip, userAgent);
      const id2 = service.generateVisitorId(ip, userAgent);

      expect(id1).toBe(id2);
    });

    it('should generate different ID for different IP', () => {
      const id1 = service.generateVisitorId('192.168.1.1', 'Mozilla');
      const id2 = service.generateVisitorId('192.168.1.2', 'Mozilla');

      expect(id1).not.toBe(id2);
    });

    it('should generate different ID for different user agent', () => {
      const id1 = service.generateVisitorId('192.168.1.1', 'Mozilla');
      const id2 = service.generateVisitorId('192.168.1.1', 'Chrome');

      expect(id1).not.toBe(id2);
    });

    it('should return 8 character hex string', () => {
      const id = service.generateVisitorId('192.168.1.1', 'Mozilla');

      expect(id).toHaveLength(8);
      expect(/^[0-9a-f]+$/.test(id)).toBe(true);
    });

    it('should handle empty IP', () => {
      const id = service.generateVisitorId('', 'Mozilla');

      expect(id).toHaveLength(8);
    });

    it('should handle empty user agent', () => {
      const id = service.generateVisitorId('192.168.1.1', '');

      expect(id).toHaveLength(8);
    });

    it('should handle both empty', () => {
      const id = service.generateVisitorId('', '');

      expect(id).toHaveLength(8);
    });

    it('should generate same ID regardless of parameter order in internal logic', () => {
      // The internal implementation combines IP and UA with separator
      const id1 = service.generateVisitorId('192.168.1.1', 'Chrome');
      const id2 = service.generateVisitorId('192.168.1.1', 'Chrome');

      expect(id1).toBe(id2);
    });
  });

  describe('hash consistency', () => {
    it('should generate consistent hashes across multiple calls', () => {
      const rawClick = new RawClick();
      rawClick.setIp('10.20.30.40');
      rawClick.setUserAgent('TestAgent/1.0');

      const codes = Array(10).fill(null).map(() => service.generateCode(rawClick));

      const allEqual = codes.every(c => c === codes[0]);
      expect(allEqual).toBe(true);
    });

    it('should generate consistent visitor IDs across multiple calls', () => {
      const ids = Array(10).fill(null).map(() => 
        service.generateVisitorId('192.168.1.1', 'TestAgent')
      );

      const allEqual = ids.every(id => id === ids[0]);
      expect(allEqual).toBe(true);
    });
  });

  describe('hash distribution', () => {
    it('should generate different hashes for slightly different inputs', () => {
      const codes = new Set<string>();
      
      for (let i = 0; i < 100; i++) {
        const rawClick = new RawClick();
        rawClick.setIp(`192.168.1.${i}`);
        codes.add(service.generateCode(rawClick));
      }

      // All 100 codes should be unique
      expect(codes.size).toBe(100);
    });

    it('should generate unique visitor IDs for unique visitors', () => {
      const ids = new Set<string>();
      
      for (let i = 0; i < 100; i++) {
        ids.add(service.generateVisitorId(`10.0.${Math.floor(i / 10)}.${i % 10}`, `Agent/${i}`));
      }

      expect(ids.size).toBe(100);
    });
  });
});
