"use strict";
/**
 * Frame Action
 *
 * Embeds target URL in a frameset.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/Frame.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrameAction = void 0;
const abstract_action_1 = require("./abstract-action");
class FrameAction extends abstract_action_1.AbstractAction {
    _weight = 200;
    constructor() {
        super('frame');
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
        this.setDestinationInfo(url);
        const html = `<html>
            <head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" /></head>
            <frameset rows="100%"><frame src="${url}"></frameset></html>`;
        this.setContent(html);
    }
}
exports.FrameAction = FrameAction;
//# sourceMappingURL=frame-action.js.map