/**
 * Action Factory
 * 
 * Creates action instances by type.
 * 
 * @see keitaro_source/application/Traffic/Actions/Service/StreamActionService.php
 */

import { AbstractAction } from './abstract-action';
import { ActionTypes, ActionTypeValue } from './action-types';

// Import all action implementations
import { HttpRedirectAction } from './http-redirect-action';
import { IframeAction } from './iframe-action';
import { MetaAction } from './meta-action';
import { DoubleMetaAction } from './double-meta-action';
import { JsAction } from './js-action';
import { ShowHtmlAction } from './show-html-action';
import { ShowTextAction } from './show-text-action';
import { DoNothingAction } from './do-nothing-action';
import { Status404Action } from './status-404-action';
import { ToCampaignAction } from './to-campaign-action';
import { FrameAction } from './frame-action';
import { CurlAction } from './curl-action';
import { RemoteAction } from './remote-action';
import { LocalFileAction } from './local-file-action';
import { BlankReferrerAction } from './blank-referrer-action';
import { JsForIframeAction } from './js-for-iframe-action';
import { FormSubmitAction } from './form-submit-action';
import { SubIdAction } from './sub-id-action';

// Re-export ActionTypeValue
export { type ActionTypeValue } from './action-types';

/**
 * Action registry
 */
const actionRegistry: Map<ActionTypeValue, new () => AbstractAction> = new Map();

/**
 * Register an action class
 */
export function registerAction(type: ActionTypeValue, actionClass: new () => AbstractAction): void {
  actionRegistry.set(type, actionClass);
}

/**
 * Initialize default actions
 */
function initializeActions(): void {
  if (actionRegistry.size > 0) return;
  
  // Redirect actions
  registerAction(ActionTypes.HTTP_REDIRECT, HttpRedirectAction);
  registerAction(ActionTypes.META, MetaAction);
  registerAction(ActionTypes.DOUBLE_META, DoubleMetaAction);
  registerAction(ActionTypes.JS, JsAction);
  registerAction(ActionTypes.BLANK_REFERRER, BlankReferrerAction);
  registerAction(ActionTypes.FORM_SUBMIT, FormSubmitAction);
  registerAction(ActionTypes.FRAME, FrameAction);
  registerAction(ActionTypes.JS_FOR_IFRAME, JsForIframeAction);
  registerAction(ActionTypes.REMOTE, RemoteAction);
  
  // Embed actions
  registerAction(ActionTypes.IFRAME, IframeAction);
  
  // Content actions
  registerAction(ActionTypes.SHOW_HTML, ShowHtmlAction);
  registerAction(ActionTypes.SHOW_TEXT, ShowTextAction);
  registerAction(ActionTypes.LOCAL_FILE, LocalFileAction);
  registerAction(ActionTypes.CURL, CurlAction);
  
  // Control actions
  registerAction(ActionTypes.DO_NOTHING, DoNothingAction);
  registerAction(ActionTypes.STATUS_404, Status404Action);
  registerAction(ActionTypes.TO_CAMPAIGN, ToCampaignAction);
  registerAction(ActionTypes.SUB_ID, SubIdAction);
}

/**
 * Create an action by type
 */
export function createAction(type: ActionTypeValue): AbstractAction | null {
  initializeActions();
  
  const ActionClass = actionRegistry.get(type);
  if (!ActionClass) {
    console.warn(`Unknown action type: ${type}`);
    return null;
  }
  
  return new ActionClass();
}

/**
 * Get all registered action types
 */
export function getRegisteredActionTypes(): ActionTypeValue[] {
  initializeActions();
  return Array.from(actionRegistry.keys());
}

/**
 * Check if action type is registered
 */
export function hasAction(type: string): boolean {
  initializeActions();
  return actionRegistry.has(type as ActionTypeValue);
}

/**
 * Get default action type
 */
export function getDefaultActionType(): ActionTypeValue {
  return ActionTypes.HTTP_REDIRECT;
}
