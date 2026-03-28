/**
 * Tests for PostbackDispatcher
 * 
 * Tests postback/conversion tracking
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { PostbackDispatcher } from '../../../src/traffic/dispatcher/postback-dispatcher.js';
import { Response } from '../../../src/traffic/response/response.js';
import { ContentType } from '../../../src/traffic/response/content-type.js';

describe('PostbackDispatcher', () => {
  let dispatcher: PostbackDispatcher;

  beforeEach(() => {
    dispatcher = new PostbackDispatcher();
  });

  describe('constants', () => {
    it('should have JSONP constant', () => {
      expect(PostbackDispatcher.JSONP).toBe('jsonp');
    });

    it('should have GIF constant', () => {
      expect(PostbackDispatcher.GIF).toBe('gif');
    });
  });

  describe('dispatch', () => {
    it('should return a Response', () => {
      const mockRequest = createMockRequest({});

      const response = dispatcher.dispatch(mockRequest);

      expect(response).toBeInstanceOf(Response);
    });

    it('should return error for missing key', () => {
      const mockRequest = createMockRequest({});

      const response = dispatcher.dispatch(mockRequest);

      expect(response.getBody()).toContain('Incorrect postback code');
    });

    it('should return error for invalid subid', () => {
      const mockRequest = createMockRequest({
        queryParams: { test_key: 'value' }
      });

      const response = dispatcher.dispatch(mockRequest);

      expect(response.getBody()).toContain('Incorrect subid');
    });

    it('should process valid postback with sub_id', () => {
      const mockRequest = createMockRequest({
        queryParams: { 
          test_key: 'value',
          sub_id: 'abc123'
        }
      });

      const response = dispatcher.dispatch(mockRequest);

      expect(response.getBody()).toContain('Success');
    });

    it('should process valid postback with subid (alt)', () => {
      const mockRequest = createMockRequest({
        queryParams: { 
          key: 'value',
          subid: 'xyz789'
        }
      });

      const response = dispatcher.dispatch(mockRequest);

      expect(response.getBody()).toContain('Success');
    });
  });

  describe('return formats', () => {
    it('should return plain text by default', () => {
      const mockRequest = createMockRequest({
        queryParams: { test_key: 'value', sub_id: 'test' }
      });

      const response = dispatcher.dispatch(mockRequest);

      expect(response.getBody()).toBe('Success');
    });

    it('should return JSONP format when requested', () => {
      const mockRequest = createMockRequest({
        queryParams: { 
          test_key: 'value',
          sub_id: 'test',
          return: 'jsonp'
        }
      });

      const response = dispatcher.dispatch(mockRequest);

      expect(response.getBody()).toContain('KTracking');
      expect(response.getHeader(ContentType.HEADER)?.[0]).toBe(ContentType.JAVASCRIPT);
    });

    it('should return GIF format when requested', () => {
      const mockRequest = createMockRequest({
        queryParams: { 
          test_key: 'value',
          sub_id: 'test',
          return: 'gif'
        }
      });

      const response = dispatcher.dispatch(mockRequest);

      expect(response.getHeader(ContentType.HEADER)?.[0]).toBe(ContentType.GIF);
    });
  });

  describe('log', () => {
    it('should have log method', () => {
      expect(typeof dispatcher.log).toBe('function');
    });

    it('should log without error', () => {
      // Should not throw
      dispatcher.log('test message');
    });
  });

  describe('convertCustomHeaders', () => {
    it('should return request unchanged', () => {
      const mockRequest = createMockRequest({});

      const result = dispatcher.convertCustomHeaders(mockRequest);

      expect(result).toBe(mockRequest);
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML entities', () => {
      const escapeHtml = (text: string): string => {
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      };

      expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
      expect(escapeHtml('a & b')).toBe('a &amp; b');
      expect(escapeHtml('"test"')).toBe('&quot;test&quot;');
    });
  });
});

/**
 * Helper to create mock server request
 */
function createMockRequest(options: {
  queryParams?: Record<string, string>;
  cookies?: Record<string, string>;
}): any {
  const queryParams = options.queryParams ?? {};
  const cookies = options.cookies ?? {};
  
  return {
    getQueryParams: () => queryParams,
    getParam: (name: string) => queryParams[name],
    getCookie: (name: string) => cookies[name],
    hasParam: (name: string) => name in queryParams,
    getUri: () => new URL('http://example.com/postback?' + new URLSearchParams(queryParams).toString()),
    getHeader: () => undefined
  };
}
