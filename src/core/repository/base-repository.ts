/**
 * Base Repository
 * 
 * Abstract base class for all repository implementations providing
 * common database operations using Prisma client.
 * 
 * @see keitaro_source/application/Core/Entity/Repository/EntityRepository.php
 */

import type { PrismaClient } from '@prisma/client';
import { db } from '../../lib/db';
import type { EntityModelInterface, EntityFieldDefinition } from '../entity/entity-model-interface';
import { EntityState } from '../entity/state';
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
export abstract class BaseRepository<T extends EntityModelInterface> implements RepositoryInterface<T> {
  /**
   * Repository instances cache (singleton pattern)
   * @artifact ARTIFACT-001: PHP used static $_instances for singleton pattern
   */
  protected static _instances: Map<string, BaseRepository<EntityModelInterface>> = new Map();

  /**
   * Memoization cache for frequently accessed data
   */
  protected _memoized: Map<string, unknown> = new Map();

  /**
   * Get singleton instance
   * Note: This method uses a generic type parameter to allow derived classes
   * to return their own type. Derived classes should NOT override this method.
   */
  static getInstance<R extends BaseRepository<EntityModelInterface>>(this: new () => R): R {
    const className = this.name;
    if (!BaseRepository._instances.has(className)) {
      BaseRepository._instances.set(className, new this());
    }
    return BaseRepository._instances.get(className) as R;
  }

  /**
   * Reset singleton instance
   * Note: Derived classes should NOT override this method.
   */
  static reset(): void {
    const className = this.name;
    BaseRepository._instances.delete(className);
  }

  /**
   * Get entity definition
   */
  abstract getDefinition(): RepositoryEntityDefinition;

  /**
   * Get Prisma client
   */
  protected get prisma(): PrismaClient {
    return db.client;
  }

  /**
   * Get table name from model
   */
  getTableName(): string {
    return this.getDefinition().tableName;
  }

  /**
   * Get entity name from model
   */
  getEntityName(): string {
    return this.getDefinition().entityName;
  }

  /**
   * Get the Prisma model delegate for this repository
   */
  protected getModel(): unknown {
    const tableName = this.getTableName();
    // Map table names to Prisma model names (camelCase)
    const modelName = this.tableNameToModelName(tableName);
    return (this.prisma as unknown as Record<string, unknown>)[modelName];
  }

  /**
   * Convert table name to Prisma model name
   * e.g., 'campaigns' -> 'campaign', 'stream_offers' -> 'streamOffer'
   */
  protected tableNameToModelName(tableName: string): string {
    // Remove trailing 's' if present, then convert to camelCase
    const singular = tableName.replace(/s$/, '');
    const parts = singular.split('_');
    if (parts.length === 1) {
      return parts[0] ?? '';
    }
    return (parts[0] ?? '') + parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  }

  /**
   * Convert database row to model instance
   */
  protected toModel(data: Record<string, unknown> | null): T | null {
    if (!data) return null;
    const ModelClass = this.getDefinition().modelClass;
    return new ModelClass(data) as T;
  }

  /**
   * Convert array of database rows to model instances
   */
  protected toModels(data: Record<string, unknown>[]): T[] {
    return data.map(row => this.toModel(row)).filter((m): m is T => m !== null);
  }

  /**
   * Build Prisma where clause from FindOptions
   */
  protected buildWhereClause(options?: FindOptions): Record<string, unknown> {
    const where: Record<string, unknown> = {};
    
    if (options?.where) {
      Object.assign(where, options.where);
    }
    
    return where;
  }

  /**
   * Find entity by ID
   */
  async find(id: number): Promise<T | null> {
    const model = this.getModel() as { findUnique: (args: { where: { id: number } }) => Promise<Record<string, unknown> | null> };
    const data = await model.findUnique({
      where: { id }
    });
    return this.toModel(data);
  }

