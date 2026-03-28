/**
 * Tests for ShowHtmlAction
 * 
 * Tests HTML content display action
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { ShowHtmlAction } from '../../../src/traffic/actions/show-html-action.js';
import { ActionType, ActionField } from '../../../src/traffic/actions/abstract-action.js';
import { Payload } from '../../../src/traffic/pipeline/payload.js';
import { Response } from '../../../src/traffic/response/response.js';
import { RawClick } from '../../../src/traffic/model/raw-click.js';
import { ServerRequest } from '../../../src/traffic/request/server-request.js';

describe('ShowHtmlAction', () => {
  let action: ShowHtmlAction;

  beforeEach(() => {
    action = new ShowHtmlAction();
  });

  describe('properties', () => {
    it('should have correct type', () => {
      expect(action.getType()).toBe(ActionType.OTHER);
    });

    it('should have TEXT field', () => {
      expect(action.getField()).toBe(ActionField.TEXT);
    });

    it('should have weight of 100', () => {
      expect(action.getWeight()).toBe(100);
    });

    it('should have name show_html', () => {
      expect(action.getName()).toBe('show_html');
    });
  });

  describe('execute', () => {
    it('should throw error when payload not set', () => {
      expect(() => action.execute()).toThrow('Payload not set');
    });

    it('should display HTML content', () => {
      const html = '<h1>Hello World</h1><p>This is a test.</p>';
      const payload = createValidPayload(html);
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain('<h1>Hello World</h1>');
    });

    it('should set content type to text/html', () => {
      const payload = createValidPayload('<p>Test</p>');
      action.setPayload(payload);

      action.execute();

      const contentType = payload.getResponse()?.getHeader('Content-Type');
      expect(contentType?.[0]).toMatch(/text\/html/);
    });

    it('should process macros in content', () => {
      const rawClick = new RawClick();
      rawClick.setIp('192.168.1.1');
      
      const html = '<p>Your IP: {ip}</p>';
      const payload = createValidPayloadWithClick(html, rawClick);
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain('192.168.1.1');
      expect(content).not.toContain('{ip}');
    });

    it('should set destination info (truncated)', () => {
      const html = '<h1>' + 'A'.repeat(1000) + '</h1>';
      const payload = createValidPayload(html);
      action.setPayload(payload);

      action.execute();

      // Should complete without error
      expect(payload.getResponse()).toBeDefined();
    });
  });

  describe('executeForScript', () => {
    it('should execute without error', () => {
      const html = '<h1>Test</h1>';
      const payload = createValidPayloadWithScript(html);
      action.setPayload(payload);

      action.execute();

      // Should complete without error
      expect(payload.getResponse()).toBeDefined();
    });
  });

  describe('executeForFrame', () => {
    it('should execute without error', () => {
      const html = '<h1>Frame Content</h1>';
      const payload = createValidPayloadWithFrame(html);
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
function createValidPayload(html: string): Payload {
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
  payload.setActionPayload(html);

  return payload;
}

/**
 * Helper to create payload with custom click data
 */
function createValidPayloadWithClick(html: string, rawClick: RawClick): Payload {
  const payload = new Payload();
  const response = new Response();
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
  payload.setActionPayload(html);

  return payload;
}

/**
 * Helper to create payload with script context
 */
function createValidPayloadWithScript(html: string): Payload {
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
  payload.setActionPayload(html);

  return payload;
}

/**
 * Helper to create payload with frame context
 */
function createValidPayloadWithFrame(html: string): Payload {
  const payload = new Payload();
  const response = new Response();
  const rawClick = new RawClick();
  const mockRequest = {
    getQueryParams: () => ({ frmparams: 'frame' }),
    getParam: (name: string) => name === 'frmparams' ? 'frame' : undefined,
    hasParam: (name: string) => name === 'frmparams',
    getUri: () => new URL('http://example.com/test?frmparams=frame'),
    getHeader: () => undefined
  } as unknown as ServerRequest;

  payload.setResponse(response);
  payload.setRawClick(rawClick);
  payload.setServerRequest(mockRequest);
  payload.setActionPayload(html);

  return payload;
}
