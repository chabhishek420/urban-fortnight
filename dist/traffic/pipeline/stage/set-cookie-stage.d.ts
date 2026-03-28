/**
 * Set Cookie Stage
 *
 * Sets tracking cookies for visitor identification and binding.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/SetCookieStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index.js';
/**
 * Set Cookie Stage
 */
export declare class SetCookieStage implements StageInterface {
    static readonly HEADER_LIMIT_FOR_COOKIES = 3060;
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, logEntry: TrafficLogEntry): Payload;
    /**
     * Check if cookies are enabled
     */
    private _areCookiesEnabled;
    /**
     * Set generic cookies (sub ID)
     */
    private _setGenericCookies;
    /**
     * Set binding cookies
     */
    private _setBindingCookies;
    /**
     * Set token cookie
     */
    private _setTokenCookie;
    /**
     * Set uniqueness ID cookie
     */
    private _setUniquenessId;
}
//# sourceMappingURL=set-cookie-stage.d.ts.map