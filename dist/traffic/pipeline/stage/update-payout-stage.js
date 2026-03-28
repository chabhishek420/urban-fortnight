"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePayoutStage = void 0;
const stage_interface_js_1 = require("../../../core/pipeline/stage-interface.js");
const offer_js_1 = require("../../model/offer.js");
/**
 * Update Payout Stage
 */
class UpdatePayoutStage {
    /**
     * Process the pipeline payload
     */
    process(payload, _logEntry) {
        const offer = payload.getOffer();
        const rawClick = payload.getRawClick();
        if (!rawClick) {
            throw new stage_interface_js_1.StageException('Empty rawClick', 'UpdatePayoutStage');
        }
        // Check if offer is CPC and payout is not auto
        if (offer && this._isCPC(offer) && !offer.isPayoutAuto()) {
            rawClick.set('is_sale', 1);
            // Exchange currency
            const revenue = this._exchangeCurrency(offer.getPayoutValue(), offer.getPayoutCurrency(), this._getSystemCurrency());
            rawClick.setRevenue(revenue);
            payload.setRawClick(rawClick);
        }
        return payload;
    }
    /**
     * Check if offer is CPC type
     */
    _isCPC(offer) {
        return offer.getPayoutType() === offer_js_1.PayoutType.CPA || offer.getPayoutType() === 'CPC';
    }
    /**
     * Exchange currency
     * @artifact ARTIFACT-035: Simplified currency exchange
     */
    _exchangeCurrency(value, _fromCurrency, _toCurrency) {
        // In original: CurrencyService.instance().exchange()
        // For now, return value as-is
        return value;
    }
    /**
     * Get system currency
     * @artifact ARTIFACT-036: Simplified settings access
     */
    _getSystemCurrency() {
        // In original: CachedSettingsRepository.instance().get("currency")
        return 'USD';
    }
}
exports.UpdatePayoutStage = UpdatePayoutStage;
//# sourceMappingURL=update-payout-stage.js.map