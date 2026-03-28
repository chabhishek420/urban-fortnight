/**
 * Meta Refresh Action
 *
 * Performs a redirect using HTML meta refresh tag.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/Meta.php
 */
import { AbstractAction, ActionType, ActionField } from './abstract-action';
export declare class MetaAction extends AbstractAction {
    protected _weight: number;
    constructor();
    getType(): ActionType;
    getField(): ActionField;
    execute(): void;
    protected executeDefault(): void;
    protected executeForScript(): void;
    private buildMetaRedirect;
}
//# sourceMappingURL=meta-action.d.ts.map