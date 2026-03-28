"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseStream = exports.StreamSchema = exports.StreamType = void 0;
/**
 * Base Stream Model
 *
 * Represents a traffic stream within a campaign.
 *
 * @see keitaro_source/application/Traffic/Model/BaseStream.php
 */
const abstract_model_js_1 = require("../../core/model/abstract-model.js");
const state_js_1 = require("../../core/entity/state.js");
/**
 * Stream type constants
 */
exports.StreamType = {
    REGULAR: 'regular',
    DEFAULT: 'default',
    LANDINGS_OFFERS: 'landings_offers',
    OFFERS: 'offers',
    LANDINGS: 'landings'
};
/**
 * Stream schema constants
 */
exports.StreamSchema = {
    LANDING_OFFER: 'landing_offer',
    OFFER: 'offer',
    LANDINGS: 'landings'
};
/**
 * Base Stream model class
 */
class BaseStream extends abstract_model_js_1.AbstractModel {
    static _tableName = 'streams';
    static _cacheKey = 'STREAMS';
    static _aclKey = 'streams';
    static _entityName = 'stream';
    // === Getters ===
    getName() {
        return this.get('name') ?? '';
    }
    getCampaignId() {
        // Try camelCase first (Prisma), then snake_case (legacy)
        return this.get('campaignId') ?? this.get('campaign_id');
    }
    getGroupId() {
        return this.get('groupId') ?? this.get('group_id');
    }
    getType() {
        return this.get('type') ?? exports.StreamType.REGULAR;
    }
    getSchema() {
        const schema = this.get('schema');
        return schema ? schema : null;
    }
    getState() {
        const state = this.get('state');
        return state === 'active' ? state_js_1.EntityState.ACTIVE : state_js_1.EntityState.DISABLED;
    }
    getPosition() {
        return this.get('position') ?? 1;
    }
    getWeight() {
        return this.get('weight') ?? 0;
    }
    getChance() {
        return this.get('chance') ?? 0;
    }
    getActionType() {
        // Try camelCase first (Prisma), then snake_case (legacy)
        return this.get('actionType') ?? this.get('action_type');
    }
    getActionPayload() {
        return this.get('actionPayload') ?? this.get('action_payload');
    }
    getActionOptions() {
        return this.get('actionOptions') ?? this.get('action_options');
    }
    getComments() {
        return this.get('comments');
    }
    isCollectClicks() {
        const val = this.get('collectClicks') ?? this.get('collect_clicks');
        return val === true || val === 1;
    }
    isFilterOr() {
        const val = this.get('filterOr') ?? this.get('filter_or');
        return val === true || val === 1;
    }
    // === Type checks ===
    isDisabled() {
        return this.getState() === state_js_1.EntityState.DISABLED;
    }
    isActive() {
        return this.getState() === state_js_1.EntityState.ACTIVE;
    }
}
exports.BaseStream = BaseStream;
//# sourceMappingURL=base-stream.js.map