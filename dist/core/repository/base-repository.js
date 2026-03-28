"use strict";
/**
 * Base Repository
 *
 * Abstract base class for all repository implementations providing
 * common database operations using Prisma client.
 *
 * @see keitaro_source/application/Core/Entity/Repository/EntityRepository.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const db_1 = require("../../lib/db");
const state_1 = require("../entity/state");
/**
 * Abstract base repository
 */
class BaseRepository {
    /**
     * Repository instances cache (singleton pattern)
     * @artifact ARTIFACT-001: PHP used static $_instances for singleton pattern
     */
    static _instances = new Map();
    /**
     * Memoization cache for frequently accessed data
     */
    _memoized = new Map();
    /**
     * Get singleton instance
     * Note: This method uses a generic type parameter to allow derived classes
     * to return their own type. Derived classes should NOT override this method.
     */
    static getInstance() {
        const className = this.name;
        if (!BaseRepository._instances.has(className)) {
            BaseRepository._instances.set(className, new this());
        }
        return BaseRepository._instances.get(className);
    }
    /**
     * Reset singleton instance
     * Note: Derived classes should NOT override this method.
     */
    static reset() {
        const className = this.name;
        BaseRepository._instances.delete(className);
    }
    /**
     * Get Prisma client
     */
    get prisma() {
        return db_1.db.client;
    }
    /**
     * Get table name from model
     */
    getTableName() {
        return this.getDefinition().tableName;
    }
    /**
     * Get entity name from model
     */
    getEntityName() {
        return this.getDefinition().entityName;
    }
    /**
     * Get the Prisma model delegate for this repository
     */
    getModel() {
        const tableName = this.getTableName();
        // Map table names to Prisma model names (camelCase)
        const modelName = this.tableNameToModelName(tableName);
        return this.prisma[modelName];
    }
    /**
     * Convert table name to Prisma model name
     * e.g., 'campaigns' -> 'campaign', 'stream_offers' -> 'streamOffer'
     */
    tableNameToModelName(tableName) {
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
    toModel(data) {
        if (!data)
            return null;
        const ModelClass = this.getDefinition().modelClass;
        return new ModelClass(data);
    }
    /**
     * Convert array of database rows to model instances
     */
    toModels(data) {
        return data.map(row => this.toModel(row)).filter((m) => m !== null);
    }
    /**
     * Build Prisma where clause from FindOptions
     */
    buildWhereClause(options) {
        const where = {};
        if (options?.where) {
            Object.assign(where, options.where);
        }
        return where;
    }
    /**
     * Find entity by ID
     */
    async find(id) {
        const model = this.getModel();
        const data = await model.findUnique({
            where: { id }
        });
        return this.toModel(data);
    }
    /**
     * Find all entities matching options
     */
    async findAll(options) {
        const model = this.getModel();
        const args = { where: this.buildWhereClause(options) };
        if (options?.orderBy)
            args.orderBy = options.orderBy;
        if (options?.limit)
            args.take = options.limit;
        if (options?.offset)
            args.skip = options.offset;
        const data = await model.findMany(args);
        return this.toModels(data);
    }
    /**
     * Find first entity matching options
     */
    async findFirst(options) {
        const model = this.getModel();
        const args = { where: this.buildWhereClause(options) };
        if (options?.orderBy)
            args.orderBy = options.orderBy;
        const data = await model.findFirst(args);
        return this.toModel(data);
    }
    /**
     * Find last entity matching options
     */
    async findLast(options) {
        const model = this.getModel();
        const data = await model.findFirst({
            where: this.buildWhereClause(options),
            orderBy: { id: 'desc' }
        });
        return this.toModel(data);
    }
    /**
     * Find all entities by IDs
     */
    async findAllByIds(ids) {
        if (!ids.length)
            return [];
        const model = this.getModel();
        const data = await model.findMany({
            where: { id: { in: ids } }
        });
        return this.toModels(data);
    }
    /**
     * Find active entity by ID
     */
    async findActive(id) {
        const model = this.getModel();
        const data = await model.findFirst({
            where: { id, state: state_1.EntityState.ACTIVE }
        });
        return this.toModel(data);
    }
    /**
     * Find all active entities
     */
    async findAllActive(options) {
        const model = this.getModel();
        const where = this.buildWhereClause(options);
        where.state = state_1.EntityState.ACTIVE;
        const args = { where };
        if (options?.orderBy)
            args.orderBy = options.orderBy;
        if (options?.limit)
            args.take = options.limit;
        if (options?.offset)
            args.skip = options.offset;
        const data = await model.findMany(args);
        return this.toModels(data);
    }
    /**
     * Create new entity
     */
    async create(data) {
        const model = this.getModel();
        const created = await model.create({
            data: {
                ...data,
                created_at: new Date(),
                updated_at: new Date()
            }
        });
        return this.toModel(created);
    }
    /**
     * Update existing entity
     */
    async update(id, data) {
        const model = this.getModel();
        const updated = await model.update({
            where: { id },
            data: {
                ...data,
                updated_at: new Date()
            }
        });
        return this.toModel(updated);
    }
    /**
     * Delete entity (soft delete)
     */
    async delete(id) {
        try {
            const model = this.getModel();
            await model.update({
                where: { id },
                data: {
                    state: state_1.EntityState.DELETED,
                    updated_at: new Date()
                }
            });
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Hard delete entity
     */
    async hardDelete(id) {
        try {
            const model = this.getModel();
            await model.delete({ where: { id } });
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Count entities matching options
     */
    async count(options) {
        const model = this.getModel();
        return model.count({
            where: this.buildWhereClause(options)
        });
    }
    /**
     * Count active entities
     */
    async countActive(options) {
        const where = this.buildWhereClause(options);
        where.state = state_1.EntityState.ACTIVE;
        const model = this.getModel();
        return model.count({ where });
    }
    /**
     * Check if entity exists
     */
    async exists(options) {
        const count = await this.count(options);
        return count > 0;
    }
    /**
     * Get all IDs
     */
    async getAllIds() {
        const model = this.getModel();
        const results = await model.findMany({
            select: { id: true }
        });
        return results.map(r => r.id);
    }
    /**
     * Get entity name by ID (memoized)
     */
    async getName(id) {
        if (!id)
            return null;
        const cacheKey = `${this.getTableName()}_${id}`;
        if (this._memoized.has(cacheKey)) {
            return this._memoized.get(cacheKey);
        }
        const model = this.getModel();
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
    async findAllDeletedBefore(date) {
        const model = this.getModel();
        const data = await model.findMany({
            where: {
                state: state_1.EntityState.DELETED,
                updated_at: { lt: date }
            }
        });
        return this.toModels(data);
    }
    /**
     * Find all deleted entities
     */
    async findAllDeleted() {
        const model = this.getModel();
        const data = await model.findMany({
            where: { state: state_1.EntityState.DELETED }
        });
        return this.toModels(data);
    }
    /**
     * Find all not deleted entities
     */
    async findAllNotDeleted(options) {
        const model = this.getModel();
        const where = this.buildWhereClause(options);
        where.state = { not: state_1.EntityState.DELETED };
        const args = { where };
        if (options?.orderBy)
            args.orderBy = options.orderBy;
        if (options?.limit)
            args.take = options.limit;
        if (options?.offset)
            args.skip = options.offset;
        const data = await model.findMany(args);
        return this.toModels(data);
    }
    /**
     * Clear memoization cache
     */
    clearMemoized() {
        this._memoized.clear();
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base-repository.js.map