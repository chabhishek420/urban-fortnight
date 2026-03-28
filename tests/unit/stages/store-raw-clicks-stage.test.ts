/**
 * Tests for StoreRawClicksStage
 * 
 * Tests click persistence to database
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { StoreRawClicksStage } from '../../../src/traffic/pipeline/stage/store-raw-clicks-stage.js';
import { Payload } from '../../../src/traffic/pipeline/payload.js';
import { TrafficLogEntry } from '../../../src/traffic/logging/traffic-log-entry.js';
import { RawClick } from '../../../src/traffic/model/raw-click.js';
import { Response } from '../../../src/traffic/response/response.js';
import { ServerRequest } from '../../../src/traffic/request/server-request.js';

describe('StoreRawClicksStage', () => {
  let stage: StoreRawClicksStage;
  let logEntry: TrafficLogEntry;

  beforeEach(() => {
    stage = new StoreRawClicksStage();
    logEntry = new TrafficLogEntry();
  });

  describe('process', () => {
    it('should return payload unchanged', async () => {
      const payload = new Payload();
      const response = new Response();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest();

      payload.setResponse(response);
      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);

      const result = await stage.process(payload, logEntry);

      expect(result).toBe(payload);
    });

    it('should log when no clicks to store', async () => {
      const payload = new Payload();
      const response = new Response();
      const mockRequest = createMockRequest();

      payload.setResponse(response);
      payload.setServerRequest(mockRequest);

      await stage.process(payload, logEntry);

      const messages = logEntry.getMessages();
      expect(messages.some(m => m.includes('Saving clicks'))).toBe(true);
    });

    it('should handle stream without collect_clicks', async () => {
      const payload = new Payload();
      const response = new Response();
      const rawClick = new RawClick();
      const mockRequest = createMockRequest();
      const mockStream = { get: (key: string) => key === 'collect_clicks' ? false : null };

      payload.setResponse(response);
      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);
      payload.setStream(mockStream as any);

      await stage.process(payload, logEntry);

      const messages = logEntry.getMessages();
      expect(messages.some(m => m.includes("doesn't store clicks"))).toBe(true);
    });

    it('should process when stream collects clicks', async () => {
      const payload = new Payload();
      const response = new Response();
      const rawClick = new RawClick();
      rawClick.setIp('192.168.1.1');
      const mockRequest = createMockRequest();
      const mockStream = { get: (key: string) => key === 'collect_clicks' ? true : null };

      payload.setResponse(response);
      payload.setRawClick(rawClick);
      payload.setServerRequest(mockRequest);
      payload.setStream(mockStream as any);

      // Add raw click to store
      payload.addRawClickToStore(rawClick);

      const result = await stage.process(payload, logEntry);

      expect(result).toBe(payload);
    });
  });
});

/**
 * Helper to create mock server request
 */
function createMockRequest(): ServerRequest {
  return {
    getQueryParams: () => ({}),
    getParsedBody: () => ({}),
    getParam: () => undefined,
    hasParam: () => false,
    getUri: () => new URL('http://example.com/test'),
    getHeader: () => undefined
  } as unknown as ServerRequest;
}
