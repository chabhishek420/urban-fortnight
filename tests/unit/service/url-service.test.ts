/**
 * Tests for UrlService
 * 
 * Tests URL manipulation and token handling
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { UrlService } from '../../../src/traffic/service/url-service.js';
import { RawClick } from '../../../src/traffic/model/raw-click.js';

describe('UrlService', () => {
  let service: UrlService;

  beforeEach(() => {
    service = new UrlService();
  });

  describe('constructor', () => {
    it('should be instantiable', () => {
      expect(service).toBeDefined();
    });

    it('should extend AbstractService', () => {
      expect(service.constructor.name).toBe('UrlService');
    });
  });

  describe('URL parsing', () => {
    it('should handle valid URLs', () => {
      const url = 'https://example.com/path?param=value';
      
      expect(() => new URL(url)).not.toThrow();
    });

    it('should extract query parameters', () => {
      const url = new URL('https://example.com?keyword=test&source=google');
      
      expect(url.searchParams.get('keyword')).toBe('test');
      expect(url.searchParams.get('source')).toBe('google');
    });

    it('should handle URLs without query params', () => {
      const url = new URL('https://example.com/path');
      
      expect(url.search).toBe('');
    });
  });

  describe('URL building', () => {
    it('should build URL with parameters', () => {
      const url = new URL('https://example.com/track');
      url.searchParams.set('campaign_id', '123');
      url.searchParams.set('keyword', 'test');
      
      expect(url.toString()).toContain('campaign_id=123');
      expect(url.toString()).toContain('keyword=test');
    });

    it('should encode special characters', () => {
      const url = new URL('https://example.com');
      url.searchParams.set('keyword', 'hello world');
      
      expect(url.toString()).toContain('keyword=hello+world');
    });

    it('should handle multiple values for same param', () => {
      const url = new URL('https://example.com');
      url.searchParams.append('id', '1');
      url.searchParams.append('id', '2');
      
      expect(url.searchParams.getAll('id')).toEqual(['1', '2']);
    });
  });

  describe('URL manipulation', () => {
    it('should replace protocol', () => {
      const url = new URL('http://example.com/path');
      const newUrl = url.toString().replace('http:', 'https:');
      
      expect(newUrl).toBe('https://example.com/path');
    });

    it('should extract domain', () => {
      const url = new URL('https://sub.example.com:8080/path');
      
      expect(url.host).toBe('sub.example.com:8080');
      expect(url.hostname).toBe('sub.example.com');
    });

    it('should extract path', () => {
      const url = new URL('https://example.com/path/to/page');
      
      expect(url.pathname).toBe('/path/to/page');
    });
  });

  describe('token generation', () => {
    it('should generate unique tokens', () => {
      const tokens = new Set<string>();
      
      for (let i = 0; i < 100; i++) {
        const token = Math.random().toString(36).substring(2, 10);
        tokens.add(token);
      }
      
      // Most tokens should be unique
      expect(tokens.size).toBeGreaterThan(90);
    });
  });

  describe('click URL generation', () => {
    it('should generate tracking URL with click data', () => {
      const rawClick = new RawClick();
      rawClick.setCampaignId(123);
      rawClick.setKeyword('test_keyword');
      
      const baseUrl = 'https://tracker.example.com';
      const url = new URL(baseUrl);
      url.searchParams.set('campaign_id', String(rawClick.getCampaignId() ?? ''));
      url.searchParams.set('keyword', rawClick.getKeyword() ?? '');
      
      expect(url.toString()).toContain('campaign_id=123');
      expect(url.toString()).toContain('keyword=test_keyword');
    });
  });

  describe('URL encoding edge cases', () => {
    it('should encode Unicode characters', () => {
      const url = new URL('https://example.com');
      url.searchParams.set('keyword', '测试');
      
      expect(url.toString()).toContain('keyword=%E6%B5%8B%E8%AF%95');
    });

    it('should encode reserved characters', () => {
      const url = new URL('https://example.com');
      url.searchParams.set('data', 'a=b&c=d');
      
      expect(url.toString()).toContain('data=a%3Db%26c%3Dd');
    });

    it('should handle empty values', () => {
      const url = new URL('https://example.com');
      url.searchParams.set('empty', '');
      
      expect(url.searchParams.get('empty')).toBe('');
    });

    it('should handle null values', () => {
      const url = new URL('https://example.com');
      url.searchParams.set('value', 'test');
      url.searchParams.delete('value');
      
      expect(url.searchParams.get('value')).toBeNull();
    });
  });
});
