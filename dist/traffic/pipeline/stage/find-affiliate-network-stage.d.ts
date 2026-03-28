/**
 * Find Affiliate Network Stage
 *
 * Finds the affiliate network for the selected offer.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/FindAffiliateNetworkStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index.js';
/**
 * Find Affiliate Network Stage
 */
export declare class FindAffiliateNetworkStage implements StageInterface {
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, _logEntry: TrafficLogEntry): Payload;
    /**
     * Add parameter to URL
     */
    private _addParameterToUrl;
    /**
     * Find affiliate network by ID
     * @artifact ARTIFACT-032: Placeholder - needs repository
     */
    private _findAffiliateNetwork;
}
/**
 * Affiliate Network model placeholder
 */
export interface AffiliateNetwork {
    getId(): number | undefined;
    get<T = unknown>(key: string): T | undefined;
}
//# sourceMappingURL=find-affiliate-network-stage.d.ts.map