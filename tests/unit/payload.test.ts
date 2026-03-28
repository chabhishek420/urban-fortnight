/**
 * Payload Tests
 * 
 * Tests for the pipeline payload that carries state through stages
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Payload } from '../../src/traffic/pipeline/payload';
import { RawClick } from '../../src/traffic/model/raw-click';

// Mock server request
function createMockServerRequest() {
  return {
    getIp: () => '127.0.0.1',
    getUserAgent: () => 'Test Agent',
    getReferrer: () => '',
    getUri: () => new URL('http://test.local/campaign'),
    getParam: () => undefined,
    getQueryParams: () => ({}),
    getHeaders: () => ({}),
    getHeader: () => undefined,
    getMethod: () => 'GET',
    getCookie: () => undefined,
    setCookie: vi.fn(),
    getQueryParam: () => undefined
  } as any;
}

// Mock response
function createMockResponse() {
  let status = 200;
  let body = '';
  const headers: Record<string, string> = {};
  
  return {
    getStatus: () => status,
    getBody: () => body,
    getHeaders: () => ({ ...headers }),
    getHeader: (name: string) => headers[name.toLowerCase()],
    withStatus: vi.fn((s: number) => { status = s; return this; }),
    withBody: vi.fn((b: string) => { body = b; return this; }),
    withHeader: vi.fn((name: string, value: string) => {
      headers[name.toLowerCase()] = value;
      return this;
    })
  } as any;
}

// Mock campaign
function createMockCampaign(id: number = 1) {
  return {
    getId: () => id,
    getName: () => 'Test Campaign',
    getAlias: () => 'test-campaign',
    isActive: () => true,
    getState: () => 'active'
  } as any;
}

// Mock stream
function createMockStream() {
  return {
    getId: () => 1,
    getName: () => 'Test Stream',
    getType: () => 'offer',
    getActionType: () => 'http_redirect'
  } as any;
}

// Mock offer
function createMockOffer() {
  return {
    getId: () => 1,
    getName: () => 'Test Offer',
    getUrl: () => 'https://example.com/offer'
  } as any;
}

// Mock landing
function createMockLanding() {
  return {
    getId: () => 1,
    getName: () => 'Test Landing',
    getUrl: () => 'https://example.com/landing'
  } as any;
}

describe('Payload', () => {
  let payload: Payload;
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(() => {
    mockRequest = createMockServerRequest();
    mockResponse = createMockResponse();
    payload = new Payload({
      serverRequest: mockRequest,
      response: mockResponse
    });
  });

  describe('constructor', () => {
    it('should create payload with options', () => {
      const rawClick = new RawClick({ sub_id: 'test' });
      const p = new Payload({
        serverRequest: mockRequest,
        response: mockResponse,
        rawClick
      });
      
      expect(p.getRawClick()).toBe(rawClick);
    });

    it('should create empty payload', () => {
      const p = new Payload();
      expect(() => p.getServerRequest()).toThrow('ServerRequest not set');
    });
  });

  describe('server request', () => {
    it('should get server request', () => {
      expect(payload.getServerRequest()).toBe(mockRequest);
    });

    it('should set server request', () => {
      const newRequest = createMockServerRequest();
      payload.setServerRequest(newRequest);
      expect(payload.getServerRequest()).toBe(newRequest);
    });

    it('should throw when setting null server request', () => {
      expect(() => payload.setServerRequest(null as any)).toThrow();
    });
  });

  describe('response', () => {
    it('should get response', () => {
      expect(payload.getResponse()).toBe(mockResponse);
    });

    it('should set response', () => {
      const newResponse = createMockResponse();
      payload.setResponse(newResponse);
      expect(payload.getResponse()).toBe(newResponse);
    });

    it('should throw when setting null response', () => {
      expect(() => payload.setResponse(null as any)).toThrow();
    });
  });

  describe('raw click', () => {
    it('should get and set raw click', () => {
      const rawClick = new RawClick({ sub_id: 'test-click' });
      payload.setRawClick(rawClick);
      expect(payload.getRawClick()).toBe(rawClick);
    });

    it('should return null when not set', () => {
      const p = new Payload({ serverRequest: mockRequest, response: mockResponse });
      expect(p.getRawClick()).toBeNull();
    });
  });

  describe('campaign', () => {
    it('should get and set campaign', () => {
      const campaign = createMockCampaign();
      payload.setCampaign(campaign);
      expect(payload.getCampaign()).toBe(campaign);
    });

    it('should allow null campaign', () => {
      payload.setCampaign(null);
      expect(payload.getCampaign()).toBeNull();
    });
  });

  describe('stream', () => {
    it('should get and set stream', () => {
      const stream = createMockStream();
      payload.setStream(stream);
      expect(payload.getStream()).toBe(stream);
    });
  });

  describe('offer', () => {
    it('should get and set offer', () => {
      const offer = createMockOffer();
      payload.setOffer(offer);
      expect(payload.getOffer()).toBe(offer);
    });
  });

  describe('landing', () => {
    it('should get and set landing', () => {
      const landing = createMockLanding();
      payload.setLanding(landing);
      expect(payload.getLanding()).toBe(landing);
    });
  });

  describe('action', () => {
    it('should get and set action type', () => {
      payload.setActionType('http_redirect');
      expect(payload.getActionType()).toBe('http_redirect');
    });

    it('should get and set action payload', () => {
      payload.setActionPayload('https://example.com');
      expect(payload.getActionPayload()).toBe('https://example.com');
    });

    it('should get and set action options', () => {
      const options = { timeout: 5000 };
      payload.setActionOptions(options);
      expect(payload.getActionOptions()).toEqual(options);
    });

    it('should get individual action option', () => {
      payload.setActionOptions({ timeout: 5000, retry: 3 });
      expect(payload.getActionOption<number>('timeout')).toBe(5000);
      expect(payload.getActionOption<number>('retry')).toBe(3);
      expect(payload.getActionOption('nonexistent')).toBeNull();
    });
  });

  describe('forced IDs', () => {
    it('should get and set forced offer ID', () => {
      payload.setForcedOfferId(123);
      expect(payload.getForcedOfferId()).toBe(123);
    });

    it('should get and set forced campaign ID', () => {
      payload.setForcedCampaignId(456);
      expect(payload.getForcedCampaignId()).toBe(456);
    });

    it('should get and set forced stream ID', () => {
      payload.setForcedStreamId(789);
      expect(payload.getForcedStreamId()).toBe(789);
    });
  });

  describe('flags', () => {
    it('should handle token needed flag', () => {
      expect(payload.isTokenNeeded()).toBe(false);
      payload.setNeedToken(true);
      expect(payload.isTokenNeeded()).toBe(true);
    });

    it('should handle add token to URL flag', () => {
      expect(payload.shouldAddTokenToUrl()).toBe(false);
      payload.setAddTokenToUrl(true);
      expect(payload.shouldAddTokenToUrl()).toBe(true);
    });

    it('should handle force redirect offer flag', () => {
      expect(payload.isForceRedirectOffer()).toBe(false);
      payload.setForceRedirectOffer(true);
      expect(payload.isForceRedirectOffer()).toBe(true);
    });

    it('should handle force choose offer flag', () => {
      expect(payload.isForceChooseOffer()).toBe(false);
      payload.setForceChooseOffer(true);
      expect(payload.isForceChooseOffer()).toBe(true);
    });

    it('should handle aborted flag', () => {
      expect(payload.isAborted()).toBe(false);
      payload.abort();
      expect(payload.isAborted()).toBe(true);
      payload.abort(false);
      expect(payload.isAborted()).toBe(false);
    });
  });

  describe('cookie binding', () => {
    it('should handle cookie bind stream flag', () => {
      expect(payload.isCookieStreamBinded()).toBe(false);
      payload.enableCookieBindStream();
      expect(payload.isCookieStreamBinded()).toBe(true);
    });

    it('should handle cookie bind landing flag', () => {
      expect(payload.isCookieLandingBinded()).toBe(false);
      payload.enableCookieBindLanding();
      expect(payload.isCookieLandingBinded()).toBe(true);
    });

    it('should handle cookie bind offer flag', () => {
      expect(payload.isCookieOfferBinded()).toBe(false);
      payload.enableCookieBindOffer();
      expect(payload.isCookieOfferBinded()).toBe(true);
    });

    it('should handle save token flag', () => {
      expect(payload.isSaveTokenRequired()).toBe(false);
      payload.enableSaveToken();
      expect(payload.isSaveTokenRequired()).toBe(true);
    });

    it('should handle save uniqueness ID flag', () => {
      expect(payload.isSaveUniquenessRequired()).toBe(false);
      payload.enableSaveUniquenessId();
      expect(payload.isSaveUniquenessRequired()).toBe(true);
    });
  });

  describe('raw clicks to store', () => {
    it('should start with empty array', () => {
      expect(payload.getRawClicksToStore()).toEqual([]);
    });

    it('should add raw clicks to store', () => {
      const click1 = new RawClick({ sub_id: 'click1' });
      const click2 = new RawClick({ sub_id: 'click2' });
      
      payload.addRawClickToStore(click1);
      payload.addRawClickToStore(click2);
      
      const clicks = payload.getRawClicksToStore();
      expect(clicks).toHaveLength(2);
      expect(clicks[0]).toBe(click1);
      expect(clicks[1]).toBe(click2);
    });
  });
});
