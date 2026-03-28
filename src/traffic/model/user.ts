/**
 * User Model
 * 
 * @see keitaro_source/application/Traffic/Model/User.php
 */
import { AbstractModel } from '../../core/model/abstract-model';

export type UserType = 'ADMIN' | 'USER';

export class User extends AbstractModel {
  protected static _tableName = 'users';
  protected static _cacheKey = 'USERS';
  protected static _aclKey = 'users';
  protected static _entityName = 'user';

  getType(): UserType {
    return (this.get<string>('type') as UserType) ?? 'USER';
  }

  getLogin(): string {
    return this.get<string>('login') ?? '';
  }

  getPasswordHash(): string | undefined {
    return this.get<string>('password_hash');
  }

  getRules(): Record<string, unknown> | undefined {
    const rules = this.get<string>('rules');
    try {
      return rules ? JSON.parse(rules) : undefined;
    } catch {
      return undefined;
    }
  }

  getPermissions(): string | undefined {
    return this.get<string>('permissions');
  }

  isAdmin(): boolean {
    return this.getType() === 'ADMIN';
  }

  isUser(): boolean {
    return this.getType() === 'USER';
  }

  hasPermission(permission: string): boolean {
    const permissions = this.getPermissions();
    if (!permissions) return false;
    return permissions.includes(permission);
  }

  /**
   * Check if user has access to a specific resource
   */
  hasAccess(resource: string, action: string = 'read'): boolean {
    if (this.isAdmin()) return true;
    
    const rules = this.getRules();
    if (!rules) return false;

    // Check rules for resource access
    const resourceRules = rules[resource as keyof typeof rules];
    if (!resourceRules) return false;

    return (resourceRules as Record<string, boolean>)[action] === true || resourceRules === true;
  }
}
