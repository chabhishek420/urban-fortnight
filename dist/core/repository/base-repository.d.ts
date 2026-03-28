/**
 * Base Repository
 *
 * Abstract base class for all repository implementations providing
 * common database operations using Prisma client.
 *
 * @see keitaro_source/application/Core/Entity/Repository/EntityRepository.php
 */
import type { PrismaClient } from '@prisma/client';
import type { EntityModelInterface, EntityFieldDefinition } from '../entity/entity-model-interface';
import type { RepositoryInterface, FindOptions } from './repository-interface';
/**
 * Entity definition for repository
 */
export interface RepositoryEntityDefinition {
    tableName: string;
    entityName: string;
    fields: Map<string, EntityFieldDefinition>;
    modelClass: new (data: Record<string, unknown>) => EntityModelInterface;
}
/**
 * Abstract base repository
 */
export declare abstract class BaseRepository<T extends EntityModelInterface> implements RepositoryInterface<T> {
    /**
     * Repository instances cache (singleton pattern)
     * @artifact ARTIFACT-001: PHP used static $_instances for singleton pattern
     */
    protected static _instances: Map<string, BaseRepository<EntityModelInterface>>;
    /**
     * Memoization cache for frequently accessed data
     */
    protected _memoized: Map<string, unknown>;
    /**
     * Get singleton instance
     * Note: This method uses a generic type parameter to allow derived classes
     * to return their own type. Derived classes should NOT override this method.
     */
    static getInstance<R extends BaseRepository<EntityModelInterface>>(this: new () => R): R;
    /**
     * Reset singleton instance
     * Note: Derived classes should NOT override this method.
     */
    static reset(): void;
    /**
     * Get entity definition
     */
    abstract getDefinition(): RepositoryEntityDefinition;
    /**
     * Get Prisma client
     */
    protected get prisma(): PrismaClient;
    /**
     * Get table name from model
     */
    getTableName(): string;
    /**
     * Get entity name from model
     */
    getEntityName(): string;
    /**
     * Get the Prisma model delegate for this repository
     */
    protected getModel(): unknown;
    /**
     * Convert table name to Prisma model name
     * e.g., 'campaigns' -> 'campaign', 'stream_offers' -> 'streamOffer'
     */
    protected tableNameToModelName(tableName: string): string;
    /**
     * Convert database row to model instance
     */
    protected toModel(data: Record<string, unknown> | null): T | null;
    /**
     * Convert array of database rows to model instances
     */
    protected toModels(data: Record<string, unknown>[]): T[];
    /**
     * Build Prisma where clause from FindOptions
     */
    protected buildWhereClause(options?: FindOptions): Record<string, unknown>;
    /**
     * Find entity by ID
     */
    find(id: number): Promise<T | null>;
    /**
     * Find all entities matching options
     */
    findAll(options?: FindOptions): Promise<T[]>;
    /**
     * Find first entity matching options
     */
    findFirst(options?: FindOptions): Promise<T | null>;
    /**
     * Find last entity matching options
     */
    findLast(options?: FindOptions): Promise<T | null>;
    /**
     * Find all entities by IDs
     */
    findAllByIds(ids: number[]): Promise<T[]>;
    /**
     * Find active entity by ID
     */
    findActive(id: number): Promise<T | null>;
    /**
     * Find all active entities
     */
    findAllActive(options?: FindOptions): Promise<T[]>;
    /**
     * Create new entity
     */
    create(data: Record<string, unknown>): Promise<T>;
    /**
     * Update existing entity
     */
    update(id: number, data: Record<string, unknown>): Promise<T>;
    /**
     * Delete entity (soft delete)
     */
    delete(id: number): Promise<boolean>;
    /**
     * Hard delete entity
     */
    hardDelete(id: number): Promise<boolean>;
    /**
     * Count entities matching options
     */
    count(options?: FindOptions): Promise<number>;
    /**
     * Count active entities
     */
    countActive(options?: FindOptions): Promise<number>;
    /**
     * Check if entity exists
     */
    exists(options?: FindOptions): Promise<boolean>;
    /**
     * Get all IDs
     */
    getAllIds(): Promise<number[]>;
    /**
     * Get entity name by ID (memoized)
     */
    getName(id: number): Promise<string | null>;
    /**
     * Find all deleted entities before date
     */
    findAllDeletedBefore(date: Date): Promise<T[]>;
    /**
     * Find all deleted entities
     */
    findAllDeleted(): Promise<T[]>;
    /**
     * Find all not deleted entities
     */
    findAllNotDeleted(options?: FindOptions): Promise<T[]>;
    /**
     * Clear memoization cache
     */
    clearMemoized(): void;
}
//# sourceMappingURL=base-repository.d.ts.map