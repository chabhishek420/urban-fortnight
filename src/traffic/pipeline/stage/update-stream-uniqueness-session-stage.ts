/**
 * Update Stream Uniqueness Session Stage
 *
 * Updates uniqueness session data for stream-level uniqueness.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/UpdateStreamUniquenessSessionStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
import { StageException } from '../../../core/pipeline/stage-interface';

/**
 * Update Stream Uniqueness Session Stage
 */
export class UpdateStreamUniquenessSessionStage implements StageInterface {
  /**
   * Process the pipeline payload
   */
  process(payload: Payload, logEntry: TrafficLogEntry): Payload {
    const campaign = payload.getCampaign();
    const stream = payload.getStream();
    const rawClick = payload.getRawClick();
    const serverRequest = payload.getServerRequest();

    if (!campaign) {
      throw new StageException('Empty campaign', 'UpdateStreamUniquenessSessionStage');
    }

    if (!rawClick) {
      throw new StageException('Empty rawClick', 'UpdateStreamUniquenessSessionStage');
    }

    // Skip if no stream
    if (!stream) {
      return payload;
    }

    // Bots are never unique
    if (rawClick.isBot()) {
      rawClick.set('is_unique_stream', false);
      return payload;
    }

    // Check uniqueness for stream
    const isUniqueStream = this._isUniqueForStream(serverRequest, rawClick, campaign, stream);
    rawClick.set('is_unique_stream', isUniqueStream);

    if (!isUniqueStream) {
      logEntry.add('Is not unique for stream');
    }

    return payload;
  }

  /**
   * Check if visitor is unique for stream
   * @artifact ARTIFACT-024: Simplified uniqueness check
   */
  private _isUniqueForStream(
    request: { getCookies: () => Record<string, string>; getClientIp: () => string },
    _click: { getSubId: () => string },
    _campaign: { getId: () => number | undefined },
    stream: { getId: () => number | undefined }
  ): boolean {
    // Check cookie for stream uniqueness
    const cookies = request.getCookies();
    const streamId = stream.getId();
    const uniquenessCookie = cookies[`u_stream_${streamId}`];

    if (uniquenessCookie) {
      return false;
    }

    return true;
  }
}
