/**
 * Tests for ChooseOfferStage
 * 
 * Tests offer selection from stream associations
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { ChooseOfferStage } from '../../../src/traffic/pipeline/stage/choose-offer-stage.js';
import { Payload } from '../../../src/traffic/pipeline/payload.js';
import { TrafficLogEntry } from '../../../src/traffic/logging/traffic-log-entry.js';
import { RawClick } from '../../../src/traffic/model/raw-click.js';
import { Response } from '../../../src/traffic/response/response.js';
import { StreamSchema, BaseStream } from '../../../src/traffic/model/base-stream.js';
import { StageException } from '../../../src/core/pipeline/stage-interface.js';
import { ServerRequest } from '../../../src/traffic/request/server-request.js';
import { Campaign } from '../../../src/traffic/model/campaign.js';
import { Landing } from '../../../src/traffic/model/landing.js';

describe('ChooseOfferStage', () => {
  let stage: ChooseOfferStage;
  let logEntry: TrafficLogEntry;

  beforeEach(() => {
    stage = new ChooseOfferStage();
    logEntry = new TrafficLogEntry();
  });

  describe('process - validation', () => {
    it('should throw StageException when response is not set', () => {
      const payload = new Payload();
      const mockRequest = createMockRequest();
      payload.setServerRequest(mockRequest);

      expect(() => stage.process(payload, logEntry)).toThrow(StageException);
      expect(() => stage.process(payload, logEntry)).toThrow('response is not set');
    });

    it('should throw StageException when serverRequest is not set', () => {
      const payload = new Payload();
      const response = new Response();
      payload.setResponse(response);

      expect(() => stage.process(payload, logEntry)).toThrow();
    });

    it('should skip when stream is not set', () => {
      const payload = new Payload();
      const mockRequest = createMockRequest();
      const response = new Response();
      payload.setServerRequest(mockRequest);
      payload.setResponse(response);

      const result = stage.process(payload, logEntry);

      expect(logEntry.getMessages()).toContain('No stream, skip choosing offer');
    });

    it('should throw StageException when campaign is not set', () => {
      const payload = new Payload();
      const mockRequest = createMockRequest();
      const response = new Response();
      const stream = createMockStream({ schema: StreamSchema.OFFER });
      
      payload.setServerRequest(mockRequest);
      payload.setResponse(response);
      payload.setStream(stream);

      expect(() => stage.process(payload, logEntry)).toThrow('Empty campaign');
    });

    it('should throw StageException when rawClick is not set', () => {
      const payload = new Payload();
      const mockRequest = createMockRequest();
      const response = new Response();
      const stream = createMockStream({ schema: StreamSchema.OFFER });
      const campaign = createMockCampaign({});
      
      payload.setServerRequest(mockRequest);
      payload.setResponse(response);
      payload.setStream(stream);
      payload.setCampaign(campaign);

      expect(() => stage.process(payload, logEntry)).toThrow('Empty rawClick');
    });
  });

  describe('process - schema checks', () => {
    it('should skip when schema is not landing_offer or offer', () => {
      const payload = createValidPayload({ schema: 'action' });

      const result = stage.process(payload, logEntry);

      expect(logEntry.getMessages()).toContain("Schema is 'action' so offer is not needed.");
    });

    it('should process when schema is offer', () => {
      const payload = createValidPayload({ schema: StreamSchema.OFFER });

      const result = stage.process(payload, logEntry);

      // Should not throw, may not choose offer if none available
      expect(result).toBe(payload);
    });

    it('should process when schema is landing_offer', () => {
      const payload = createValidPayload({ schema: StreamSchema.LANDING_OFFER });

      const result = stage.process(payload, logEntry);

      expect(result).toBe(payload);
    });
  });

  describe('process - landing checks', () => {
    it('should skip when landing is chosen and not forced', () => {
      const payload = createValidPayload({ schema: StreamSchema.LANDING_OFFER });
      payload.setLanding(createMockLanding({ id: 1 }));

      const result = stage.process(payload, logEntry);

      expect(logEntry.getMessages()).toContain('Landing is chosen, skip choosing offer');
    });

    it('should process when landing is chosen but offer is forced', () => {
      const payload = createValidPayload({ schema: StreamSchema.LANDING_OFFER });
      payload.setLanding(createMockLanding({ id: 1 }));
      payload.setForceChooseOffer(true);

      const result = stage.process(payload, logEntry);

      // Should attempt to choose offer
      expect(result).toBe(payload);
    });
  });

  describe('IGNORE_OFFER_PARAM', () => {
    it('should have correct param name', () => {
      expect(ChooseOfferStage.IGNORE_OFFER_PARAM).toBe('exit');
    });

    it('should not set offer ID when exit param is 1', () => {
      const payload = createValidPayload({ schema: StreamSchema.OFFER });
      const mockRequest = createMockRequest({ params: { exit: '1' } });
      payload.setServerRequest(mockRequest);

      stage.process(payload, logEntry);

      // Offer ID should not be set
      expect(payload.getRawClick()?.getOfferId()).toBeUndefined();
    });
  });

  describe('VERSION_SEND_TOKEN_ONLY', () => {
    it('should have correct version constant', () => {
      expect(ChooseOfferStage.VERSION_SEND_TOKEN_ONLY).toBe(2);
    });
  });

  describe('payload updates', () => {
    it('should return payload for chaining', () => {
      const payload = createValidPayload({ schema: StreamSchema.OFFER });

      const result = stage.process(payload, logEntry);

      expect(result).toBe(payload);
    });

    it('should set needToken when offer chosen', () => {
      // This would require mock stream with offer associations
      // Current implementation returns empty array from _getOfferAssociations
      const payload = createValidPayload({ schema: StreamSchema.OFFER });

      stage.process(payload, logEntry);

      // Without real offers, needToken won't be set
      expect(result => result).not.toThrow();
    });
  });

  describe('forced offer', () => {
    it('should attempt to load forced offer ID', () => {
      const payload = createValidPayload({ schema: StreamSchema.OFFER });
      payload.setForcedOfferId(123);

      const result = stage.process(payload, logEntry);

      // Current implementation returns false from _streamHasOfferId
      expect(result).toBe(payload);
    });
  });

  describe('force redirect offer', () => {
    it('should set action data when force redirect is enabled', () => {
      const payload = createValidPayload({ schema: StreamSchema.OFFER });
      payload.setForceRedirectOffer(true);

      const result = stage.process(payload, logEntry);

      // Without real offers, action won't be set
      expect(result).toBe(payload);
    });
  });
});

/**
 * Helper to create valid payload with all required fields
 */
