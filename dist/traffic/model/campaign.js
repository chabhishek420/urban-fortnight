"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Campaign = exports.VisitorBinding = exports.UniqueCheckMethod = exports.UniquenessMethod = exports.CostType = exports.CampaignType = void 0;
/**
 * Campaign Model
 *
 * Represents a tracking campaign in the system.
 *
 * @see keitaro_source/application/Traffic/Model/Campaign.php
 */
const abstract_model_js_1 = require("../../core/model/abstract-model.js");
const state_js_1 = require("../../core/entity/state.js");
/**
 * Campaign type constants
 */
exports.CampaignType = {
    POSITION: 'position',
    WEIGHT: 'weight'
};
/**
 * Cost type constants
 */
exports.CostType = {
    CPM: 'CPM', // Cost per mille (thousand impressions)
    CPC: 'CPC', // Cost per click
    CPUC: 'CPUC', // Cost per unique click
    CPA: 'CPA', // Cost per action
    CPS: 'CPS', // Cost per sale
    REV_SHARE: 'RevShare', // Revenue share
    CPV: 'CPV' // Cost per view
};
/**
 * Uniqueness method constants
 */
exports.UniquenessMethod = {
    COOKIE_AND_IP: 'cookie_and_ip',
    IP: 'ip',
    COOKIE: 'cookie'
};
/**
 * Unique check method constants
 */
exports.UniqueCheckMethod = {
    IP_UA: 'ip_ua',
    IP: 'ip'
};
/**
 * Visitor binding options
 */
exports.VisitorBinding = {
    STREAM_LANDING_OFFER: 'slo',
    STREAM_LANDING: 'sl',
    STREAM: 's'
};
/**
 * Campaign model class
 */
class Campaign extends abstract_model_js_1.AbstractModel {
    static _tableName = 'campaigns';
    static _cacheKey = 'CAMPAIGNS';
    static _aclKey = 'campaigns';
    static _entityName = 'campaign';
    // Default values
    static DEFAULT_COOKIES_TTL = 24;
    static MIN_COOKIES_TTL = 1;
    static MAX_COOKIES_TTL = 8760;
    // === Getters ===
    getName() {
        return this.get('name') ?? '';
    }
    getAlias() {
        return this.get('alias');
    }
    getToken() {
        return this.get('token');
    }
    getType() {
        return this.get('type') ?? exports.CampaignType.POSITION;
    }
    getMode() {
        return this.get('mode') ?? 'general';
    }
    getState() {
        const state = this.get('state');
        return state === 'active' ? state_js_1.EntityState.ACTIVE : state_js_1.EntityState.DISABLED;
    }
    getPosition() {
        return this.get('position') ?? 0;
    }
    getGroupId() {
        return this.get('group_id');
    }
    getCookiesTtl() {
        return this.get('cookies_ttl') ?? Campaign.DEFAULT_COOKIES_TTL;
    }
    getUniquenessMethod() {
        return this.get('uniqueness_method') ?? exports.UniqueCheckMethod.IP_UA;
    }
    getActionType() {
        return this.get('action_type');
    }
    getActionPayload() {
        return this.get('action_payload');
    }
    getCostType() {
        return this.get('cost_type') ?? exports.CostType.CPV;
    }
    getCostValue() {
        return this.get('cost_value') ?? 0;
    }
    getCostCurrency() {
        return this.get('cost_currency');
    }
    getTrafficSourceId() {
        return this.get('traffic_source_id');
    }
    getDomainId() {
        return this.get('domain_id');
    }
    getParameters() {
        return this.get('parameters');
    }
    getTrafficLoss() {
        return this.get('traffic_loss') ?? 0;
    }
    getNotes() {
        return this.get('notes');
    }
    // === Type checks ===
    isTypePosition() {
        return this.getType() === exports.CampaignType.POSITION;
    }
    isWeightPosition() {
        return this.getType() === exports.CampaignType.WEIGHT;
    }
    isDisabled() {
        return this.getState() === state_js_1.EntityState.DISABLED;
    }
    isUniqueByIpUa() {
        return this.getUniquenessMethod() !== exports.UniqueCheckMethod.IP;
    }
    isUniqueByIp() {
        return this.getUniquenessMethod() === exports.UniqueCheckMethod.IP;
    }
    isUniquenessUseCookies() {
        return this.get('uniqueness_use_cookies') === 1;
    }
    isCostAuto() {
        return this.get('cost_auto') === 1;
    }
    isCostPerUnique() {
        return [exports.CostType.CPUC, 'CPUV'].includes(this.getCostType());
    }
    isCostPerThousand() {
        return this.getCostType() === exports.CostType.CPM;
    }
    isCostPerClick() {
        const clickTypes = [exports.CostType.CPC, exports.CostType.CPV];
        return clickTypes.includes(this.getCostType());
    }
    isCostPerAcquisition() {
        return this.getCostType() === exports.CostType.CPA;
    }
    isCostPerSale() {
        return this.getCostType() === exports.CostType.CPS;
    }
    isCostRevShare() {
        return this.getCostType() === exports.CostType.REV_SHARE;
    }
    isBindVisitorsEnabled() {
        const bind = this.get('bind_visitors');
        return this.isWeightPosition() && !!bind && bind.length > 0;
    }
    isBindVisitorsLandingEnabled() {
        const bind = this.get('bind_visitors');
        return this.isWeightPosition() && !!bind && bind.length >= 2;
    }
    isBindVisitorsOfferEnabled() {
        const bind = this.get('bind_visitors');
        return this.isWeightPosition() && !!bind && bind.length >= 3;
    }
    // === Setters ===
    setPosition(value) {
        return this.set('position', value);
    }
    setActionPayload(value) {
        return this.set('action_payload', value);
    }
}
exports.Campaign = Campaign;
//# sourceMappingURL=campaign.js.map