/**
 * Check Prefetch Stage
 *
 * Detects and blocks prefetch requests if configured.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/CheckPrefetchStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
import { StageException } from '../../../core/pipeline/stage-interface';
import { Response } from '../../response/response';
import { StatusCode } from '../../response/status-code';

/**
 * Prefetch detection headers
 */
const PREFETCH_HEADERS: Record<string, string> = {
  'X-PURPOSE': 'preview',
  'X-MOZ': 'prefetch',
  'X-FB-HTTP-ENGINE': 'Liger'
};

/**
 * Check Prefetch Stage - blocks prefetch requests
 */
export class CheckPrefetchStage implements StageInterface {
  /**
   * Process the pipeline payload
   */
  process(payload: Payload, logEntry: TrafficLogEntry): Payload {
    const request = payload.getServerRequest();

    if (!request) {
      throw new StageException('Empty request', 'CheckPrefetchStage');
    }

    // Check if prefetch ignoring is enabled
    // @artifact ARTIFACT-006: Simplified settings check
    const ignorePrefetch = this._getIgnorePrefetchSetting();

    if (!ignorePrefetch) {
      return payload;
    }

    // Check for prefetch detection
    if (this._isPrefetchDetected(request) ||
        (request.getParam('version') && request.getParam('prefetch'))) {
      logEntry.add('Ignored because prefetch is detected');

      const response = new Response()
        .withStatus(StatusCode.FORBIDDEN)
        .withBody('Prefetch not allowed');

      payload.setResponse(response);
      payload.abort();
    }

    return payload;
  }

  /**
   * Check if prefetch should be ignored
   */
  private _getIgnorePrefetchSetting(): boolean {
    // In original: CachedSettingsRepository.instance().get("ingore_prefetch")
    // Default to true for safety
    return true;
  }

  /**
   * Detect if request is a prefetch
   */
  private _isPrefetchDetected(request: { getHeader: (name: string) => string | undefined }): boolean {
    for (const [name, value] of Object.entries(PREFETCH_HEADERS)) {
      const headerValue = request.getHeader(name);
      if (headerValue === value) {
        return true;
      }
    }
    return false;
  }
}
