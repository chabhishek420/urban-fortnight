"use strict";
/**
 * Stream Repository
 *
 * Repository for BaseStream entity database operations.
 *
 * @see keitaro_source/application/Traffic/Repository/StreamRepository.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamRepository = void 0;
const base_repository_js_1 = require("../../core/repository/base-repository.js");
const base_stream_js_1 = require("../model/base-stream.js");
const state_js_1 = require("../../core/entity/state.js");
/**
 * Stream Repository implementation
 */
class StreamRepository extends base_repository_js_1.BaseRepository {
    /**
     * Get entity definition
     */
    getDefinition() {
        return {
            tableName: 'streams',
            entityName: 'stream',
            fields: new Map([
                ['id', { name: 'id', type: 'number', readonly: true }],
                ['name', { name: 'name', type: 'string' }],
                ['campaign_id', { name: 'campaign_id', type: 'number', nullable: true }],
                ['group_id', { name: 'group_id', type: 'number', nullable: true }],
                ['type', { name: 'type', type: 'string', default: 'regular' }],
                ['schema', { name: 'schema', type: 'string', nullable: true }],
                ['state', { name: 'state', type: 'string', default: 'active' }],
                ['position', { name: 'position', type: 'number', default: 1 }],
                ['weight', { name: 'weight', type: 'number', default: 0 }],
                ['chance', { name: 'chance', type: 'number', default: 0 }],
                ['action_type', { name: 'action_type', type: 'string', nullable: true }],
                ['action_payload', { name: 'action_payload', type: 'string', nullable: true }],
                ['action_options', { name: 'action_options', type: 'json', nullable: true }],
                ['collect_clicks', { name: 'collect_clicks', type: 'boolean', default: false }],
                ['filter_or', { name: 'filter_or', type: 'boolean', default: false }],
                ['comments', { name: 'comments', type: 'string', nullable: true }],
                ['created_at', { name: 'created_at', type: 'date' }],
                ['updated_at', { name: 'updated_at', type: 'date' }]
            ]),
            modelClass: base_stream_js_1.BaseStream
        };
    }
    /**
     * Find streams by campaign
     */
    async findByCampaignId(campaignId, options) {
        return this.findAll({
            ...options,
            where: { ...options?.where, campaignId: campaignId }
        });
    }
    /**
     * Find active streams by campaign
     */
    async findActiveByCampaignId(campaignId, options) {
        return this.findAll({
            ...options,
            where: { ...options?.where, campaignId: campaignId, state: state_js_1.EntityState.ACTIVE },
            orderBy: { position: 'asc' }
        });
    }
    /**
     * Find streams by group
     */
    async findByGroupId(groupId, options) {
        return this.findAll({
            ...options,
            where: { ...options?.where, groupId: groupId }
        });
    }
    /**
     * Find streams by type
     */
    async findByType(streamType, options) {
        return this.findAll({
            ...options,
            where: { ...options?.where, type: streamType }
        });
    }
    /**
     * Find all active streams with optional filtering
     */
    async findAllActiveStreams(options) {
        const where = { state: state_js_1.EntityState.ACTIVE };
        if (options?.campaignId) {
            where.campaignId = options.campaignId;
        }
        if (options?.groupId) {
            where.groupId = options.groupId;
        }
        if (options?.streamType) {
            where.type = options.streamType;
        }
        return this.findAll({
            ...options,
            where,
            orderBy: { position: 'asc' }
        });
    }
    /**
     * Get stream position for ordering within a campaign
     */
    async getNextPosition(campaignId) {
        const streams = await this.findAll({
            where: { campaignId: campaignId },
            orderBy: { position: 'desc' },
            limit: 1
        });
        return streams.length > 0 ? (streams[0]?.getPosition() ?? 0) + 1 : 1;
    }
    /**
     * Update stream position
     */
    async updatePosition(id, position) {
        return this.update(id, { position });
    }
    /**
     * Find streams with landings and offers schema
     */
    async findLandingsOffersStreams(campaignId) {
        return this.findActiveByCampaignId(campaignId, {
            where: { schema: 'landing_offer' }
        });
    }
    /**
     * Find streams with offers only schema
     */
    async findOffersStreams(campaignId) {
        return this.findActiveByCampaignId(campaignId, {
            where: { schema: 'offer' }
        });
    }
    /**
     * Count active streams for campaign
     */
    async countActiveByCampaign(campaignId) {
        return this.count({
            where: { campaignId: campaignId, state: state_js_1.EntityState.ACTIVE }
        });
    }
}
exports.StreamRepository = StreamRepository;
//# sourceMappingURL=stream-repository.js.map