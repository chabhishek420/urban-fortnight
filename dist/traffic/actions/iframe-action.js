"use strict";
/**
 * Iframe Action
 *
 * Embeds the target URL in an iframe.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/Iframe.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IframeAction = void 0;
const abstract_action_1 = require("./abstract-action");
const status_code_1 = require("../response/status-code");
class IframeAction extends abstract_action_1.AbstractAction {
    _weight = 6;
    constructor() {
        super('iframe');
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
        const url = this.getActionPayload();
        const html = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
</head>
<style type="text/css">
  body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
  iframe {
    width: 100%;
    height: 100%;
    min-height: 10000px;
    border: 0;
  }
</style>
<body>
  <iframe src="${url}"></iframe>
</body>
</html>`;
        this.setContentType('text/html');
        this.setContent(html);
        this.setDestinationInfo(url);
    }
    executeForFrame() {
        const url = this.getActionPayload();
        // For frame context, just redirect
        this.addHeader('Location: ' + url);
        this.setStatus(status_code_1.StatusCode.FOUND);
        this.setDestinationInfo(url);
    }
}
exports.IframeAction = IframeAction;
//# sourceMappingURL=iframe-action.js.map