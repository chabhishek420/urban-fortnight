/**
 * Choose Stream Stage
 *
 * Selects a stream from the campaign based on rotation rules and filters.
 * THIS IS THE CORE CLOAKING LOGIC - filters determine which streams are valid.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/ChooseStreamStage.php
 * @see keitaro_source/application/Traffic/Pipeline/Rotator/StreamRotator.php
 */

import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
import { StageException } from '../../../core/pipeline/stage-interface';
import { Response } from '../../response/response';
import { StatusCode } from '../../response/status-code';
import type { BaseStream } from '../../model/base-stream';
import { StreamType, StreamSchema } from '../../model/base-stream';
import type { Campaign } from '../../model/campaign';
import { CampaignType } from '../../model/campaign';
import { CachedStreamRepository } from '../../repository/cached-stream-repository';
import { CheckFilters } from '../../filter/check-filters';
import type { ServerRequest } from '../../request/server-request';
import type { RawClick } from '../../model/raw-click';

/**
 * Choose Stream Stage
 * 
 * Implements the core cloaking logic:
 * 1. Get candidate streams for campaign
 * 2. For each candidate, check if filters pass
 * 3. Return first stream that passes all filters
 */
export class ChooseStreamStage implements StageInterface {
  static readonly NO_STREAM_SELECTED = 'No stream selected';
  static readonly SHOW_TEXT = 'show_text';
  static readonly DO_NOTHING = 'do_nothing';

  private _streamRepository: CachedStreamRepository;

  constructor() {
    this._streamRepository = CachedStreamRepository.getInstance();
  }

  /**
   * Process the pipeline payload
   */
  async process(payload: Payload, logEntry: TrafficLogEntry): Promise<Payload> {
    const campaign = payload.getCampaign();
    const rawClick = payload.getRawClick();
    const serverRequest = payload.getServerRequest();
    const response = payload.getResponse();

    if (!response) {
      throw new StageException('response is not set', 'ChooseStreamStage');
    }

    if (!serverRequest) {
      throw new StageException('server_request is not defined', 'ChooseStreamStage');
    }

    if (!campaign) {
      throw new StageException('campaign is not defined', 'ChooseStreamStage');
    }

    if (!rawClick) {
      throw new StageException('rawClick is not defined', 'ChooseStreamStage');
    }

    // Check for forced stream
    const forcedStreamId = payload.getForcedStreamId();
    let stream: BaseStream | null = null;

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

    // Try forced streams first (streams with chance > 0)
    if (!stream || stream.isDisabled()) {
      logEntry.add(`Processing campaign ${campaign.getId()}`);
      const forcedStreams = groupedStreams.filter(s => s.getType() === StreamType.REGULAR && s.getChance() > 0);
      stream = await this._chooseByPosition(serverRequest, forcedStreams, rawClick, logEntry);
    }

    // Try regular streams
    if (!stream || stream.isDisabled()) {
      const regularStreams = groupedStreams.filter(s => s.getType() === StreamType.REGULAR);

      if (campaign.getType() === CampaignType.POSITION) {
        stream = await this._chooseByPosition(serverRequest, regularStreams, rawClick, logEntry);
      } else {
        stream = await this._chooseByWeight(serverRequest, regularStreams, rawClick, logEntry, campaign);

        // Enable cookie binding for weight-based campaigns
        if (stream && campaign.isBindVisitorsEnabled()) {
          payload.enableCookieBindStream();
        }
      }
    }

    // Try default streams
    if (!stream || stream.isDisabled()) {
      const defaultStreams = groupedStreams.filter(s => s.getType() === StreamType.DEFAULT);
      // Default streams typically don't have filters, but we should still check
      if (defaultStreams.length > 0) {
        const defaultStream = defaultStreams[0];
        if (defaultStream) {
          const checkFilter = new CheckFilters(serverRequest, defaultStream, rawClick, logEntry);
          if (await checkFilter.isPass()) {
            stream = defaultStream;
          }
        }
      }
    }

    // Set stream or default action
    if (stream && !stream.isDisabled()) {
      if (stream.getType() === StreamType.DEFAULT) {
        logEntry.add(`Chosen default stream #${stream.getId()}`);
      } else {
        logEntry.add(`Chosen stream #${stream.getId()}: ${stream.getName()}`);
      }

      payload.setStream(stream);
      rawClick.setStreamId(stream.getId()!);

      // Set action for non-landing/offer schemas
      const schema = stream.getSchema();
      if (schema !== StreamSchema.LANDING_OFFER && schema !== StreamSchema.OFFER) {
        const actionType = stream.getActionType();
        const actionPayload = stream.getActionPayload();
        logEntry.add(`Setting action: ${actionType} -> ${actionPayload?.substring(0, 50)}...`);
        payload.setActionType(actionType ?? null);
        payload.setActionPayload(actionPayload);
        payload.setActionOptions(stream.getActionOptions() ?? null);
      }
    } else {
      logEntry.add('No stream selected, setting do_nothing');
      this._setNoDirection(payload);
    }

    return payload;
  }

