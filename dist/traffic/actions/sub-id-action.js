"use strict";
/**
 * SubId Action
 *
 * Sets the sub_id on the click for tracking purposes.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/SubId.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubIdAction = void 0;
const abstract_action_1 = require("./abstract-action");
class SubIdAction extends abstract_action_1.AbstractAction {
    constructor() {
        super('sub_id');
    }
    getType() {
        return abstract_action_1.ActionType.HIDDEN;
    }
    getField() {
        return abstract_action_1.ActionField.TEXT;
    }
    execute() {
        const subId = this.getActionPayload();
        const rawClick = this.getRawClick();
        // Set the sub_id on the click
        rawClick.setSubId(subId);
    }
}
exports.SubIdAction = SubIdAction;
//# sourceMappingURL=sub-id-action.js.map