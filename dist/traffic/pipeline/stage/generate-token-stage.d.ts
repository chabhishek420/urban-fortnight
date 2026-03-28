/**
 * Generate Token Stage
 *
 * Generates a visitor token for tracking and stores it.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/GenerateTokenStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index.js';
/**
 * Generate Token Stage
 */
export declare class GenerateTokenStage implements StageInterface {
    static readonly TOKEN_PARAM = "_token";
    static readonly SUBID_PARAM = "_subid";
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, logEntry: TrafficLogEntry): Payload;
    /**
     * Store raw click and return token
     */
    private _storeRawClick;
    /**
     * Add parameter to URL
     */
    private _addParameterToUrl;
    /**
     * Check if action is a redirect
     */
    private _isRedirect;
    /**
     * Get offers for stream
     * @artifact ARTIFACT-031: Placeholder - needs repository
     */
    private _getStreamOffers;
}
//# sourceMappingURL=generate-token-stage.d.ts.map