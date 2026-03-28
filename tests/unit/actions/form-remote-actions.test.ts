/**
 * Tests for FormSubmitAction and RemoteAction
 * 
 * Tests form submission and remote redirect actions
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { FormSubmitAction } from '../../../src/traffic/actions/form-submit-action.js';
import { RemoteAction } from '../../../src/traffic/actions/remote-action.js';
import { ActionType, ActionField } from '../../../src/traffic/actions/abstract-action.js';
import { Payload } from '../../../src/traffic/pipeline/payload.js';
import { Response } from '../../../src/traffic/response/response.js';
import { RawClick } from '../../../src/traffic/model/raw-click.js';
import { ServerRequest } from '../../../src/traffic/request/server-request.js';

describe('FormSubmitAction', () => {
  let action: FormSubmitAction;

  beforeEach(() => {
    action = new FormSubmitAction();
  });

  describe('properties', () => {
    it('should have correct type', () => {
      expect(action.getType()).toBe(ActionType.REDIRECT);
    });

    it('should have URL field', () => {
      expect(action.getField()).toBe(ActionField.URL);
    });

    it('should have weight of 5', () => {
      expect(action.getWeight()).toBe(5);
    });

    it('should have name form_submit', () => {
      expect(action.getName()).toBe('form_submit');
    });
  });

  describe('execute', () => {
    it('should throw error when payload not set', () => {
      expect(() => action.execute()).toThrow('Payload not set');
    });

    it('should generate form HTML', () => {
      const url = 'https://example.com/submit';
      const payload = createValidPayload(url);
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain('<form');
      expect(content).toContain(`action="${url}"`);
    });

    it('should use POST method', () => {
      const payload = createValidPayload('https://example.com');
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain('method="POST"');
    });

    it('should include auto-submit script', () => {
      const payload = createValidPayload('https://example.com');
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain('document.forms[0].submit()');
    });

    it('should include hidden fields from POST body', () => {
      const payload = createValidPayloadWithBody('https://example.com', { 
        param1: 'value1', 
        param2: 'value2' 
      });
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain('name="param1"');
      expect(content).toContain('value="value1"');
      expect(content).toContain('name="param2"');
      expect(content).toContain('value="value2"');
    });

    it('should escape HTML in field values', () => {
      const payload = createValidPayloadWithBody('https://example.com', { 
        malicious: '<script>alert("xss")</script>' 
      });
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain('&lt;script&gt;');
      expect(content).not.toContain('<script>alert');
    });

    it('should escape HTML in field names', () => {
      const payload = createValidPayloadWithBody('https://example.com', { 
        '"><script>alert(1)</script>': 'value' 
      });
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain('&lt;script&gt;');
    });

    it('should set destination info', () => {
      const url = 'https://example.com/target';
      const payload = createValidPayload(url);
      action.setPayload(payload);

      action.execute();

      // Should complete without error
      expect(payload.getResponse()).toBeDefined();
    });
  });
});

describe('RemoteAction', () => {
  let action: RemoteAction;

  beforeEach(() => {
    action = new RemoteAction();
  });

  describe('properties', () => {
    it('should have correct type', () => {
      expect(action.getType()).toBe(ActionType.REDIRECT);
    });

    it('should have URL field', () => {
      expect(action.getField()).toBe(ActionField.URL);
    });

    it('should have weight of 130', () => {
      expect(action.getWeight()).toBe(130);
    });

    it('should have name remote', () => {
      expect(action.getName()).toBe('remote');
    });
  });

  describe('execute', () => {
    it('should throw error when payload not set', () => {
      expect(() => action.execute()).toThrow('Payload not set');
    });

    it('should execute without error', () => {
      const payload = createValidPayload('https://example.com/api/redirect');
      action.setPayload(payload);

      action.execute();

      expect(payload.getResponse()).toBeDefined();
    });
  });

  describe('setStub', () => {
    it('should have static setStub method for testing', () => {
      expect(typeof RemoteAction.setStub).toBe('function');
    });

    it('should allow setting stub URLs', () => {
      RemoteAction.setStub('https://test.com/api', 'https://redirect.com/target');
      // Stub was set without error
    });
  });
});

/**
 * Helper to create valid payload
 */
function createValidPayload(url: string): Payload {
  const payload = new Payload();
  const response = new Response();
  const rawClick = new RawClick();
  const mockRequest = {
    getQueryParams: () => ({}),
    getParsedBody: () => ({}),
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

/**
 * Helper to create payload with POST body
 */
function createValidPayloadWithBody(url: string, body: Record<string, string>): Payload {
  const payload = new Payload();
  const response = new Response();
  const rawClick = new RawClick();
  const mockRequest = {
    getQueryParams: () => ({}),
    getParsedBody: () => body,
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
