/**
 * Iframe Action
 *
 * Embeds the target URL in an iframe.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/Iframe.php
 */
import { AbstractAction, ActionType, ActionField } from './abstract-action';
export declare class IframeAction extends AbstractAction {
    protected _weight: number;
    constructor();
    getType(): ActionType;
    getField(): ActionField;
    execute(): void;
    protected executeDefault(): void;
    protected executeForFrame(): void;
}
//# sourceMappingURL=iframe-action.d.ts.map