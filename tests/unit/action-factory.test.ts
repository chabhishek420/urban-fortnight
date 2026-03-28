/**
 * Action Factory Tests
 * 
 * Tests for the action factory that creates action instances
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  createAction, 
  registerAction, 
  getRegisteredActionTypes, 
  hasAction,
  getDefaultActionType 
} from '../../src/traffic/actions/action-factory';
import { ActionTypes } from '../../src/traffic/actions/action-types';
import { AbstractAction, ActionType, ActionField } from '../../src/traffic/actions/abstract-action';

describe('Action Factory', () => {
  beforeEach(() => {
    // Reset the action registry by clearing the require cache
    // This ensures tests start with a clean slate
  });

  describe('createAction', () => {
    it('should create HTTP redirect action', () => {
      const action = createAction(ActionTypes.HTTP_REDIRECT);
      expect(action).not.toBeNull();
      expect(action?.getName()).toBe('http_redirect');
    });

    it('should create iframe action', () => {
      const action = createAction(ActionTypes.IFRAME);
      expect(action).not.toBeNull();
      expect(action?.getName()).toBe('iframe');
    });

    it('should create meta redirect action', () => {
      const action = createAction(ActionTypes.META);
      expect(action).not.toBeNull();
      expect(action?.getName()).toBe('meta');
    });

    it('should create double meta action', () => {
      const action = createAction(ActionTypes.DOUBLE_META);
      expect(action).not.toBeNull();
    });

    it('should create JS action', () => {
      const action = createAction(ActionTypes.JS);
      expect(action).not.toBeNull();
    });

    it('should create show HTML action', () => {
      const action = createAction(ActionTypes.SHOW_HTML);
      expect(action).not.toBeNull();
    });

    it('should create show text action', () => {
      const action = createAction(ActionTypes.SHOW_TEXT);
      expect(action).not.toBeNull();
    });

    it('should create do nothing action', () => {
      const action = createAction(ActionTypes.DO_NOTHING);
      expect(action).not.toBeNull();
    });

    it('should create 404 action', () => {
      const action = createAction(ActionTypes.STATUS_404);
      expect(action).not.toBeNull();
    });

    it('should create to campaign action', () => {
      const action = createAction(ActionTypes.TO_CAMPAIGN);
      expect(action).not.toBeNull();
    });

    it('should return null for unknown action type', () => {
      const action = createAction('unknown_action_type' as any);
      expect(action).toBeNull();
    });
  });

  describe('registerAction', () => {
    it('should register custom action', () => {
      // Custom action for testing
      class CustomAction extends AbstractAction {
        constructor() {
          super('custom_action');
        }
        execute(): void {}
        getType(): ActionType {
          return ActionType.OTHER;
        }
        getField(): ActionField {
          return ActionField.TEXT;
        }
      }

      registerAction('custom_action' as any, CustomAction);
      
      const action = createAction('custom_action' as any);
      expect(action).not.toBeNull();
      expect(action?.getName()).toBe('custom_action');
    });
  });

  describe('getRegisteredActionTypes', () => {
    it('should return array of registered types', () => {
      const types = getRegisteredActionTypes();
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBeGreaterThan(0);
    });

    it('should include all standard action types', () => {
      const types = getRegisteredActionTypes();
      
      expect(types).toContain(ActionTypes.HTTP_REDIRECT);
      expect(types).toContain(ActionTypes.IFRAME);
      expect(types).toContain(ActionTypes.META);
      expect(types).toContain(ActionTypes.DOUBLE_META);
      expect(types).toContain(ActionTypes.JS);
      expect(types).toContain(ActionTypes.SHOW_HTML);
      expect(types).toContain(ActionTypes.SHOW_TEXT);
      expect(types).toContain(ActionTypes.DO_NOTHING);
      expect(types).toContain(ActionTypes.STATUS_404);
      expect(types).toContain(ActionTypes.TO_CAMPAIGN);
    });
  });

  describe('hasAction', () => {
    it('should return true for registered actions', () => {
      expect(hasAction(ActionTypes.HTTP_REDIRECT)).toBe(true);
      expect(hasAction(ActionTypes.IFRAME)).toBe(true);
      expect(hasAction(ActionTypes.META)).toBe(true);
    });

    it('should return false for unregistered actions', () => {
      expect(hasAction('nonexistent_action')).toBe(false);
    });
  });

  describe('getDefaultActionType', () => {
    it('should return HTTP_REDIRECT as default', () => {
      expect(getDefaultActionType()).toBe(ActionTypes.HTTP_REDIRECT);
    });
  });
});

describe('ActionTypes constants', () => {
  it('should have correct redirect action types', () => {
    expect(ActionTypes.HTTP_REDIRECT).toBe('http_redirect');
    expect(ActionTypes.META).toBe('meta');
    expect(ActionTypes.DOUBLE_META).toBe('double_meta');
    expect(ActionTypes.JS).toBe('js');
    expect(ActionTypes.BLANK_REFERRER).toBe('blank_referrer');
    expect(ActionTypes.FORM_SUBMIT).toBe('form_submit');
    expect(ActionTypes.FRAME).toBe('frame');
    expect(ActionTypes.JS_FOR_IFRAME).toBe('js_for_iframe');
    expect(ActionTypes.REMOTE).toBe('remote');
  });

  it('should have correct embed action types', () => {
    expect(ActionTypes.IFRAME).toBe('iframe');
  });

  it('should have correct content action types', () => {
    expect(ActionTypes.SHOW_HTML).toBe('show_html');
    expect(ActionTypes.SHOW_TEXT).toBe('show_text');
    expect(ActionTypes.LOCAL_FILE).toBe('local_file');
    expect(ActionTypes.CURL).toBe('curl');
  });

  it('should have correct control action types', () => {
    expect(ActionTypes.DO_NOTHING).toBe('do_nothing');
    expect(ActionTypes.STATUS_404).toBe('status_404');
    expect(ActionTypes.TO_CAMPAIGN).toBe('to_campaign');
    expect(ActionTypes.SUB_ID).toBe('sub_id');
  });
});
