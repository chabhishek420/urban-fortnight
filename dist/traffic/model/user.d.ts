/**
 * User Model
 *
 * @see keitaro_source/application/Traffic/Model/User.php
 */
import { AbstractModel } from '../../core/model/abstract-model.js';
export type UserType = 'ADMIN' | 'USER';
export declare class User extends AbstractModel {
    protected static _tableName: string;
    protected static _cacheKey: string;
    protected static _aclKey: string;
    protected static _entityName: string;
    getType(): UserType;
    getLogin(): string;
    getPasswordHash(): string | undefined;
    getRules(): Record<string, unknown> | undefined;
    getPermissions(): string | undefined;
    isAdmin(): boolean;
    isUser(): boolean;
    hasPermission(permission: string): boolean;
    /**
     * Check if user has access to a specific resource
     */
    hasAccess(resource: string, action?: string): boolean;
}
//# sourceMappingURL=user.d.ts.map