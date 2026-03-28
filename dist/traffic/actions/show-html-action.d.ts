/**
 * Show HTML Action
 *
 * Displays custom HTML content.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/ShowHtml.php
 */
import { AbstractAction, ActionType, ActionField } from './abstract-action';
export declare class ShowHtmlAction extends AbstractAction {
    protected _weight: number;
    constructor();
    getType(): ActionType;
    getField(): ActionField;
    execute(): void;
    protected executeDefault(): void;
    protected executeForScript(): void;
    protected executeForFrame(): void;
    private buildContent;
}
//# sourceMappingURL=show-html-action.d.ts.map