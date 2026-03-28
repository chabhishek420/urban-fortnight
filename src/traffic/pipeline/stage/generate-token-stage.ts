/**
 * Generate Token Stage
 *
 * Generates a visitor token for tracking and stores it.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/GenerateTokenStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
import { StageException } from '../../../core/pipeline/stage-interface';

/**
 * Generate Token Stage
 */
export class GenerateTokenStage implements StageInterface {
  static readonly TOKEN_PARAM = '_token';
  static readonly SUBID_PARAM = '_subid';

  /**
   * Process the pipeline payload
   */
  process(payload: Payload, logEntry: TrafficLogEntry): Payload {
    const serverRequest = payload.getServerRequest();
    const response = payload.getResponse();
    const rawClick = payload.getRawClick();
    const stream = payload.getStream();

    // Check if token is needed
    if (!payload.isTokenNeeded()) {
      logEntry.add('Token is not needed.');
      return payload;
    }

    // Skip if already has token
    if (rawClick?.get('token')) {
      return payload;
    }

    if (!rawClick) {
      throw new StageException('GenerateTokenStage: Empty rawClick', 'GenerateTokenStage');
    }

    if (!serverRequest) {
      throw new StageException('serverRequest is not set', 'GenerateTokenStage');
    }

    if (!response) {
      throw new StageException('response is not set', 'GenerateTokenStage');
    }

    if (!stream) {
      return payload;
    }

    // Check if stream has offers
    const offers = this._getStreamOffers(stream);
    if (!offers || offers.length === 0) {
      logEntry.add('Token is not needed because the stream does not contain any offers');
      return payload;
    }

    // Enable token saving
    payload.enableSaveToken();

    // Generate and store token
    const token = this._storeRawClick(rawClick);
    rawClick.set('token', token);

    // Add token to URL if redirect action
    if (payload.shouldAddTokenToUrl() && this._isRedirect(payload.getActionType())) {
      let actionPayload = payload.getActionPayload() as string;

      if (typeof actionPayload === 'string') {
        const subidParam = `${GenerateTokenStage.SUBID_PARAM}=${rawClick.getSubId()}`;
        const tokenParam = `${GenerateTokenStage.TOKEN_PARAM}=${token}`;

        actionPayload = this._addParameterToUrl(actionPayload, subidParam);
        actionPayload = this._addParameterToUrl(actionPayload, tokenParam);

        payload.setActionPayload(actionPayload);
      }
    }

    return payload;
  }

  /**
   * Store raw click and return token
   */
  private _storeRawClick(click: { getSubId: () => string; getData: () => Record<string, unknown> }): string {
    // Generate a unique token
    // Keitaro PHP: UUID_PREFIX . $subId . "_" . uniqid($subId, true);
    const subId = click.getSubId();
    const unique = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const token = `uuid_${subId}_${unique}`;

    return token;
  }

  /**
   * Add parameter to URL
   */
  private _addParameterToUrl(url: string, param: string): string {
    if (!url) return url;

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${param}`;
  }

  /**
   * Check if action is a redirect
   */
  private _isRedirect(actionType: string | null): boolean {
    const redirectTypes = ['http', 'https', 'location', 'redirect', 'remote'];
    return actionType ? redirectTypes.includes(actionType.toLowerCase()) : false;
  }

  /**
   * Get offers for stream
   * @artifact ARTIFACT-031: Placeholder - needs repository
   */
  private _getStreamOffers(_stream: { getId: () => number | undefined }): unknown[] {
    // TODO: Implement stream offer repository
    return [];
  }
}
