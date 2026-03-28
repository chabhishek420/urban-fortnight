/**
 * Tests for Status404Action and ShowTextAction
 * 
 * Tests 404 response and text display actions
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { Status404Action } from '../../../src/traffic/actions/status-404-action.js';
import { ShowTextAction } from '../../../src/traffic/actions/show-text-action.js';
import { ActionType, ActionField } from '../../../src/traffic/actions/abstract-action.js';
import { StatusCode } from '../../../src/traffic/response/status-code.js';
import { Payload } from '../../../src/traffic/pipeline/payload.js';
import { Response } from '../../../src/traffic/response/response.js';
import { RawClick } from '../../../src/traffic/model/raw-click.js';
import { ServerRequest } from '../../../src/traffic/request/server-request.js';

describe('Status404Action', () => {
  let action: Status404Action;

  beforeEach(() => {
    action = new Status404Action();
  });

  describe('properties', () => {
    it('should have correct type', () => {
      expect(action.getType()).toBe(ActionType.OTHER);
    });

    it('should have NOTHING field', () => {
      expect(action.getField()).toBe(ActionField.NOTHING);
    });

    it('should have weight of 1001', () => {
      expect(action.getWeight()).toBe(1001);
    });

    it('should have name status_404', () => {
      expect(action.getName()).toBe('status_404');
    });
  });

  describe('execute', () => {
    it('should throw error when payload not set', () => {
      expect(() => action.execute()).toThrow('Payload not set');
    });

    it('should set status to 404', () => {
      const payload = createValidPayload();
      action.setPayload(payload);

      action.execute();

      expect(payload.getResponse()?.getStatus()).toBe(StatusCode.NOT_FOUND);
    });

    it('should set content type to text/html', () => {
      const payload = createValidPayload();
      action.setPayload(payload);

      action.execute();

      const contentType = payload.getResponse()?.getHeader('Content-Type');
      expect(contentType?.[0]).toMatch(/text\/html/);
    });

    it('should include 404 Not Found heading', () => {
      const payload = createValidPayload();
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain('Not Found');
    });

    it('should include proper HTML structure', () => {
      const payload = createValidPayload();
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain('<!DOCTYPE html>');
      expect(content).toContain('<title>404 Not Found</title>');
      expect(content).toContain('<h1>Not Found</h1>');
    });

    it('should include error message', () => {
      const payload = createValidPayload();
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain('was not found');
    });
  });
});

describe('ShowTextAction', () => {
  let action: ShowTextAction;

  beforeEach(() => {
    action = new ShowTextAction();
  });

  describe('properties', () => {
    it('should have correct type', () => {
      expect(action.getType()).toBe(ActionType.OTHER);
    });

    it('should have TEXT field', () => {
      expect(action.getField()).toBe(ActionField.TEXT);
    });

    it('should have weight of 101', () => {
      expect(action.getWeight()).toBe(101);
    });

    it('should have name show_text', () => {
      expect(action.getName()).toBe('show_text');
    });
  });

  describe('execute', () => {
    it('should throw error when payload not set', () => {
      expect(() => action.execute()).toThrow('Payload not set');
    });

    it('should display text content', () => {
      const text = 'Hello, this is plain text!';
      const payload = createValidPayload(text);
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toBe(text);
    });

    it('should set content type to text/plain', () => {
      const payload = createValidPayload('Test text');
      action.setPayload(payload);

      action.execute();

      const contentType = payload.getResponse()?.getHeader('Content-Type');
      expect(contentType?.[0]).toMatch(/text\/plain/);
    });

    it('should handle special characters', () => {
      const text = 'Special chars: <>&"\'';
      const payload = createValidPayload(text);
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toBe(text);
    });

    it('should handle empty text', () => {
      const payload = createValidPayload('');
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toBe('');
    });

    it('should handle multiline text', () => {
      const text = 'Line 1\nLine 2\nLine 3';
      const payload = createValidPayload(text);
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toBe(text);
    });

    it('should handle Unicode text', () => {
      const text = 'Hello 世界 🌍';
      const payload = createValidPayload(text);
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toBe(text);
    });
  });
});

/**
 * Helper to create valid payload
 */
function createValidPayload(text?: string): Payload {
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
  if (text !== undefined) {
    payload.setActionPayload(text);
  }

  return payload;
}
