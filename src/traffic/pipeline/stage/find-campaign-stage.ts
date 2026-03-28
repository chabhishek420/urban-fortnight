/**
 * Find Campaign Stage
 *
 * Finds a campaign by token, alias, or domain association.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/FindCampaignStage.php
 */

import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
import { StageException } from '../../../core/pipeline/stage-interface';
import type { Campaign } from '../../model/campaign';
import { CachedCampaignRepository } from '../../repository/cached-campaign-repository';

/**
 * Find Campaign Stage
 */
export class FindCampaignStage implements StageInterface {
  private _campaignRepository: CachedCampaignRepository;

  constructor() {
    this._campaignRepository = CachedCampaignRepository.getInstance();
  }

  /**
   * Process the pipeline payload
   */
  async process(payload: Payload, logEntry: TrafficLogEntry): Promise<Payload> {
    const request = payload.getServerRequest();

    // Skip if campaign already set
    if (payload.getCampaign()) {
      return payload;
    }

    if (!request) {
      throw new StageException('Empty request', 'FindCampaignStage');
    }

    // Check for forced campaign ID
    const forcedCampaignId = payload.getForcedCampaignId();
    if (forcedCampaignId) {
      logEntry.add(`[Restored] Processing campaign ${forcedCampaignId}`);
      const campaign = await this._findCampaignById(forcedCampaignId);
      payload.setForcedCampaignId(null as unknown as number);
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
  private async _tryToFindCampaign(request: { getParam: (n: string) => string | undefined; getQueryParams: () => Record<string, string>; getUri: () => URL }): Promise<Campaign | null> {
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
  private async _findDomainDefaultCampaign(_request: { getUri: () => URL }): Promise<Campaign | null> {
    // TODO: Implement domain repository integration
    // In original: CachedDomainRepository.instance().getCampaignIdByUrl()
    return null;
  }

  /**
   * Get campaign parameter aliases
   */
  private _getCampaignParamAliases(request: { getParam: (n: string) => string | undefined; getQueryParams: () => Record<string, string> }): string[] {
    const result: string[] = [];

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
  private async _findCampaignByAlias(alias: string): Promise<Campaign | null> {
    try {
      return await this._campaignRepository.findActiveByAlias(alias);
    } catch {
      return null;
    }
  }

  /**
   * Find campaign by ID
   */
  private async _findCampaignById(id: number): Promise<Campaign | null> {
    try {
      return await this._campaignRepository.findCached(id);
    } catch {
      return null;
    }
  }
}
