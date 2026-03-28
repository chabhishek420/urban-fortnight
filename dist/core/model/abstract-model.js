"use strict";
/**
 * Abstract Model Base Class
 *
 * Base class for all domain entities providing common functionality
 * for property access, serialization, and validation.
 *
 * @see keitaro_source/application/Core/Model/AbstractModel.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractModel = void 0;
const state_1 = require("../entity/state");
class AbstractModel {
    /**
     * Entity data storage
     */
    _data = {};
    /**
     * Entity field definitions
     * @artifact ARTIFACT-004: Original had underscore prefix, maintained convention
     */
    static _fields = null;
    /**
     * Table name override
     */
    static _tableName;
    /**
     * Cache key for repository caching
     */
    static _cacheKey;
    /**
     * ACL key for permission checking
     */
    static _aclKey;
    /**
     * Entity name for serialization
     */
    static _entityName;
    constructor(data = {}) {
        this._data = { ...data };
    }
    /**
     * Get entity ID
     */
    getId() {
        return this._data.id;
    }
    /**
     * Get a property value with type safety
     */
    get(key) {
        return this._data[key];
    }
    /**
     * Set a property value (returns this for chaining)
     */
    set(key, value) {
        this._data[key] = value;
        return this;
    }
    /**
     * Get all data as a plain object
     */
    getData() {
        return { ...this._data };
    }
    /**
     * Check if entity is new (not persisted)
     */
    isNew() {
        return !this.getId();
    }
    /**
     * Get entity name
     */
    getEntityName() {
        return this.constructor._entityName ?? 'entity';
    }
    /**
     * Get table name
     */
    getTableName() {
        return this.constructor._tableName ?? '';
    }
    /**
     * Get state of the entity
     */
    getState() {
        const state = this.get('state');
        return state ? (0, state_1.parseState)(state) : state_1.EntityState.ACTIVE;
    }
    /**
     * Check if entity is active
     */
    isActive() {
        return (0, state_1.isActive)(this.getState());
    }
    /**
     * Check if entity is disabled
     */
    isDisabled() {
        return (0, state_1.isDisabled)(this.getState());
    }
    /**
     * Check if entity is deleted
     */
    isDeleted() {
        return (0, state_1.isDeleted)(this.getState());
    }
    /**
     * Convert to plain object for JSON serialization
     */
    toJSON() {
        return this.getData();
    }
    /**
     * Clone the entity
     */
    clone() {
        const ModelConstructor = this.constructor;
        return new ModelConstructor(this.getData());
    }
}
exports.AbstractModel = AbstractModel;
//# sourceMappingURL=abstract-model.js.map