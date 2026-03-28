/**
 * JS for Iframe Action
 *
 * Specialized redirect action for iframe contexts.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/JsForIframe.php
 */
import { AbstractAction, ActionType, ActionField } from './abstract-action';
export declare class JsForIframeAction extends AbstractAction {
    protected _weight: number;
    constructor();
    getType(): ActionType;
    getField(): ActionField;
    execute(): void;
    protected executeDefault(): void;
    protected executeForFrame(): void;
}
//# sourceMappingURL=js-for-iframe-action.d.ts.map