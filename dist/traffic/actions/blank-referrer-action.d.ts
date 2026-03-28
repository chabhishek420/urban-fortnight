/**
 * Blank Referrer Action
 *
 * Performs a redirect while blanking the referrer.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/BlankReferrer.php
 */
import { AbstractAction, ActionType, ActionField } from './abstract-action';
export declare class BlankReferrerAction extends AbstractAction {
    protected _weight: number;
    constructor();
    getType(): ActionType;
    getField(): ActionField;
    execute(): void;
    protected executeDefault(): void;
    protected executeForScript(): void;
}
//# sourceMappingURL=blank-referrer-action.d.ts.map