/**
 * ExecuteActionStage Tests
 * 
 * Tests for the pipeline stage that executes actions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExecuteActionStage } from '../../../src/traffic/pipeline/stage/execute-action-stage';
import { Payload } from '../../../src/traffic/pipeline/payload';
import { RawClick } from '../../../src/traffic/model/raw-click';
import { Response } from '../../../src/traffic/response/response';
import { TrafficLogEntry } from '../../../src/traffic/logging/traffic-log-entry';
import { StageException } from '../../../src/core/pipeline/stage-interface';

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

// Create test payload
function createTestPayload(options: {
  actionType?: string | null;
  actionPayload?: string;
  rawClick?: RawClick;
  response?: Response;
} = {}) {
  const rawClick = options.rawClick ?? new RawClick({ sub_id: 'test-sub-id' });
  const mockRequest = createMockServerRequest();
  const mockResponse = options.response ?? new Response();
  
  const payload = new Payload({
    serverRequest: mockRequest,
    response: mockResponse,
    rawClick
  });
  
  if (options.actionType !== undefined) {
    payload.setActionType(options.actionType);
  }
  
  if (options.actionPayload) {
    payload.setActionPayload(options.actionPayload);
  }
  
  return payload;
}

// Create mock stream
function createMockStream(actionType: string, actionPayload: string) {
  return {
    getId: () => 1,
    getName: () => 'Test Stream',
    getActionType: () => actionType,
    getActionPayload: () => actionPayload,
    getActionOptions: () => ({})
  } as any;
}

describe('ExecuteActionStage', () => {
  let stage: ExecuteActionStage;
  let logEntry: TrafficLogEntry;

  beforeEach(() => {
    stage = new ExecuteActionStage();
    logEntry = new TrafficLogEntry();
  });

  describe('validation', () => {
    it('should throw when rawClick is null', () => {
      const payload = createTestPayload();
      (payload as any)._rawClick = null;
      
      expect(() => stage.process(payload, logEntry)).toThrow(StageException);
      expect(() => stage.process(payload, logEntry)).toThrow('Empty rawClick');
    });

    it('should pass through when actionType is null', () => {
      const payload = createTestPayload({ actionType: null });
      
      const result = stage.process(payload, logEntry);
      
      expect(result).toBe(payload);
      expect(logEntry.getMessages().some(m => m.includes('Empty actionType'))).toBe(true);
    });

    it('should throw when response is null', () => {
      const payload = createTestPayload({ actionType: 'http_redirect' });
      (payload as any)._response = null;
      
      expect(() => stage.process(payload, logEntry)).toThrow('Empty response');
    });
  });

  describe('action execution', () => {
    it('should execute http_redirect action', () => {
      const payload = createTestPayload({
        actionType: 'http_redirect',
        actionPayload: 'https://example.com/offer'
      });
      
      const result = stage.process(payload, logEntry);
      
      const response = result.getResponse();
      expect(response?.getHeader('Location')).toEqual(['https://example.com/offer']);
    });

    it('should execute iframe action', () => {
      const payload = createTestPayload({
        actionType: 'iframe',
        actionPayload: 'https://example.com/embed'
      });
      
      const result = stage.process(payload, logEntry);
      
      const response = result.getResponse();
      expect(response?.getBody()).toContain('<iframe');
    });

    it('should execute show_html action', () => {
      const payload = createTestPayload({
        actionType: 'show_html',
        actionPayload: '<h1>Hello World</h1>'
      });
      
      const result = stage.process(payload, logEntry);
      
      const response = result.getResponse();
      expect(response?.getBody()).toContain('<h1>Hello World</h1>');
    });

    it('should execute show_text action', () => {
      const payload = createTestPayload({
        actionType: 'show_text',
        actionPayload: 'Plain text content'
      });
      
      const result = stage.process(payload, logEntry);
      
      const response = result.getResponse();
      expect(response?.getBody()).toContain('Plain text content');
    });

    it('should execute do_nothing action', () => {
      const payload = createTestPayload({
        actionType: 'do_nothing'
      });
      
      expect(() => stage.process(payload, logEntry)).not.toThrow();
    });

    it('should execute status_404 action', () => {
      const payload = createTestPayload({
        actionType: 'status_404'
      });
      
      const result = stage.process(payload, logEntry);
      
      const response = result.getResponse();
      expect(response?.getStatus()).toBe(404);
    });

    it('should execute meta redirect action', () => {
      const payload = createTestPayload({
        actionType: 'meta',
        actionPayload: 'https://example.com/offer'
      });
      
      const result = stage.process(payload, logEntry);
      
      const response = result.getResponse();
      expect(response?.getBody()).toContain('meta');
      expect(response?.getBody()).toContain('refresh');
    });

    it('should execute js redirect action', () => {
      const payload = createTestPayload({
        actionType: 'js',
        actionPayload: 'https://example.com/offer'
      });
      
      const result = stage.process(payload, logEntry);
      
      const response = result.getResponse();
      expect(response?.getBody()).toContain('window.location');
    });
  });

  describe('error handling', () => {
    it('should throw for unknown action type', () => {
      const payload = createTestPayload({
        actionType: 'unknown_action'
      });
      
      expect(() => stage.process(payload, logEntry)).toThrow(StageException);
      expect(() => stage.process(payload, logEntry)).toThrow('Incorrect type');
    });

    it('should handle action execution errors', () => {
      const payload = createTestPayload({
        actionType: 'http_redirect',
        actionPayload: null as any // Will cause error in action
      });
      
      // Should either handle gracefully or throw
      expect(() => stage.process(payload, logEntry)).not.toThrow();
    });
  });

  describe('logging', () => {
    it('should log action execution', () => {
      const payload = createTestPayload({
        actionType: 'http_redirect',
        actionPayload: 'https://example.com'
      });
      
      stage.process(payload, logEntry);
      
      expect(logEntry.getMessages().some(m => m.includes('Executing action'))).toBe(true);
    });
  });

  describe('destination tracking', () => {
    it('should set destination on raw click for redirect actions', () => {
      const payload = createTestPayload({
        actionType: 'http_redirect',
        actionPayload: 'https://offer.example.com/landing'
      });
      
      const result = stage.process(payload, logEntry);
      
      const rawClick = result.getRawClick();
      expect(rawClick?.getDestination()).toBe('https://offer.example.com/landing');
    });
  });

  describe('campaign context in errors', () => {
    it('should include campaign ID in error when available', () => {
      const payload = createTestPayload({ actionType: null });
      payload.setCampaign({
        getId: () => 42,
        getName: () => 'Test Campaign'
      } as any);
      
      stage.process(payload, logEntry);
      
      expect(logEntry.getMessages().some(m => m.includes('#42'))).toBe(true);
    });
  });
});
