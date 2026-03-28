/**
 * Check Sending To Another Campaign Stage
 * 
 * Handles campaign chaining (redirecting to another campaign).
 * 
 * @see keitaro_source/application/Traffic/Pipeline/Stage/CheckSendingToAnotherCampaign.php
 */

import type { Payload } from '../payload';
import type { TrafficLogEntry } from '../../logging/traffic-log-entry';
import { StageInterface, SendToCampaignException } from '../../../core/pipeline/stage-interface';

export class CheckSendingToAnotherCampaignStage implements StageInterface {
  /**
   * Process the pipeline payload
   */
  process(payload: Payload, logEntry: TrafficLogEntry): Payload {
    const forcedCampaignId = payload.getForcedCampaignId();
    
    if (!forcedCampaignId) {
      return payload;
    }
    
    const currentCampaign = payload.getCampaign();
    
    // Check if we're redirecting to a different campaign
    if (currentCampaign && currentCampaign.getId() === forcedCampaignId) {
      // Same campaign, no need to redirect
      return payload;
    }
    
    logEntry.add(`Redirecting to campaign #${forcedCampaignId}`);
    
    // Throw exception to trigger re-processing with new campaign
    throw new SendToCampaignException(forcedCampaignId);
  }
}
