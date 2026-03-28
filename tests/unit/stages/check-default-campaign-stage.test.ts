/**
 * Tests for CheckDefaultCampaignStage
 * 
 * Tests default campaign handling when no campaign is found
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { CheckDefaultCampaignStage } from '../../../src/traffic/pipeline/stage/check-default-campaign-stage.js';
import { Payload } from '../../../src/traffic/pipeline/payload.js';
import { TrafficLogEntry } from '../../../src/traffic/logging/traffic-log-entry.js';
import { StatusCode } from '../../../src/traffic/response/status-code.js';
import { StageException } from '../../../src/core/pipeline/stage-interface.js';
import { ServerRequest } from '../../../src/traffic/request/server-request.js';
import { Campaign } from '../../../src/traffic/model/campaign.js';

describe('CheckDefaultCampaignStage', () => {
  let stage: CheckDefaultCampaignStage;
  let logEntry: TrafficLogEntry;

  beforeEach(() => {
    stage = new CheckDefaultCampaignStage();
    logEntry = new TrafficLogEntry();
  });

  describe('process', () => {
    it('should pass through when campaign is already set', () => {
      const payload = new Payload();
      const mockRequest = createMockRequest();
      payload.setServerRequest(mockRequest);
      payload.setCampaign(createMockCampaign({ id: 123 }));

      const result = stage.process(payload, logEntry);

      expect(result.isAborted()).toBe(false);
    });

    it('should throw StageException when request is missing', () => {
      const payload = new Payload();

      expect(() => stage.process(payload, logEntry)).toThrow();
    });

    it('should return 404 when no campaign found and default action is nothing', () => {
      const payload = new Payload();
      const mockRequest = createMockRequest();
      payload.setServerRequest(mockRequest);

      const result = stage.process(payload, logEntry);

      expect(result.isAborted()).toBe(true);
      expect(result.getResponse()?.getStatus()).toBe(StatusCode.NOT_FOUND);
    });

    it('should return 404 body with "Not Found" text', () => {
      const payload = new Payload();
      const mockRequest = createMockRequest();
      payload.setServerRequest(mockRequest);

      stage.process(payload, logEntry);

      expect(payload.getResponse()?.getBody()).toContain('Not Found');
    });

    it('should log when showing 404', () => {
      const payload = new Payload();
      const mockRequest = createMockRequest();
      payload.setServerRequest(mockRequest);

      stage.process(payload, logEntry);

      const messages = logEntry.getMessages();
      expect(messages).toContain('Shows 404 NotFound');
    });

    it('should log when checking default action', () => {
      const payload = new Payload();
      const mockRequest = createMockRequest();
      payload.setServerRequest(mockRequest);

      stage.process(payload, logEntry);

      const messages = logEntry.getMessages();
      expect(messages).toContain('Check default action from settings');
    });

    it('should return payload for chaining', () => {
      const payload = new Payload();
      const mockRequest = createMockRequest();
      payload.setServerRequest(mockRequest);

      const result = stage.process(payload, logEntry);

      expect(result).toBe(payload);
    });

    it('should abort pipeline on 404 response', () => {
      const payload = new Payload();
      const mockRequest = createMockRequest();
      payload.setServerRequest(mockRequest);

      const result = stage.process(payload, logEntry);

      expect(result.isAborted()).toBe(true);
    });
  });

  describe('campaign already set scenarios', () => {
    it('should not modify payload when campaign exists', () => {
      const payload = new Payload();
      const mockRequest = createMockRequest();
      const campaign = createMockCampaign({ id: 456 });
      payload.setServerRequest(mockRequest);
      payload.setCampaign(campaign);

      const result = stage.process(payload, logEntry);

      expect(result.getCampaign()).toBe(campaign);
      expect(result.isAborted()).toBe(false);
      expect(result.getResponse()).toBeNull();
    });
  });

  describe('response handling', () => {
    it('should create new response when none exists', () => {
      const payload = new Payload();
      const mockRequest = createMockRequest();
      payload.setServerRequest(mockRequest);

      stage.process(payload, logEntry);

      expect(payload.getResponse()).toBeDefined();
    });

    it('should set NOT_FOUND status code', () => {
      const payload = new Payload();
      const mockRequest = createMockRequest();
      payload.setServerRequest(mockRequest);

      stage.process(payload, logEntry);

      expect(payload.getResponse()?.getStatus()).toBe(StatusCode.NOT_FOUND);
    });
  });

  describe('extra action scenarios', () => {
    it('should handle missing request gracefully', () => {
      const payload = new Payload();
      // No request set

      expect(() => stage.process(payload, logEntry)).toThrow();
    });
  });
});

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
 * Helper to create mock campaign
 */
function createMockCampaign(options: { id: number }): Campaign {
  return {
    getId: () => options.id,
    isActive: () => true,
    getParameters: () => ({})
  } as unknown as Campaign;
}
