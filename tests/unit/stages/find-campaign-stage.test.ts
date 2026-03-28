/**
 * FindCampaignStage Tests
 * 
 * Tests for the pipeline stage that resolves campaigns from requests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FindCampaignStage } from '../../../src/traffic/pipeline/stage/find-campaign-stage';
import { Payload } from '../../../src/traffic/pipeline/payload';
import { RawClick } from '../../../src/traffic/model/raw-click';
import { Response } from '../../../src/traffic/response/response';
import { TrafficLogEntry } from '../../../src/traffic/logging/traffic-log-entry';
import { CachedCampaignRepository } from '../../../src/traffic/repository/cached-campaign-repository';

// Mock campaign
function createMockCampaign(options: {
  id?: number;
  name?: string;
  alias?: string;
  active?: boolean;
  state?: string;
} = {}) {
  return {
    getId: () => options.id ?? 1,
    getName: () => options.name ?? 'Test Campaign',
    getAlias: () => options.alias ?? 'test-campaign',
    isActive: () => options.active ?? true,
    getState: () => options.state ?? 'active',
    getStreams: () => [],
    getType: () => 'position',
    getTrafficSourceId: () => null,
    isBindVisitorsEnabled: () => false
  } as any;
}

// Create mock server request
function createMockServerRequest(options: {
  params?: Record<string, string>;
  path?: string;
} = {}) {
  const queryParams = options.params ?? {};
  const path = options.path ?? '/';
  
  return {
    getIp: () => '127.0.0.1',
    getUserAgent: () => 'Test Agent',
    getReferrer: () => '',
    getUri: () => new URL(`http://test.local${path}?${new URLSearchParams(queryParams).toString()}`),
    getParam: (name: string) => queryParams[name],
    getQueryParams: () => queryParams,
    getHeaders: () => ({}),
    getHeader: () => undefined,
    getMethod: () => 'GET',
    getCookie: () => undefined,
    getQueryParam: (name: string) => queryParams[name]
  } as any;
}

// Create test payload
function createTestPayload(options: {
  params?: Record<string, string>;
  path?: string;
  forcedCampaignId?: number;
  existingCampaign?: any;
} = {}) {
  const rawClick = new RawClick({ sub_id: 'test-sub-id' });
  const mockRequest = createMockServerRequest({ 
    params: options.params,
    path: options.path
  });
  const mockResponse = new Response();
  
  const payload = new Payload({
    serverRequest: mockRequest,
    response: mockResponse,
    rawClick
  });
  
  if (options.forcedCampaignId) {
    payload.setForcedCampaignId(options.forcedCampaignId);
  }
  
  if (options.existingCampaign) {
    payload.setCampaign(options.existingCampaign);
  }
  
  return payload;
}

describe('FindCampaignStage', () => {
  let logEntry: TrafficLogEntry;

  beforeEach(() => {
    logEntry = new TrafficLogEntry();
    
    // Reset singleton
    (CachedCampaignRepository as any).instance = undefined;
  });

  describe('parameter handling', () => {
    it('should find campaign by _campaign parameter', async () => {
      const mockCampaign = createMockCampaign({ alias: 'my-campaign' });
      
      vi.spyOn(CachedCampaignRepository, 'getInstance').mockReturnValue({
        findActiveByAlias: vi.fn().mockResolvedValue(mockCampaign),
        findCached: vi.fn().mockResolvedValue(null)
      } as any);
      
      const stage = new FindCampaignStage();
      const payload = createTestPayload({ params: { _campaign: 'my-campaign' } });
      
      const result = await stage.process(payload, logEntry);
      
      expect(result.getCampaign()).toBe(mockCampaign);
    });

    it('should find campaign by campaign alias parameter', async () => {
      const mockCampaign = createMockCampaign({ alias: 'promo-2024' });
      
      vi.spyOn(CachedCampaignRepository, 'getInstance').mockReturnValue({
        findActiveByAlias: vi.fn().mockResolvedValue(mockCampaign),
        findCached: vi.fn().mockResolvedValue(null)
      } as any);
      
      const stage = new FindCampaignStage();
      const payload = createTestPayload({ params: { campaign: 'promo-2024' } });
      
      const result = await stage.process(payload, logEntry);
      
      expect(result.getCampaign()).toBe(mockCampaign);
    });

    it('should find campaign by short "c" parameter', async () => {
      const mockCampaign = createMockCampaign({ alias: 'short' });
      
      vi.spyOn(CachedCampaignRepository, 'getInstance').mockReturnValue({
        findActiveByAlias: vi.fn().mockResolvedValue(mockCampaign),
        findCached: vi.fn().mockResolvedValue(null)
      } as any);
      
      const stage = new FindCampaignStage();
      const payload = createTestPayload({ params: { c: 'short' } });
      
      const result = await stage.process(payload, logEntry);
      
      expect(result.getCampaign()).toBe(mockCampaign);
    });

    it('should find campaign by keyword parameter', async () => {
      const mockCampaign = createMockCampaign({ alias: 'search-term' });
      
      vi.spyOn(CachedCampaignRepository, 'getInstance').mockReturnValue({
        findActiveByAlias: vi.fn().mockResolvedValue(mockCampaign),
        findCached: vi.fn().mockResolvedValue(null)
      } as any);
      
      const stage = new FindCampaignStage();
      const payload = createTestPayload({ params: { keyword: 'search-term' } });
      
      const result = await stage.process(payload, logEntry);
      
      expect(result.getCampaign()).toBe(mockCampaign);
    });

    it('should prioritize _campaign parameter over others', async () => {
      const priorityCampaign = createMockCampaign({ alias: 'priority' });
      const otherCampaign = createMockCampaign({ alias: 'other' });
      
      vi.spyOn(CachedCampaignRepository, 'getInstance').mockReturnValue({
        findActiveByAlias: vi.fn().mockImplementation(async (alias: string) => {
          if (alias === 'priority') return priorityCampaign;
          if (alias === 'other') return otherCampaign;
          return null;
        }),
        findCached: vi.fn().mockResolvedValue(null)
      } as any);
      
      const stage = new FindCampaignStage();
      const payload = createTestPayload({ params: { _campaign: 'priority', campaign: 'other' } });
      
      const result = await stage.process(payload, logEntry);
      
      expect(result.getCampaign()).toBe(priorityCampaign);
    });
  });

  describe('path-based campaign resolution', () => {
    it('should find campaign from URL path', async () => {
      const mockCampaign = createMockCampaign({ alias: 'special-offer' });
      
      vi.spyOn(CachedCampaignRepository, 'getInstance').mockReturnValue({
        findActiveByAlias: vi.fn().mockResolvedValue(mockCampaign),
        findCached: vi.fn().mockResolvedValue(null)
      } as any);
      
      const stage = new FindCampaignStage();
      const payload = createTestPayload({ path: '/special-offer' });
      
      const result = await stage.process(payload, logEntry);
      
      expect(result.getCampaign()).toBe(mockCampaign);
    });

    it('should use first path segment for campaign', async () => {
      const mockCampaign = createMockCampaign({ alias: 'offers' });
      
      vi.spyOn(CachedCampaignRepository, 'getInstance').mockReturnValue({
        findActiveByAlias: vi.fn()
          .mockImplementation(async (alias: string) => {
            if (alias === 'offers') return mockCampaign;
            return null;
          }),
        findCached: vi.fn().mockResolvedValue(null)
      } as any);
      
      const stage = new FindCampaignStage();
      const payload = createTestPayload({ path: '/offers/product/123' });
      
      const result = await stage.process(payload, logEntry);
      
      expect(result.getCampaign()).toBe(mockCampaign);
    });
  });

  describe('forced campaign ID', () => {
    it('should use forced campaign ID when set', async () => {
      const mockCampaign = createMockCampaign({ id: 999, name: 'Forced Campaign' });
      
      vi.spyOn(CachedCampaignRepository, 'getInstance').mockReturnValue({
        findActiveByAlias: vi.fn().mockResolvedValue(null),
        findCached: vi.fn().mockResolvedValue(mockCampaign)
      } as any);
      
      const stage = new FindCampaignStage();
      const payload = createTestPayload({ forcedCampaignId: 999 });
      
      const result = await stage.process(payload, logEntry);
      
      expect(result.getCampaign()).toBe(mockCampaign);
      expect(logEntry.getMessages().some(m => m.includes('[Restored]'))).toBe(true);
    });
  });

  describe('existing campaign', () => {
    it('should skip processing if campaign already set', async () => {
      const existingCampaign = createMockCampaign({ id: 50, name: 'Existing' });
      
      vi.spyOn(CachedCampaignRepository, 'getInstance').mockReturnValue({
        findActiveByAlias: vi.fn().mockResolvedValue(null),
        findCached: vi.fn().mockResolvedValue(null)
      } as any);
      
      const stage = new FindCampaignStage();
      const payload = createTestPayload({ 
        existingCampaign,
        params: { campaign: 'different-campaign' }
      });
      
      const result = await stage.process(payload, logEntry);
      
      // Should keep existing campaign, not look for new one
      expect(result.getCampaign()).toBe(existingCampaign);
    });
  });

  describe('campaign state handling', () => {
    it('should not set inactive campaign', async () => {
      const inactiveCampaign = createMockCampaign({ 
        id: 1, 
        active: false, 
        state: 'paused' 
      });
      
      vi.spyOn(CachedCampaignRepository, 'getInstance').mockReturnValue({
        findActiveByAlias: vi.fn().mockResolvedValue(inactiveCampaign),
        findCached: vi.fn().mockResolvedValue(null)
      } as any);
      
      const stage = new FindCampaignStage();
      const payload = createTestPayload({ params: { campaign: 'inactive' } });
      
      const result = await stage.process(payload, logEntry);
      
      expect(result.getCampaign()).toBeNull();
      expect(logEntry.getMessages().some(m => m.includes('not active'))).toBe(true);
    });
  });

  describe('not found handling', () => {
    it('should return null campaign when not found', async () => {
      vi.spyOn(CachedCampaignRepository, 'getInstance').mockReturnValue({
        findActiveByAlias: vi.fn().mockResolvedValue(null),
        findCached: vi.fn().mockResolvedValue(null)
      } as any);
      
      const stage = new FindCampaignStage();
      const payload = createTestPayload({ params: { campaign: 'nonexistent' } });
      
      const result = await stage.process(payload, logEntry);
      
      expect(result.getCampaign()).toBeNull();
      expect(logEntry.getMessages().some(m => m.includes('No campaign found'))).toBe(true);
    });
  });

  describe('logging', () => {
    it('should log requested URL', async () => {
      vi.spyOn(CachedCampaignRepository, 'getInstance').mockReturnValue({
        findActiveByAlias: vi.fn().mockResolvedValue(null),
        findCached: vi.fn().mockResolvedValue(null)
      } as any);
      
      const stage = new FindCampaignStage();
      const payload = createTestPayload({ path: '/test-path' });
      
      await stage.process(payload, logEntry);
      
      expect(logEntry.getMessages().some(m => m.includes('Requested:'))).toBe(true);
    });

    it('should log found campaign details', async () => {
      const mockCampaign = createMockCampaign({ id: 42, name: 'Test Campaign' });
      
      vi.spyOn(CachedCampaignRepository, 'getInstance').mockReturnValue({
        findActiveByAlias: vi.fn().mockResolvedValue(mockCampaign),
        findCached: vi.fn().mockResolvedValue(null)
      } as any);
      
      const stage = new FindCampaignStage();
      const payload = createTestPayload({ params: { campaign: 'test' } });
      
      await stage.process(payload, logEntry);
      
      expect(logEntry.getMessages().some(m => m.includes('Found campaign: Test Campaign (ID: 42)'))).toBe(true);
    });
  });
});
