/**
 * Multiple Action Types Tests
 * 
 * Tests for various action implementations
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { IframeAction } from '../../src/traffic/actions/iframe-action';
import { ShowTextAction } from '../../src/traffic/actions/show-text-action';
import { DoNothingAction } from '../../src/traffic/actions/do-nothing-action';
import { Status404Action } from '../../src/traffic/actions/status-404-action';
import { MetaAction } from '../../src/traffic/actions/meta-action';
import { JsAction } from '../../src/traffic/actions/js-action';
import { Payload } from '../../src/traffic/pipeline/payload';
import { RawClick } from '../../src/traffic/model/raw-click';
import { Response } from '../../src/traffic/response/response';
import { StatusCode } from '../../src/traffic/response/status-code';
import { ContentType } from '../../src/traffic/response/content-type';

// Mock server request
function createMockServerRequest() {
  return {
    getIp: () => '127.0.0.1',
    getUserAgent: () => 'Test Agent',
    getReferrer: () => '',
    getUri: () => new URL('http://test.local/campaign'),
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
function createTestPayload(actionPayload?: string, actionType?: string) {
  const rawClick = new RawClick({ sub_id: 'test-sub-id' });
  const mockRequest = createMockServerRequest();
  const mockResponse = new Response();
  
  const payload = new Payload({
    serverRequest: mockRequest,
    response: mockResponse,
    rawClick
  });
  
  if (actionPayload) {
    payload.setActionPayload(actionPayload);
  }
  
  if (actionType) {
    payload.setActionType(actionType);
  }
  
  return payload;
}

describe('IframeAction', () => {
  let action: IframeAction;

  beforeEach(() => {
    action = new IframeAction();
  });

  it('should have correct name', () => {
    expect(action.getName()).toBe('iframe');
  });

  it('should have redirect type', () => {
    // IframeAction is classified as redirect in this implementation
    expect(action.getType()).toBe('redirect');
  });

  it('should have URL field', () => {
    expect(action.getField()).toBe('url');
  });

  it('should set HTML content with iframe', () => {
    const payload = createTestPayload('https://example.com/embed');
    action.setPayload(payload);
    action.execute();
    
    const response = payload.getResponse();
    expect(response?.getBody()).toContain('<iframe');
    expect(response?.getBody()).toContain('https://example.com/embed');
  });

  it('should set HTML content type', () => {
    const payload = createTestPayload('https://example.com/embed');
    action.setPayload(payload);
    action.execute();
    
    const response = payload.getResponse();
    expect(response?.getHeader('Content-Type')).toEqual([ContentType.HTML]);
  });
});

describe('ShowTextAction', () => {
  let action: ShowTextAction;

  beforeEach(() => {
    action = new ShowTextAction();
  });

  it('should have correct name', () => {
    expect(action.getName()).toBe('show_text');
  });

  it('should have text field', () => {
    expect(action.getField()).toBe('text');
  });

  it('should set text content', () => {
    const payload = createTestPayload('Hello World');
    action.setPayload(payload);
    action.execute();
    
    const response = payload.getResponse();
    expect(response?.getBody()).toContain('Hello World');
  });
});

describe('DoNothingAction', () => {
  let action: DoNothingAction;

  beforeEach(() => {
    action = new DoNothingAction();
  });

  it('should have correct name', () => {
    expect(action.getName()).toBe('do_nothing');
  });

  it('should have nothing field', () => {
    expect(action.getField()).toBe('nothing');
  });

  it('should execute without error', () => {
    const payload = createTestPayload();
    action.setPayload(payload);
    
    expect(() => action.execute()).not.toThrow();
  });

  it('should return payload from run', () => {
    const payload = createTestPayload();
    action.setPayload(payload);
    
    const result = action.run();
    expect(result).toBe(payload);
  });
});

describe('Status404Action', () => {
  let action: Status404Action;

  beforeEach(() => {
    action = new Status404Action();
  });

  it('should have correct name', () => {
    expect(action.getName()).toBe('status_404');
  });

  it('should have nothing field', () => {
    expect(action.getField()).toBe('nothing');
  });

  it('should set 404 status', () => {
    const payload = createTestPayload();
    action.setPayload(payload);
    action.execute();
    
    const response = payload.getResponse();
    expect(response?.getStatus()).toBe(StatusCode.NOT_FOUND);
  });
});

describe('MetaAction', () => {
  let action: MetaAction;

  beforeEach(() => {
    action = new MetaAction();
  });

  it('should have correct name', () => {
    expect(action.getName()).toBe('meta');
  });

  it('should have redirect type', () => {
    expect(action.getType()).toBe('redirect');
  });

  it('should have URL field', () => {
    expect(action.getField()).toBe('url');
  });

  it('should set HTML content with meta refresh', () => {
    const payload = createTestPayload('https://example.com/offer');
    action.setPayload(payload);
    action.execute();
    
    const response = payload.getResponse();
    expect(response?.getBody()).toContain('meta');
    expect(response?.getBody()).toContain('refresh');
    expect(response?.getBody()).toContain('https://example.com/offer');
  });

  it('should set HTML content type', () => {
    const payload = createTestPayload('https://example.com/offer');
    action.setPayload(payload);
    action.execute();
    
    const response = payload.getResponse();
    expect(response?.getHeader('Content-Type')).toEqual([ContentType.HTML]);
  });
});

describe('JsAction', () => {
  let action: JsAction;

  beforeEach(() => {
    action = new JsAction();
  });

  it('should have correct name', () => {
    expect(action.getName()).toBe('js');
  });

  it('should have redirect type', () => {
    expect(action.getType()).toBe('redirect');
  });

  it('should have URL field', () => {
    expect(action.getField()).toBe('url');
  });

  it('should set JavaScript content with redirect', () => {
    const payload = createTestPayload('https://example.com/offer');
    action.setPayload(payload);
    action.execute();
    
    const response = payload.getResponse();
    expect(response?.getBody()).toContain('window.location');
    expect(response?.getBody()).toContain('https://example.com/offer');
  });

  it('should set HTML content type by default', () => {
    // Default execution uses HTML content type
    const payload = createTestPayload('https://example.com/offer');
    action.setPayload(payload);
    action.execute();
    
    const response = payload.getResponse();
    expect(response?.getHeader('Content-Type')).toEqual([ContentType.HTML]);
  });

  it('should set destination on raw click', () => {
    const payload = createTestPayload('https://example.com/offer');
    action.setPayload(payload);
    action.execute();
    
    const rawClick = payload.getRawClick();
    expect(rawClick?.getDestination()).toBe('https://example.com/offer');
  });
});
