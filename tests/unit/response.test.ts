/**
 * Response Tests
 * 
 * Tests for the HTTP response object
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Response } from '../../src/traffic/response/response';
import { StatusCode } from '../../src/traffic/response/status-code';
import { ContentType } from '../../src/traffic/response/content-type';

describe('Response', () => {
  let response: Response;

  beforeEach(() => {
    response = new Response();
  });

  describe('status code', () => {
    it('should default to 200 OK', () => {
      expect(response.getStatus()).toBe(StatusCode.OK);
    });

    it('should set status code with withStatus', () => {
      response.withStatus(StatusCode.FOUND);
      expect(response.getStatus()).toBe(StatusCode.FOUND);
    });

    it('should set 404 status', () => {
      response.withStatus(StatusCode.NOT_FOUND);
      expect(response.getStatus()).toBe(StatusCode.NOT_FOUND);
    });

    it('should set 500 status', () => {
      response.withStatus(StatusCode.INTERNAL_SERVER_ERROR);
      expect(response.getStatus()).toBe(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('should return same instance for chaining', () => {
      const result = response.withStatus(404);
      expect(result).toBe(response);
    });
  });

  describe('body', () => {
    it('should default to null body', () => {
      expect(response.getBody()).toBeNull();
    });

    it('should set body with withBody', () => {
      response.withBody('Hello World');
      expect(response.getBody()).toBe('Hello World');
    });

    it('should handle HTML content', () => {
      const html = '<html><body>Test</body></html>';
      response.withBody(html);
      expect(response.getBody()).toBe(html);
    });

    it('should handle JSON content', () => {
      const json = '{"status":"ok"}';
      response.withBody(json);
      expect(response.getBody()).toBe(json);
    });

    it('should handle large body', () => {
      const largeBody = 'x'.repeat(100000);
      response.withBody(largeBody);
      expect(response.getBody()).toBe(largeBody);
    });

    it('should accept null body', () => {
      response.withBody('test');
      response.withBody(null);
      expect(response.getBody()).toBeNull();
    });

    it('should accept Buffer body', () => {
      const buffer = Buffer.from('binary data');
      response.withBody(buffer);
      expect(response.getBody()).toBe(buffer);
    });
  });

  describe('headers', () => {
    it('should default to empty headers', () => {
      expect(response.getHeaders()).toEqual({});
    });

    it('should set header with withHeader', () => {
      response.withHeader('Content-Type', 'text/html');
      expect(response.getHeader('Content-Type')).toEqual(['text/html']);
    });

    it('should set multiple headers', () => {
      response
        .withHeader('Content-Type', 'application/json')
        .withHeader('X-Custom-Header', 'custom-value');
      
      expect(response.getHeader('Content-Type')).toEqual(['application/json']);
      expect(response.getHeader('X-Custom-Header')).toEqual(['custom-value']);
    });

    it('should handle array values for headers', () => {
      response.withHeader('Set-Cookie', ['cookie1=value1', 'cookie2=value2']);
      expect(response.getHeader('Set-Cookie')).toEqual(['cookie1=value1', 'cookie2=value2']);
    });

    it('should overwrite existing header', () => {
      response.withHeader('X-Test', 'first');
      response.withHeader('X-Test', 'second');
      
      expect(response.getHeader('X-Test')).toEqual(['second']);
    });

    it('should append to header with appendHeader', () => {
      response
        .withHeader('Set-Cookie', 'cookie1=value1')
        .appendHeader('Set-Cookie', 'cookie2=value2');
      
      expect(response.getHeader('Set-Cookie')).toEqual(['cookie1=value1', 'cookie2=value2']);
    });

    it('should remove header with withoutHeader', () => {
      response.withHeader('X-Test', 'value');
      response.withoutHeader('X-Test');
      
      expect(response.getHeader('X-Test')).toBeUndefined();
    });
  });

  describe('chaining', () => {
    it('should support method chaining', () => {
      response
        .withStatus(StatusCode.FOUND)
        .withHeader('Location', 'https://example.com')
        .withBody('Redirecting...');
      
      expect(response.getStatus()).toBe(StatusCode.FOUND);
      expect(response.getHeader('Location')).toEqual(['https://example.com']);
      expect(response.getBody()).toBe('Redirecting...');
    });
  });

  describe('mutability', () => {
    it('should modify same instance when setting status', () => {
      const result = response.withStatus(404);
      expect(result.getStatus()).toBe(404);
      expect(response.getStatus()).toBe(404);
    });

    it('should modify same instance when setting body', () => {
      response.withBody('New body');
      expect(response.getBody()).toBe('New body');
    });

    it('should modify same instance when setting header', () => {
      response.withHeader('X-Test', 'value');
      expect(response.getHeader('X-Test')).toEqual(['value']);
    });
  });

  describe('cache control', () => {
    it('should disable cache with withCacheDisabled', () => {
      response.withCacheDisabled();
      
      expect(response.isCacheDisabled()).toBe(true);
      expect(response.getHeader('Cache-Control')).toEqual(['no-store, no-cache, must-revalidate']);
      expect(response.getHeader('Pragma')).toEqual(['no-cache']);
    });
  });

  describe('static factory methods', () => {
    it('should create response with build()', () => {
      const r = Response.build();
      expect(r).toBeInstanceOf(Response);
      expect(r.getStatus()).toBe(StatusCode.OK);
    });

    it('should create HTML response with buildHtml()', () => {
      const r = Response.buildHtml({ body: '<html></html>' });
      
      expect(r.getStatus()).toBe(StatusCode.OK);
      expect(r.getHeader('Content-Type')).toEqual([ContentType.HTML]);
      expect(r.getBody()).toBe('<html></html>');
    });

    it('should create JSON response with buildJson()', () => {
      const r = Response.buildJson({ body: { success: true } });
      
      expect(r.getStatus()).toBe(StatusCode.OK);
      expect(r.getHeader('Content-Type')).toEqual([ContentType.JSON]);
      expect(r.getBody()).toBe('{"success":true}');
    });

    it('should create redirect response with buildRedirect()', () => {
      const r = Response.buildRedirect('https://example.com/offer');
      
      expect(r.getStatus()).toBe(StatusCode.FOUND);
      expect(r.getHeader('Location')).toEqual(['https://example.com/offer']);
    });

    it('should create text response with buildText()', () => {
      const r = Response.buildText('Plain text content');
      
      expect(r.getStatus()).toBe(StatusCode.OK);
      expect(r.getHeader('Content-Type')).toEqual([ContentType.TEXT]);
      expect(r.getBody()).toBe('Plain text content');
    });
  });

  describe('constructor options', () => {
    it('should accept status in constructor', () => {
      const r = new Response({ status: 404 });
      expect(r.getStatus()).toBe(404);
    });

    it('should accept headers in constructor', () => {
      const r = new Response({ headers: { 'Content-Type': 'application/json' } });
      expect(r.getHeader('Content-Type')).toEqual(['application/json']);
    });

    it('should accept body in constructor', () => {
      const r = new Response({ body: 'test body' });
      expect(r.getBody()).toBe('test body');
    });

    it('should accept disableCache in constructor', () => {
      const r = new Response({ disableCache: true });
      expect(r.isCacheDisabled()).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      response.withStatus(200).withHeader('Content-Type', 'text/html');
      const str = response.toString();
      
      expect(str).toContain('Response');
      expect(str).toContain('200');
      expect(str).toContain('Content-Type');
    });
  });

  describe('common response patterns', () => {
    it('should create redirect response', () => {
      response
        .withStatus(StatusCode.FOUND)
        .withHeader('Location', 'https://example.com/offer');
      
      expect(response.getStatus()).toBe(StatusCode.FOUND);
      expect(response.getHeader('Location')).toEqual(['https://example.com/offer']);
    });

    it('should create HTML response', () => {
      response
        .withHeader(ContentType.HEADER, ContentType.HTML)
        .withBody('<html><body>Hello</body></html>');
      
      expect(response.getHeader('Content-Type')).toEqual([ContentType.HTML]);
      expect(response.getBody()).toContain('<html>');
    });

    it('should create JSON response', () => {
      response
        .withHeader(ContentType.HEADER, ContentType.JSON)
        .withBody('{"success":true}');
      
      expect(response.getHeader('Content-Type')).toEqual([ContentType.JSON]);
      expect(response.getBody()).toBe('{"success":true}');
    });

    it('should create 404 response', () => {
      response
        .withStatus(StatusCode.NOT_FOUND)
        .withBody('Not Found');
      
      expect(response.getStatus()).toBe(StatusCode.NOT_FOUND);
    });
  });
});

describe('StatusCode constants', () => {
  it('should have correct status codes', () => {
    expect(StatusCode.OK).toBe(200);
    expect(StatusCode.MOVED_PERMANENTLY).toBe(301);
    expect(StatusCode.FOUND).toBe(302);
    expect(StatusCode.SEE_OTHER).toBe(303);
    expect(StatusCode.NOT_FOUND).toBe(404);
    expect(StatusCode.INTERNAL_SERVER_ERROR).toBe(500);
  });
});

describe('ContentType constants', () => {
  it('should have correct content types', () => {
    expect(ContentType.HEADER).toBe('Content-Type');
    expect(ContentType.HTML).toBe('text/html');
    expect(ContentType.JSON).toBe('application/json');
    expect(ContentType.JAVASCRIPT).toBe('application/javascript');
    expect(ContentType.TEXT).toBe('text/plain');
  });
});
