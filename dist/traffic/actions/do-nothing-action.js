"use strict";
/**
 * Do Nothing Action
 *
 * Returns an empty response.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/DoNothing.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoNothingAction = void 0;
const abstract_action_1 = require("./abstract-action");
class DoNothingAction extends abstract_action_1.AbstractAction {
    _weight = 1000;
    constructor() {
        super('do_nothing');
    }
    getType() {
        return abstract_action_1.ActionType.HIDDEN;
    }
    getField() {
        return abstract_action_1.ActionField.NOTHING;
    }
    execute() {
        // Do nothing - return empty response
        this.setContent('');
    }
}
exports.DoNothingAction = DoNothingAction;
//# sourceMappingURL=do-nothing-action.js.map