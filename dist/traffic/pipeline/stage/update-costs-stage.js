"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCostsStage = void 0;
const stage_interface_js_1 = require("../../../core/pipeline/stage-interface.js");
const campaign_js_1 = require("../../model/campaign.js");
/**
 * Update Costs Stage
 */
class UpdateCostsStage {
    /**
     * Process the pipeline payload
     */
    process(payload, logEntry) {
        const campaign = payload.getCampaign();
        const rawClick = payload.getRawClick();
        if (!campaign) {
            throw new stage_interface_js_1.StageException('No campaign', 'UpdateCostsStage');
        }
        if (!rawClick) {
            throw new stage_interface_js_1.StageException('No rawClick', 'UpdateCostsStage');
        }
        let cost;
        let currency;
        if (campaign.isCostAuto()) {
            // Use cost from click data
            cost = this._parseCost(rawClick.get('cost'));
            cost = this._patchMegapush(cost);
            currency = rawClick.get('currency');
        }
        else {
            // Use campaign cost settings
            cost = campaign.getCostValue();
            currency = campaign.getCostCurrency();
        }
        // Reset cost
        rawClick.setCost(0);
        // Validate cost
        if (cost && !this._isValidCost(cost)) {
            logEntry.add(`Incorrect cost received - ${cost}`);
            return payload;
        }
        // Apply traffic loss adjustment
        cost = this._applyTrafficLoss(cost, campaign.getTrafficLoss());
        // Handle different cost types
        const costType = campaign.getCostType();
        if (this._isCPAorCPSorRevShare(costType)) {
            // Cost per action/sale/revshare
            if (campaign.isCostPerUnique()) {
                if (this._isCostPerThousand(costType) && cost) {
                    if (!this._isCostPerClick(costType)) {
                        rawClick.setCost(cost);
                        rawClick.set('currency', currency);
                    }
                }
                else {
                    rawClick.setCost(cost / 1000);
                    rawClick.set('currency', currency);
                }
                return payload;
            }
            if (rawClick.isUniqueCampaign()) {
                rawClick.setCost(cost);
                rawClick.set('currency', currency);
            }
        }
        return payload;
    }
    /**
     * Parse cost value
     */
    _parseCost(value) {
        if (typeof value === 'number')
            return value;
        if (typeof value === 'string') {
            const parsed = parseFloat(value.replace(',', '.'));
            return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
    }
    /**
     * Patch for Megapush cost format
     */
    _patchMegapush(cost) {
        // Megapush sends cost as 00XXX format
        const costStr = cost.toString();
        if (/^00[0-9]+/.test(costStr)) {
            return parseFloat(costStr.replace(/^00/, '0.'));
        }
        return cost;
    }
    /**
     * Check if cost is valid
     */
    _isValidCost(cost) {
        return !isNaN(cost) && isFinite(cost);
    }
    /**
     * Apply traffic loss adjustment
     */
    _applyTrafficLoss(cost, trafficLossValue) {
        if (cost && trafficLossValue) {
            return cost / (1 - trafficLossValue / 100);
        }
        return cost;
    }
    /**
     * Check if cost type is CPA, CPS, or RevShare
     */
    _isCPAorCPSorRevShare(costType) {
        return [campaign_js_1.CostType.CPA, campaign_js_1.CostType.CPS, campaign_js_1.CostType.REV_SHARE].includes(costType);
    }
    /**
     * Check if cost per thousand
     */
    _isCostPerThousand(costType) {
        return costType === campaign_js_1.CostType.CPM;
    }
    /**
     * Check if cost per click
     */
    _isCostPerClick(costType) {
        return [campaign_js_1.CostType.CPC, campaign_js_1.CostType.CPV].includes(costType);
    }
}
exports.UpdateCostsStage = UpdateCostsStage;
//# sourceMappingURL=update-costs-stage.js.map