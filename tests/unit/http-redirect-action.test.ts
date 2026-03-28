/**
 * HTTP Redirect Action Tests
 * 
 * Tests for the HTTP redirect action implementation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpRedirectAction } from '../../src/traffic/actions/http-redirect-action';
import { Payload } from '../../src/traffic/pipeline/payload';
import { RawClick } from '../../src/traffic/model/raw-click';
import { Response } from '../../src/traffic/response/response';
import { StatusCode } from '../../src/traffic/response/status-code';

// Mock server request
function createMockServerRequest(params: Record<string, string> = {}) {
  return {
    getIp: () => '127.0.0.1',
    getUserAgent: () => 'Test Agent',
    getReferrer: () => '',
    getUri: () => new URL('http://test.local/campaign'),
    getParam: (name: string) => params[name],
    getQueryParams: () => params,
    getHeaders: () => ({}),
    getHeader: () => undefined,
    getMethod: () => 'GET',
    getCookie: () => undefined,
    setCookie: vi.fn(),
    getQueryParam: (name: string) => params[name]
  } as any;
}

// Create test payload with real Response
function createTestPayload(actionPayload?: string, params: Record<string, string> = {}) {
  const rawClick = new RawClick({ sub_id: 'test-sub-id' });
  const mockRequest = createMockServerRequest(params);
  const mockResponse = new Response();
  
  const payload = new Payload({
    serverRequest: mockRequest,
    response: mockResponse,
    rawClick
  });
  
  if (actionPayload) {
    payload.setActionPayload(actionPayload);
  }
  
  return payload;
}

describe('HttpRedirectAction', () => {
  let action: HttpRedirectAction;

  beforeEach(() => {
    action = new HttpRedirectAction();
  });

  describe('properties', () => {
    it('should have correct name', () => {
      expect(action.getName()).toBe('http_redirect');
    });

    it('should have redirect type', () => {
      expect(action.getType()).toBe('redirect');
    });

    it('should have URL field type', () => {
      expect(action.getField()).toBe('url');
    });

    it('should have default weight', () => {
      expect(action.getWeight()).toBe(1);
    });
  });

  describe('execute', () => {
    it('should set Location header', () => {
      const payload = createTestPayload('https://example.com/offer');
      action.setPayload(payload);
      action.execute();
      
      const response = payload.getResponse();
      expect(response?.getHeader('Location')).toEqual(['https://example.com/offer']);
    });

    it('should set redirect status code', () => {
      const payload = createTestPayload('https://example.com/offer');
      action.setPayload(payload);
      action.execute();
      
      const response = payload.getResponse();
      expect(response?.getStatus()).toBe(StatusCode.FOUND);
    });

    it('should set destination on raw click', () => {
      const payload = createTestPayload('https://example.com/offer');
      action.setPayload(payload);
      action.execute();
      
      const rawClick = payload.getRawClick();
      expect(rawClick?.getDestination()).toBe('https://example.com/offer');
    });

    it('should handle URL with query parameters', () => {
      const payload = createTestPayload('https://example.com/offer?id=123&ref=test');
      action.setPayload(payload);
      action.execute();
      
      const response = payload.getResponse();
      expect(response?.getHeader('Location')).toEqual(['https://example.com/offer?id=123&ref=test']);
    });
  });

  describe('run', () => {
    it('should return payload after execution', () => {
      const payload = createTestPayload('https://example.com/offer');
      action.setPayload(payload);
      
      const result = action.run();
      expect(result).toBe(payload);
    });
  });

  describe('error handling', () => {
    it('should throw if payload not set', () => {
      expect(() => action.getPayload()).toThrow('Payload not set');
    });
  });
});
