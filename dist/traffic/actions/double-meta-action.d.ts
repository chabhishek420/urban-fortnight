/**
 * Double Meta Refresh Action
 *
 * Performs two meta refresh redirects to blank the referrer.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/DoubleMeta.php
 */
import { AbstractAction, ActionType, ActionField } from './abstract-action';
export declare class DoubleMetaAction extends AbstractAction {
    protected _weight: number;
    constructor();
    getType(): ActionType;
    getField(): ActionField;
    execute(): void;
    protected executeDefault(): void;
    protected executeForScript(): void;
    private buildIntermediateUrl;
    private buildSecondRedirect;
    private buildMetaRedirect;
}
//# sourceMappingURL=double-meta-action.d.ts.map