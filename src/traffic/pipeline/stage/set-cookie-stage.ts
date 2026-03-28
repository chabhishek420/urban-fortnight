/**
 * Set Cookie Stage
 *
 * Sets tracking cookies for visitor identification and binding.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/SetCookieStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
import { StageException } from '../../../core/pipeline/stage-interface';
import { GenerateTokenStage } from './generate-token-stage';

/**
 * Set Cookie Stage
 */
export class SetCookieStage implements StageInterface {
  static readonly HEADER_LIMIT_FOR_COOKIES = 3060;

  /**
   * Process the pipeline payload
   */
  process(payload: Payload, logEntry: TrafficLogEntry): Payload {
    // Check if cookies are enabled
    if (!this._areCookiesEnabled()) {
      return payload;
    }

    // Set generic cookies
    payload = this._setGenericCookies(payload, logEntry);

    // Set landing binding cookies
    if (payload.isCookieLandingBinded()) {
      const landing = payload.getLanding();
      if (landing) {
        payload = this._setBindingCookies(payload, logEntry, 'landing_binding', landing.getId()!);
      }
    }

    // Set offer binding cookies
    if (payload.isCookieOfferBinded()) {
      const offer = payload.getOffer();
      if (offer) {
        payload = this._setBindingCookies(payload, logEntry, 'offer_binding', offer.getId()!);
      }
    }

    // Set stream binding cookies
    if (payload.isCookieStreamBinded()) {
      const stream = payload.getStream();
      if (stream) {
        payload = this._setBindingCookies(payload, logEntry, 'stream_binding', stream.getId()!);
      }
    }

    // Set token cookie
    payload = this._setTokenCookie(payload, logEntry);

    // Set uniqueness ID cookie
    payload = this._setUniquenessId(payload, logEntry);

    return payload;
  }

  /**
   * Check if cookies are enabled
   */
  private _areCookiesEnabled(): boolean {
    // In original: CachedSettingsRepository.instance().get("cookies_enabled", 1)
    return true;
  }

  /**
   * Set generic cookies (sub ID)
   */
  private _setGenericCookies(payload: Payload, _logEntry: TrafficLogEntry): Payload {
    const rawClick = payload.getRawClick();
    const response = payload.getResponse();

    if (!response) {
      throw new StageException('response is not set', 'SetCookieStage');
    }

    if (rawClick) {
      const subId = rawClick.getSubId();
      // Set cookie header
      response.withHeader('Set-Cookie', `subid=${subId}; Path=/; HttpOnly`);
    }

    return payload;
  }

  /**
   * Set binding cookies
   */
  private _setBindingCookies(
    payload: Payload,
    _logEntry: TrafficLogEntry,
    type: string,
    entityId: number
  ): Payload {
    const response = payload.getResponse();
    if (response) {
      response.withHeader('Set-Cookie', `${type}=${entityId}; Path=/; HttpOnly`);
    }
    return payload;
  }

  /**
   * Set token cookie
   */
  private _setTokenCookie(payload: Payload, _logEntry: TrafficLogEntry): Payload {
    if (!payload.isSaveTokenRequired()) {
      return payload;
    }

    const rawClick = payload.getRawClick();
    const response = payload.getResponse();

    if (!rawClick || !response) {
      return payload;
    }

    const token = rawClick.get('token') as string;
    if (token && token.length < SetCookieStage.HEADER_LIMIT_FOR_COOKIES) {
      response.withHeader('Set-Cookie', `${GenerateTokenStage.TOKEN_PARAM}=${token}; Path=/; HttpOnly`);
    }

    return payload;
  }

  /**
   * Set uniqueness ID cookie
   */
  private _setUniquenessId(payload: Payload, _logEntry: TrafficLogEntry): Payload {
    if (!payload.isSaveUniquenessRequired()) {
      return payload;
    }

    const rawClick = payload.getRawClick();
    const campaign = payload.getCampaign();
    const stream = payload.getStream();
    const response = payload.getResponse();

    if (!rawClick || !campaign || !response) {
      return payload;
    }

    // Set uniqueness cookies
    const subId = rawClick.getSubId();
    const campaignId = campaign.getId();

    response.withHeader('Set-Cookie', `u_global=${subId}; Path=/; HttpOnly`);
    if (campaignId) {
      response.withHeader('Set-Cookie', `u_campaign_${campaignId}=${subId}; Path=/; HttpOnly`);
    }

    if (stream) {
      const streamId = stream.getId();
      if (streamId) {
        response.withHeader('Set-Cookie', `u_stream_${streamId}=${subId}; Path=/; HttpOnly`);
      }
    }

    return payload;
  }
}
