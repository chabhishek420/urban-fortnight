/**
 * Choose Landing Stage
 *
 * Selects a landing page from the stream's landing associations.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/ChooseLandingStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
import { StageException } from '../../../core/pipeline/stage-interface';
import type { Landing } from '../../model/landing';
import type { BaseStream } from '../../model/base-stream';
import { StreamSchema } from '../../model/base-stream';

/**
 * Choose Landing Stage
 */
export class ChooseLandingStage implements StageInterface {
  /**
   * Process the pipeline payload
   */
  process(payload: Payload, logEntry: TrafficLogEntry): Payload {
    const stream = payload.getStream();
    const campaign = payload.getCampaign();
    const rawClick = payload.getRawClick();
    const currentLanding = payload.getLanding();
    const serverRequest = payload.getServerRequest();
    const response = payload.getResponse();

    if (!response) {
      throw new StageException('response is not set', 'ChooseLandingStage');
    }

    if (!serverRequest) {
      throw new StageException('serverRequest is not defined', 'ChooseLandingStage');
    }

    // No stream - skip
    if (!stream) {
      logEntry.add('No stream, skip choosing landing');
      return payload;
    }

    // Check schema
    const schema = stream.getSchema();
    if (schema !== StreamSchema.LANDING_OFFER && schema !== 'landings') {
      logEntry.add(`Schema is ${schema}, skip choosing landings`);
      return payload;
    }

    if (!campaign) {
      throw new StageException('campaign is not defined', 'ChooseLandingStage');
    }

    if (!rawClick) {
      throw new StageException('rawClick is not defined', 'ChooseLandingStage');
    }

    // Landing already selected
    if (currentLanding) {
      logEntry.add(`Landing is preselected #${currentLanding.getId()}`);
      return payload;
    }

    // Choose landing
    let landing: Landing | null = null;

    const landingAssociations = this._getLandingAssociations(stream);
    if (!landingAssociations || landingAssociations.length === 0) {
      logEntry.add('No landings');
    } else {
      landing = this._getRandom(serverRequest, landingAssociations, logEntry);

      // Enable cookie binding for landing
      if (campaign.isBindVisitorsLandingEnabled() && landing) {
        payload.enableCookieBindLanding();
      }
    }

    if (landing) {
      logEntry.add(`LP #${landing.getId()} is chosen`);
      this._updatePayload(payload, landing);
    } else {
      logEntry.add('No LP selected');
    }

    return payload;
  }

  /**
   * Update payload with landing data
   */
  private _updatePayload(payload: Payload, landing: Landing): void {
    payload.setActionPayload(landing.getUrl() ?? landing.getActionPayload());
    payload.getRawClick()?.setLandingId(landing.getId()!);
    payload.setLanding(landing);
    payload.setActionType(landing.getActionType() ?? null);
    payload.setActionOptions(landing.getActionOptions() ?? null);

    // Check if token is needed
    const stream = payload.getStream();
    if (stream && this._hasOffers(stream)) {
      payload.setNeedToken(true);
      payload.setAddTokenToUrl(true);
    }
  }

  /**
   * Get random landing from associations
   */
  private _getRandom(
    _request: { getUri: () => URL },
    associations: Array<{ landing: Landing; weight: number; share: number }>,
    _logger: TrafficLogEntry
  ): Landing | null {
    if (associations.length === 0) return null;
    if (associations.length === 1) return associations[0]?.landing ?? null;

    // Weighted random selection
    const totalWeight = associations.reduce((sum, a) => sum + a.weight, 0);
    if (totalWeight === 0) return associations[0]?.landing ?? null;

    let random = Math.random() * totalWeight;
    for (const assoc of associations) {
      random -= assoc.weight;
      if (random <= 0) {
        return assoc.landing;
      }
    }

    return associations[associations.length - 1]?.landing ?? null;
  }

  /**
   * Get landing associations for stream
   * @artifact ARTIFACT-025: Placeholder - needs repository
   */
  private _getLandingAssociations(_stream: BaseStream): Array<{ landing: Landing; weight: number; share: number }> {
    // TODO: Implement stream landing association repository
    return [];
  }

  /**
   * Check if stream has offers
   * @artifact ARTIFACT-026: Placeholder - needs repository
   */
  private _hasOffers(_stream: BaseStream): boolean {
    // TODO: Implement stream offer association repository
    return false;
  }
}
