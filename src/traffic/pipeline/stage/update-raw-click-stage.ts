/**
 * Update Raw Click Stage
 *
 * Updates raw click with campaign data after campaign is found.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/UpdateRawClickStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
import { StageException } from '../../../core/pipeline/stage-interface';
import { VisitorService } from '../../service/visitor-service';
import { RawClickService } from '../../service/raw-click-service';

/**
 * Update Raw Click Stage
 */
export class UpdateRawClickStage implements StageInterface {
  /**
   * Process the pipeline payload
   */
  process(payload: Payload, _logEntry: TrafficLogEntry): Payload {
    const rawClick = payload.getRawClick();
    const campaign = payload.getCampaign();

    if (!rawClick) {
      throw new StageException('rawClick is not set', 'UpdateRawClickStage');
    }

    if (!campaign) {
      throw new StageException('campaign is not set', 'UpdateRawClickStage');
    }

    // Set campaign ID
    rawClick.setCampaignId(campaign.getId()!);

    // Set traffic source ID
    const trafficSourceId = campaign.getTrafficSourceId();
    if (trafficSourceId) {
      rawClick.set('ts_id', trafficSourceId);
    }

    // Generate visitor code using VisitorService
    const visitorService = VisitorService.instance();
    const visitorCode = visitorService.generateCode(rawClick);
    rawClick.set('visitor_code', visitorCode);

    // Generate sub ID using RawClickService
    const rawClickService = RawClickService.instance();
    const subId = rawClickService.generateSubId(visitorCode);
    rawClick.setSubId(subId);

    payload.setRawClick(rawClick);
    return payload;
  }
}
