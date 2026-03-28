/**
 * Do Nothing Action
 *
 * Returns an empty response.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/DoNothing.php
 */
import { AbstractAction, ActionType, ActionField } from './abstract-action';
export declare class DoNothingAction extends AbstractAction {
    protected _weight: number;
    constructor();
    getType(): ActionType;
    getField(): ActionField;
    execute(): void;
}
//# sourceMappingURL=do-nothing-action.d.ts.map