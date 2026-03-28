/**
 * Choose Offer Stage
 *
 * Selects an offer from the stream's offer associations.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/ChooseOfferStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
/**
 * Choose Offer Stage
 */
export declare class ChooseOfferStage implements StageInterface {
    static readonly VERSION_SEND_TOKEN_ONLY = 2;
    static readonly IGNORE_OFFER_PARAM = "exit";
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, logEntry: TrafficLogEntry): Payload;
    /**
     * Get random offer from associations
     */
    private _getRandom;
    /**
     * Check if stream has offer ID
     * @artifact ARTIFACT-027: Placeholder - needs repository
     */
    private _streamHasOfferId;
    /**
     * Find offer by ID
     * @artifact ARTIFACT-028: Placeholder - needs repository
     */
    private _findOfferById;
    /**
     * Get offer associations for stream
     * @artifact ARTIFACT-029: Placeholder - needs repository
     */
    private _getOfferAssociations;
    /**
     * Find available offer (check conversion capacity)
     * @artifact ARTIFACT-030: Placeholder - needs conversion capacity service
     */
    private _findAvailableOffer;
}
//# sourceMappingURL=choose-offer-stage.d.ts.map