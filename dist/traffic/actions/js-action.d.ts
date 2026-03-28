/**
 * JavaScript Redirect Action
 *
 * Performs redirect using JavaScript.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/Js.php
 */
import { AbstractAction, ActionType, ActionField } from './abstract-action';
export declare class JsAction extends AbstractAction {
    protected _weight: number;
    constructor();
    getType(): ActionType;
    getField(): ActionField;
    execute(): void;
    protected executeDefault(): void;
    protected executeForScript(): void;
    protected executeForFrame(): void;
    private buildJsRedirect;
    private buildJsCode;
}
//# sourceMappingURL=js-action.d.ts.map