"use strict";
/**
 * JavaScript Redirect Action
 *
 * Performs redirect using JavaScript.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/Js.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsAction = void 0;
const abstract_action_1 = require("./abstract-action");
class JsAction extends abstract_action_1.AbstractAction {
    _weight = 4;
    constructor() {
        super('js');
    }
    getType() {
        return abstract_action_1.ActionType.REDIRECT;
    }
    getField() {
        return abstract_action_1.ActionField.URL;
    }
    execute() {
        this.setDestinationInfo(this.getActionPayload());
        this.executeInContext();
    }
    executeDefault() {
        const url = this.getActionPayload();
        const html = this.buildJsRedirect(url);
        this.setContentType('text/html');
        this.setContent(html);
    }
    executeForScript() {
        const url = this.getActionPayload();
        const script = this.buildJsCode(url);
        this.setContentType('application/javascript');
        this.setContent(script);
    }
    executeForFrame() {
        const url = this.getActionPayload();
        // For frame, just redirect
        this.addHeader('Location: ' + url);
        this.setContent('');
    }
    buildJsRedirect(url) {
        return `<!DOCTYPE html>
<html>
<head>
  <script>
    window.location.href = "${url}";
  </script>
</head>
<body>
  <p>Redirecting...</p>
</body>
</html>`;
    }
    buildJsCode(url) {
        return `window.location.href = "${url}";`;
    }
}
exports.JsAction = JsAction;
//# sourceMappingURL=js-action.js.map