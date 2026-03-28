/**
 * ServerRequest Tests
 * 
 * Tests for HTTP request handling and IP detection
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ServerRequest } from '../../src/traffic/request/server-request';

describe('ServerRequest', () => {
  describe('constructor', () => {
    it('should create request with default values', () => {
      const request = new ServerRequest();
      
      expect(request.getMethod()).toBe('GET');
      expect(request.getUri().toString()).toBe('http://localhost/');
    });

    it('should accept custom options', () => {
      const request = new ServerRequest({
        method: 'POST',
        uri: new URL('https://example.com/api/test'),
        headers: { 'Content-Type': 'application/json' },
        queryParams: { page: '1', limit: '10' }
      });
      
      expect(request.getMethod()).toBe('POST');
      expect(request.getPath()).toBe('/api/test');
      expect(request.getHeader('Content-Type')).toBe('application/json');
      expect(request.getParam('page')).toBe('1');
    });
  });

  describe('parameter handling', () => {
    let request: ServerRequest;

    beforeEach(() => {
      request = new ServerRequest({
        uri: new URL('http://test.local/path?foo=bar&baz=qux'),
        queryParams: { custom: 'value' }
      });
    });

    it('should get query param from URL', () => {
      expect(request.getParam('foo')).toBe('bar');
      expect(request.getParam('baz')).toBe('qux');
    });

    it('should get query param from queryParams', () => {
      expect(request.getParam('custom')).toBe('value');
    });

    it('should return undefined for missing param', () => {
      expect(request.getParam('nonexistent')).toBeUndefined();
    });

    it('should check if param exists', () => {
      expect(request.hasParam('foo')).toBe(true);
      expect(request.hasParam('nonexistent')).toBe(false);
    });

    it('should return all query params', () => {
      const params = request.getQueryParams();
      expect(params.custom).toBe('value');
      // Note: getQueryParams returns the queryParams object, not URL params
      // URL params are accessed via getParam()
    });
  });

  describe('header handling', () => {
    let request: ServerRequest;

    beforeEach(() => {
      request = new ServerRequest({
        headers: {
          'Content-Type': 'application/json',
          'X-Custom-Header': 'custom-value'
        }
      });
    });

    it('should get header case-insensitively', () => {
      expect(request.getHeader('content-type')).toBe('application/json');
      expect(request.getHeader('CONTENT-TYPE')).toBe('application/json');
      expect(request.getHeader('Content-Type')).toBe('application/json');
    });

    it('should return undefined for missing header', () => {
      expect(request.getHeader('X-Nonexistent')).toBeUndefined();
    });

    it('should check if header exists', () => {
      expect(request.hasHeader('content-type')).toBe(true);
      expect(request.hasHeader('x-nonexistent')).toBe(false);
    });

    it('should return all headers', () => {
      const headers = request.getHeaders();
      expect(headers['Content-Type']).toBe('application/json');
      expect(headers['X-Custom-Header']).toBe('custom-value');
    });
  });

  describe('IP address detection', () => {
    it('should get IP from X-Real-IP header', () => {
      const request = new ServerRequest({
        headers: {
          'X-Real-IP': '1.2.3.4'
        }
      });
      
      expect(request.getClientIp()).toBe('1.2.3.4');
    });

    it('should get IP from CF-Connecting-IP header', () => {
      const request = new ServerRequest({
        headers: {
          'CF-Connecting-IP': '5.6.7.8'
        }
      });
      
      expect(request.getClientIp()).toBe('5.6.7.8');
    });

    it('should get IP from X-Forwarded-For header (first IP)', () => {
      const request = new ServerRequest({
        headers: {
          'X-Forwarded-For': '10.0.0.1, 10.0.0.2, 10.0.0.3'
        }
      });
      
      expect(request.getClientIp()).toBe('10.0.0.1');
    });

    it('should get IP from REMOTE_ADDR server param', () => {
      const request = new ServerRequest({
        serverParams: {
          'REMOTE_ADDR': '192.168.1.100'
        }
      });
      
      expect(request.getClientIp()).toBe('192.168.1.100');
    });

    it('should prioritize X-Real-IP over other headers', () => {
      const request = new ServerRequest({
        headers: {
          'X-Real-IP': '1.1.1.1',
          'X-Forwarded-For': '2.2.2.2',
          'CF-Connecting-IP': '3.3.3.3'
        }
      });
      
      expect(request.getClientIp()).toBe('1.1.1.1');
    });

    it('should default to 127.0.0.1 when no IP found', () => {
      const request = new ServerRequest();
      expect(request.getClientIp()).toBe('127.0.0.1');
    });
  });

  describe('user agent handling', () => {
    it('should get user agent', () => {
      const request = new ServerRequest({
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });
      
      expect(request.getUserAgent()).toBe('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    });

    it('should return empty string when no user agent', () => {
      const request = new ServerRequest();
      expect(request.getUserAgent()).toBe('');
    });
  });

  describe('referer handling', () => {
    it('should get referer', () => {
      const request = new ServerRequest({
        headers: {
          'Referer': 'https://google.com/search?q=test'
        }
      });
      
      expect(request.getReferer()).toBe('https://google.com/search?q=test');
    });

    it('should return empty string when no referer', () => {
      const request = new ServerRequest();
      expect(request.getReferer()).toBe('');
    });
  });

  describe('cookie handling', () => {
    it('should get cookie value', () => {
      const request = new ServerRequest({
        cookies: {
          sessionId: 'abc123',
          userId: 'user-456'
        }
      });
      
      expect(request.getCookie('sessionId')).toBe('abc123');
      expect(request.getCookie('userId')).toBe('user-456');
    });

    it('should return undefined for missing cookie', () => {
      const request = new ServerRequest();
      expect(request.getCookie('nonexistent')).toBeUndefined();
    });

    it('should return all cookies', () => {
      const request = new ServerRequest({
        cookies: {
          cookie1: 'value1',
          cookie2: 'value2'
        }
      });
      
      const cookies = request.getCookies();
      expect(cookies.cookie1).toBe('value1');
      expect(cookies.cookie2).toBe('value2');
    });
  });

  describe('attribute handling', () => {
    it('should get and set attributes', () => {
      const request = new ServerRequest();
      const updated = request.withAttribute('customKey', 'customValue');
      
      expect(updated.getAttribute('customKey')).toBe('customValue');
    });

    it('should return undefined for missing attribute', () => {
      const request = new ServerRequest();
      expect(request.getAttribute('nonexistent')).toBeUndefined();
    });
  });

  describe('immutability', () => {
    it('should return new instance from withQueryParams', () => {
      const original = new ServerRequest();
      const updated = original.withQueryParams({ new: 'param' });
      
      expect(updated).not.toBe(original);
      expect(original.getParam('new')).toBeUndefined();
      expect(updated.getParam('new')).toBe('param');
    });

    it('should return new instance from withHeaders', () => {
      const original = new ServerRequest();
      const updated = original.withHeaders({ 'X-New': 'header' });
      
      expect(updated).not.toBe(original);
      expect(original.getHeader('X-New')).toBeUndefined();
      expect(updated.getHeader('X-New')).toBe('header');
    });

    it('should return new instance from withoutHeader', () => {
      const original = new ServerRequest({
        headers: { 'X-Test': 'value' }
      });
      const updated = original.withoutHeader('X-Test');
      
      expect(updated).not.toBe(original);
      expect(original.getHeader('X-Test')).toBe('value');
      expect(updated.getHeader('X-Test')).toBeUndefined();
    });
  });

  describe('static factory', () => {
    it('should create request using build()', () => {
      const request = ServerRequest.build({
        method: 'POST',
        uri: new URL('https://api.example.com/users')
      });
      
      expect(request.getMethod()).toBe('POST');
      expect(request.getPath()).toBe('/users');
    });
  });

  describe('body handling', () => {
    it('should get body', () => {
      const request = new ServerRequest({
        body: { name: 'test', value: 123 }
      });
      
      expect(request.getBody()).toEqual({ name: 'test', value: 123 });
    });

    it('should get parsed body', () => {
      const request = new ServerRequest({
        body: { data: 'value' }
      });
      
      expect(request.getParsedBody()).toEqual({ data: 'value' });
    });

    it('should return null for non-object body', () => {
      const request = new ServerRequest({
        body: 'string body'
      });
      
      expect(request.getParsedBody()).toBeNull();
    });
  });

  describe('URL parsing', () => {
    it('should parse path correctly', () => {
      const request = new ServerRequest({
        uri: new URL('https://example.com/path/to/resource?query=value')
      });
      
      expect(request.getPath()).toBe('/path/to/resource');
    });

    it('should handle root path', () => {
      const request = new ServerRequest({
        uri: new URL('https://example.com/')
      });
      
      expect(request.getPath()).toBe('/');
    });

    it('should handle complex query strings', () => {
      const request = new ServerRequest({
        uri: new URL('https://example.com/search?q=test%20query&filter=type:article&page=2')
      });
      
      expect(request.getParam('q')).toBe('test query');
      expect(request.getParam('filter')).toBe('type:article');
      expect(request.getParam('page')).toBe('2');
    });
  });

  describe('real-world scenarios', () => {
    it('should parse typical ad tracker request', () => {
      const request = new ServerRequest({
        method: 'GET',
        uri: new URL('https://tracker.example.com/campaign/offer123?keyword=buy+shoes&source=google'),
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
          'Referer': 'https://google.com/',
          'X-Real-IP': '203.0.113.50',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        queryParams: {
          sub1: 'campaign1',
          sub2: 'adgroup2'
        }
      });
      
      expect(request.getMethod()).toBe('GET');
      expect(request.getPath()).toBe('/campaign/offer123');
      expect(request.getParam('keyword')).toBe('buy shoes');
      expect(request.getParam('source')).toBe('google');
      expect(request.getParam('sub1')).toBe('campaign1');
      expect(request.getClientIp()).toBe('203.0.113.50');
      expect(request.getUserAgent()).toContain('iPhone');
    });

    it('should handle CloudFlare-proxied request', () => {
      const request = new ServerRequest({
        headers: {
          'CF-Connecting-IP': '198.51.100.1',
          'CF-IPCountry': 'US',
          'X-Forwarded-For': '10.0.0.1, 198.51.100.1'
        }
      });
      
      expect(request.getClientIp()).toBe('198.51.100.1');
    });
  });
});
