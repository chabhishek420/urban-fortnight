/**
 * Tests for SetCookieStage
 * 
 * Tests cookie setting for visitor tracking
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { SetCookieStage } from '../../../src/traffic/pipeline/stage/set-cookie-stage.js';
import { GenerateTokenStage } from '../../../src/traffic/pipeline/stage/generate-token-stage.js';
import { Payload } from '../../../src/traffic/pipeline/payload.js';
import { TrafficLogEntry } from '../../../src/traffic/logging/traffic-log-entry.js';
import { RawClick } from '../../../src/traffic/model/raw-click.js';
import { Response } from '../../../src/traffic/response/response.js';
import { ServerRequest } from '../../../src/traffic/request/server-request.js';

describe('SetCookieStage', () => {
  let stage: SetCookieStage;
  let logEntry: TrafficLogEntry;

  beforeEach(() => {
    stage = new SetCookieStage();
    logEntry = new TrafficLogEntry();
  });

  describe('constants', () => {
    it('should have HEADER_LIMIT_FOR_COOKIES constant', () => {
      expect(SetCookieStage.HEADER_LIMIT_FOR_COOKIES).toBe(3060);
    });
  });

  describe('process', () => {
    it('should process without error when response is set', () => {
      const payload = createValidPayload();
      
      const result = stage.process(payload, logEntry);

      expect(result).toBe(payload);
    });

    it('should throw when response is not set', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      rawClick.setSubId('test_subid');
      payload.setRawClick(rawClick);

      expect(() => stage.process(payload, logEntry)).toThrow();
    });

    it('should set subid cookie when rawClick exists', () => {
      const rawClick = new RawClick();
      rawClick.setSubId('abc123');
      
      const payload = createValidPayloadWithClick(rawClick);
      
      stage.process(payload, logEntry);

      const cookies = payload.getResponse()?.getHeader('Set-Cookie');
      expect(cookies).toBeDefined();
      expect(cookies?.some(c => c.includes('subid=abc123'))).toBe(true);
    });
  });

  describe('binding cookies', () => {
    it('should set landing binding cookie when enabled', () => {
      const rawClick = new RawClick();
      rawClick.setSubId('test123');
      
      const payload = createValidPayloadWithClick(rawClick);
      payload.enableCookieBindLanding();
      payload.setLanding({ getId: () => 55 } as any);

      stage.process(payload, logEntry);

      const cookies = payload.getResponse()?.getHeader('Set-Cookie');
      expect(cookies?.some(c => c.includes('landing_binding=55'))).toBe(true);
    });

    it('should set offer binding cookie when enabled', () => {
      const rawClick = new RawClick();
      rawClick.setSubId('test123');
      
      const payload = createValidPayloadWithClick(rawClick);
      payload.enableCookieBindOffer();
      payload.setOffer({ getId: () => 77 } as any);

      stage.process(payload, logEntry);

      const cookies = payload.getResponse()?.getHeader('Set-Cookie');
      expect(cookies?.some(c => c.includes('offer_binding=77'))).toBe(true);
    });

    it('should set stream binding cookie when enabled', () => {
      const rawClick = new RawClick();
      rawClick.setSubId('test123');
      
      const payload = createValidPayloadWithClick(rawClick);
      payload.enableCookieBindStream();
      payload.setStream({ getId: () => 99 } as any);

      stage.process(payload, logEntry);

      const cookies = payload.getResponse()?.getHeader('Set-Cookie');
      expect(cookies?.some(c => c.includes('stream_binding=99'))).toBe(true);
    });
  });

  describe('token cookie', () => {
    it('should set token cookie when save token is required', () => {
      const rawClick = new RawClick();
      rawClick.setSubId('test123');
      rawClick.set('token', 'test_token_value');
      
      const payload = createValidPayloadWithClick(rawClick);
      payload.enableSaveToken();

      stage.process(payload, logEntry);

      const cookies = payload.getResponse()?.getHeader('Set-Cookie');
      expect(cookies?.some(c => c.includes(`${GenerateTokenStage.TOKEN_PARAM}=test_token_value`))).toBe(true);
    });

    it('should not set token cookie when token exceeds limit', () => {
      const rawClick = new RawClick();
      rawClick.setSubId('test123');
      rawClick.set('token', 'x'.repeat(4000)); // Exceeds 3060 limit
      
      const payload = createValidPayloadWithClick(rawClick);
      payload.enableSaveToken();

      stage.process(payload, logEntry);

      const cookies = payload.getResponse()?.getHeader('Set-Cookie');
      // Token cookie should not be set due to size limit
      expect(cookies?.some(c => c.includes('_token='))).toBe(false);
    });
  });

  describe('uniqueness cookies', () => {
    it('should process when save uniqueness is enabled', () => {
      const rawClick = new RawClick();
      rawClick.setSubId('unique123');
      
      const payload = createValidPayloadWithClick(rawClick);
      payload.enableSaveUniquenessId();
      // Campaign is needed for uniqueness cookies
      payload.setCampaign({ getId: () => 1 } as any);

      // Should not throw
      const result = stage.process(payload, logEntry);
      expect(result).toBe(payload);
    });
  });
});

/**
 * Helper to create valid payload
 */
function createValidPayload(): Payload {
  const payload = new Payload();
  const response = new Response();
  const rawClick = new RawClick();
  const mockRequest = {
    getQueryParams: () => ({}),
    getParam: () => undefined,
    hasParam: () => false,
    getUri: () => new URL('http://example.com/test'),
    getHeader: () => undefined
  } as unknown as ServerRequest;

  payload.setResponse(response);
  payload.setRawClick(rawClick);
  payload.setServerRequest(mockRequest);

  return payload;
}

/**
 * Helper to create payload with click data
 */
function createValidPayloadWithClick(rawClick: RawClick): Payload {
  const payload = new Payload();
  const response = new Response();
  const mockRequest = {
    getQueryParams: () => ({}),
    getParam: () => undefined,
    hasParam: () => false,
    getUri: () => new URL('http://example.com/test'),
    getHeader: () => undefined
  } as unknown as ServerRequest;

  payload.setResponse(response);
  payload.setRawClick(rawClick);
  payload.setServerRequest(mockRequest);

  return payload;
}
