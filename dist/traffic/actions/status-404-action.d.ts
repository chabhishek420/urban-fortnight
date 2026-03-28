/**
 * Status 404 Action
 *
 * Returns a 404 Not Found response.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/Status404.php
 */
import { AbstractAction, ActionType, ActionField } from './abstract-action';
export declare class Status404Action extends AbstractAction {
    protected _weight: number;
    constructor();
    getType(): ActionType;
    getField(): ActionField;
    execute(): void;
}
//# sourceMappingURL=status-404-action.d.ts.map