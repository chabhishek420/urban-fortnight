/**
 * Frame Action
 *
 * Embeds target URL in a frameset.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/Frame.php
 */
import { AbstractAction, ActionType, ActionField } from './abstract-action';
export declare class FrameAction extends AbstractAction {
    protected _weight: number;
    constructor();
    getType(): ActionType;
    getField(): ActionField;
    execute(): void;
    protected executeDefault(): void;
}
//# sourceMappingURL=frame-action.d.ts.map