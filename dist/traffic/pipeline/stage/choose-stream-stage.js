"use strict";
/**
 * Choose Stream Stage
 *
 * Selects a stream from the campaign based on rotation rules.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/ChooseStreamStage.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChooseStreamStage = void 0;
const stage_interface_1 = require("../../../core/pipeline/stage-interface");
const response_1 = require("../../response/response");
const status_code_1 = require("../../response/status-code");
const base_stream_1 = require("../../model/base-stream");
const campaign_1 = require("../../model/campaign");
const cached_stream_repository_1 = require("../../repository/cached-stream-repository");
/**
 * Choose Stream Stage
 */
class ChooseStreamStage {
    static NO_STREAM_SELECTED = 'No stream selected';
    static SHOW_TEXT = 'show_text';
    static DO_NOTHING = 'do_nothing';
    _streamRepository;
    constructor() {
        this._streamRepository = cached_stream_repository_1.CachedStreamRepository.getInstance();
    }
    /**
     * Process the pipeline payload
     */
    async process(payload, logEntry) {
        const campaign = payload.getCampaign();
        const rawClick = payload.getRawClick();
        const serverRequest = payload.getServerRequest();
        const response = payload.getResponse();
        if (!response) {
            throw new stage_interface_1.StageException('response is not set', 'ChooseStreamStage');
        }
        if (!serverRequest) {
            throw new stage_interface_1.StageException('server_request is not defined', 'ChooseStreamStage');
        }
        if (!campaign) {
            throw new stage_interface_1.StageException('campaign is not defined', 'ChooseStreamStage');
        }
        if (!rawClick) {
            throw new stage_interface_1.StageException('rawClick is not defined', 'ChooseStreamStage');
        }
        // Check for forced stream
        const forcedStreamId = payload.getForcedStreamId();
        let stream = null;
        if (forcedStreamId) {
            logEntry.add(`Loading stream #${forcedStreamId}`);
            stream = await this._findStreamById(forcedStreamId);
            if (!stream) {
                return this._triggerNotFound(payload, logEntry);
            }
        }
        // Get all active streams for campaign
        const groupedStreams = await this._getActiveStreams(campaign);
        logEntry.add(`Found ${groupedStreams.length} streams for campaign`);
        // Try forced streams first
        if (!stream || stream.isDisabled()) {
            logEntry.add(`Processing campaign ${campaign.getId()}`);
            const forcedStreams = groupedStreams.filter(s => s.getType() === base_stream_1.StreamType.REGULAR && s.getChance() > 0);
            stream = this._chooseByPosition(serverRequest, forcedStreams);
        }
        // Try regular streams
        if (!stream || stream.isDisabled()) {
            const regularStreams = groupedStreams.filter(s => s.getType() === base_stream_1.StreamType.REGULAR);
            if (campaign.getType() === campaign_1.CampaignType.POSITION) {
                stream = this._chooseByPosition(serverRequest, regularStreams);
            }
            else {
                stream = this._chooseByWeight(serverRequest, regularStreams, rawClick);
                // Enable cookie binding for weight-based campaigns
                if (stream && campaign.isBindVisitorsEnabled()) {
                    payload.enableCookieBindStream();
                }
            }
        }
        // Try default streams
        if (!stream || stream.isDisabled()) {
            const defaultStreams = groupedStreams.filter(s => s.getType() === base_stream_1.StreamType.DEFAULT);
            stream = defaultStreams[0] ?? null;
        }
        // Set stream or default action
        if (stream && !stream.isDisabled()) {
            if (stream.getType() === base_stream_1.StreamType.DEFAULT) {
                logEntry.add(`Chosen default stream #${stream.getId()}`);
            }
            else {
                logEntry.add(`Chosen stream #${stream.getId()}: ${stream.getName()}`);
            }
            payload.setStream(stream);
            rawClick.setStreamId(stream.getId());
            // Set action for non-landing/offer schemas
            const schema = stream.getSchema();
            if (schema !== base_stream_1.StreamSchema.LANDING_OFFER && schema !== base_stream_1.StreamSchema.OFFER) {
                const actionType = stream.getActionType();
                const actionPayload = stream.getActionPayload();
                logEntry.add(`Setting action: ${actionType} -> ${actionPayload?.substring(0, 50)}...`);
                payload.setActionType(actionType ?? null);
                payload.setActionPayload(actionPayload);
                payload.setActionOptions(stream.getActionOptions() ?? null);
            }
        }
        else {
            logEntry.add('No stream selected, setting do_nothing');
            this._setNoDirection(payload);
        }
        return payload;
    }
    /**
     * Set no direction action
     */
    _setNoDirection(payload) {
        payload.setActionType(ChooseStreamStage.DO_NOTHING);
    }
    /**
     * Trigger 404 not found
     */
    _triggerNotFound(payload, logger) {
        const response = payload.getResponse() ?? new response_1.Response();
        response.withStatus(status_code_1.StatusCode.NOT_FOUND).withBody('Forced stream not found');
        logger.add('Forced stream not found. Shows 404 NotFound');
        payload.setResponse(response);
        payload.abort();
        return payload;
    }
    /**
     * Choose stream by position
     */
    _chooseByPosition(_request, streams) {
        if (streams.length === 0)
            return null;
        if (streams.length === 1)
            return streams[0] ?? null;
        // Use position-based selection
        const position = Math.floor(Math.random() * streams.length);
        return streams[position] ?? null;
    }
    /**
     * Choose stream by weight
     */
    _chooseByWeight(_request, streams, _click) {
        if (streams.length === 0)
            return null;
        if (streams.length === 1)
            return streams[0] ?? null;
        // Calculate total weight
        const totalWeight = streams.reduce((sum, s) => sum + s.getWeight(), 0);
        if (totalWeight === 0)
            return streams[0] ?? null;
        // Weighted random selection
        let random = Math.random() * totalWeight;
        for (const stream of streams) {
            random -= stream.getWeight();
            if (random <= 0) {
                return stream;
            }
        }
        return streams[streams.length - 1] ?? null;
    }
    /**
     * Find stream by ID
     */
    async _findStreamById(id) {
        try {
            return await this._streamRepository.findCached(id);
        }
        catch {
            return null;
        }
    }
    /**
     * Get active streams for campaign
     */
    async _getActiveStreams(campaign) {
        try {
            const collection = await this._streamRepository.getCachedActiveStreams(campaign);
            return collection.all();
        }
        catch {
            return [];
        }
    }
}
exports.ChooseStreamStage = ChooseStreamStage;
//# sourceMappingURL=choose-stream-stage.js.map