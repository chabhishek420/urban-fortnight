/**
 * Action Types Registry
 * 
 * Defines all available stream action types.
 * 
 * @see keitaro_source/application/Traffic/Actions/
 */

/**
 * Predefined action names
 */
export const ActionTypes = {
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
} as const;

export type ActionTypeValue = typeof ActionTypes[keyof typeof ActionTypes];

/**
 * Action categories
 */
export const ActionCategories = {
  REDIRECT: 'redirect',
  CONTENT: 'content',
  CONTROL: 'control',
  HIDDEN: 'hidden'
} as const;

/**
 * Action definitions
 */
export const ActionDefinitions: Record<string, {
  name: string;
  type: string;
  category: string;
  weight: number;
  field: 'url' | 'text' | 'campaigns' | 'nothing' | 'upload';
}> = {
  [ActionTypes.HTTP_REDIRECT]: {
    name: 'HTTP Redirect',
    type: ActionTypes.HTTP_REDIRECT,
    category: ActionCategories.REDIRECT,
    weight: 1,
    field: 'url'
  },
  [ActionTypes.META]: {
    name: 'Meta Refresh',
    type: ActionTypes.META,
    category: ActionCategories.REDIRECT,
    weight: 2,
    field: 'url'
  },
  [ActionTypes.DOUBLE_META]: {
    name: 'Double Meta Refresh',
    type: ActionTypes.DOUBLE_META,
    category: ActionCategories.REDIRECT,
    weight: 3,
    field: 'url'
  },
  [ActionTypes.JS]: {
    name: 'JavaScript Redirect',
    type: ActionTypes.JS,
    category: ActionCategories.REDIRECT,
    weight: 4,
    field: 'url'
  },
  [ActionTypes.BLANK_REFERRER]: {
    name: 'Blank Referrer',
    type: ActionTypes.BLANK_REFERRER,
    category: ActionCategories.REDIRECT,
    weight: 3,
    field: 'url'
  },
  [ActionTypes.FORM_SUBMIT]: {
    name: 'Form Submit',
    type: ActionTypes.FORM_SUBMIT,
    category: ActionCategories.REDIRECT,
    weight: 5,
    field: 'url'
  },
  [ActionTypes.IFRAME]: {
    name: 'Iframe',
    type: ActionTypes.IFRAME,
    category: ActionCategories.CONTENT,
    weight: 6,
    field: 'url'
  },
  [ActionTypes.FRAME]: {
    name: 'Frame',
    type: ActionTypes.FRAME,
    category: ActionCategories.REDIRECT,
    weight: 200,
    field: 'url'
  },
  [ActionTypes.CURL]: {
    name: 'CURL',
    type: ActionTypes.CURL,
    category: ActionCategories.CONTENT,
    weight: 3,
    field: 'url'
  },
  [ActionTypes.REMOTE]: {
    name: 'Remote',
    type: ActionTypes.REMOTE,
    category: ActionCategories.REDIRECT,
    weight: 130,
    field: 'url'
  },
  [ActionTypes.LOCAL_FILE]: {
    name: 'Local File',
    type: ActionTypes.LOCAL_FILE,
    category: ActionCategories.HIDDEN,
    weight: 50,
    field: 'upload'
  },
  [ActionTypes.SHOW_HTML]: {
    name: 'Show HTML',
    type: ActionTypes.SHOW_HTML,
    category: ActionCategories.CONTENT,
    weight: 100,
    field: 'text'
  },
  [ActionTypes.SHOW_TEXT]: {
    name: 'Show Text',
    type: ActionTypes.SHOW_TEXT,
    category: ActionCategories.CONTENT,
    weight: 101,
    field: 'text'
  },
  [ActionTypes.DO_NOTHING]: {
    name: 'Do Nothing',
    type: ActionTypes.DO_NOTHING,
    category: ActionCategories.CONTROL,
    weight: 1000,
    field: 'nothing'
  },
  [ActionTypes.STATUS_404]: {
    name: '404 Not Found',
    type: ActionTypes.STATUS_404,
    category: ActionCategories.CONTROL,
    weight: 1001,
    field: 'nothing'
  },
  [ActionTypes.TO_CAMPAIGN]: {
    name: 'Redirect to Campaign',
    type: ActionTypes.TO_CAMPAIGN,
    category: ActionCategories.CONTROL,
    weight: 6,
    field: 'campaigns'
  },
  [ActionTypes.SUB_ID]: {
    name: 'Set SubId',
    type: ActionTypes.SUB_ID,
    category: ActionCategories.HIDDEN,
    weight: 0,
    field: 'text'
  },
  [ActionTypes.JS_FOR_IFRAME]: {
    name: 'JS for Iframe',
    type: ActionTypes.JS_FOR_IFRAME,
    category: ActionCategories.REDIRECT,
    weight: 999,
    field: 'url'
  },
};
