"use strict";
/**
 * HTTP Redirect Action
 *
 * Performs a standard HTTP 302 redirect to the target URL.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/HttpRedirect.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRedirectAction = void 0;
const abstract_action_1 = require("./abstract-action");
const status_code_1 = require("../response/status-code");
class HttpRedirectAction extends abstract_action_1.AbstractAction {
    _weight = 1;
    constructor() {
        super('http_redirect');
    }
    getType() {
        return abstract_action_1.ActionType.REDIRECT;
    }
    getField() {
        return abstract_action_1.ActionField.URL;
    }
    execute() {
        const url = this.getActionPayload();
        // Set Location header
        this.addHeader('Location: ' + url);
        // Check for kversion parameter (for client compatibility)
        const request = this.getServerRequest();
        const kversion = request.getParam('kversion');
        if (kversion) {
            // Version 3.4+ uses 302
            this.setStatus(status_code_1.StatusCode.FOUND);
        }
        else {
            this.setStatus(status_code_1.StatusCode.FOUND);
        }
        // Store destination in click
        this.setDestinationInfo(url);
    }
}
exports.HttpRedirectAction = HttpRedirectAction;
//# sourceMappingURL=http-redirect-action.js.map