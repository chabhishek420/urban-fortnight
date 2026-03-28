"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrafficSource = void 0;
/**
 * Traffic Source Model
 *
 * @see keitaro_source/application/Traffic/Model/TrafficSource.php
 */
const abstract_model_js_1 = require("../../core/model/abstract-model.js");
const state_js_1 = require("../../core/entity/state.js");
class TrafficSource extends abstract_model_js_1.AbstractModel {
    static _tableName = 'traffic_sources';
    static _cacheKey = 'TRAFFIC_SOURCES';
    static _aclKey = 'traffic_sources';
    static _entityName = 'traffic_source';
    getName() {
        return this.get('name') ?? '';
    }
    getPostbackUrl() {
        return this.get('postback_url');
    }
    getPostbackStatuses() {
        const statuses = this.get('postback_statuses');
        try {
            return statuses ? JSON.parse(statuses) : ['sale', 'lead', 'rejected', 'rebill'];
        }
        catch {
            return ['sale', 'lead', 'rejected', 'rebill'];
        }
    }
    getTemplateName() {
        return this.get('template_name');
    }
    isAcceptParameters() {
        return this.get('accept_parameters') === 1;
    }
    getParameters() {
        const params = this.get('parameters');
        try {
            return params ? JSON.parse(params) : undefined;
        }
        catch {
            return undefined;
        }
    }
    getState() {
        const state = this.get('state');
        return state === 'active' ? state_js_1.EntityState.ACTIVE : state_js_1.EntityState.DISABLED;
    }
    getNotes() {
        return this.get('notes');
    }
    getTrafficLoss() {
        return this.get('traffic_loss') ?? 0;
    }
    isActive() {
        return this.getState() === state_js_1.EntityState.ACTIVE;
    }
}
exports.TrafficSource = TrafficSource;
//# sourceMappingURL=traffic-source.js.map