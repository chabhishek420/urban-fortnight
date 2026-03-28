"use strict";
/**
 * JS for Iframe Action
 *
 * Specialized redirect action for iframe contexts.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/JsForIframe.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsForIframeAction = void 0;
const abstract_action_1 = require("./abstract-action");
const redirect_service_1 = require("./service/redirect-service");
class JsForIframeAction extends abstract_action_1.AbstractAction {
    _weight = 999;
    constructor() {
        super('js_for_iframe');
    }
    getType() {
        return abstract_action_1.ActionType.REDIRECT;
    }
    getField() {
        return abstract_action_1.ActionField.URL;
    }
    execute() {
        this.executeInContext();
    }
    executeDefault() {
        this.executeForFrame();
    }
    executeForFrame() {
        const url = this.getActionPayload();
        this.setDestinationInfo(url);
        const redirectService = redirect_service_1.RedirectService.getInstance();
        this.setContent(redirectService.frameRedirect(url));
    }
}
exports.JsForIframeAction = JsForIframeAction;
//# sourceMappingURL=js-for-iframe-action.js.map