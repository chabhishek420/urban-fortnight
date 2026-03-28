/**
 * Abstract Model Base Class
 * 
 * Base class for all domain entities providing common functionality
 * for property access, serialization, and validation.
 * 
 * @see keitaro_source/application/Core/Model/AbstractModel.php
 */

import type { EntityModelInterface, EntityFieldDefinition } from '../entity/entity-model-interface';
import { EntityState, parseState, isActive, isDisabled, isDeleted } from '../entity/state';

export abstract class AbstractModel implements EntityModelInterface {
  /**
   * Entity data storage
   */
  protected _data: Record<string, unknown> = {};

  /**
   * Entity field definitions
   * @artifact ARTIFACT-004: Original had underscore prefix, maintained convention
   */
  protected static _fields: Map<string, EntityFieldDefinition> | null = null;

  /**
   * Table name override
   */
  protected static _tableName: string;

  /**
   * Cache key for repository caching
   */
  protected static _cacheKey: string;

  /**
   * ACL key for permission checking
   */
  protected static _aclKey: string;

  /**
   * Entity name for serialization
   */
  protected static _entityName: string;

  constructor(data: Record<string, unknown> = {}) {
    this._data = { ...data };
  }

  /**
   * Get entity ID
   */
  getId(): number | undefined {
    return this._data.id as number | undefined;
  }

  /**
   * Get a property value with type safety
   */
  get<T = unknown>(key: string): T | undefined {
    return this._data[key] as T | undefined;
  }

  /**
   * Set a property value (returns this for chaining)
   */
  set(key: string, value: unknown): this {
    this._data[key] = value;
    return this;
  }

  /**
   * Get all data as a plain object
   */
  getData(): Record<string, unknown> {
    return { ...this._data };
  }

  /**
   * Check if entity is new (not persisted)
   */
  isNew(): boolean {
    return !this.getId();
  }

  /**
   * Get entity name
   */
  getEntityName(): string {
    return (this.constructor as typeof AbstractModel)._entityName ?? 'entity';
  }

  /**
   * Get table name
   */
  getTableName(): string {
    return (this.constructor as typeof AbstractModel)._tableName ?? '';
  }

  /**
   * Get state of the entity
   */
  getState(): EntityState {
    const state = this.get<string>('state');
    return state ? parseState(state) : EntityState.ACTIVE;
  }

  /**
   * Check if entity is active
   */
  isActive(): boolean {
    return isActive(this.getState());
  }

  /**
   * Check if entity is disabled
   */
  isDisabled(): boolean {
    return isDisabled(this.getState());
  }

  /**
   * Check if entity is deleted
   */
  isDeleted(): boolean {
    return isDeleted(this.getState());
  }

  /**
   * Convert to plain object for JSON serialization
   */
  toJSON(): Record<string, unknown> {
    return this.getData();
  }

  /**
   * Clone the entity
   */
  clone(): this {
    const ModelConstructor = this.constructor as new (data: Record<string, unknown>) => this;
    return new ModelConstructor(this.getData());
  }
}