  /**
   * Find all entities matching options
   */
  async findAll(options?: FindOptions): Promise<T[]> {
    const model = this.getModel() as { 
      findMany: (args: { 
        where?: Record<string, unknown>; 
        orderBy?: Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>;
        take?: number;
        skip?: number;
      }) => Promise<Record<string, unknown>[]>;
    };
    const args: {
      where: Record<string, unknown>;
      orderBy?: Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>;
      take?: number;
      skip?: number;
    } = { where: this.buildWhereClause(options) };
    
    if (options?.orderBy) args.orderBy = options.orderBy;
    if (options?.limit) args.take = options.limit;
    if (options?.offset) args.skip = options.offset;
    
    const data = await model.findMany(args);
    return this.toModels(data);
  }

  /**
   * Find first entity matching options
   */
  async findFirst(options?: FindOptions): Promise<T | null> {
    const model = this.getModel() as { 
      findFirst: (args: { 
        where?: Record<string, unknown>; 
        orderBy?: Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>;
      }) => Promise<Record<string, unknown> | null>;
    };
    const args: {
      where: Record<string, unknown>;
      orderBy?: Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>;
    } = { where: this.buildWhereClause(options) };
    
    if (options?.orderBy) args.orderBy = options.orderBy;
    
    const data = await model.findFirst(args);
    return this.toModel(data);
  }

  /**
   * Find last entity matching options
   */
  async findLast(options?: FindOptions): Promise<T | null> {
    const model = this.getModel() as { 
      findFirst: (args: { 
        where?: Record<string, unknown>; 
        orderBy: Record<string, 'asc' | 'desc'>;
      }) => Promise<Record<string, unknown> | null>;
    };
    const data = await model.findFirst({
      where: this.buildWhereClause(options),
      orderBy: { id: 'desc' }
    });
    return this.toModel(data);
  }

  /**
   * Find all entities by IDs
   */
  async findAllByIds(ids: number[]): Promise<T[]> {
    if (!ids.length) return [];
    const model = this.getModel() as { 
      findMany: (args: { where: { id: { in: number[] } } }) => Promise<Record<string, unknown>[]>;
    };
    const data = await model.findMany({
      where: { id: { in: ids } }
    });
    return this.toModels(data);
  }

  /**
   * Find active entity by ID
   */
  async findActive(id: number): Promise<T | null> {
    const model = this.getModel() as { 
      findFirst: (args: { 
        where: { id: number; state: string };
      }) => Promise<Record<string, unknown> | null>;
    };
    const data = await model.findFirst({
      where: { id, state: EntityState.ACTIVE }
    });
    return this.toModel(data);
  }

  /**
   * Find all active entities
   */
  async findAllActive(options?: FindOptions): Promise<T[]> {
    const model = this.getModel() as { 
      findMany: (args: { 
        where: Record<string, unknown>; 
        orderBy?: Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>;
        take?: number;
        skip?: number;
      }) => Promise<Record<string, unknown>[]>;
    };
    const where = this.buildWhereClause(options);
    where.state = EntityState.ACTIVE;
    
    const args: {
      where: Record<string, unknown>;
      orderBy?: Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>;
      take?: number;
      skip?: number;
    } = { where };
    
    if (options?.orderBy) args.orderBy = options.orderBy;
    if (options?.limit) args.take = options.limit;
    if (options?.offset) args.skip = options.offset;
    
    const data = await model.findMany(args);
    return this.toModels(data);
  }

  /**
   * Create new entity
   */
  async create(data: Record<string, unknown>): Promise<T> {
    const model = this.getModel() as { 
      create: (args: { data: Record<string, unknown> }) => Promise<Record<string, unknown>>;
    };
    const created = await model.create({
      data: {
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
    return this.toModel(created)!;
  }

  /**
   * Update existing entity
   */
  async update(id: number, data: Record<string, unknown>): Promise<T> {
    const model = this.getModel() as { 
      update: (args: { where: { id: number }; data: Record<string, unknown> }) => Promise<Record<string, unknown>>;
    };
    const updated = await model.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date()
      }
    });
    return this.toModel(updated)!;
  }

