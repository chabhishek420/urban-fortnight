"use strict";
/**
 * Status 404 Action
 *
 * Returns a 404 Not Found response.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/Status404.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status404Action = void 0;
const abstract_action_1 = require("./abstract-action");
const status_code_1 = require("../response/status-code");
class Status404Action extends abstract_action_1.AbstractAction {
    _weight = 1001;
    constructor() {
        super('status_404');
    }
    getType() {
        return abstract_action_1.ActionType.OTHER;
    }
    getField() {
        return abstract_action_1.ActionField.NOTHING;
    }
    execute() {
        this.setStatus(status_code_1.StatusCode.NOT_FOUND);
        this.setContentType('text/html');
        this.setContent(`<!DOCTYPE html>
<html>
<head><title>404 Not Found</title></head>
<body>
<h1>Not Found</h1>
<p>The requested URL was not found on this server.</p>
</body>
</html>`);
    }
}
exports.Status404Action = Status404Action;
//# sourceMappingURL=status-404-action.js.map