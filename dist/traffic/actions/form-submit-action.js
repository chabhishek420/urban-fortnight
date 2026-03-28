"use strict";
/**
 * Form Submit Action
 *
 * Submits a form via JavaScript to the target URL.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/FormSubmit.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormSubmitAction = void 0;
const abstract_action_1 = require("./abstract-action");
class FormSubmitAction extends abstract_action_1.AbstractAction {
    _weight = 5;
    _delay = 0;
    constructor() {
        super('form_submit');
    }
    getType() {
        return abstract_action_1.ActionType.REDIRECT;
    }
    getField() {
        return abstract_action_1.ActionField.URL;
    }
    execute() {
        const url = this.getActionPayload();
        const delayMs = this._delay * 1000;
        let content = '<!doctype html>\n';
        content += '<head>\n';
        content += `<script>window.onload = function(){
            setTimeout(function() {
                document.forms[0].submit();
            }, ${delayMs});
        };</script>\n`;
        content += '</head><body>\n';
        content += `<form action="${url}" method="POST">`;
        // Add POST parameters from request
        const request = this.getServerRequest();
        const body = request.getParsedBody();
        if (body && typeof body === 'object') {
            for (const [name, value] of Object.entries(body)) {
                const escapedName = this.escapeHtml(name);
                const escapedValue = this.escapeHtml(String(value));
                content += `<input type="hidden" name="${escapedName}" value="${escapedValue}" />\n`;
            }
        }
        content += '</form>\n';
        content += '</body></html>\n';
        this.setContent(content);
        this.setDestinationInfo(url);
    }
    /**
     * Escape HTML entities
     */
    escapeHtml(input) {
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}
exports.FormSubmitAction = FormSubmitAction;
//# sourceMappingURL=form-submit-action.js.map