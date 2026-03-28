"use strict";
/**
 * Landing Repository
 *
 * Repository for Landing entity database operations.
 *
 * @see keitaro_source/application/Traffic/Repository/LandingRepository.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingRepository = void 0;
const base_repository_js_1 = require("../../core/repository/base-repository.js");
const landing_js_1 = require("../model/landing.js");
const state_js_1 = require("../../core/entity/state.js");
/**
 * Landing Repository implementation
 */
class LandingRepository extends base_repository_js_1.BaseRepository {
    /**
     * Get entity definition
     */
    getDefinition() {
        return {
            tableName: 'landings',
            entityName: 'landing',
            fields: new Map([
                ['id', { name: 'id', type: 'number', readonly: true }],
                ['name', { name: 'name', type: 'string' }],
                ['url', { name: 'url', type: 'string', nullable: true }],
                ['group_id', { name: 'group_id', type: 'number', nullable: true }],
                ['landing_type', { name: 'landing_type', type: 'string', default: 'external' }],
                ['state', { name: 'state', type: 'string', default: 'active' }],
                ['action_type', { name: 'action_type', type: 'string', nullable: true }],
                ['action_payload', { name: 'action_payload', type: 'string', nullable: true }],
                ['action_options', { name: 'action_options', type: 'json', nullable: true }],
                ['offer_count', { name: 'offer_count', type: 'number', default: 1 }],
                ['notes', { name: 'notes', type: 'string', nullable: true }],
                ['created_at', { name: 'created_at', type: 'date' }],
                ['updated_at', { name: 'updated_at', type: 'date' }]
            ]),
            modelClass: landing_js_1.Landing
        };
    }
    /**
     * Find landings by group
     */
    async findByGroupId(groupId, options) {
        return this.findAll({
            ...options,
            where: { ...options?.where, group_id: groupId }
        });
    }
    /**
     * Find landings by type
     */
    async findByType(landingType, options) {
        return this.findAll({
            ...options,
            where: { ...options?.where, landing_type: landingType }
        });
    }
    /**
     * Find all active landings with optional filtering
     */
    async findAllActiveLandings(options) {
        const where = { state: state_js_1.EntityState.ACTIVE };
        if (options?.groupId) {
            where.group_id = options.groupId;
        }
        if (options?.landingType) {
            where.landing_type = options.landingType;
        }
        return this.findAll({
            ...options,
            where
        });
    }
    /**
     * Find external landings
     */
    async findExternalLandings(options) {
        return this.findByType('external', options);
    }
    /**
     * Find local landings
     */
    async findLocalLandings(options) {
        return this.findByType('local', options);
    }
    /**
     * Get landing URLs as a map
     */
    async getLandingUrls() {
        const landings = await this.findAllActive();
        const urlMap = new Map();
        for (const landing of landings) {
            const id = landing.getId();
            const url = landing.getUrl();
            if (id && url) {
                urlMap.set(id, url);
            }
        }
        return urlMap;
    }
}
exports.LandingRepository = LandingRepository;
//# sourceMappingURL=landing-repository.js.map