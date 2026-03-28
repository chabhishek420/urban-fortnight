/**
 * Choose Landing Stage
 *
 * Selects a landing page from the stream's landing associations.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/ChooseLandingStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
/**
 * Choose Landing Stage
 */
export declare class ChooseLandingStage implements StageInterface {
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, logEntry: TrafficLogEntry): Payload;
    /**
     * Update payload with landing data
     */
    private _updatePayload;
    /**
     * Get random landing from associations
     */
    private _getRandom;
    /**
     * Get landing associations for stream
     * @artifact ARTIFACT-025: Placeholder - needs repository
     */
    private _getLandingAssociations;
    /**
     * Check if stream has offers
     * @artifact ARTIFACT-026: Placeholder - needs repository
     */
    private _hasOffers;
}
//# sourceMappingURL=choose-landing-stage.d.ts.map