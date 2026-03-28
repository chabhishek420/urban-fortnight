/**
 * Choose Offer Stage
 *
 * Selects an offer from the stream's offer associations.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/ChooseOfferStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
import { StageException } from '../../../core/pipeline/stage-interface';
import type { Offer } from '../../model/offer';
import type { BaseStream } from '../../model/base-stream';
import { StreamSchema } from '../../model/base-stream';

/**
 * Choose Offer Stage
 */
export class ChooseOfferStage implements StageInterface {
  static readonly VERSION_SEND_TOKEN_ONLY = 2;
  static readonly IGNORE_OFFER_PARAM = 'exit';

  /**
   * Process the pipeline payload
   */
  process(payload: Payload, logEntry: TrafficLogEntry): Payload {
    const stream = payload.getStream();
    const campaign = payload.getCampaign();
    const rawClick = payload.getRawClick();
    const landing = payload.getLanding();
    const serverRequest = payload.getServerRequest();
    const response = payload.getResponse();

    if (!response) {
      throw new StageException('response is not set', 'ChooseOfferStage');
    }

    if (!serverRequest) {
      throw new StageException('serverRequest is empty', 'ChooseOfferStage');
    }

    // No stream - skip
    if (!stream) {
      logEntry.add('No stream, skip choosing offer');
      return payload;
    }

    if (!campaign) {
      throw new StageException('Empty campaign', 'ChooseOfferStage');
    }

    if (!rawClick) {
      throw new StageException('Empty rawClick', 'ChooseOfferStage');
    }

    // Skip if landing chosen and not forced
    if (landing && !payload.isForceChooseOffer()) {
      logEntry.add('Landing is chosen, skip choosing offer');
      return payload;
    }

    // Check schema
    const schema = stream.getSchema();
    if (schema !== StreamSchema.LANDING_OFFER && schema !== StreamSchema.OFFER) {
      logEntry.add(`Schema is '${schema}' so offer is not needed.`);
      return payload;
    }

    // Check for forced offer
    let offer: Offer | null = null;
    const forcedOfferId = payload.getForcedOfferId();

    if (forcedOfferId && this._streamHasOfferId(stream, forcedOfferId)) {
      logEntry.add(`Loading offer #${forcedOfferId}`);
      offer = this._findOfferById(forcedOfferId);
    }

    // Choose offer if not forced
    if (!offer) {
      const offerAssociations = this._getOfferAssociations(stream);

      if (!offerAssociations || offerAssociations.length === 0) {
        logEntry.add('No offers in the stream');
      } else {
        offer = this._getRandom(serverRequest, offerAssociations, logEntry);

        if (!offer) {
          logEntry.add('Rotator return empty result');
        } else if (campaign.isBindVisitorsOfferEnabled()) {
          payload.enableCookieBindOffer();
        }
      }
    }

    if (!offer) {
      logEntry.add('No offer is chosen');
      return payload;
    }

    // Check conversion capacity
    const availableOffer = this._findAvailableOffer(offer);
    if (availableOffer && availableOffer.getId() !== offer.getId()) {
      logEntry.add(`Offer #${offer.getId()} reach his conversion capacity. An alternative is chosen #${availableOffer.getId()}`);
      offer = availableOffer;
    }

    if (!offer) {
      logEntry.add(`Warning! Offer doesn't have alternative offer in his chain.`);
      return payload;
    }

    logEntry.add(`Offer #${offer.getId()} is chosen`);

    // Set offer ID if not ignored
    if (serverRequest.getParam(ChooseOfferStage.IGNORE_OFFER_PARAM) !== '1') {
      rawClick.setOfferId(offer.getId()!);
    }

    payload.setOffer(offer);
    payload.setNeedToken(true);

    // Set action for forced redirect
    if (payload.isForceRedirectOffer()) {
      payload.setActionType(offer.getActionType() ?? null);
      payload.setActionPayload(offer.getUrl() ?? offer.getActionPayload());
      payload.setActionOptions(offer.getActionOptions() ?? null);
    }

    return payload;
  }

  /**
   * Get random offer from associations
   */
  private _getRandom(
    _request: { getUri: () => URL },
    associations: Array<{ offer: Offer; weight: number; share: number }>,
    _logger: TrafficLogEntry
  ): Offer | null {
    if (associations.length === 0) return null;
    if (associations.length === 1) return associations[0]?.offer ?? null;

    // Weighted random selection
    const totalWeight = associations.reduce((sum, a) => sum + a.weight, 0);
    if (totalWeight === 0) return associations[0]?.offer ?? null;

    let random = Math.random() * totalWeight;
    for (const assoc of associations) {
      random -= assoc.weight;
      if (random <= 0) {
        return assoc.offer;
      }
    }

    return associations[associations.length - 1]?.offer ?? null;
  }

  /**
   * Check if stream has offer ID
   * @artifact ARTIFACT-027: Placeholder - needs repository
   */
  private _streamHasOfferId(_stream: BaseStream, _offerId: number): boolean {
    // TODO: Implement stream offer association check
    return false;
  }

  /**
   * Find offer by ID
   * @artifact ARTIFACT-028: Placeholder - needs repository
   */
  private _findOfferById(_id: number): Offer | null {
    // TODO: Implement offer repository
    return null;
  }

  /**
   * Get offer associations for stream
   * @artifact ARTIFACT-029: Placeholder - needs repository
   */
  private _getOfferAssociations(_stream: BaseStream): Array<{ offer: Offer; weight: number; share: number }> {
    // TODO: Implement stream offer association repository
    return [];
  }

  /**
   * Find available offer (check conversion capacity)
   * @artifact ARTIFACT-030: Placeholder - needs conversion capacity service
   */
  private _findAvailableOffer(offer: Offer): Offer | null {
    // TODO: Implement conversion capacity service
    return offer;
  }
}
