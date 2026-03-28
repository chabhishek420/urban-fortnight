"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversion = void 0;
/**
 * Conversion Model
 *
 * @see keitaro_source/application/Traffic/Model/Conversion.php
 */
const abstract_model_js_1 = require("../../core/model/abstract-model.js");
class Conversion extends abstract_model_js_1.AbstractModel {
    static _tableName = 'conversions_2';
    static _cacheKey = 'CONVERSIONS';
    static _aclKey = 'conversions';
    static _entityName = 'conversion';
    getSubId() {
        return this.get('sub_id') ?? '';
    }
    getTid() {
        return this.get('tid');
    }
    getStatus() {
        return this.get('status');
    }
    getPreviousStatus() {
        return this.get('previous_status');
    }
    getOriginalStatus() {
        return this.get('original_status');
    }
    getRevenue() {
        return this.get('revenue') ?? 0;
    }
    getCost() {
        return this.get('cost') ?? 0;
    }
    getCampaignId() {
        return this.get('campaign_id');
    }
    getStreamId() {
        return this.get('stream_id');
    }
    getOfferId() {
        return this.get('offer_id');
    }
    getLandingId() {
        return this.get('landing_id');
    }
    getClickId() {
        return this.get('click_id');
    }
    getVisitorId() {
        return this.get('visitor_id');
    }
    getClickDatetime() {
        return this.get('click_datetime');
    }
    getPostbackDatetime() {
        return this.get('postback_datetime');
    }
    getSaleDatetime() {
        return this.get('sale_datetime');
    }
    isProcessed() {
        return this.get('is_processed') === 1;
    }
    getParams() {
        const params = this.get('params');
        try {
            return params ? JSON.parse(params) : undefined;
        }
        catch {
            return undefined;
        }
    }
    isLead() {
        return this.getStatus() === 'lead';
    }
    isSale() {
        return this.getStatus() === 'sale';
    }
    isRejected() {
        return this.getStatus() === 'rejected';
    }
    isRebill() {
        return this.getStatus() === 'rebill';
    }
    getProfit() {
        return this.getRevenue() - this.getCost();
    }
}
exports.Conversion = Conversion;
//# sourceMappingURL=conversion.js.map