"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Landing = exports.LandingType = void 0;
/**
 * Landing Model
 *
 * Represents a landing page in the system.
 *
 * @see keitaro_source/application/Traffic/Model/Landing.php
 */
const abstract_model_js_1 = require("../../core/model/abstract-model.js");
const state_js_1 = require("../../core/entity/state.js");
/**
 * Landing type constants
 */
exports.LandingType = {
    EXTERNAL: 'external',
    LOCAL: 'local'
};
/**
 * Landing model class
 */
class Landing extends abstract_model_js_1.AbstractModel {
    static _tableName = 'landings';
    static _cacheKey = 'LANDINGS';
    static _aclKey = 'landings';
    static _entityName = 'landing';
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
    getLandingType() {
        return this.get('landing_type') ?? exports.LandingType.EXTERNAL;
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
    getOfferCount() {
        return this.get('offer_count') ?? 1;
    }
    getNotes() {
        return this.get('notes');
    }
    // === Type checks ===
    isExternal() {
        return this.getLandingType() === exports.LandingType.EXTERNAL;
    }
    isLocal() {
        return this.getLandingType() === exports.LandingType.LOCAL;
    }
    isDisabled() {
        return this.getState() === state_js_1.EntityState.DISABLED;
    }
    isActive() {
        return this.getState() === state_js_1.EntityState.ACTIVE;
    }
}
exports.Landing = Landing;
//# sourceMappingURL=landing.js.map