/**
 * Tests for IframeAction
 * 
 * Tests iframe action execution and response generation
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { IframeAction } from '../../../src/traffic/actions/iframe-action.js';
import { ActionType, ActionField } from '../../../src/traffic/actions/abstract-action.js';
import { StatusCode } from '../../../src/traffic/response/status-code.js';
import { Payload } from '../../../src/traffic/pipeline/payload.js';
import { Response } from '../../../src/traffic/response/response.js';
import { RawClick } from '../../../src/traffic/model/raw-click.js';
import { ServerRequest } from '../../../src/traffic/request/server-request.js';

describe('IframeAction', () => {
  let action: IframeAction;

  beforeEach(() => {
    action = new IframeAction();
  });

  describe('properties', () => {
    it('should have correct type', () => {
      expect(action.getType()).toBe(ActionType.REDIRECT);
    });

    it('should have URL field', () => {
      expect(action.getField()).toBe(ActionField.URL);
    });

    it('should have weight of 6', () => {
      expect(action.getWeight()).toBe(6);
    });

    it('should have name iframe', () => {
      expect(action.getName()).toBe('iframe');
    });
  });

  describe('execute', () => {
    it('should throw error when payload not set', () => {
      expect(() => action.execute()).toThrow('Payload not set');
    });

    it('should execute with payload set', () => {
      const payload = createValidPayload('https://example.com');
      action.setPayload(payload);

      expect(() => action.execute()).not.toThrow();
    });
  });

  describe('executeDefault', () => {
    it('should generate HTML with iframe', () => {
      const url = 'https://example.com/target';
      const payload = createValidPayload(url);
      action.setPayload(payload);

      action.execute();

      const response = payload.getResponse();
      expect(response?.getBody()).toContain('<iframe');
      expect(response?.getBody()).toContain(`src="${url}"`);
    });

    it('should set content type to text/html', () => {
      const payload = createValidPayload('https://example.com');
      action.setPayload(payload);

      action.execute();

      const response = payload.getResponse();
      // Check content type is set (returns array)
      const contentType = response?.getHeader('Content-Type');
      expect(contentType?.[0]).toMatch(/text\/html/);
    });

    it('should include viewport meta tag', () => {
      const payload = createValidPayload('https://example.com');
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain('viewport');
      expect(content).toContain('width=device-width');
    });

    it('should include responsive CSS styles', () => {
      const payload = createValidPayload('https://example.com');
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain('width: 100%');
      expect(content).toContain('height: 100%');
    });

    it('should set iframe to full page size', () => {
      const payload = createValidPayload('https://example.com');
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain('border: 0');
      expect(content).toContain('min-height');
    });

    it('should include DOCTYPE declaration', () => {
      const payload = createValidPayload('https://example.com');
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain('<!DOCTYPE html>');
    });

    it('should handle URLs with query parameters', () => {
      const url = 'https://example.com/page?param=value&other=test';
      const payload = createValidPayload(url);
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain(url);
    });

    it('should handle URLs with fragments', () => {
      const url = 'https://example.com/page#section';
      const payload = createValidPayload(url);
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain(url);
    });
  });

  describe('response handling', () => {
    it('should create valid HTML document', () => {
      const payload = createValidPayload('https://example.com');
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain('<html>');
      expect(content).toContain('</html>');
      expect(content).toContain('<head>');
      expect(content).toContain('</head>');
      expect(content).toContain('<body>');
      expect(content).toContain('</body>');
    });

    it('should include overflow styles for scrolling', () => {
      const payload = createValidPayload('https://example.com');
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain('overflow');
    });
  });

  describe('edge cases', () => {
    it('should handle empty URL', () => {
      const payload = createValidPayload('');
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain('src=""');
    });

    it('should handle URL with special characters', () => {
      const url = 'https://example.com/path?name=Test%20Value&key=value%26amp';
      const payload = createValidPayload(url);
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain(url);
    });

    it('should handle URL with Unicode', () => {
      const url = 'https://example.com/路径';
      const payload = createValidPayload(url);
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain(url);
    });
  });
});

/**
 * Helper to create valid payload with URL
 */
function createValidPayload(url: string): Payload {
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
  payload.setActionPayload(url);

  return payload;
}
