"use strict";
/**
 * Action Factory
 *
 * Creates action instances by type.
 *
 * @see keitaro_source/application/Traffic/Actions/Service/StreamActionService.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAction = registerAction;
exports.createAction = createAction;
exports.getRegisteredActionTypes = getRegisteredActionTypes;
exports.hasAction = hasAction;
exports.getDefaultActionType = getDefaultActionType;
const action_types_1 = require("./action-types");
// Import all action implementations
const http_redirect_action_1 = require("./http-redirect-action");
const iframe_action_1 = require("./iframe-action");
const meta_action_1 = require("./meta-action");
const double_meta_action_1 = require("./double-meta-action");
const js_action_1 = require("./js-action");
const show_html_action_1 = require("./show-html-action");
const show_text_action_1 = require("./show-text-action");
const do_nothing_action_1 = require("./do-nothing-action");
const status_404_action_1 = require("./status-404-action");
const to_campaign_action_1 = require("./to-campaign-action");
const frame_action_1 = require("./frame-action");
const curl_action_1 = require("./curl-action");
const remote_action_1 = require("./remote-action");
const local_file_action_1 = require("./local-file-action");
const blank_referrer_action_1 = require("./blank-referrer-action");
const js_for_iframe_action_1 = require("./js-for-iframe-action");
const form_submit_action_1 = require("./form-submit-action");
const sub_id_action_1 = require("./sub-id-action");
/**
 * Action registry
 */
const actionRegistry = new Map();
/**
 * Register an action class
 */
function registerAction(type, actionClass) {
    actionRegistry.set(type, actionClass);
}
/**
 * Initialize default actions
 */
function initializeActions() {
    if (actionRegistry.size > 0)
        return;
    // Redirect actions
    registerAction(action_types_1.ActionTypes.HTTP_REDIRECT, http_redirect_action_1.HttpRedirectAction);
    registerAction(action_types_1.ActionTypes.META, meta_action_1.MetaAction);
    registerAction(action_types_1.ActionTypes.DOUBLE_META, double_meta_action_1.DoubleMetaAction);
    registerAction(action_types_1.ActionTypes.JS, js_action_1.JsAction);
    registerAction(action_types_1.ActionTypes.BLANK_REFERRER, blank_referrer_action_1.BlankReferrerAction);
    registerAction(action_types_1.ActionTypes.FORM_SUBMIT, form_submit_action_1.FormSubmitAction);
    registerAction(action_types_1.ActionTypes.FRAME, frame_action_1.FrameAction);
    registerAction(action_types_1.ActionTypes.JS_FOR_IFRAME, js_for_iframe_action_1.JsForIframeAction);
    registerAction(action_types_1.ActionTypes.REMOTE, remote_action_1.RemoteAction);
    // Embed actions
    registerAction(action_types_1.ActionTypes.IFRAME, iframe_action_1.IframeAction);
    // Content actions
    registerAction(action_types_1.ActionTypes.SHOW_HTML, show_html_action_1.ShowHtmlAction);
    registerAction(action_types_1.ActionTypes.SHOW_TEXT, show_text_action_1.ShowTextAction);
    registerAction(action_types_1.ActionTypes.LOCAL_FILE, local_file_action_1.LocalFileAction);
    registerAction(action_types_1.ActionTypes.CURL, curl_action_1.CurlAction);
    // Control actions
    registerAction(action_types_1.ActionTypes.DO_NOTHING, do_nothing_action_1.DoNothingAction);
    registerAction(action_types_1.ActionTypes.STATUS_404, status_404_action_1.Status404Action);
    registerAction(action_types_1.ActionTypes.TO_CAMPAIGN, to_campaign_action_1.ToCampaignAction);
    registerAction(action_types_1.ActionTypes.SUB_ID, sub_id_action_1.SubIdAction);
}
/**
 * Create an action by type
 */
function createAction(type) {
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
function getRegisteredActionTypes() {
    initializeActions();
    return Array.from(actionRegistry.keys());
}
/**
 * Check if action type is registered
 */
function hasAction(type) {
    initializeActions();
    return actionRegistry.has(type);
}
/**
 * Get default action type
 */
function getDefaultActionType() {
    return action_types_1.ActionTypes.HTTP_REDIRECT;
}
//# sourceMappingURL=action-factory.js.map