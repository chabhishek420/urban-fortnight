/**
 * ChooseStreamStage Tests
 * 
 * Tests for stream selection by position and weight
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ChooseStreamStage } from '../../../src/traffic/pipeline/stage/choose-stream-stage';
import { Payload } from '../../../src/traffic/pipeline/payload';
import { RawClick } from '../../../src/traffic/model/raw-click';
import { Response } from '../../../src/traffic/response/response';
import { TrafficLogEntry } from '../../../src/traffic/logging/traffic-log-entry';
import { CachedStreamRepository } from '../../../src/traffic/repository/cached-stream-repository';
import { StreamType, StreamSchema } from '../../../src/traffic/model/base-stream';
import { CampaignType } from '../../../src/traffic/model/campaign';
import { EntityState } from '../../../src/core/entity/state';

// Create mock stream
function createMockStream(options: {
  id?: number;
  name?: string;
  type?: string;
  weight?: number;
  chance?: number;
  schema?: string;
  actionType?: string;
  actionPayload?: string;
  disabled?: boolean;
} = {}) {
  const data: Record<string, unknown> = {
    streamId: options.id ?? 1,
    name: options.name ?? 'Test Stream',
    type: options.type ?? StreamType.REGULAR,
    weight: options.weight ?? 100,
    chance: options.chance ?? 0,
    schema: options.schema ?? StreamSchema.ACTION,
    actionType: options.actionType ?? 'http_redirect',
    actionPayload: options.actionPayload ?? 'https://example.com',
    actionOptions: {},
    state: options.disabled ? EntityState.DISABLED : EntityState.ACTIVE
  };
  
  return {
    getId: () => data.streamId as number,
    getName: () => data.name as string,
    getType: () => data.type as string,
    getWeight: () => data.weight as number,
    getChance: () => data.chance as number,
    getSchema: () => data.schema as string,
    getActionType: () => data.actionType as string,
    getActionPayload: () => data.actionPayload as string,
    getActionOptions: () => ({}),
    getOffers: () => [],
    isDisabled: () => data.state === EntityState.DISABLED,
    getState: () => data.state,
    getLandingId: () => null,
    getOfferId: () => null
  } as any;
}

// Create mock campaign
function createMockCampaign(options: {
  id?: number;
  type?: CampaignType;
  bindVisitors?: boolean;
} = {}) {
  return {
    getId: () => options.id ?? 1,
    getName: () => 'Test Campaign',
    getType: () => options.type ?? CampaignType.POSITION,
    isBindVisitorsEnabled: () => options.bindVisitors ?? false
  } as any;
}

// Create mock server request
function createMockServerRequest() {
  return {
    getIp: () => '127.0.0.1',
    getUserAgent: () => 'Test Agent',
    getReferrer: () => '',
    getUri: () => new URL('http://test.local/'),
    getParam: () => undefined,
    getQueryParams: () => ({}),
    getHeaders: () => ({}),
    getHeader: () => undefined,
    getMethod: () => 'GET',
    getCookie: () => undefined,
    getQueryParam: () => undefined
  } as any;
}

// Create test payload - always includes rawClick
function createTestPayload(options: {
  campaign?: any;
  stream?: any;
  forcedStreamId?: number;
  includeRawClick?: boolean;
} = {}) {
  const rawClick = new RawClick({ sub_id: 'test-sub-id' });
  const mockRequest = createMockServerRequest();
  const mockResponse = new Response();
  
  const payload = new Payload({
    serverRequest: mockRequest,
    response: mockResponse,
    rawClick: options.includeRawClick === false ? null as any : rawClick
  });
  
  if (options.campaign) {
    payload.setCampaign(options.campaign);
  }
  
  if (options.stream) {
    payload.setStream(options.stream);
  }
  
  if (options.forcedStreamId) {
    payload.setForcedStreamId(options.forcedStreamId);
  }
  
  return payload;
}

// Mock stream collection
function createMockStreamCollection(streams: any[]) {
  return {
    all: () => streams,
    first: () => streams[0] ?? null,
    count: () => streams.length
  };
}

describe('ChooseStreamStage', () => {
  let logEntry: TrafficLogEntry;

  beforeEach(() => {
    logEntry = new TrafficLogEntry();
    (CachedStreamRepository as any).instance = undefined;
  });

  describe('validation', () => {
    it('should throw when campaign is not set', async () => {
      vi.spyOn(CachedStreamRepository, 'getInstance').mockReturnValue({
        findCached: vi.fn().mockResolvedValue(null),
        getCachedActiveStreams: vi.fn().mockResolvedValue(createMockStreamCollection([]))
      } as any);
      
      const stage = new ChooseStreamStage();
      const payload = createTestPayload({});
      
      await expect(stage.process(payload, logEntry)).rejects.toThrow('campaign is not defined');
    });

    it('should throw when rawClick is not set', async () => {
      vi.spyOn(CachedStreamRepository, 'getInstance').mockReturnValue({
        findCached: vi.fn().mockResolvedValue(null),
        getCachedActiveStreams: vi.fn().mockResolvedValue(createMockStreamCollection([]))
      } as any);
      
      const stage = new ChooseStreamStage();
      const campaign = createMockCampaign();
      const payload = createTestPayload({ campaign, includeRawClick: false });
      
      await expect(stage.process(payload, logEntry)).rejects.toThrow('rawClick is not defined');
    });
  });

  describe('forced stream', () => {
    it('should use forced stream ID when set', async () => {
      const forcedStream = createMockStream({ id: 999, name: 'Forced Stream' });
      
      vi.spyOn(CachedStreamRepository, 'getInstance').mockReturnValue({
        findCached: vi.fn().mockResolvedValue(forcedStream),
        getCachedActiveStreams: vi.fn().mockResolvedValue(createMockStreamCollection([]))
      } as any);
      
      const stage = new ChooseStreamStage();
      const campaign = createMockCampaign();
      const payload = createTestPayload({ campaign, forcedStreamId: 999 });
      
      const result = await stage.process(payload, logEntry);
      
      expect(result.getStream()?.getId()).toBe(999);
      expect(logEntry.getMessages().some(m => m.includes('Loading stream #999'))).toBe(true);
    });

    it('should return 404 when forced stream not found', async () => {
      vi.spyOn(CachedStreamRepository, 'getInstance').mockReturnValue({
        findCached: vi.fn().mockResolvedValue(null),
        getCachedActiveStreams: vi.fn().mockResolvedValue(createMockStreamCollection([]))
      } as any);
      
      const stage = new ChooseStreamStage();
      const campaign = createMockCampaign();
      const payload = createTestPayload({ campaign, forcedStreamId: 999 });
      
      const result = await stage.process(payload, logEntry);
      
      expect(result.isAborted()).toBe(true);
      expect(result.getResponse()?.getStatus()).toBe(404);
    });
  });

  describe('position-based selection', () => {
    it('should select stream for position-based campaign', async () => {
      const streams = [
        createMockStream({ id: 1, type: StreamType.REGULAR }),
        createMockStream({ id: 2, type: StreamType.REGULAR })
      ];
      
      vi.spyOn(CachedStreamRepository, 'getInstance').mockReturnValue({
        findCached: vi.fn().mockResolvedValue(null),
        getCachedActiveStreams: vi.fn().mockResolvedValue(createMockStreamCollection(streams))
      } as any);
      
      const stage = new ChooseStreamStage();
      const campaign = createMockCampaign({ type: CampaignType.POSITION });
      const payload = createTestPayload({ campaign });
      
      const result = await stage.process(payload, logEntry);
      
      expect(result.getStream()).not.toBeNull();
    });
  });

  describe('weight-based selection', () => {
    it('should select stream by weight for weight-based campaign', async () => {
      const streams = [
        createMockStream({ id: 1, weight: 100 }),
        createMockStream({ id: 2, weight: 200 })
      ];
      
      vi.spyOn(CachedStreamRepository, 'getInstance').mockReturnValue({
        findCached: vi.fn().mockResolvedValue(null),
        getCachedActiveStreams: vi.fn().mockResolvedValue(createMockStreamCollection(streams))
      } as any);
      
      const stage = new ChooseStreamStage();
      const campaign = createMockCampaign({ type: CampaignType.WEIGHT });
      const payload = createTestPayload({ campaign });
      
      const result = await stage.process(payload, logEntry);
      
      expect(result.getStream()).not.toBeNull();
    });

    it('should enable cookie binding for weight campaigns with bind visitors', async () => {
      const streams = [
        createMockStream({ id: 1, weight: 100 })
      ];
      
      vi.spyOn(CachedStreamRepository, 'getInstance').mockReturnValue({
        findCached: vi.fn().mockResolvedValue(null),
        getCachedActiveStreams: vi.fn().mockResolvedValue(createMockStreamCollection(streams))
      } as any);
      
      const stage = new ChooseStreamStage();
      const campaign = createMockCampaign({ 
        type: CampaignType.WEIGHT, 
        bindVisitors: true 
      });
      const payload = createTestPayload({ campaign });
      
      const result = await stage.process(payload, logEntry);
      
      expect(result.isCookieStreamBinded()).toBe(true);
    });
  });

  describe('default stream', () => {
    it('should use default stream when no regular streams match', async () => {
      const defaultStream = createMockStream({ 
        id: 99, 
        type: StreamType.DEFAULT,
        actionType: 'do_nothing'
      });
      
      vi.spyOn(CachedStreamRepository, 'getInstance').mockReturnValue({
        findCached: vi.fn().mockResolvedValue(null),
        getCachedActiveStreams: vi.fn().mockResolvedValue(createMockStreamCollection([defaultStream]))
      } as any);
      
      const stage = new ChooseStreamStage();
      const campaign = createMockCampaign();
      const payload = createTestPayload({ campaign });
      
      const result = await stage.process(payload, logEntry);
      
      expect(result.getStream()?.getId()).toBe(99);
    });
  });

  describe('action setting', () => {
    it('should set action type from stream for action schema', async () => {
      const stream = createMockStream({
        id: 1,
        schema: StreamSchema.ACTION,
        actionType: 'http_redirect',
        actionPayload: 'https://offer.example.com'
      });
      
      vi.spyOn(CachedStreamRepository, 'getInstance').mockReturnValue({
        findCached: vi.fn().mockResolvedValue(null),
        getCachedActiveStreams: vi.fn().mockResolvedValue(createMockStreamCollection([stream]))
      } as any);
      
      const stage = new ChooseStreamStage();
      const campaign = createMockCampaign();
      const payload = createTestPayload({ campaign });
      
      const result = await stage.process(payload, logEntry);
      
      expect(result.getActionType()).toBe('http_redirect');
      expect(result.getActionPayload()).toBe('https://offer.example.com');
    });

    it('should not set action for landing-offer schema', async () => {
      const stream = createMockStream({
        id: 1,
        schema: StreamSchema.LANDING_OFFER
      });
      
      vi.spyOn(CachedStreamRepository, 'getInstance').mockReturnValue({
        findCached: vi.fn().mockResolvedValue(null),
        getCachedActiveStreams: vi.fn().mockResolvedValue(createMockStreamCollection([stream]))
      } as any);
      
      const stage = new ChooseStreamStage();
      const campaign = createMockCampaign();
      const payload = createTestPayload({ campaign });
      
      const result = await stage.process(payload, logEntry);
      
      expect(result.getActionType()).toBeNull();
    });
  });

  describe('no stream handling', () => {
    it('should set do_nothing when no stream selected', async () => {
      vi.spyOn(CachedStreamRepository, 'getInstance').mockReturnValue({
        findCached: vi.fn().mockResolvedValue(null),
        getCachedActiveStreams: vi.fn().mockResolvedValue(createMockStreamCollection([]))
      } as any);
      
      const stage = new ChooseStreamStage();
      const campaign = createMockCampaign();
      const payload = createTestPayload({ campaign });
      
      const result = await stage.process(payload, logEntry);
      
      expect(result.getActionType()).toBe('do_nothing');
    });
  });

  describe('stream ID assignment', () => {
    it('should set stream ID on raw click', async () => {
      const stream = createMockStream({ id: 42 });
      
      vi.spyOn(CachedStreamRepository, 'getInstance').mockReturnValue({
        findCached: vi.fn().mockResolvedValue(null),
        getCachedActiveStreams: vi.fn().mockResolvedValue(createMockStreamCollection([stream]))
      } as any);
      
      const stage = new ChooseStreamStage();
      const campaign = createMockCampaign();
      const payload = createTestPayload({ campaign });
      
      const result = await stage.process(payload, logEntry);
      
      expect(result.getRawClick()?.getStreamId()).toBe(42);
    });
  });

  describe('logging', () => {
    it('should log stream count', async () => {
      const streams = [
        createMockStream({ id: 1 }),
        createMockStream({ id: 2 }),
        createMockStream({ id: 3 })
      ];
      
      vi.spyOn(CachedStreamRepository, 'getInstance').mockReturnValue({
        findCached: vi.fn().mockResolvedValue(null),
        getCachedActiveStreams: vi.fn().mockResolvedValue(createMockStreamCollection(streams))
      } as any);
      
      const stage = new ChooseStreamStage();
      const campaign = createMockCampaign();
      const payload = createTestPayload({ campaign });
      
      await stage.process(payload, logEntry);
      
      expect(logEntry.getMessages().some(m => m.includes('Found 3 streams'))).toBe(true);
    });

    it('should log chosen stream', async () => {
      const stream = createMockStream({ id: 1, name: 'Main Stream' });
      
      vi.spyOn(CachedStreamRepository, 'getInstance').mockReturnValue({
        findCached: vi.fn().mockResolvedValue(null),
        getCachedActiveStreams: vi.fn().mockResolvedValue(createMockStreamCollection([stream]))
      } as any);
      
      const stage = new ChooseStreamStage();
      const campaign = createMockCampaign();
      const payload = createTestPayload({ campaign });
      
      await stage.process(payload, logEntry);
      
      expect(logEntry.getMessages().some(m => m.includes('Chosen stream #1: Main Stream'))).toBe(true);
    });
  });
});
