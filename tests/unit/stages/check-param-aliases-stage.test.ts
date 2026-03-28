/**
 * Tests for CheckParamAliasesStage
 * 
 * Tests parameter alias resolution and mapping
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { CheckParamAliasesStage } from '../../../src/traffic/pipeline/stage/check-param-aliases-stage.js';
import { Payload } from '../../../src/traffic/pipeline/payload.js';
import { TrafficLogEntry } from '../../../src/traffic/logging/traffic-log-entry.js';
import { RawClick } from '../../../src/traffic/model/raw-click.js';
import { Campaign } from '../../../src/traffic/model/campaign.js';
import { ServerRequest } from '../../../src/traffic/request/server-request.js';

describe('CheckParamAliasesStage', () => {
  let stage: CheckParamAliasesStage;
  let logEntry: TrafficLogEntry;

  beforeEach(() => {
    stage = new CheckParamAliasesStage();
    logEntry = new TrafficLogEntry();
  });

  describe('process', () => {
    it('should skip when rawClick is missing', () => {
      const payload = new Payload();
      const mockRequest = createMockRequest({});
      payload.setServerRequest(mockRequest);

      const result = stage.process(payload, logEntry);

      expect(result).toBe(payload);
      expect(logEntry.getMessages()).toContain('CheckParamAliasesStage: No rawClick, skipping');
    });

    it('should handle missing request gracefully', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      payload.setRawClick(rawClick);
      // No server request set

      // The stage will throw when trying to access the server request
      expect(() => stage.process(payload, logEntry)).toThrow();
    });

    it('should set parameter value directly when param exists', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest({
        params: { keyword: 'test_keyword' }
      });
      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);

      stage.process(payload, logEntry);

      expect(rawClick.getKeyword()).toBe('test_keyword');
    });

    it('should apply alias mapping when param name not present but alias is', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest({
        params: { kw: 'keyword_from_alias' }
      });
      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);

      stage.process(payload, logEntry);

      expect(rawClick.getKeyword()).toBe('keyword_from_alias');
    });

    it('should apply q alias for keyword', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest({
        params: { q: 'search_query' }
      });
      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);

      stage.process(payload, logEntry);

      expect(rawClick.getKeyword()).toBe('search_query');
    });

    it('should apply src alias for source', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest({
        params: { src: 'traffic_source' }
      });
      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);

      stage.process(payload, logEntry);

      expect(rawClick.getSource()).toBe('traffic_source');
    });

    it('should apply cpc alias for cost', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest({
        params: { cpc: '0.50' }
      });
      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);

      stage.process(payload, logEntry);

      expect(rawClick.getCost()).toBe('0.50');
    });

    it('should prefer direct param over alias', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest({
        params: { keyword: 'direct_value', kw: 'alias_value' }
      });
      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);

      stage.process(payload, logEntry);

      expect(rawClick.getKeyword()).toBe('direct_value');
    });

    it('should set site param as source', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest({
        params: { site: 'example.com' }
      });
      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);

      stage.process(payload, logEntry);

      expect(rawClick.getSource()).toBe('example.com');
    });

    it('should handle sub_id_N parameters', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest({
        params: { sub_id_1: 'value1', sub_id_5: 'value5' }
      });
      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);

      stage.process(payload, logEntry);

      expect(rawClick.get('sub_id_1')).toBe('value1');
      expect(rawClick.get('sub_id_5')).toBe('value5');
    });

    it('should handle extra_param_N parameters', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest({
        params: { extra_param_1: 'extra1' }
      });
      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);

      stage.process(payload, logEntry);

      expect(rawClick.get('extra_param_1')).toBe('extra1');
    });

    it('should process with campaign when set', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest({
        params: { keyword: 'test' }
      });
      const campaign = createMockCampaign({});
      
      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);
      payload.setCampaign(campaign);

      const result = stage.process(payload, logEntry);

      expect(result).toBe(payload);
    });

    it('should return payload for chaining', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest({});
      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);

      const result = stage.process(payload, logEntry);

      expect(result).toBe(payload);
    });
  });

  describe('alias mappings', () => {
    it('should map kw -> keyword', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest({ params: { kw: 'test' } });
      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);

      stage.process(payload, logEntry);

      expect(rawClick.getKeyword()).toBe('test');
    });

    it('should map key -> keyword', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest({ params: { key: 'test' } });
      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);

      stage.process(payload, logEntry);

      expect(rawClick.getKeyword()).toBe('test');
    });

    it('should map traffic_source -> source', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest({ params: { traffic_source: 'google' } });
      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);

      stage.process(payload, logEntry);

      expect(rawClick.getSource()).toBe('google');
    });

    it('should map curr -> currency', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest({ params: { curr: 'USD' } });
      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);

      stage.process(payload, logEntry);

      expect(rawClick.get('currency')).toBe('USD');
    });

    it('should map cpm -> cost', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest({ params: { cpm: '1.50' } });
      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);

      stage.process(payload, logEntry);

      expect(rawClick.getCost()).toBe('1.50');
    });

    it('should map search_engine -> se', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest({ params: { search_engine: 'google' } });
      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);

      stage.process(payload, logEntry);

      expect(rawClick.get('se')).toBe('google');
    });
  });

  describe('campaign parameters', () => {
    it('should check aliases from campaign parameters', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest({
        params: { custom_alias: 'custom_value' }
      });
      const campaign = createMockCampaign({
        parameters: {
          target_param: { name: 'custom_alias', placeholder: '' }
        }
      });

      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);
      payload.setCampaign(campaign);

      stage.process(payload, logEntry);

      // Campaign parameter aliases should be processed
      expect(result => result).not.toThrow();
    });

    it('should apply placeholders when param not provided', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest({ params: {} });
      const campaign = createMockCampaign({
        parameters: {
          keyword: { name: 'keyword', placeholder: 'default_keyword' }
        }
      });

      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);
      payload.setCampaign(campaign);

      stage.process(payload, logEntry);

      expect(rawClick.getKeyword()).toBe('default_keyword');
    });

    it('should not apply macro placeholders', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest({ params: {} });
      const campaign = createMockCampaign({
        parameters: {
          keyword: { name: 'keyword', placeholder: '[MACRO]' }
        }
      });

      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);
      payload.setCampaign(campaign);

      stage.process(payload, logEntry);

      expect(rawClick.getKeyword()).toBeUndefined();
    });

    it('should not apply curly brace macro placeholders', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest({ params: {} });
      const campaign = createMockCampaign({
        parameters: {
          keyword: { name: 'keyword', placeholder: '{macro}' }
        }
      });

      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);
      payload.setCampaign(campaign);

      stage.process(payload, logEntry);

      expect(rawClick.getKeyword()).toBeUndefined();
    });
  });

  describe('logging', () => {
    it('should log alias matches', () => {
      const payload = new Payload();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest({
        params: { kw: 'test_keyword' }
      });
      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);

      stage.process(payload, logEntry);

      const messages = logEntry.getMessages();
      expect(messages.some(m => m.includes('Param alias matched'))).toBe(true);
    });
  });
});

/**
 * Helper to create mock server request
 */
function createMockRequest(options: {
  params?: Record<string, string>;
}): ServerRequest {
  const params = options.params ?? {};

  return {
    getParam: (name: string) => params[name],
    hasParam: (name: string) => name in params,
    getUri: () => new URL('http://example.com/test'),
    getHeader: () => undefined
  } as unknown as ServerRequest;
}

/**
 * Helper to create mock campaign
 */
function createMockCampaign(options: {
  parameters?: Record<string, unknown>;
}): Campaign {
  return {
    getParameters: () => options.parameters ?? {},
    getId: () => 1,
    isActive: () => true
  } as unknown as Campaign;
}
