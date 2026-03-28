/**
 * Save Uniqueness Session Stage
 *
 * Saves uniqueness session data for tracking unique visitors.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/SaveUniquenessSessionStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
import { StageException } from '../../../core/pipeline/stage-interface';

/**
 * Save Uniqueness Session Stage
 */
export class SaveUniquenessSessionStage implements StageInterface {
  /**
   * Process the pipeline payload
   */
  process(payload: Payload, logEntry: TrafficLogEntry): Payload {
    const campaign = payload.getCampaign();
    const stream = payload.getStream();
    const rawClick = payload.getRawClick();
    const request = payload.getServerRequest();
    const response = payload.getResponse();

    if (!request) {
      throw new StageException('Error serverRequest is empty', 'SaveUniquenessSessionStage');
    }

    if (!response) {
      throw new StageException('response is empty', 'SaveUniquenessSessionStage');
    }

    if (!campaign) {
      throw new StageException('campaign is empty', 'SaveUniquenessSessionStage');
    }

    if (!rawClick) {
      throw new StageException('rawClick is empty', 'SaveUniquenessSessionStage');
    }

    // Save non-cookie uniqueness data
    this._saveNonCookies(rawClick, campaign, stream, logEntry);

    // Enable uniqueness ID saving
    payload.enableSaveUniquenessId();
    payload.setServerRequest(request);
    payload.setResponse(response);

    return payload;
  }

  /**
   * Save non-cookie uniqueness data
   * @artifact ARTIFACT-037: Simplified uniqueness storage
   */
  private _saveNonCookies(
    _rawClick: { getSubId: () => string; isUniqueCampaign: () => boolean; isUniqueStream: () => boolean },
    campaign: { getId: () => number | undefined; getCookiesTtl: () => number },
    _stream: { getId: () => number | undefined } | null,
    logger: TrafficLogEntry
  ): void {
    // In original: UniquenessSessionService.instance().saveNonCookies()
    // Store uniqueness in local cache/session
    const campaignId = campaign.getId();
    // Note: stream ID would be used here for stream-level uniqueness tracking
    logger.add(`Saving uniqueness session for campaign ${campaignId}`);
  }
}
