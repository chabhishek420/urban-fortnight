/**
 * Tests for ClickDispatcher
 * 
 * Tests main click processing dispatcher
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { ClickDispatcher } from '../../../src/traffic/dispatcher/click-dispatcher.js';
import { Response } from '../../../src/traffic/response/response.js';
import { StatusCode } from '../../../src/traffic/response/status-code.js';

describe('ClickDispatcher', () => {
  let dispatcher: ClickDispatcher;

  beforeEach(() => {
    dispatcher = new ClickDispatcher();
  });

  describe('dispatch', () => {
    it('should return a Response', async () => {
      const mockRequest = createMockRequest();

      const response = await dispatcher.dispatch(mockRequest);

      expect(response).toBeInstanceOf(Response);
    });

    it('should return response with body', async () => {
      const mockRequest = createMockRequest();

      const response = await dispatcher.dispatch(mockRequest);

      expect(response.getBody()).toBeDefined();
    });

    it('should handle errors gracefully', async () => {
      const mockRequest = createMockRequest();

      // Should not throw
      const response = await dispatcher.dispatch(mockRequest);

      expect(response).toBeDefined();
    });
  });

  describe('process', () => {
    it('should return context unchanged', () => {
      const mockContext = { type: 'test' };

      const result = dispatcher.process(mockContext as any);

      expect(result).toBe(mockContext);
    });
  });

  describe('error handling', () => {
    it('should have getErrorResponse method', () => {
      // Access private method through any
      const errorResponse = (dispatcher as any).getErrorResponse('Test error');

      expect(errorResponse).toBeInstanceOf(Response);
    });

    it('should return NOT_IMPLEMENTED status by default', () => {
      const errorResponse = (dispatcher as any).getErrorResponse('Test error');

      expect(errorResponse.getStatus()).toBe(StatusCode.NOT_IMPLEMENTED);
    });

    it('should accept custom status code', () => {
      const errorResponse = (dispatcher as any).getErrorResponse('Test error', StatusCode.INTERNAL_SERVER_ERROR);

      expect(errorResponse.getStatus()).toBe(StatusCode.INTERNAL_SERVER_ERROR);
    });
  });

  describe('license check', () => {
    it('should have isLicenseExpired method', () => {
      const isExpired = (dispatcher as any).isLicenseExpired();

      expect(typeof isExpired).toBe('boolean');
    });

    it('should return false by default', () => {
      const isExpired = (dispatcher as any).isLicenseExpired();

      expect(isExpired).toBe(false);
    });
  });
});

/**
 * Helper to create mock server request
 */
function createMockRequest(): any {
  return {
    getQueryParams: () => ({}),
    getParsedBody: () => ({}),
    getParam: () => undefined,
    hasParam: () => false,
    getUri: () => new URL('http://example.com/test'),
    getHeader: () => undefined,
    getMethod: () => 'GET',
    getIp: () => '127.0.0.1',
    getClientIp: () => '127.0.0.1',
    getUserAgent: () => 'Test Agent'
  };
}
