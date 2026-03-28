"use strict";
/**
 * Show Text Action
 *
 * Displays plain text content.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/ShowText.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowTextAction = void 0;
const abstract_action_1 = require("./abstract-action");
class ShowTextAction extends abstract_action_1.AbstractAction {
    _weight = 101;
    constructor() {
        super('show_text');
    }
    getType() {
        return abstract_action_1.ActionType.OTHER;
    }
    getField() {
        return abstract_action_1.ActionField.TEXT;
    }
    execute() {
        const text = this.getActionPayload();
        this.setContentType('text/plain');
        this.setDestinationInfo(text.substring(0, 500));
        this.setContent(text);
    }
}
exports.ShowTextAction = ShowTextAction;
//# sourceMappingURL=show-text-action.js.map