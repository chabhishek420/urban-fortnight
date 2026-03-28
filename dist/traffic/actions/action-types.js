"use strict";
/**
 * Action Types Registry
 *
 * Defines all available stream action types.
 *
 * @see keitaro_source/application/Traffic/Actions/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionDefinitions = exports.ActionCategories = exports.ActionTypes = void 0;
/**
 * Predefined action names
 */
exports.ActionTypes = {
    // Redirect actions
    HTTP_REDIRECT: 'http_redirect',
    META: 'meta',
    DOUBLE_META: 'double_meta',
    JS: 'js',
    JS_FOR_IFRAME: 'js_for_iframe',
    BLANK_REFERRER: 'blank_referrer',
    // Embed actions
    IFRAME: 'iframe',
    FRAME: 'frame',
    // Content actions
    SHOW_HTML: 'show_html',
    SHOW_TEXT: 'show_text',
    LOCAL_FILE: 'local_file',
    REMOTE: 'remote',
    CURL: 'curl',
    // Control actions
    DO_NOTHING: 'do_nothing',
    STATUS_404: 'status_404',
    TO_CAMPAIGN: 'to_campaign',
    SUB_ID: 'sub_id',
    FORM_SUBMIT: 'form_submit',
};
/**
 * Action categories
 */
exports.ActionCategories = {
    REDIRECT: 'redirect',
    CONTENT: 'content',
    CONTROL: 'control',
    HIDDEN: 'hidden'
};
/**
 * Action definitions
 */
exports.ActionDefinitions = {
    [exports.ActionTypes.HTTP_REDIRECT]: {
        name: 'HTTP Redirect',
        type: exports.ActionTypes.HTTP_REDIRECT,
        category: exports.ActionCategories.REDIRECT,
        weight: 1,
        field: 'url'
    },
    [exports.ActionTypes.META]: {
        name: 'Meta Refresh',
        type: exports.ActionTypes.META,
        category: exports.ActionCategories.REDIRECT,
        weight: 2,
        field: 'url'
    },
    [exports.ActionTypes.DOUBLE_META]: {
        name: 'Double Meta Refresh',
        type: exports.ActionTypes.DOUBLE_META,
        category: exports.ActionCategories.REDIRECT,
        weight: 3,
        field: 'url'
    },
    [exports.ActionTypes.JS]: {
        name: 'JavaScript Redirect',
        type: exports.ActionTypes.JS,
        category: exports.ActionCategories.REDIRECT,
        weight: 4,
        field: 'url'
    },
    [exports.ActionTypes.BLANK_REFERRER]: {
        name: 'Blank Referrer',
        type: exports.ActionTypes.BLANK_REFERRER,
        category: exports.ActionCategories.REDIRECT,
        weight: 3,
        field: 'url'
    },
    [exports.ActionTypes.FORM_SUBMIT]: {
        name: 'Form Submit',
        type: exports.ActionTypes.FORM_SUBMIT,
        category: exports.ActionCategories.REDIRECT,
        weight: 5,
        field: 'url'
    },
    [exports.ActionTypes.IFRAME]: {
        name: 'Iframe',
        type: exports.ActionTypes.IFRAME,
        category: exports.ActionCategories.CONTENT,
        weight: 6,
        field: 'url'
    },
    [exports.ActionTypes.FRAME]: {
        name: 'Frame',
        type: exports.ActionTypes.FRAME,
        category: exports.ActionCategories.REDIRECT,
        weight: 200,
        field: 'url'
    },
    [exports.ActionTypes.CURL]: {
        name: 'CURL',
        type: exports.ActionTypes.CURL,
        category: exports.ActionCategories.CONTENT,
        weight: 3,
        field: 'url'
    },
    [exports.ActionTypes.REMOTE]: {
        name: 'Remote',
        type: exports.ActionTypes.REMOTE,
        category: exports.ActionCategories.REDIRECT,
        weight: 130,
        field: 'url'
    },
    [exports.ActionTypes.LOCAL_FILE]: {
        name: 'Local File',
        type: exports.ActionTypes.LOCAL_FILE,
        category: exports.ActionCategories.HIDDEN,
        weight: 50,
        field: 'upload'
    },
    [exports.ActionTypes.SHOW_HTML]: {
        name: 'Show HTML',
        type: exports.ActionTypes.SHOW_HTML,
        category: exports.ActionCategories.CONTENT,
        weight: 100,
        field: 'text'
    },
    [exports.ActionTypes.SHOW_TEXT]: {
        name: 'Show Text',
        type: exports.ActionTypes.SHOW_TEXT,
        category: exports.ActionCategories.CONTENT,
        weight: 101,
        field: 'text'
    },
    [exports.ActionTypes.DO_NOTHING]: {
        name: 'Do Nothing',
        type: exports.ActionTypes.DO_NOTHING,
        category: exports.ActionCategories.CONTROL,
        weight: 1000,
        field: 'nothing'
    },
    [exports.ActionTypes.STATUS_404]: {
        name: '404 Not Found',
        type: exports.ActionTypes.STATUS_404,
        category: exports.ActionCategories.CONTROL,
        weight: 1001,
        field: 'nothing'
    },
    [exports.ActionTypes.TO_CAMPAIGN]: {
        name: 'Redirect to Campaign',
        type: exports.ActionTypes.TO_CAMPAIGN,
        category: exports.ActionCategories.CONTROL,
        weight: 6,
        field: 'campaigns'
    },
    [exports.ActionTypes.SUB_ID]: {
        name: 'Set SubId',
        type: exports.ActionTypes.SUB_ID,
        category: exports.ActionCategories.HIDDEN,
        weight: 0,
        field: 'text'
    },
    [exports.ActionTypes.JS_FOR_IFRAME]: {
        name: 'JS for Iframe',
        type: exports.ActionTypes.JS_FOR_IFRAME,
        category: exports.ActionCategories.REDIRECT,
        weight: 999,
        field: 'url'
    },
};
//# sourceMappingURL=action-types.js.map