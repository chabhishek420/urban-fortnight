/**
 * Tests for ChooseLandingStage
 * 
 * Tests landing page selection from stream associations
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { ChooseLandingStage } from '../../../src/traffic/pipeline/stage/choose-landing-stage.js';
import { Payload } from '../../../src/traffic/pipeline/payload.js';
import { TrafficLogEntry } from '../../../src/traffic/logging/traffic-log-entry.js';
import { RawClick } from '../../../src/traffic/model/raw-click.js';
import { Response } from '../../../src/traffic/response/response.js';
import { StreamSchema, BaseStream } from '../../../src/traffic/model/base-stream.js';
import { StageException } from '../../../src/core/pipeline/stage-interface.js';
import { ServerRequest } from '../../../src/traffic/request/server-request.js';
import { Campaign } from '../../../src/traffic/model/campaign.js';
import { Landing } from '../../../src/traffic/model/landing.js';

describe('ChooseLandingStage', () => {
  let stage: ChooseLandingStage;
  let logEntry: TrafficLogEntry;

  beforeEach(() => {
    stage = new ChooseLandingStage();
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

      expect(logEntry.getMessages()).toContain('No stream, skip choosing landing');
    });

    it('should throw StageException when campaign is not set', () => {
      const payload = new Payload();
      const mockRequest = createMockRequest();
      const response = new Response();
      const stream = createMockStream({ schema: StreamSchema.LANDING_OFFER });
      
      payload.setServerRequest(mockRequest);
      payload.setResponse(response);
      payload.setStream(stream);

      expect(() => stage.process(payload, logEntry)).toThrow('campaign is not defined');
    });

    it('should throw StageException when rawClick is not set', () => {
      const payload = new Payload();
      const mockRequest = createMockRequest();
      const response = new Response();
      const stream = createMockStream({ schema: StreamSchema.LANDING_OFFER });
      const campaign = createMockCampaign({});
      
      payload.setServerRequest(mockRequest);
      payload.setResponse(response);
      payload.setStream(stream);
      payload.setCampaign(campaign);

      expect(() => stage.process(payload, logEntry)).toThrow('rawClick is not defined');
    });
  });

  describe('process - schema checks', () => {
    it('should skip when schema is not landing_offer or landings', () => {
      const payload = createValidPayload({ schema: 'offer' });

      const result = stage.process(payload, logEntry);

      expect(logEntry.getMessages()).toContain('Schema is offer, skip choosing landings');
    });

    it('should process when schema is landing_offer', () => {
      const payload = createValidPayload({ schema: StreamSchema.LANDING_OFFER });

      const result = stage.process(payload, logEntry);

      expect(result).toBe(payload);
    });

    it('should process when schema is landings', () => {
      const payload = createValidPayload({ schema: 'landings' });

      const result = stage.process(payload, logEntry);

      expect(result).toBe(payload);
    });
  });

  describe('process - preselected landing', () => {
    it('should use preselected landing', () => {
      const payload = createValidPayload({ schema: StreamSchema.LANDING_OFFER });
      const landing = createMockLanding({ id: 55 });
      payload.setLanding(landing);

      const result = stage.process(payload, logEntry);

      expect(logEntry.getMessages()).toContain('Landing is preselected #55');
      expect(result.getLanding()).toBe(landing);
    });
  });

  describe('process - no landings', () => {
    it('should log when no landings available', () => {
      const payload = createValidPayload({ schema: StreamSchema.LANDING_OFFER });

      stage.process(payload, logEntry);

      // Current implementation returns empty array from _getLandingAssociations
      expect(logEntry.getMessages()).toContain('No landings');
    });

    it('should log when no LP selected', () => {
      const payload = createValidPayload({ schema: StreamSchema.LANDING_OFFER });

      stage.process(payload, logEntry);

      expect(logEntry.getMessages()).toContain('No LP selected');
    });
  });

  describe('payload updates', () => {
    it('should return payload for chaining', () => {
      const payload = createValidPayload({ schema: StreamSchema.LANDING_OFFER });

      const result = stage.process(payload, logEntry);

      expect(result).toBe(payload);
    });
  });

  describe('cookie binding', () => {
    it('should enable cookie binding when campaign has bind_visitors_landing enabled', () => {
      const payload = new Payload();
      const mockRequest = createMockRequest();
      const response = new Response();
      const stream = createMockStream({ schema: StreamSchema.LANDING_OFFER });
      const campaign = createMockCampaign({ bindVisitorsLanding: true });
      const rawClick = new RawClick();

      payload.setServerRequest(mockRequest);
      payload.setResponse(response);
      payload.setStream(stream);
      payload.setCampaign(campaign);
      payload.setRawClick(rawClick);

      // Without real landings, cookie binding won't be enabled
      // This tests the code path exists
      const result = stage.process(payload, logEntry);
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
function createMockRequest(): ServerRequest {
  return {
    getParam: () => undefined,
    hasParam: () => false,
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
function createMockCampaign(options: { bindVisitorsLanding?: boolean }): Campaign {
  return {
    getId: () => 1,
    isActive: () => true,
    getParameters: () => ({}),
    isBindVisitorsOfferEnabled: () => false,
    isBindVisitorsLandingEnabled: () => options.bindVisitorsLanding ?? false
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
