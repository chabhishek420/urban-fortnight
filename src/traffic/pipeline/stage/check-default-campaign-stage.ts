/**
 * Check Default Campaign Stage
 *
 * Handles cases where no campaign is found by triggering default actions.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/CheckDefaultCampaignStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
import { StageException } from '../../../core/pipeline/stage-interface';
import { Response } from '../../response/response';
import { StatusCode } from '../../response/status-code';

/**
 * Extra action types
 */
const ExtraAction = {
  PARAM_CAMPAIGN: 'campaign',
  PARAM_REDIRECT: 'redirect',
  PARAM_NOTHING: 'nothing'
} as const;

/**
 * Check Default Campaign Stage
 */
export class CheckDefaultCampaignStage implements StageInterface {
  /**
   * Process the pipeline payload
   */
  process(payload: Payload, logEntry: TrafficLogEntry): Payload {
    // Skip if campaign already set
    if (payload.getCampaign()) {
      return payload;
    }

    logEntry.add('Check default action from settings');

    const request = payload.getServerRequest();
    if (!request) {
      throw new StageException('Empty request', 'CheckDefaultCampaignStage');
    }

    // Get extra action setting
    const extraAction = this._getExtraAction();

    switch (extraAction) {
      case ExtraAction.PARAM_CAMPAIGN:
        return this._triggerCampaign(payload, logEntry);
      case ExtraAction.PARAM_REDIRECT:
        return this._triggerRedirect(payload, logEntry);
      default:
        return this._triggerNotFound(payload, logEntry);
    }
  }

  /**
   * Get extra action setting
   * @artifact ARTIFACT-014: Simplified settings access
   */
  private _getExtraAction(): string {
    // In original: CachedSettingsRepository.instance().get(Setting::EXTRA_ACTION)
    return ExtraAction.PARAM_NOTHING;
  }

  /**
   * Trigger redirect to extra URL
   */
  private _triggerRedirect(payload: Payload, logger: TrafficLogEntry): Payload {
    const extraUrl = this._getExtraUrl();
    logger.add(`Redirecting to ${extraUrl}`);

    const response = payload.getResponse() ?? new Response();
    response.withStatus(StatusCode.MOVED_TEMPORARILY).withHeader('Location', extraUrl);

    payload.setResponse(response);
    payload.abort();

    return payload;
  }

  /**
   * Trigger 404 not found
   */
  private _triggerNotFound(payload: Payload, logger: TrafficLogEntry): Payload {
    const response = payload.getResponse() ?? new Response();
    response.withStatus(StatusCode.NOT_FOUND).withBody('404 Not Found');

    logger.add('Shows 404 NotFound');

    payload.setResponse(response);
    payload.abort();

    return payload;
  }

  /**
   * Trigger default campaign
   */
  private _triggerCampaign(payload: Payload, logger: TrafficLogEntry): Payload {
    const defaultCampaignId = this._getDefaultCampaignId();
    logger.add(`Sending to default campaign #${defaultCampaignId}`);

    if (!defaultCampaignId) {
      throw new StageException('Default campaign missing. Check default action settings', 'CheckDefaultCampaignStage');
    }

    // Check if campaign is active
    const campaign = this._findCampaignById(defaultCampaignId);
    if (!campaign || !campaign.isActive()) {
      logger.add(`Default campaign #${defaultCampaignId} is not active, redirecting to 404`);
      return this._triggerNotFound(payload, logger);
    }

    payload.setForcedCampaignId(defaultCampaignId);
    payload.abort();

    return payload;
  }

  /**
   * Get extra redirect URL
   * @artifact ARTIFACT-015: Simplified settings access
   */
  private _getExtraUrl(): string {
    // In original: CachedSettingsRepository.instance().get("extra_url")
    return '/';
  }

  /**
   * Get default campaign ID
   * @artifact ARTIFACT-016: Simplified settings access
   */
  private _getDefaultCampaignId(): number | null {
    // In original: CachedSettingsRepository.instance().get(Setting::EXTRA_CAMPAIGN)
    return null;
  }

  /**
   * Find campaign by ID
   * @artifact ARTIFACT-017: Placeholder - needs campaign repository
   */
  private _findCampaignById(_id: number): { isActive: () => boolean } | null {
    // TODO: Implement campaign repository integration
    return null;
  }
}