  /**
   * Set no direction action
   */
  private _setNoDirection(payload: Payload): void {
    payload.setActionType(ChooseStreamStage.DO_NOTHING);
  }

  /**
   * Trigger 404 not found
   */
  private _triggerNotFound(payload: Payload, logger: TrafficLogEntry): Payload {
    const response = payload.getResponse() ?? new Response();
    response.withStatus(StatusCode.NOT_FOUND).withBody('Forced stream not found');

    logger.add('Forced stream not found. Shows 404 NotFound');

    payload.setResponse(response);
    payload.abort();

    return payload;
  }

  /**
   * Choose stream by position
   * 
   * Iterates through streams in order, checking filters for each.
   * Returns the first stream that passes all filters.
   * 
   * @see keitaro_source/application/Traffic/Pipeline/Rotator/StreamRotator.php::chooseByPosition()
   */
  private async _chooseByPosition(
    serverRequest: ServerRequest,
    streams: BaseStream[],
    rawClick: RawClick,
    logEntry: TrafficLogEntry
  ): Promise<BaseStream | null> {
    for (let i = 0; i < streams.length; i++) {
      const stream = streams[i];
      if (!stream) continue;

      const checkFilter = new CheckFilters(serverRequest, stream, rawClick, logEntry);
      if (await checkFilter.isPass()) {
        logEntry.add('Passed. Checking the schema and action.');
        return stream;
      }
    }
    return null;
  }

  /**
   * Choose stream by weight
   * 
   * Uses weighted random selection, then checks filters.
   * If selected stream fails filters, recursively tries again with remaining streams.
   * 
   * @see keitaro_source/application/Traffic/Pipeline/Rotator/StreamRotator.php::chooseByWeight()
   */
  private async _chooseByWeight(
    serverRequest: ServerRequest,
    streams: BaseStream[],
    rawClick: RawClick,
    logEntry: TrafficLogEntry,
    campaign: Campaign
  ): Promise<BaseStream | null> {
    // Check for bound stream first (visitor binding)
    if (campaign.isBindVisitorsEnabled()) {
      // TODO: Implement entity binding service for bound stream lookup
      // const boundStream = await this._findBoundStream(serverRequest, streams, rawClick);
      // if (boundStream) return boundStream;
    }

    return this._rollDice(serverRequest, streams, rawClick, logEntry);
  }

  /**
   * Roll dice for weighted random stream selection
   * 
   * @see keitaro_source/application/Traffic/Pipeline/Rotator/StreamRotator.php::_rollDice()
   */
  private async _rollDice(
    serverRequest: ServerRequest,
    streams: BaseStream[],
    rawClick: RawClick,
    logEntry: TrafficLogEntry
  ): Promise<BaseStream | null> {
    if (streams.length === 0) {
      return null;
    }

    // Shuffle for randomness
    const shuffled = [...streams].sort(() => Math.random() - 0.5);

    // Calculate total weight
    let totalWeight = 0;
    for (const stream of shuffled) {
      totalWeight += stream.getWeight();
    }

    if (totalWeight === 0) {
      return null;
    }

    // Weighted random selection
    const rand = Math.floor(Math.random() * totalWeight);
    let currentWeight = 0;
    let selectedIndex = 0;

    for (let i = 0; i < shuffled.length; i++) {
      const stream = shuffled[i];
      if (!stream) continue;
      
      const weight = stream.getWeight();
      if (currentWeight <= rand && rand < currentWeight + weight) {
        selectedIndex = i;
        break;
      }
      currentWeight += weight;
    }

    const selectedStream = shuffled[selectedIndex];
    if (!selectedStream) {
      return null;
    }

    // Check filters for selected stream
    const checkFilter = new CheckFilters(serverRequest, selectedStream, rawClick, logEntry);
    if (await checkFilter.isPass()) {
      return selectedStream;
    }

    // Filter failed - remove this stream and try again
    const remaining = shuffled.filter((_, i) => i !== selectedIndex);
    return this._rollDice(serverRequest, remaining, rawClick, logEntry);
  }

  /**
   * Find stream by ID
   */
  private async _findStreamById(id: number): Promise<BaseStream | null> {
    try {
      return await this._streamRepository.findCached(id);
    } catch {
      return null;
    }
  }

  /**
   * Get active streams for campaign
   */
  private async _getActiveStreams(campaign: Campaign): Promise<BaseStream[]> {
    try {
      const collection = await this._streamRepository.getCachedActiveStreams(campaign);
      return collection.all();
    } catch {
      return [];
    }
  }
}
