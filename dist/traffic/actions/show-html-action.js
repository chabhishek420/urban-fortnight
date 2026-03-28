"use strict";
/**
 * Show HTML Action
 *
 * Displays custom HTML content.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/ShowHtml.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowHtmlAction = void 0;
const abstract_action_1 = require("./abstract-action");
class ShowHtmlAction extends abstract_action_1.AbstractAction {
    _weight = 100;
    constructor() {
        super('show_html');
    }
    getType() {
        return abstract_action_1.ActionType.OTHER;
    }
    getField() {
        return abstract_action_1.ActionField.TEXT;
    }
    execute() {
        this.executeInContext();
    }
    executeDefault() {
        const html = this.buildContent();
        this.setContentType('text/html');
        this.setDestinationInfo(html.substring(0, 500)); // Truncate for storage
        this.setContent(html);
    }
    executeForScript() {
        const html = this.buildContent();
        this.setContentType('application/javascript');
        const code = `document.write(${JSON.stringify(html)});`;
        this.setDestinationInfo(code.substring(0, 500));
        this.setContent(code);
    }
    executeForFrame() {
        let html = this.buildContent();
        // Wrap in basic HTML if not already
        if (!html.toLowerCase().includes('<html')) {
            html = `<!DOCTYPE html>
<html>
<head><style>body{margin:0}</style></head>
<body>${html}</body>
</html>`;
        }
        this.setContentType('text/html');
        this.setDestinationInfo(html.substring(0, 500));
        this.setContent(html);
    }
    buildContent() {
        return this.processMacros(this.getRawActionPayload());
    }
}
exports.ShowHtmlAction = ShowHtmlAction;
//# sourceMappingURL=show-html-action.js.map