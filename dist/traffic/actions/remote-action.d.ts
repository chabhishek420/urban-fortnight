/**
 * Remote Action
 *
 * Fetches a redirect URL from a remote source and redirects to it.
 * Caches the result for a TTL period.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/Remote.php
 */
import { AbstractAction, ActionType, ActionField } from './abstract-action';
export declare class RemoteAction extends AbstractAction {
    protected _weight: number;
    protected _ttl: number;
    constructor();
    getType(): ActionType;
    getField(): ActionField;
    execute(): void;
    protected executeDefault(): void;
    protected executeForFrame(): void;
    protected executeForScript(): void;
    /**
     * Get remote URL, using cache if available
     */
    private getRemoteUrl;
    /**
     * Make HTTP request to get redirect URL
     */
    private request;
    /**
     * Get cache filename for URL
     */
    private getCacheFilename;
    /**
     * Append query parameters from source URL to target
     */
    private appendParams;
    /**
     * Simple MD5 hash (for cache keys)
     */
    private md5;
    /**
     * Set stub for testing
     */
    static setStub(url: string, content: string): void;
}
//# sourceMappingURL=remote-action.d.ts.map