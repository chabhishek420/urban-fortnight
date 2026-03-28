/**
 * Repository Interface
 * 
 * Base interface for all repository implementations providing
 * a consistent API for data access operations.
 * 
 * @see keitaro_source/application/Core/Entity/Repository/EntityRepository.php
 */

import type { EntityModelInterface } from '../entity/entity-model-interface';

/**
 * Find options for query operations
 */
export interface FindOptions {
  where?: Record<string, unknown>;
  orderBy?: Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>;
  limit?: number;
  offset?: number;
  select?: string[];
  include?: string[];
}

/**
 * Pagination result wrapper
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Repository interface for CRUD operations
 */
export interface RepositoryInterface<T extends EntityModelInterface> {
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
   * Count entities matching options
   */
  count(options?: FindOptions): Promise<number>;

  /**
   * Check if entity exists
   */
  exists(options?: FindOptions): Promise<boolean>;

  /**
   * Get entity name
   */
  getEntityName(): string;

  /**
   * Get table name
   */
  getTableName(): string;
}

/**
 * Cached repository interface extending base repository
 */
export interface CachedRepositoryInterface<T extends EntityModelInterface> extends RepositoryInterface<T> {
  /**
   * Find entity from cache by ID
   */
  findCached(id: number): Promise<T | null>;

  /**
   * Clear cache for entity
   */
  clearCache(id: number): Promise<void>;

  /**
   * Clear all cache
   */
  clearAllCache(): Promise<void>;

  /**
   * Warm up cache
   */
  warmupCache(): Promise<void>;
}
