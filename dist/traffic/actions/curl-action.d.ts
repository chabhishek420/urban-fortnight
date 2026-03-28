/**
 * Curl Action
 *
 * Fetches content from a URL using HTTP request and returns it.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/Curl.php
 */
import { AbstractAction, ActionType, ActionField } from './abstract-action';
export declare class CurlAction extends AbstractAction {
    protected _weight: number;
    constructor();
    getType(): ActionType;
    getField(): ActionField;
    execute(): Promise<void>;
    /**
     * Ensure UTF-8 encoding
     */
    private utf8ize;
}
//# sourceMappingURL=curl-action.d.ts.map