/**
 * Landing Offer Dispatcher
 * 
 * Handles landing page to offer transitions.
 * Runs second level pipeline stages for offer processing.
 * 
 * @see keitaro_source/application/Traffic/Dispatcher/LandingOfferDispatcher.php
 */
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface';
import type { ServerRequest } from '../request/server-request';
import type { Response } from '../response/response';
import { Response as HttpResponse } from '../response/response';
import { StatusCode } from '../response/status-code';
import { Payload } from '../pipeline/payload';
import type { RawClick } from '../model/raw-click';

export class LandingOfferDispatcher implements DispatcherInterface {
  private _rawClick: RawClick;

  constructor(rawClick: RawClick) {
    if (!rawClick) {
      throw new Error('rawclick is not provided');
    }
    this._rawClick = rawClick;
  }

  /**
   * Get raw click
   */
  getRawClick(): RawClick {
    return this._rawClick;
  }

  /**
   * Dispatch the landing offer request
   */
  dispatch(request: ServerRequest): Response {
    const response = new HttpResponse({
      disableCache: true
    });
    
    // Check for forced offer_id
    const offerIdParam = request.getParam('offer_id');
    if (offerIdParam) {
      this._rawClick.setOfferId(parseInt(offerIdParam, 10));
    }
    
    // Create pipeline payload with forced values
    const pipelinePayload = new Payload({
      serverRequest: request,
      response,
      rawClick: this._rawClick
    });
    
    const streamId = this._rawClick.getStreamId();
    const campaignId = this._rawClick.getCampaignId();
    const offerId = this._rawClick.getOfferId();
    
    if (streamId !== null && streamId !== undefined) {
      pipelinePayload.setForcedStreamId(streamId);
    }
    if (campaignId !== null && campaignId !== undefined) {
      pipelinePayload.setForcedCampaignId(campaignId);
    }
    if (offerId !== null && offerId !== undefined) {
      pipelinePayload.setForcedOfferId(offerId);
    }
    pipelinePayload.setForceRedirectOffer(true);
    
    try {
      // In production: Run second level pipeline stages
      // const pipeline = new Pipeline();
      // pipelinePayload = pipeline.secondLevelStages().start(pipelinePayload, logEntry);
      
      // Save LP click if offer was selected
      const rawClick = pipelinePayload.getRawClick();
      if (rawClick?.getOfferId()) {
        this.saveLpClick(rawClick, request);
      }
      
      return pipelinePayload.getResponse() ?? response;
      
    } catch {
      return this.getErrorResponse();
    }
  }

  /**
   * Save landing page click
   */
  private saveLpClick(_rawClick: RawClick, _request: ServerRequest): void {
    // In production: UpdateClickCommand::saveLpClick(rawClick.getSubId(), rawClick.getOfferId(), params, landingId)
  }

  /**
   * Get error response
   */
  private getErrorResponse(): Response {
    return new HttpResponse({
      body: 'Sorry. Some internal problems. Please read System Log.',
      status: StatusCode.NOT_IMPLEMENTED
    });
  }
}