  /**
   * Delete entity (soft delete)
   */
  async delete(id: number): Promise<boolean> {
    try {
      const model = this.getModel() as { 
        update: (args: { where: { id: number }; data: Record<string, unknown> }) => Promise<unknown>;
      };
      await model.update({
        where: { id },
        data: {
          state: EntityState.DELETED,
          updated_at: new Date()
        }
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Hard delete entity
   */
  async hardDelete(id: number): Promise<boolean> {
    try {
      const model = this.getModel() as { 
        delete: (args: { where: { id: number } }) => Promise<unknown>;
      };
      await model.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Count entities matching options
   */
  async count(options?: FindOptions): Promise<number> {
    const model = this.getModel() as { 
      count: (args: { where?: Record<string, unknown> }) => Promise<number>;
    };
    return model.count({
      where: this.buildWhereClause(options)
    });
  }

  /**
   * Count active entities
   */
  async countActive(options?: FindOptions): Promise<number> {
    const where = this.buildWhereClause(options);
    where.state = EntityState.ACTIVE;
    
    const model = this.getModel() as { 
      count: (args: { where: Record<string, unknown> }) => Promise<number>;
    };
    return model.count({ where });
  }

  /**
   * Check if entity exists
   */
  async exists(options?: FindOptions): Promise<boolean> {
    const count = await this.count(options);
    return count > 0;
  }

  /**
   * Get all IDs
   */
  async getAllIds(): Promise<number[]> {
    const model = this.getModel() as { 
      findMany: (args: { select: { id: boolean } }) => Promise<Array<{ id: number }>>;
    };
    const results = await model.findMany({
      select: { id: true }
    });
    return results.map(r => r.id);
  }

  /**
   * Get entity name by ID (memoized)
   */
  async getName(id: number): Promise<string | null> {
    if (!id) return null;
    
    const cacheKey = `${this.getTableName()}_${id}`;
    if (this._memoized.has(cacheKey)) {
      return this._memoized.get(cacheKey) as string;
    }

    const model = this.getModel() as { 
      findUnique: (args: { where: { id: number }; select: { name: boolean } }) => Promise<{ name: string } | null>;
    };
    const result = await model.findUnique({
      where: { id },
      select: { name: true }
    });

    const name = result?.name ?? null;
    if (name) {
      this._memoized.set(cacheKey, name);
    }
    return name;
  }

  /**
   * Find all deleted entities before date
   */
  async findAllDeletedBefore(date: Date): Promise<T[]> {
    const model = this.getModel() as { 
      findMany: (args: { 
        where: { state: string; updated_at: { lt: Date } };
      }) => Promise<Record<string, unknown>[]>;
    };
    const data = await model.findMany({
      where: {
        state: EntityState.DELETED,
        updated_at: { lt: date }
      }
    });
    return this.toModels(data);
  }

  /**
   * Find all deleted entities
   */
  async findAllDeleted(): Promise<T[]> {
    const model = this.getModel() as { 
      findMany: (args: { where: { state: string } }) => Promise<Record<string, unknown>[]>;
    };
    const data = await model.findMany({
      where: { state: EntityState.DELETED }
    });
    return this.toModels(data);
  }

  /**
   * Find all not deleted entities
   */
  async findAllNotDeleted(options?: FindOptions): Promise<T[]> {
    const model = this.getModel() as { 
      findMany: (args: { 
        where: Record<string, unknown>; 
        orderBy?: Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>;
        take?: number;
        skip?: number;
      }) => Promise<Record<string, unknown>[]>;
    };
    const where = this.buildWhereClause(options);
    where.state = { not: EntityState.DELETED };
    
    const args: {
      where: Record<string, unknown>;
      orderBy?: Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>;
      take?: number;
      skip?: number;
    } = { where };
    
    if (options?.orderBy) args.orderBy = options.orderBy;
    if (options?.limit) args.take = options.limit;
    if (options?.offset) args.skip = options.offset;
    
    const data = await model.findMany(args);
    return this.toModels(data);
  }

  /**
   * Clear memoization cache
   */
  clearMemoized(): void {
    this._memoized.clear();
  }
}
