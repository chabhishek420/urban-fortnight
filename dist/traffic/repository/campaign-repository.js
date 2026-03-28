"use strict";
/**
 * Campaign Repository
 *
 * Repository for Campaign entity database operations.
 *
 * @see keitaro_source/application/Traffic/Repository/CampaignRepository.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignRepository = void 0;
const base_repository_js_1 = require("../../core/repository/base-repository.js");
const campaign_js_1 = require("../model/campaign.js");
const state_js_1 = require("../../core/entity/state.js");
/**
 * Campaign Repository implementation
 */
class CampaignRepository extends base_repository_js_1.BaseRepository {
    /**
     * Get entity definition
     */
    getDefinition() {
        return {
            tableName: 'campaigns',
            entityName: 'campaign',
            fields: new Map([
                ['id', { name: 'id', type: 'number', readonly: true }],
                ['name', { name: 'name', type: 'string' }],
                ['alias', { name: 'alias', type: 'string', nullable: true }],
                ['token', { name: 'token', type: 'string', nullable: true }],
                ['type', { name: 'type', type: 'string', default: 'position' }],
                ['mode', { name: 'mode', type: 'string', default: 'general' }],
                ['state', { name: 'state', type: 'string', default: 'active' }],
                ['position', { name: 'position', type: 'number', default: 0 }],
                ['group_id', { name: 'group_id', type: 'number', nullable: true }],
                ['cookies_ttl', { name: 'cookies_ttl', type: 'number', default: 24 }],
                ['uniqueness_method', { name: 'uniqueness_method', type: 'string', default: 'ip_ua' }],
                ['action_type', { name: 'action_type', type: 'string', nullable: true }],
                ['action_payload', { name: 'action_payload', type: 'string', nullable: true }],
                ['cost_type', { name: 'cost_type', type: 'string', default: 'CPV' }],
                ['cost_value', { name: 'cost_value', type: 'decimal', default: 0 }],
                ['cost_currency', { name: 'cost_currency', type: 'string', nullable: true }],
                ['traffic_source_id', { name: 'traffic_source_id', type: 'number', nullable: true }],
                ['domain_id', { name: 'domain_id', type: 'number', nullable: true }],
                ['parameters', { name: 'parameters', type: 'json', nullable: true }],
                ['traffic_loss', { name: 'traffic_loss', type: 'number', default: 0 }],
                ['notes', { name: 'notes', type: 'string', nullable: true }],
                ['created_at', { name: 'created_at', type: 'date' }],
                ['updated_at', { name: 'updated_at', type: 'date' }]
            ]),
            modelClass: campaign_js_1.Campaign
        };
    }
    /**
     * Find campaign by token
     */
    async findByToken(token) {
        return this.findFirst({
            where: { token }
        });
    }
    /**
     * Find campaign by alias
     */
    async findByAlias(alias) {
        return this.findFirst({
            where: { alias }
        });
    }
    /**
     * Find active campaign by token
     */
    async findActiveByToken(token) {
        return this.findFirst({
            where: { token, state: state_js_1.EntityState.ACTIVE }
        });
    }
    /**
     * Find active campaign by alias
     */
    async findActiveByAlias(alias) {
        return this.findFirst({
            where: { alias, state: state_js_1.EntityState.ACTIVE }
        });
    }
    /**
     * Find campaigns by traffic source
     */
    async findByTrafficSourceId(trafficSourceId, options) {
        return this.findAll({
            ...options,
            where: { ...options?.where, traffic_source_id: trafficSourceId }
        });
    }
    /**
     * Find campaigns by domain
     */
    async findByDomainId(domainId, options) {
        return this.findAll({
            ...options,
            where: { ...options?.where, domain_id: domainId }
        });
    }
    /**
     * Find campaigns by group
     */
    async findByGroupId(groupId, options) {
        return this.findAll({
            ...options,
            where: { ...options?.where, group_id: groupId }
        });
    }
    /**
     * Find all active campaigns with optional filtering
     */
    async findAllActiveCampaigns(options) {
        const where = { state: state_js_1.EntityState.ACTIVE };
        if (options?.trafficSourceId) {
            where.traffic_source_id = options.trafficSourceId;
        }
        if (options?.domainId) {
            where.domain_id = options.domainId;
        }
        if (options?.groupId) {
            where.group_id = options.groupId;
        }
        return this.findAll({
            ...options,
            where
        });
    }
    /**
     * Get campaign position for ordering
     */
    async getNextPosition() {
        const campaigns = await this.findAll({
            orderBy: { position: 'desc' },
            limit: 1
        });
        return campaigns.length > 0 ? (campaigns[0]?.getPosition() ?? 0) + 1 : 1;
    }
    /**
     * Update campaign position
     */
    async updatePosition(id, position) {
        return this.update(id, { position });
    }
}
exports.CampaignRepository = CampaignRepository;
//# sourceMappingURL=campaign-repository.js.map