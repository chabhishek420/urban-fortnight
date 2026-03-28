/**
 * Show Text Action
 *
 * Displays plain text content.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/ShowText.php
 */
import { AbstractAction, ActionType, ActionField } from './abstract-action';
export declare class ShowTextAction extends AbstractAction {
    protected _weight: number;
    constructor();
    getType(): ActionType;
    getField(): ActionField;
    execute(): void;
}
//# sourceMappingURL=show-text-action.d.ts.map