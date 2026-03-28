/**
 * Tests for JsAction
 * 
 * Tests JavaScript redirect action
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { JsAction } from '../../../src/traffic/actions/js-action.js';
import { ActionType, ActionField } from '../../../src/traffic/actions/abstract-action.js';
import { Payload } from '../../../src/traffic/pipeline/payload.js';
import { Response } from '../../../src/traffic/response/response.js';
import { RawClick } from '../../../src/traffic/model/raw-click.js';
import { ServerRequest } from '../../../src/traffic/request/server-request.js';

describe('JsAction', () => {
  let action: JsAction;

  beforeEach(() => {
    action = new JsAction();
  });

  describe('properties', () => {
    it('should have correct type', () => {
      expect(action.getType()).toBe(ActionType.REDIRECT);
    });

    it('should have URL field', () => {
      expect(action.getField()).toBe(ActionField.URL);
    });

    it('should have weight of 4', () => {
      expect(action.getWeight()).toBe(4);
    });

    it('should have name js', () => {
      expect(action.getName()).toBe('js');
    });
  });

  describe('execute', () => {
    it('should throw error when payload not set', () => {
      expect(() => action.execute()).toThrow('Payload not set');
    });

    it('should generate JavaScript redirect HTML', () => {
      const url = 'https://example.com/target';
      const payload = createValidPayload(url);
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain('window.location.href');
      expect(content).toContain(`"${url}"`);
    });

    it('should set content type to text/html', () => {
      const payload = createValidPayload('https://example.com');
      action.setPayload(payload);

      action.execute();

      const contentType = payload.getResponse()?.getHeader('Content-Type');
      expect(contentType?.[0]).toMatch(/text\/html/);
    });

    it('should include DOCTYPE declaration', () => {
      const payload = createValidPayload('https://example.com');
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain('<!DOCTYPE html>');
    });

    it('should include redirect message', () => {
      const payload = createValidPayload('https://example.com');
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain('Redirecting');
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

  describe('executeForScript', () => {
    it('should execute without error', () => {
      const url = 'https://example.com';
      const payload = createValidPayloadWithScript(url);
      action.setPayload(payload);

      action.execute();

      // Should complete without error
      expect(payload.getResponse()).toBeDefined();
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
 * Helper to create payload with script context
 */
function createValidPayloadWithScript(url: string): Payload {
  const payload = new Payload();
  const response = new Response();
  const rawClick = new RawClick();
  const mockRequest = {
    getQueryParams: () => ({ frmparams: 'script' }),
    getParam: (name: string) => name === 'frmparams' ? 'script' : undefined,
    hasParam: (name: string) => name === 'frmparams',
    getUri: () => new URL('http://example.com/test?frmparams=script'),
    getHeader: () => undefined
  } as unknown as ServerRequest;

  payload.setResponse(response);
  payload.setRawClick(rawClick);
  payload.setServerRequest(mockRequest);
  payload.setActionPayload(url);

  return payload;
}
