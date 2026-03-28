"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityState = void 0;
exports.isActive = isActive;
exports.isDisabled = isDisabled;
exports.isDeleted = isDeleted;
exports.parseState = parseState;
/**
 * Entity State
 *
 * Represents the possible states of an entity in the system.
 *
 * @see keitaro_source/application/Core/Entity/State.php
 */
var EntityState;
(function (EntityState) {
    EntityState["ACTIVE"] = "active";
    EntityState["DISABLED"] = "disabled";
    EntityState["DELETED"] = "deleted";
    EntityState["PENDING"] = "pending";
    EntityState["ARCHIVED"] = "archived";
})(EntityState || (exports.EntityState = EntityState = {}));
/**
 * Check if state is active
 */
function isActive(state) {
    return state === EntityState.ACTIVE;
}
/**
 * Check if state is disabled
 */
function isDisabled(state) {
    return state === EntityState.DISABLED;
}
/**
 * Check if state is deleted
 */
function isDeleted(state) {
    return state === EntityState.DELETED;
}
/**
 * Parse state from string
 */
function parseState(value) {
    const normalized = value.toLowerCase();
    switch (normalized) {
        case 'active':
        case 'enabled':
        case '1':
            return EntityState.ACTIVE;
        case 'disabled':
        case '0':
            return EntityState.DISABLED;
        case 'deleted':
            return EntityState.DELETED;
        case 'pending':
            return EntityState.PENDING;
        case 'archived':
            return EntityState.ARCHIVED;
        default:
            return EntityState.ACTIVE;
    }
}
//# sourceMappingURL=state.js.map