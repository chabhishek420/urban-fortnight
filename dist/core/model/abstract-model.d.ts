/**
 * Abstract Model Base Class
 *
 * Base class for all domain entities providing common functionality
 * for property access, serialization, and validation.
 *
 * @see keitaro_source/application/Core/Model/AbstractModel.php
 */
import type { EntityModelInterface, EntityFieldDefinition } from '../entity/entity-model-interface';
import { EntityState } from '../entity/state';
export declare abstract class AbstractModel implements EntityModelInterface {
    /**
     * Entity data storage
     */
    protected _data: Record<string, unknown>;
    /**
     * Entity field definitions
     * @artifact ARTIFACT-004: Original had underscore prefix, maintained convention
     */
    protected static _fields: Map<string, EntityFieldDefinition> | null;
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
    constructor(data?: Record<string, unknown>);
    /**
     * Get entity ID
     */
    getId(): number | undefined;
    /**
     * Get a property value with type safety
     */
    get<T = unknown>(key: string): T | undefined;
    /**
     * Set a property value (returns this for chaining)
     */
    set(key: string, value: unknown): this;
    /**
     * Get all data as a plain object
     */
    getData(): Record<string, unknown>;
    /**
     * Check if entity is new (not persisted)
     */
    isNew(): boolean;
    /**
     * Get entity name
     */
    getEntityName(): string;
    /**
     * Get table name
     */
    getTableName(): string;
    /**
     * Get state of the entity
     */
    getState(): EntityState;
    /**
     * Check if entity is active
     */
    isActive(): boolean;
    /**
     * Check if entity is disabled
     */
    isDisabled(): boolean;
    /**
     * Check if entity is deleted
     */
    isDeleted(): boolean;
    /**
     * Convert to plain object for JSON serialization
     */
    toJSON(): Record<string, unknown>;
    /**
     * Clone the entity
     */
    clone(): this;
}
//# sourceMappingURL=abstract-model.d.ts.map