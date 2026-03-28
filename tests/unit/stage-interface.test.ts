/**
 * Stage Tests
 * 
 * Tests for pipeline stages
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StageException, CampaignNotFoundException, SendToCampaignException } from '../../src/core/pipeline/stage-interface';
import { TrafficLogEntry } from '../../src/traffic/logging/traffic-log-entry';
import { Payload } from '../../src/traffic/pipeline/payload';
import { RawClick } from '../../src/traffic/model/raw-click';

// Mock server request
function createMockServerRequest(params: Record<string, string> = {}) {
  return {
    getIp: () => '127.0.0.1',
    getUserAgent: () => 'Test Agent',
    getReferrer: () => '',
    getUri: () => new URL('http://test.local/campaign'),
    getParam: (name: string) => params[name],
    getQueryParams: () => params,
    getHeaders: () => ({}),
    getHeader: () => undefined,
    getMethod: () => 'GET',
    getCookie: () => undefined,
    setCookie: vi.fn(),
    getQueryParam: (name: string) => params[name]
  } as any;
}

// Mock response
function createMockResponse() {
  let status = 200;
  let body = '';
  const headers: Record<string, string> = {};
  
  return {
    getStatus: () => status,
    getBody: () => body,
    getHeaders: () => ({ ...headers }),
    getHeader: (name: string) => headers[name.toLowerCase()],
    withStatus: vi.fn((s: number) => {
      status = s;
      return this;
    }),
    withBody: vi.fn((b: string) => {
      body = b;
      return this;
    }),
    withHeader: vi.fn((name: string, value: string) => {
      headers[name.toLowerCase()] = value;
      return this;
    })
  } as any;
}

// Create test payload
function createTestPayload(params: Record<string, string> = {}) {
  const rawClick = new RawClick({ sub_id: 'test-sub-id' });
  const mockRequest = createMockServerRequest(params);
  const mockResponse = createMockResponse();
  
  return new Payload({
    serverRequest: mockRequest,
    response: mockResponse,
    rawClick
  });
}

describe('StageException', () => {
  it('should create exception with message', () => {
    const error = new StageException('Test error');
    expect(error.message).toBe('Test error');
    expect(error.name).toBe('StageException');
  });

  it('should include stage name', () => {
    const error = new StageException('Test error', 'TestStage');
    expect(error.stageName).toBe('TestStage');
  });

  it('should be instance of Error', () => {
    const error = new StageException('Test');
    expect(error).toBeInstanceOf(Error);
  });
});

describe('CampaignNotFoundException', () => {
  it('should have default message', () => {
    const error = new CampaignNotFoundException();
    expect(error.message).toBe('Campaign not found');
  });

  it('should accept custom message', () => {
    const error = new CampaignNotFoundException('Custom campaign error');
    expect(error.message).toBe('Custom campaign error');
  });

  it('should have correct stage name', () => {
    const error = new CampaignNotFoundException();
    expect(error.stageName).toBe('FindCampaignStage');
  });

  it('should be instance of StageException', () => {
    const error = new CampaignNotFoundException();
    expect(error).toBeInstanceOf(StageException);
  });
});

describe('SendToCampaignException', () => {
  it('should create with campaign ID', () => {
    const error = new SendToCampaignException(123);
    expect(error.campaignId).toBe(123);
    expect(error.message).toContain('123');
  });

  it('should have correct stage name', () => {
    const error = new SendToCampaignException(456);
    expect(error.stageName).toBe('CheckSendingToAnotherCampaign');
  });

  it('should accept custom message', () => {
    const error = new SendToCampaignException(789, 'Custom message');
    expect(error.message).toBe('Custom message');
  });
});

describe('TrafficLogEntry with stages', () => {
  let logEntry: TrafficLogEntry;

  beforeEach(() => {
    logEntry = new TrafficLogEntry();
  });

  it('should log stage execution', () => {
    logEntry.add('[TestStage] Starting execution');
    logEntry.add('[TestStage] Completed successfully');
    
    const messages = logEntry.getMessages();
    expect(messages).toContain('[TestStage] Starting execution');
    expect(messages).toContain('[TestStage] Completed successfully');
  });

  it('should log stage errors', () => {
    logEntry.add('[TestStage] Error: Something went wrong');
    
    expect(logEntry.toString()).toContain('Error');
  });

  it('should track timing for stages', async () => {
    logEntry.startProfiling();
    
    // Simulate stage processing
    await new Promise(r => setTimeout(r, 10));
    
    const elapsed = logEntry.stopProfiling('Stage execution');
    // Allow 1ms tolerance for timer resolution
    expect(elapsed).toBeGreaterThanOrEqual(8);
  });
});
