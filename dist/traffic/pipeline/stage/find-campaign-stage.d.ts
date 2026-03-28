/**
 * Find Campaign Stage
 *
 * Finds a campaign by token, alias, or domain association.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/FindCampaignStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index.js';
/**
 * Find Campaign Stage
 */
export declare class FindCampaignStage implements StageInterface {
    private _campaignRepository;
    constructor();
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, logEntry: TrafficLogEntry): Promise<Payload>;
    /**
     * Try to find campaign by various methods
     */
    private _tryToFindCampaign;
    /**
     * Find domain default campaign
     */
    private _findDomainDefaultCampaign;
    /**
     * Get campaign parameter aliases
     */
    private _getCampaignParamAliases;
    /**
     * Find campaign by alias
     */
    private _findCampaignByAlias;
    /**
     * Find campaign by ID
     */
    private _findCampaignById;
}
//# sourceMappingURL=find-campaign-stage.d.ts.map