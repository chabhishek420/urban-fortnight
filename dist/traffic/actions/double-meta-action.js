"use strict";
/**
 * Double Meta Refresh Action
 *
 * Performs two meta refresh redirects to blank the referrer.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/DoubleMeta.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoubleMetaAction = void 0;
const abstract_action_1 = require("./abstract-action");
class DoubleMetaAction extends abstract_action_1.AbstractAction {
    _weight = 3;
    constructor() {
        super('double_meta');
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
        // First meta refresh to intermediate page
        const intermediateUrl = this.buildIntermediateUrl(url);
        const html = this.buildMetaRedirect(intermediateUrl);
        this.setContentType('text/html');
        this.setContent(html);
    }
    executeForScript() {
        const url = this.getActionPayload();
        const intermediateUrl = this.buildIntermediateUrl(url);
        const html = this.buildMetaRedirect(intermediateUrl);
        this.setContentType('application/javascript');
        this.setContent(`document.write(${JSON.stringify(html)});`);
    }
    buildIntermediateUrl(targetUrl) {
        // Create a data URL that will do the second redirect
        const secondRedirect = this.buildSecondRedirect(targetUrl);
        return `data:text/html;charset=utf-8,${encodeURIComponent(secondRedirect)}`;
    }
    buildSecondRedirect(url) {
        return `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0;url=${url}">
</head>
<body>
  <script>window.location.replace("${url}");</script>
</body>
</html>`;
    }
    buildMetaRedirect(url) {
        return `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0;url=${url}">
</head>
<body></body>
</html>`;
    }
}
exports.DoubleMetaAction = DoubleMetaAction;
//# sourceMappingURL=double-meta-action.js.map