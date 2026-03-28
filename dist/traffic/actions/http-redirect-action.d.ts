/**
 * HTTP Redirect Action
 *
 * Performs a standard HTTP 302 redirect to the target URL.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/HttpRedirect.php
 */
import { AbstractAction, ActionType, ActionField } from './abstract-action';
export declare class HttpRedirectAction extends AbstractAction {
    protected _weight: number;
    constructor();
    getType(): ActionType;
    getField(): ActionField;
    execute(): void;
}
//# sourceMappingURL=http-redirect-action.d.ts.map