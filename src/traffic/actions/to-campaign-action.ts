/**
 * To Campaign Action
 * 
 * Redirects to another campaign.
 * 
 * @see keitaro_source/application/Traffic/Actions/Predefined/ToCampaign.php
 */

import { AbstractAction, ActionType, ActionField } from './abstract-action';

export class ToCampaignAction extends AbstractAction {
  protected _weight = 6;

  constructor() {
    super('to_campaign');
  }

  getType(): ActionType {
    return ActionType.OTHER;
  }

  getField(): ActionField {
    return ActionField.CAMPAIGNS;
  }

  execute(): void {
    const campaignId = parseInt(this.getRawActionPayload(), 10);
    
    if (isNaN(campaignId)) {
      return;
    }
    
    // Store the campaign ID for the pipeline to handle
    this.getPayload().setForcedCampaignId(campaignId);
    
    // Note: Campaign lookup would need to be async in real implementation
    // For now, just set destination info
    this.setDestinationInfo(`Campaign ${campaignId}`);
  }
}
