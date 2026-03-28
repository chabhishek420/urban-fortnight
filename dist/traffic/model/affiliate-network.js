"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffiliateNetwork = void 0;
/**
 * Affiliate Network Model
 *
 * @see keitaro_source/application/Traffic/Model/AffiliateNetwork.php
 */
const abstract_model_js_1 = require("../../core/model/abstract-model.js");
const state_js_1 = require("../../core/entity/state.js");
class AffiliateNetwork extends abstract_model_js_1.AbstractModel {
    static _tableName = 'affiliate_networks';
    static _cacheKey = 'AFFILIATE_NETWORKS';
    static _aclKey = 'affiliate_networks';
    static _entityName = 'affiliate_network';
    getName() {
        return this.get('name') ?? '';
    }
    getPostbackUrl() {
        return this.get('postback_url');
    }
    getOfferParam() {
        return this.get('offer_param');
    }
    getState() {
        const state = this.get('state');
        return state === 'active' ? state_js_1.EntityState.ACTIVE : state_js_1.EntityState.DISABLED;
    }
    getTemplateName() {
        return this.get('template_name');
    }
    getNotes() {
        return this.get('notes');
    }
    getPullApiOptions() {
        return this.get('pull_api_options');
    }
    isActive() {
        return this.getState() === state_js_1.EntityState.ACTIVE;
    }
}
exports.AffiliateNetwork = AffiliateNetwork;
//# sourceMappingURL=affiliate-network.js.map