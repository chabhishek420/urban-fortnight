"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
/**
 * User Model
 *
 * @see keitaro_source/application/Traffic/Model/User.php
 */
const abstract_model_js_1 = require("../../core/model/abstract-model.js");
class User extends abstract_model_js_1.AbstractModel {
    static _tableName = 'users';
    static _cacheKey = 'USERS';
    static _aclKey = 'users';
    static _entityName = 'user';
    getType() {
        return this.get('type') ?? 'USER';
    }
    getLogin() {
        return this.get('login') ?? '';
    }
    getPasswordHash() {
        return this.get('password_hash');
    }
    getRules() {
        const rules = this.get('rules');
        try {
            return rules ? JSON.parse(rules) : undefined;
        }
        catch {
            return undefined;
        }
    }
    getPermissions() {
        return this.get('permissions');
    }
    isAdmin() {
        return this.getType() === 'ADMIN';
    }
    isUser() {
        return this.getType() === 'USER';
    }
    hasPermission(permission) {
        const permissions = this.getPermissions();
        if (!permissions)
            return false;
        return permissions.includes(permission);
    }
    /**
     * Check if user has access to a specific resource
     */
    hasAccess(resource, action = 'read') {
        if (this.isAdmin())
            return true;
        const rules = this.getRules();
        if (!rules)
            return false;
        // Check rules for resource access
        const resourceRules = rules[resource];
        if (!resourceRules)
            return false;
        return resourceRules[action] === true || resourceRules === true;
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map