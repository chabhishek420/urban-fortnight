/**
 * Tests for remaining redirect actions
 * 
 * Tests double-meta, blank-referrer, to-campaign, do-nothing actions
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { DoubleMetaAction } from '../../../src/traffic/actions/double-meta-action.js';
import { BlankReferrerAction } from '../../../src/traffic/actions/blank-referrer-action.js';
import { ToCampaignAction } from '../../../src/traffic/actions/to-campaign-action.js';
import { DoNothingAction } from '../../../src/traffic/actions/do-nothing-action.js';
import { ActionType, ActionField } from '../../../src/traffic/actions/abstract-action.js';
import { Payload } from '../../../src/traffic/pipeline/payload.js';
import { Response } from '../../../src/traffic/response/response.js';
import { RawClick } from '../../../src/traffic/model/raw-click.js';
import { ServerRequest } from '../../../src/traffic/request/server-request.js';

describe('DoubleMetaAction', () => {
  let action: DoubleMetaAction;

  beforeEach(() => {
    action = new DoubleMetaAction();
  });

  describe('properties', () => {
    it('should have correct type', () => {
      expect(action.getType()).toBe(ActionType.REDIRECT);
    });

    it('should have URL field', () => {
      expect(action.getField()).toBe(ActionField.URL);
    });

    it('should have weight of 3', () => {
      expect(action.getWeight()).toBe(3);
    });

    it('should have name double_meta', () => {
      expect(action.getName()).toBe('double_meta');
    });
  });

  describe('execute', () => {
    it('should throw error when payload not set', () => {
      expect(() => action.execute()).toThrow('Payload not set');
    });

    it('should generate double redirect HTML', () => {
      const url = 'https://example.com/target';
      const payload = createValidPayload(url);
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      // First redirect uses data URL
      expect(content).toContain('data:text/html');
      expect(content).toContain('<meta http-equiv="refresh"');
    });

    it('should use data URL for intermediate redirect', () => {
      const payload = createValidPayload('https://example.com');
      action.setPayload(payload);

      action.execute();

      const content = payload.getResponse()?.getBody() ?? '';
      expect(content).toContain('data:text/html;charset=utf-8');
    });
  });
});

describe('BlankReferrerAction', () => {
  let action: BlankReferrerAction;

  beforeEach(() => {
    action = new BlankReferrerAction();
  });

  describe('properties', () => {
    it('should have correct type', () => {
      expect(action.getType()).toBe(ActionType.REDIRECT);
    });

    it('should have URL field', () => {
      expect(action.getField()).toBe(ActionField.URL);
    });

    it('should have weight of 3', () => {
      expect(action.getWeight()).toBe(3);
    });

    it('should have name blank_referrer', () => {
      expect(action.getName()).toBe('blank_referrer');
    });
  });

  describe('execute', () => {
    it('should throw error when payload not set', () => {
      expect(() => action.execute()).toThrow('Payload not set');
    });

    it('should execute without error', () => {
      const payload = createValidPayload('https://example.com');
      action.setPayload(payload);

      action.execute();

      expect(payload.getResponse()).toBeDefined();
    });
  });
});

describe('ToCampaignAction', () => {
  let action: ToCampaignAction;

  beforeEach(() => {
    action = new ToCampaignAction();
  });

  describe('properties', () => {
    it('should have correct type', () => {
      expect(action.getType()).toBe(ActionType.OTHER);
    });

    it('should have CAMPAIGNS field', () => {
      expect(action.getField()).toBe(ActionField.CAMPAIGNS);
    });

    it('should have weight of 6', () => {
      expect(action.getWeight()).toBe(6);
    });

    it('should have name to_campaign', () => {
      expect(action.getName()).toBe('to_campaign');
    });
  });

  describe('execute', () => {
    it('should throw error when payload not set', () => {
      expect(() => action.execute()).toThrow('Payload not set');
    });

    it('should set forced campaign ID', () => {
      const payload = createValidPayload('123');
      action.setPayload(payload);

      action.execute();

      expect(payload.getForcedCampaignId()).toBe(123);
    });

    it('should handle non-numeric campaign ID', () => {
      const payload = createValidPayload('invalid');
      action.setPayload(payload);

      // Should not throw
      action.execute();

      expect(payload.getForcedCampaignId()).toBeNull();
    });

    it('should set destination info', () => {
      const payload = createValidPayload('456');
      action.setPayload(payload);

      action.execute();

      // Should complete without error
      expect(payload.getResponse()).toBeDefined();
    });
  });
});

describe('DoNothingAction', () => {
  let action: DoNothingAction;

  beforeEach(() => {
    action = new DoNothingAction();
  });

  describe('properties', () => {
    it('should have correct type', () => {
      expect(action.getType()).toBe(ActionType.HIDDEN);
    });

    it('should have NOTHING field', () => {
      expect(action.getField()).toBe(ActionField.NOTHING);
    });

    it('should have weight of 1000', () => {
      expect(action.getWeight()).toBe(1000);
    });

    it('should have name do_nothing', () => {
      expect(action.getName()).toBe('do_nothing');
    });
  });

  describe('execute', () => {
    it('should throw error when payload not set', () => {
      expect(() => action.execute()).toThrow('Payload not set');
    });

    it('should return empty content', () => {
      const payload = createValidPayload('');
      action.setPayload(payload);

      action.execute();

      expect(payload.getResponse()?.getBody()).toBe('');
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
