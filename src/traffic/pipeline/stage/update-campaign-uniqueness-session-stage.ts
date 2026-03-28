/**
 * Update Campaign Uniqueness Session Stage
 *
 * Updates uniqueness session data for campaign-level uniqueness.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/UpdateCampaignUniquenessSessionStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
import { StageException } from '../../../core/pipeline/stage-interface';

/**
 * Update Campaign Uniqueness Session Stage
 */
export class UpdateCampaignUniquenessSessionStage implements StageInterface {
  /**
   * Process the pipeline payload
   */
  process(payload: Payload, logEntry: TrafficLogEntry): Payload {
    const campaign = payload.getCampaign();
    const rawClick = payload.getRawClick();
    const serverRequest = payload.getServerRequest();

    if (!campaign) {
      throw new StageException('Empty campaign', 'UpdateCampaignUniquenessSessionStage');
    }

    if (!rawClick) {
      throw new StageException('Empty rawClick', 'UpdateCampaignUniquenessSessionStage');
    }

    // Bots are never unique
    if (rawClick.isBot()) {
      rawClick.set('is_unique_campaign', false);
      return payload;
    }

    // Check uniqueness for campaign
    const isUniqueCampaign = this._isUniqueForCampaign(serverRequest, rawClick, campaign);
    rawClick.set('is_unique_campaign', isUniqueCampaign);

    // Check global uniqueness
    const isUniqueGlobal = this._isUniqueGlobal(serverRequest, rawClick, campaign);
    rawClick.set('is_unique_global', isUniqueGlobal);

    if (!isUniqueCampaign) {
      logEntry.add('Is not unique for campaign');
    }

    return payload;
  }

  /**
   * Check if visitor is unique for campaign
   * @artifact ARTIFACT-020: Simplified uniqueness check
   */
  private _isUniqueForCampaign(
    request: { getCookies: () => Record<string, string>; getClientIp: () => string },
    _click: { getSubId: () => string },
    campaign: { getId: () => number | undefined; getCookiesTtl: () => number }
  ): boolean {
    // Check cookie for campaign uniqueness
    const cookies = request.getCookies();
    const campaignId = campaign.getId();
    const uniquenessCookie = cookies[`u_campaign_${campaignId}`];

    if (uniquenessCookie) {
      return false;
    }

    return true;
  }

  /**
   * Check if visitor is unique globally
   * @artifact ARTIFACT-021: Simplified uniqueness check
   */
  private _isUniqueGlobal(
    request: { getCookies: () => Record<string, string>; getClientIp: () => string },
    _click: { getSubId: () => string },
    _campaign: { getId: () => number | undefined }
  ): boolean {
    // Check global uniqueness cookie
    const cookies = request.getCookies();
    const globalCookie = cookies['u_global'];

    if (globalCookie) {
      return false;
    }

    return true;
  }
}
