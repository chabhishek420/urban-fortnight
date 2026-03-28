/**
 * Entity Model Interface
 * 
 * Base interface for all domain entities in the system.
 * Provides a consistent API for getting/setting entity properties.
 * 
 * @see keitaro_source/application/Core/Entity/Model/EntityModelInterface.php
 */
export interface EntityModelInterface {
  /**
   * Get entity ID
   */
  getId(): number | undefined;

  /**
   * Get a property value
   */
  get<T = unknown>(key: string): T | undefined;

  /**
   * Set a property value
   */
  set(key: string, value: unknown): this;

  /**
   * Get all data as an object
   */
  getData(): Record<string, unknown>;

  /**
   * Check if entity is new (not persisted)
   */
  isNew(): boolean;

  /**
   * Get entity name (e.g., 'campaign', 'offer')
   */
  getEntityName(): string;

  /**
   * Get table name for database operations
   */
  getTableName(): string;
}

/**
 * Entity field definition
 */
export interface EntityFieldDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'json' | 'decimal';
  nullable?: boolean;
  default?: unknown;
  readonly?: boolean;
}

/**
 * Entity definition interface
 */
export interface EntityDefinition {
  fields: Map<string, EntityFieldDefinition>;
  tableName: string;
  entityName: string;
  cacheKey?: string;
  aclKey?: string;
}
