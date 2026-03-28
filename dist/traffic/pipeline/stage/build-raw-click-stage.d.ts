/**
 * Build Raw Click Stage
 *
 * Builds the initial RawClick from the request data.
 * Extracts IP, user agent, referrer, keywords, costs, etc.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/BuildRawClickStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
/**
 * Build Raw Click Stage
 */
export declare class BuildRawClickStage implements StageInterface {
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, logEntry: TrafficLogEntry): Payload;
    /**
     * Prepare basic click data
     */
    private _prepare;
    /**
     * Find language from accept-language header
     */
    private _findLanguage;
    /**
     * Find other parameters
     */
    private _findOtherParams;
    /**
     * Find search engine referrer
     */
    private _findSeReferrer;
    /**
     * Find referrer
     */
    private _findReferrer;
    /**
     * Find source
     */
    private _findSource;
    /**
     * Find X-Requested-With header
     */
    private _findXRequestedWith;
    /**
     * Find search engine
     */
    private _findSearchEngine;
    /**
     * Find keyword
     */
    private _findKeyword;
    /**
     * Extract keyword from referrer URL
     */
    private _extractKeywordFromReferrer;
    /**
     * Find default keyword
     */
    private _findDefaultKeyword;
    /**
     * Find costs
     */
    private _findCosts;
    /**
     * Find sub IDs
     */
    private _findSubIds;
    /**
     * Find extra params
     */
    private _findExtraParams;
    /**
     * Find IP info (geo, ISP, etc.)
     * @artifact ARTIFACT-007: Simplified without GeoDB integration
     */
    private _findIpInfo;
    /**
     * Find device info
     * @artifact ARTIFACT-008: Simplified without DeviceAtlas integration
     */
    private _findDeviceInfo;
    /**
     * Check if request is from a bot
     * @artifact ARTIFACT-009: Simplified bot detection
     */
    private _checkIfBot;
    /**
     * Check if request is from a proxy
     * @artifact ARTIFACT-010: Simplified proxy detection
     */
    private _checkIfProxy;
}
//# sourceMappingURL=build-raw-click-stage.d.ts.map