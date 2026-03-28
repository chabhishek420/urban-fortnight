/**
 * Action Types Tests
 * 
 * Tests for action type definitions and constants
 */

import { describe, it, expect } from 'vitest';
import { ActionTypes, ActionCategories, ActionDefinitions } from '../../src/traffic/actions/action-types';

describe('ActionTypes', () => {
  describe('constants', () => {
    it('should have redirect action types', () => {
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

    it('should have embed action types', () => {
      expect(ActionTypes.IFRAME).toBe('iframe');
    });

    it('should have content action types', () => {
      expect(ActionTypes.SHOW_HTML).toBe('show_html');
      expect(ActionTypes.SHOW_TEXT).toBe('show_text');
      expect(ActionTypes.LOCAL_FILE).toBe('local_file');
      expect(ActionTypes.CURL).toBe('curl');
    });

    it('should have control action types', () => {
      expect(ActionTypes.DO_NOTHING).toBe('do_nothing');
      expect(ActionTypes.STATUS_404).toBe('status_404');
      expect(ActionTypes.TO_CAMPAIGN).toBe('to_campaign');
      expect(ActionTypes.SUB_ID).toBe('sub_id');
    });
  });
});

describe('ActionCategories', () => {
  it('should have correct category values', () => {
    expect(ActionCategories.REDIRECT).toBe('redirect');
    expect(ActionCategories.CONTENT).toBe('content');
    expect(ActionCategories.CONTROL).toBe('control');
    expect(ActionCategories.HIDDEN).toBe('hidden');
  });
});

describe('ActionDefinitions', () => {
  it('should have definition for all action types', () => {
    const actionTypes = Object.values(ActionTypes);
    
    for (const type of actionTypes) {
      expect(ActionDefinitions[type]).toBeDefined();
      expect(ActionDefinitions[type].type).toBe(type);
    }
  });

  it('should have correct structure for each definition', () => {
    for (const [key, def] of Object.entries(ActionDefinitions)) {
      expect(def).toHaveProperty('name');
      expect(def).toHaveProperty('type');
      expect(def).toHaveProperty('category');
      expect(def).toHaveProperty('weight');
      expect(def).toHaveProperty('field');
      expect(typeof def.name).toBe('string');
      expect(typeof def.type).toBe('string');
      expect(typeof def.category).toBe('string');
      expect(typeof def.weight).toBe('number');
    }
  });

  it('should have HTTP redirect as the first weight', () => {
    expect(ActionDefinitions[ActionTypes.HTTP_REDIRECT].weight).toBe(1);
  });

  it('should have DO_NOTHING with high weight', () => {
    expect(ActionDefinitions[ActionTypes.DO_NOTHING].weight).toBe(1000);
  });

  it('should have correct field types', () => {
    expect(ActionDefinitions[ActionTypes.HTTP_REDIRECT].field).toBe('url');
    expect(ActionDefinitions[ActionTypes.SHOW_HTML].field).toBe('text');
    expect(ActionDefinitions[ActionTypes.DO_NOTHING].field).toBe('nothing');
    expect(ActionDefinitions[ActionTypes.TO_CAMPAIGN].field).toBe('campaigns');
    expect(ActionDefinitions[ActionTypes.LOCAL_FILE].field).toBe('upload');
  });

  it('should categorize redirect actions correctly', () => {
    const redirectActions = [
      ActionTypes.HTTP_REDIRECT,
      ActionTypes.META,
      ActionTypes.DOUBLE_META,
      ActionTypes.JS,
      ActionTypes.BLANK_REFERRER,
      ActionTypes.FORM_SUBMIT,
      ActionTypes.FRAME,
      ActionTypes.JS_FOR_IFRAME,
      ActionTypes.REMOTE
    ];

    for (const action of redirectActions) {
      expect(ActionDefinitions[action].category).toBe(ActionCategories.REDIRECT);
    }
  });

  it('should categorize content actions correctly', () => {
    expect(ActionDefinitions[ActionTypes.IFRAME].category).toBe(ActionCategories.CONTENT);
    expect(ActionDefinitions[ActionTypes.SHOW_HTML].category).toBe(ActionCategories.CONTENT);
    expect(ActionDefinitions[ActionTypes.SHOW_TEXT].category).toBe(ActionCategories.CONTENT);
    expect(ActionDefinitions[ActionTypes.CURL].category).toBe(ActionCategories.CONTENT);
  });

  it('should categorize control actions correctly', () => {
    expect(ActionDefinitions[ActionTypes.DO_NOTHING].category).toBe(ActionCategories.CONTROL);
    expect(ActionDefinitions[ActionTypes.STATUS_404].category).toBe(ActionCategories.CONTROL);
    expect(ActionDefinitions[ActionTypes.TO_CAMPAIGN].category).toBe(ActionCategories.CONTROL);
  });
});