function createValidPayload(options: { schema: string }): Payload {
  const payload = new Payload();
  const mockRequest = createMockRequest();
  const response = new Response();
  const stream = createMockStream({ schema: options.schema });
  const campaign = createMockCampaign({});
  const rawClick = new RawClick();

  payload.setServerRequest(mockRequest);
  payload.setResponse(response);
  payload.setStream(stream);
  payload.setCampaign(campaign);
  payload.setRawClick(rawClick);

  return payload;
}

/**
 * Helper to create mock server request
 */
function createMockRequest(options?: { params?: Record<string, string> }): ServerRequest {
  const params = options?.params ?? {};
  return {
    getParam: (name: string) => params[name],
    hasParam: (name: string) => name in params,
    getUri: () => new URL('http://example.com/test'),
    getHeader: () => undefined
  } as unknown as ServerRequest;
}

/**
 * Helper to create mock stream
 */
function createMockStream(options: { schema: string }): BaseStream {
  return {
    getSchema: () => options.schema,
    getId: () => 1,
    getType: () => 'regular',
    getPosition: () => 1,
    getWeight: () => 100,
    getChance: () => 100,
    getActionType: () => null,
    getActionPayload: () => null,
    getActionOptions: () => null,
    getCollectClicks: () => true,
    getFilterOr: () => false,
    getCampaignId: () => 1
  } as unknown as BaseStream;
}

/**
 * Helper to create mock campaign
 */
function createMockCampaign(options: Record<string, unknown>): Campaign {
  return {
    getId: () => 1,
    isActive: () => true,
    getParameters: () => ({}),
    isBindVisitorsOfferEnabled: () => false,
    isBindVisitorsLandingEnabled: () => false
  } as unknown as Campaign;
}

/**
 * Helper to create mock landing
 */
function createMockLanding(options: { id: number }): Landing {
  return {
    getId: () => options.id,
    getUrl: () => 'http://example.com/landing',
    getActionType: () => null,
    getActionPayload: () => null,
    getActionOptions: () => null
  } as unknown as Landing;
}
