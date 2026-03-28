"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Offer = exports.PayoutType = exports.OfferType = void 0;
/**
 * Offer Model
 *
 * Represents an offer (affiliate offer) in the system.
 *
 * @see keitaro_source/application/Traffic/Model/Offer.php
 */
const abstract_model_js_1 = require("../../core/model/abstract-model.js");
const state_js_1 = require("../../core/entity/state.js");
/**
 * Offer type constants
 */
exports.OfferType = {
    EXTERNAL: 'external',
    LOCAL: 'local'
};
/**
 * Payout type constants
 */
exports.PayoutType = {
    CPA: 'CPA',
    CPL: 'CPL',
    CPS: 'CPS',
    REV_SHARE: 'RevShare'
};
/**
 * Offer model class
 */
class Offer extends abstract_model_js_1.AbstractModel {
    static _tableName = 'offers';
    static _cacheKey = 'OFFERS';
    static _aclKey = 'offers';
    static _entityName = 'offer';
    // === Getters ===
    getName() {
        return this.get('name') ?? '';
    }
    getUrl() {
        return this.get('url');
    }
    getGroupId() {
        return this.get('group_id');
    }
    getAffiliateNetworkId() {
        return this.get('affiliate_network_id');
    }
    getOfferType() {
        return this.get('offer_type') ?? exports.OfferType.EXTERNAL;
    }
    getState() {
        const state = this.get('state');
        return state === 'active' ? state_js_1.EntityState.ACTIVE : state_js_1.EntityState.DISABLED;
    }
    getActionType() {
        return this.get('action_type');
    }
    getActionPayload() {
        return this.get('action_payload');
    }
    getActionOptions() {
        return this.get('action_options');
    }
    // Payouts
    getPayoutValue() {
        return this.get('payout_value') ?? 0;
    }
    getPayoutCurrency() {
        return this.get('payout_currency');
    }
    getPayoutType() {
        return this.get('payout_type');
    }
    isPayoutAuto() {
        return this.get('payout_auto') === 1;
    }
    isPayoutUpsell() {
        return this.get('payout_upsell') === 1;
    }
    // Country
    getCountry() {
        return this.get('country');
    }
    // Conversion cap
    isConversionCapEnabled() {
        return this.get('conversion_cap_enabled') === 1;
    }
    getDailyCap() {
        return this.get('daily_cap') ?? 0;
    }
    getConversionTimezone() {
        return this.get('conversion_timezone') ?? 'UTC';
    }
    getAlternativeOfferId() {
        return this.get('alternative_offer_id');
    }
    getNotes() {
        return this.get('notes');
    }
    // === Type checks ===
    isExternal() {
        return this.getOfferType() === exports.OfferType.EXTERNAL;
    }
    isLocal() {
        return this.getOfferType() === exports.OfferType.LOCAL;
    }
    isDisabled() {
        return this.getState() === state_js_1.EntityState.DISABLED;
    }
    isActive() {
        return this.getState() === state_js_1.EntityState.ACTIVE;
    }
}
exports.Offer = Offer;
//# sourceMappingURL=offer.js.map