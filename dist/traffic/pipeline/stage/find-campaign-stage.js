"use strict";
/**
 * Find Campaign Stage
 *
 * Finds a campaign by token, alias, or domain association.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/FindCampaignStage.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindCampaignStage = void 0;
const stage_interface_js_1 = require("../../../core/pipeline/stage-interface.js");
const cached_campaign_repository_js_1 = require("../../repository/cached-campaign-repository.js");
/**
 * Find Campaign Stage
 */
class FindCampaignStage {
    _campaignRepository;
    constructor() {
        this._campaignRepository = cached_campaign_repository_js_1.CachedCampaignRepository.getInstance();
    }
    /**
     * Process the pipeline payload
     */
    async process(payload, logEntry) {
        const request = payload.getServerRequest();
        // Skip if campaign already set
        if (payload.getCampaign()) {
            return payload;
        }
        if (!request) {
            throw new stage_interface_js_1.StageException('Empty request', 'FindCampaignStage');
        }
        // Check for forced campaign ID
        const forcedCampaignId = payload.getForcedCampaignId();
        if (forcedCampaignId) {
            logEntry.add(`[Restored] Processing campaign ${forcedCampaignId}`);
            const campaign = await this._findCampaignById(forcedCampaignId);
            payload.setForcedCampaignId(null);
            payload.setCampaign(campaign);
            return payload;
        }
        logEntry.add(`Requested: ${request.getUri().toString()}`);
        logEntry.add('Searching campaign');
        // Try to find campaign
        let campaign = await this._tryToFindCampaign(request);
        // Check domain default campaign
        if (!campaign) {
            logEntry.add('Campaign is not found. Checking assigned to domain campaign.');
            campaign = await this._findDomainDefaultCampaign(request);
        }
        if (!campaign) {
            logEntry.add('No campaign found');
            return payload;
        }
        // Check if campaign is active
        if (!campaign.isActive()) {
            logEntry.add(`Campaign is not active (${campaign.getState()})`);
            return payload;
        }
        logEntry.add(`Found campaign: ${campaign.getName()} (ID: ${campaign.getId()})`);
        payload.setCampaign(campaign);
        return payload;
    }
    /**
     * Try to find campaign by various methods
     */
    async _tryToFindCampaign(request) {
        const campaignAliases = this._getCampaignParamAliases(request);
        for (const alias of campaignAliases) {
            // Try by alias
            let campaign = await this._findCampaignByAlias(alias);
            if (!campaign) {
                // Try by ID if allowed
                const id = parseInt(alias, 10);
                if (!isNaN(id)) {
                    campaign = await this._findCampaignById(id);
                }
            }
            if (campaign) {
                return campaign;
            }
        }
        // Try to find by path component (first segment after host)
        const path = request.getUri().pathname;
        const pathSegments = path.split('/').filter(s => s.length > 0);
        if (pathSegments.length > 0) {
            const firstSegment = pathSegments[0];
            if (firstSegment) {
                const campaign = await this._findCampaignByAlias(firstSegment);
                if (campaign) {
                    return campaign;
                }
            }
        }
        return null;
    }
    /**
     * Find domain default campaign
     */
    async _findDomainDefaultCampaign(_request) {
        // TODO: Implement domain repository integration
        // In original: CachedDomainRepository.instance().getCampaignIdByUrl()
        return null;
    }
    /**
     * Get campaign parameter aliases
     */
    _getCampaignParamAliases(request) {
        const result = [];
        // Standard campaign parameter
        const param = request.getParam('_campaign');
        if (param) {
            result.push(param);
        }
        // Check alias parameters
        const aliases = ['campaign', 'camp', 'c', 'keyword', 'k'];
        for (const alias of aliases) {
            const p = request.getParam(alias);
            if (p) {
                result.push(p);
            }
        }
        return result;
    }
    /**
     * Find campaign by alias
     */
    async _findCampaignByAlias(alias) {
        try {
            return await this._campaignRepository.findActiveByAlias(alias);
        }
        catch {
            return null;
        }
    }
    /**
     * Find campaign by ID
     */
    async _findCampaignById(id) {
        try {
            return await this._campaignRepository.findCached(id);
        }
        catch {
            return null;
        }
    }
}
exports.FindCampaignStage = FindCampaignStage;
//# sourceMappingURL=find-campaign-stage.js.map