/**
 * Form Submit Action
 *
 * Submits a form via JavaScript to the target URL.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/FormSubmit.php
 */
import { AbstractAction, ActionType, ActionField } from './abstract-action';
export declare class FormSubmitAction extends AbstractAction {
    protected _weight: number;
    protected _delay: number;
    constructor();
    getType(): ActionType;
    getField(): ActionField;
    execute(): void;
    /**
     * Escape HTML entities
     */
    private escapeHtml;
}
//# sourceMappingURL=form-submit-action.d.ts.map