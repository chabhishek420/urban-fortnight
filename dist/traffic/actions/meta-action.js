"use strict";
/**
 * Meta Refresh Action
 *
 * Performs a redirect using HTML meta refresh tag.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/Meta.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaAction = void 0;
const abstract_action_1 = require("./abstract-action");
class MetaAction extends abstract_action_1.AbstractAction {
    _weight = 2;
    constructor() {
        super('meta');
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
        const html = this.buildMetaRedirect(url);
        this.setContentType('text/html');
        this.setContent(html);
    }
    executeForScript() {
        const url = this.getActionPayload();
        const html = this.buildMetaRedirect(url);
        this.setContentType('application/javascript');
        this.setContent(`document.write(${JSON.stringify(html)});`);
    }
    buildMetaRedirect(url) {
        return `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0;url=${url}">
  <title>Redirecting...</title>
</head>
<body>
  <p>Redirecting to <a href="${url}">${url}</a></p>
  <script>window.location.href="${url}";</script>
</body>
</html>`;
    }
}
exports.MetaAction = MetaAction;
//# sourceMappingURL=meta-action.js.map