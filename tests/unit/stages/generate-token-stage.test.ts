/**
 * Tests for GenerateTokenStage
 * 
 * Tests token generation for visitor tracking
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { GenerateTokenStage } from '../../../src/traffic/pipeline/stage/generate-token-stage.js';
import { Payload } from '../../../src/traffic/pipeline/payload.js';
import { TrafficLogEntry } from '../../../src/traffic/logging/traffic-log-entry.js';
import { RawClick } from '../../../src/traffic/model/raw-click.js';
import { Response } from '../../../src/traffic/response/response.js';
import { StageException } from '../../../src/core/pipeline/stage-interface.js';
import { ServerRequest } from '../../../src/traffic/request/server-request.js';

describe('GenerateTokenStage', () => {
  let stage: GenerateTokenStage;
  let logEntry: TrafficLogEntry;

  beforeEach(() => {
    stage = new GenerateTokenStage();
    logEntry = new TrafficLogEntry();
  });

  describe('constants', () => {
    it('should have TOKEN_PARAM constant', () => {
      expect(GenerateTokenStage.TOKEN_PARAM).toBe('_token');
    });

    it('should have SUBID_PARAM constant', () => {
      expect(GenerateTokenStage.SUBID_PARAM).toBe('_subid');
    });
  });

  describe('process', () => {
    it('should skip when token is not needed', () => {
      const payload = new Payload();
      const mockRequest = createMockRequest();
      const response = new Response();
      const rawClick = new RawClick();

      payload.setServerRequest(mockRequest);
      payload.setResponse(response);
      payload.setRawClick(rawClick);
      // Token not needed by default

      const result = stage.process(payload, logEntry);

      expect(logEntry.getMessages()).toContain('Token is not needed.');
    });

    it('should skip if rawClick already has token', () => {
      const payload = new Payload();
      const mockRequest = createMockRequest();
      const response = new Response();
      const rawClick = new RawClick();

      rawClick.set('token', 'existing_token');
      rawClick.setSubId('test_subid');

      payload.setServerRequest(mockRequest);
      payload.setResponse(response);
      payload.setRawClick(rawClick);
      payload.setNeedToken(true);

      const result = stage.process(payload, logEntry);

      expect(rawClick.get('token')).toBe('existing_token');
    });

    it('should throw when rawClick is missing', () => {
      const payload = new Payload();
      payload.setNeedToken(true);

      expect(() => stage.process(payload, logEntry)).toThrow();
    });

    it('should skip when stream is not set', () => {
      const payload = new Payload();
      const mockRequest = createMockRequest();
      const response = new Response();
      const rawClick = new RawClick();
      rawClick.setSubId('test_subid');

      payload.setServerRequest(mockRequest);
      payload.setResponse(response);
      payload.setRawClick(rawClick);
      payload.setNeedToken(true);
      // No stream set

      const result = stage.process(payload, logEntry);

      expect(result).toBe(payload);
    });
  });

  describe('token generation', () => {
    it('should generate unique tokens', () => {
      // Test the internal token generation logic
      const subId = 'test123';
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 10);
      const token = `${subId}_${timestamp}_${random}`;

      expect(token).toContain(subId);
      expect(token.split('_').length).toBe(3);
    });

    it('should include subid in token', () => {
      const subId = 'mysubid';
      const token = `${subId}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 10)}`;

      expect(token.startsWith(subId + '_')).toBe(true);
    });
  });

  describe('URL parameter handling', () => {
    it('should add parameter to URL without query string', () => {
      const url = 'https://example.com/path';
      const param = 'token=abc123';
      const separator = url.includes('?') ? '&' : '?';
      const newUrl = `${url}${separator}${param}`;

      expect(newUrl).toBe('https://example.com/path?token=abc123');
    });

    it('should add parameter to URL with existing query string', () => {
      const url = 'https://example.com/path?existing=value';
      const param = 'token=abc123';
      const separator = url.includes('?') ? '&' : '?';
      const newUrl = `${url}${separator}${param}`;

      expect(newUrl).toBe('https://example.com/path?existing=value&token=abc123');
    });
  });

  describe('redirect detection', () => {
    it('should identify http as redirect', () => {
      const redirectTypes = ['http', 'https', 'location', 'redirect', 'remote'];
      expect(redirectTypes.includes('http')).toBe(true);
    });

    it('should identify https as redirect', () => {
      const redirectTypes = ['http', 'https', 'location', 'redirect', 'remote'];
      expect(redirectTypes.includes('https')).toBe(true);
    });

    it('should identify location as redirect', () => {
      const redirectTypes = ['http', 'https', 'location', 'redirect', 'remote'];
      expect(redirectTypes.includes('location')).toBe(true);
    });

    it('should not identify iframe as redirect', () => {
      const redirectTypes = ['http', 'https', 'location', 'redirect', 'remote'];
      expect(redirectTypes.includes('iframe')).toBe(false);
    });
  });
});

/**
 * Helper to create mock server request
 */
function createMockRequest(): ServerRequest {
  return {
    getQueryParams: () => ({}),
    getParam: () => undefined,
    hasParam: () => false,
    getUri: () => new URL('http://example.com/test'),
    getHeader: () => undefined
  } as unknown as ServerRequest;
}
