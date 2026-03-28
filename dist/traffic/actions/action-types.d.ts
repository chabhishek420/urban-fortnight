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
export declare const ActionTypes: {
    readonly HTTP_REDIRECT: "http_redirect";
    readonly META: "meta";
    readonly DOUBLE_META: "double_meta";
    readonly JS: "js";
    readonly JS_FOR_IFRAME: "js_for_iframe";
    readonly BLANK_REFERRER: "blank_referrer";
    readonly IFRAME: "iframe";
    readonly FRAME: "frame";
    readonly SHOW_HTML: "show_html";
    readonly SHOW_TEXT: "show_text";
    readonly LOCAL_FILE: "local_file";
    readonly REMOTE: "remote";
    readonly CURL: "curl";
    readonly DO_NOTHING: "do_nothing";
    readonly STATUS_404: "status_404";
    readonly TO_CAMPAIGN: "to_campaign";
    readonly SUB_ID: "sub_id";
    readonly FORM_SUBMIT: "form_submit";
};
export type ActionTypeValue = typeof ActionTypes[keyof typeof ActionTypes];
/**
 * Action categories
 */
export declare const ActionCategories: {
    readonly REDIRECT: "redirect";
    readonly CONTENT: "content";
    readonly CONTROL: "control";
    readonly HIDDEN: "hidden";
};
/**
 * Action definitions
 */
export declare const ActionDefinitions: Record<string, {
    name: string;
    type: string;
    category: string;
    weight: number;
    field: 'url' | 'text' | 'campaigns' | 'nothing' | 'upload';
}>;
//# sourceMappingURL=action-types.d.ts.map