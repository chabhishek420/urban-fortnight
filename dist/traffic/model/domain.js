"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Domain = void 0;
/**
 * Domain Model
 *
 * @see keitaro_source/application/Traffic/Model/Domain.php
 */
const abstract_model_js_1 = require("../../core/model/abstract-model.js");
const state_js_1 = require("../../core/entity/state.js");
class Domain extends abstract_model_js_1.AbstractModel {
    static _tableName = 'domains';
    static _cacheKey = 'DOMAINS';
    static _aclKey = 'domains';
    static _entityName = 'domain';
    getName() {
        return this.get('name') ?? '';
    }
    isSsl() {
        return this.get('is_ssl') === 1;
    }
    getNetworkStatus() {
        return this.get('network_status');
    }
    getDefaultCampaignId() {
        return this.get('default_campaign_id');
    }
    getState() {
        const state = this.get('state');
        return state === 'active' ? state_js_1.EntityState.ACTIVE : state_js_1.EntityState.DISABLED;
    }
    isWildcard() {
        return this.get('wildcard') === 1;
    }
    catchNotFound() {
        return this.get('catch_not_found') === 1;
    }
    getNotes() {
        return this.get('notes');
    }
    getErrorDescription() {
        return this.get('error_description');
    }
    getSslStatus() {
        return this.get('ssl_status');
    }
    getRedirect() {
        return this.get('redirect') ?? 'not';
    }
    getSslData() {
        const data = this.get('ssl_data');
        try {
            return data ? JSON.parse(data) : undefined;
        }
        catch {
            return undefined;
        }
    }
    isRobotsAllowed() {
        return this.get('is_robots_allowed') === 1;
    }
    isSslRedirect() {
        return this.get('ssl_redirect') === 1;
    }
    isAllowIndexing() {
        return this.get('allow_indexing') === 1;
    }
    getCheckRetries() {
        return this.get('check_retries') ?? 0;
    }
    isActive() {
        return this.getState() === state_js_1.EntityState.ACTIVE;
    }
}
exports.Domain = Domain;
//# sourceMappingURL=domain.js.map