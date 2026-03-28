"use strict";
/**
 * Blank Referrer Action
 *
 * Performs a redirect while blanking the referrer.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/BlankReferrer.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlankReferrerAction = void 0;
const abstract_action_1 = require("./abstract-action");
const redirect_service_1 = require("./service/redirect-service");
class BlankReferrerAction extends abstract_action_1.AbstractAction {
    _weight = 3;
    constructor() {
        super('blank_referrer');
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
        const redirectService = redirect_service_1.RedirectService.getInstance();
        const html = redirectService.metaRedirect(url, {
            delay: 0,
            noReferrer: true
        });
        this.setContent(html);
    }
    executeForScript() {
        const url = this.getActionPayload();
        const redirectService = redirect_service_1.RedirectService.getInstance();
        const html = redirectService.metaRedirect(url, {
            delay: 0,
            noReferrer: true
        });
        this.setContentType('application/javascript');
        // Escape for JavaScript
        const escaped = html.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
        this.setContent(`document.write("${escaped}");`);
    }
}
exports.BlankReferrerAction = BlankReferrerAction;
//# sourceMappingURL=blank-referrer-action.js.map