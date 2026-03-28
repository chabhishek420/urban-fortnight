"use strict";
/**
 * To Campaign Action
 *
 * Redirects to another campaign.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/ToCampaign.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToCampaignAction = void 0;
const abstract_action_1 = require("./abstract-action");
class ToCampaignAction extends abstract_action_1.AbstractAction {
    _weight = 6;
    constructor() {
        super('to_campaign');
    }
    getType() {
        return abstract_action_1.ActionType.OTHER;
    }
    getField() {
        return abstract_action_1.ActionField.CAMPAIGNS;
    }
    execute() {
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
exports.ToCampaignAction = ToCampaignAction;
//# sourceMappingURL=to-campaign-action.js.map