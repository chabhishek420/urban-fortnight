/**
 * Build Raw Click Stage
 *
 * Builds the initial RawClick from the request data.
 * Extracts IP, user agent, referrer, keywords, costs, etc.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/BuildRawClickStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
import { StageException } from '../../../core/pipeline/stage-interface';
import { RawClick } from '../../model/raw-click';

/**
 * Build Raw Click Stage
 */
export class BuildRawClickStage implements StageInterface {
  /**
   * Process the pipeline payload
   */
  process(payload: Payload, logEntry: TrafficLogEntry): Payload {
    const request = payload.getServerRequest();
    const rawClick = payload.getRawClick();

    if (!request) {
      throw new StageException('Empty request', 'BuildRawClickStage');
    }

    // Create raw click if not set
    const click = rawClick ?? new RawClick();

    // Prepare basic info
    this._prepare(request, click, logEntry);

    // Extract language
    this._findLanguage(request, click, logEntry);

    // Extract other params
    this._findOtherParams(request, click);

    // Extract search engine referrer
    this._findSeReferrer(request, click);

    // Extract referrer
    this._findReferrer(request, click);

    // Extract source
    this._findSource(request, click);

    // Extract X-Requested-With header
    this._findXRequestedWith(request, click);

    // Extract search engine
    this._findSearchEngine(request, click);

    // Extract keyword
    this._findKeyword(request, click, logEntry);

    // Extract default keyword
    this._findDefaultKeyword(request, click);

    // Extract costs
    this._findCosts(request, click);

    // Extract sub IDs
    this._findSubIds(request, click);

    // Extract extra params
    this._findExtraParams(request, click);

    // Extract IP info
    this._findIpInfo(request, click, logEntry);

    // Extract device info
    this._findDeviceInfo(click);

    // Check for bot
    this._checkIfBot(request, click, logEntry);

    // Check for proxy
    this._checkIfProxy(request, click, logEntry);

    payload.setRawClick(click);
    return payload;
  }

  /**
   * Prepare basic click data
   */
  private _prepare(request: { getClientIp: () => string; getUserAgent: () => string; getHeader: (n: string) => string | undefined }, click: RawClick, logger: TrafficLogEntry): void {
    // Set datetime if not set
    if (!click.get('datetime')) {
      click.set('datetime', new Date());
    }

    // Set user agent if not set
    if (!click.getUserAgent()) {
      click.setUserAgent(request.getUserAgent());
    }

    // Set IP if not set
    const ip = click.get<string>('ip');
    if (!ip || ip === '0.0.0.0') {
      const clientIp = request.getClientIp();
      click.set('ip', clientIp);
      click.set('ip_string', clientIp);
      logger.add(`Client IP: ${clientIp}`);
    }
  }

  /**
   * Find language from accept-language header
   */
  private _findLanguage(request: { getHeader: (n: string) => string | undefined }, click: RawClick, _logger: TrafficLogEntry): void {
    if (click.getLanguage()) return;

    const acceptLanguage = request.getHeader('Accept-Language');
    if (acceptLanguage) {
      const lang = acceptLanguage.substring(0, 2).toUpperCase();
      click.setLanguage(lang);
    }
  }

  /**
   * Find other parameters
   */
  private _findOtherParams(request: { getParam: (n: string) => string | undefined }, click: RawClick): void {
    // Landing ID
    const lpId = request.getParam('lp_id');
    if (lpId) {
      click.set('landing_id', parseInt(lpId, 10));
    }

    // Landing URL
    const landingUrl = request.getParam('landing_url');
    if (landingUrl) {
      click.set('landing_url', landingUrl);
    }

    // Other params
    const params = ['landing_id', 'creative_id', 'ad_campaign_id', 'external_id'];
    for (const paramName of params) {
      const paramValue = request.getParam(paramName);
      if (paramValue) {
        click.set(paramName, paramValue);
      }
    }
  }

  /**
   * Find search engine referrer
   */
  private _findSeReferrer(request: { getParam: (n: string) => string | undefined }, click: RawClick): void {
    if (click.get('se_referrer')) return;

    const seReferrer = request.getParam('se_referrer');
    if (seReferrer) {
      click.set('se_referrer', decodeURIComponent(seReferrer));
    }
  }

  /**
   * Find referrer
   */
  private _findReferrer(request: { getParam: (n: string) => string | undefined; getHeader: (n: string) => string | undefined }, click: RawClick): void {
    // Check for referrer param override
    const referrerParam = request.getParam('referrer');
    if (referrerParam) {
      click.setReferrer(decodeURIComponent(referrerParam));
      return;
    }

    // Use referer header
    if (!click.getReferrer()) {
      const referer = request.getHeader('Referer');
      if (referer) {
        click.setReferrer(decodeURIComponent(referer));
      }
    }
  }

  /**
   * Find source
   */
  private _findSource(request: { getParam: (n: string) => string | undefined; hasParam: (n: string) => boolean }, click: RawClick): void {
    if (click.getSource()) return;

    if (request.hasParam('source')) {
      click.setSource(request.getParam('source') ?? '');
    } else {
      // Extract from referrer
      const referrer = click.getReferrer();
      if (referrer) {
        const match = referrer.match(/https?:\/\/([^\/]+)/i);
        if (match && match[1]) {
          click.setSource(match[1]);
        }
      }
    }
  }

  /**
   * Find X-Requested-With header
   */
  private _findXRequestedWith(request: { getHeader: (n: string) => string | undefined }, click: RawClick): void {
    if (click.get('x_requested_with')) return;

    const value = request.getHeader('X-Requested-With');
    if (value?.trim()) {
      click.set('x_requested_with', value);
    }
  }

  /**
   * Find search engine
   */
  private _findSearchEngine(request: { getParam: (n: string) => string | undefined }, click: RawClick): void {
    if (click.getSearchEngine()) return;

    const se = request.getParam('se');
    if (se) {
      click.setSearchEngine(decodeURIComponent(se));
    }

    // Extract from se_referrer
    if (!click.getSearchEngine()) {
      const seReferrer = click.get<string>('se_referrer');
      if (seReferrer) {
        try {
          const url = new URL(seReferrer);
          click.setSearchEngine(url.host);
        } catch {
          // Invalid URL
        }
      }
    }
  }

  /**
   * Find keyword
   */
  private _findKeyword(request: { getParam: (n: string) => string | undefined }, click: RawClick, _logger: TrafficLogEntry): void {
    if (click.getKeyword()) return;

    let keyword = request.getParam('keyword');
    if (keyword) {
      keyword = decodeURIComponent(keyword);
    }

    // Character set conversion (simplified)
    const charset = request.getParam('charset') ?? 'utf-8';
    if (keyword && charset !== 'utf-8') {
      // In production, would convert charset
    }

    if (keyword) {
      click.setKeyword(keyword);
    }

    // Try to extract from se_referrer
    if (!click.getKeyword()) {
      const seReferrer = click.get<string>('se_referrer');
      if (seReferrer) {
        const extracted = this._extractKeywordFromReferrer(seReferrer);
        if (extracted) {
          click.setKeyword(extracted);
        }
      }
    }

    // Try to extract from referrer
    if (!click.getKeyword()) {
      const referrer = click.getReferrer();
      if (referrer) {
        const extracted = this._extractKeywordFromReferrer(referrer);
        if (extracted) {
          click.setKeyword(extracted);
        }
      }
    }
  }

  /**
   * Extract keyword from referrer URL
   */
  private _extractKeywordFromReferrer(referrer: string): string | null {
    try {
      const url = new URL(referrer);
      const keyword = url.searchParams.get('q') ?? url.searchParams.get('query') ?? url.searchParams.get('keyword');
      return keyword;
    } catch {
      return null;
    }
  }

  /**
   * Find default keyword
   */
  private _findDefaultKeyword(request: { getParam: (n: string) => string | undefined }, click: RawClick): void {
    if (click.getKeyword()) return;

    const defaultKeyword = request.getParam('default_keyword');
    if (defaultKeyword) {
      let keyword = decodeURIComponent(defaultKeyword);
      const charset = request.getParam('charset');
      if (charset && charset !== 'utf-8') {
        // In production, would convert charset
      }
      click.setKeyword(keyword);
    }
  }

  /**
   * Find costs
   */
  private _findCosts(request: { getParam: (n: string) => string | undefined }, click: RawClick): void {
    const cost = request.getParam('cost');
    if (cost !== undefined) {
      click.set('cost', parseFloat(cost) || 0);
    }

    const currency = request.getParam('currency');
    if (currency !== undefined) {
      click.set('currency', currency);
    }
  }

  /**
   * Find sub IDs
   * @artifact ARTIFACT-012: Optimized to avoid 60 unnecessary getParam calls
   */
  private _findSubIds(request: { getQueryParams: () => Record<string, string> }, click: RawClick): void {
    const params = request.getQueryParams();
    for (const [key, value] of Object.entries(params)) {
      if (key.startsWith('sub_id_') || key.startsWith('subid')) {
        const nStr = key.replace('sub_id_', '').replace('subid', '');
        const n = parseInt(nStr, 10);
        if (n >= 1 && n <= 30) {
          click.setSubIdN(n, decodeURIComponent(value).trim());
        }
      }
    }
  }

  /**
   * Find extra params
   * @artifact ARTIFACT-012: Optimized to avoid 20 unnecessary getParam calls
   */
  private _findExtraParams(request: { getQueryParams: () => Record<string, string> }, click: RawClick): void {
    const params = request.getQueryParams();
    for (const [key, value] of Object.entries(params)) {
      if (key.startsWith('extra_param_')) {
        const nStr = key.replace('extra_param_', '');
        const n = parseInt(nStr, 10);
        if (n >= 1 && n <= 20) {
          click.setExtraParamN(n, decodeURIComponent(value).trim());
        }
      }
    }
  }

  /**
   * Find IP info (geo, ISP, etc.)
   * @artifact ARTIFACT-007: Simplified without GeoDB integration
   */
  private _findIpInfo(_request: { getClientIp: () => string }, click: RawClick, _logger: TrafficLogEntry): void {
    // In original: IpInfoService.instance().getIpInfo()
    // Set resolution flags
    click.set('is_geo_resolved', false);
    click.set('is_isp_resolved', false);
  }

  /**
   * Find device info
   * @artifact ARTIFACT-008: Simplified without DeviceAtlas integration
   */
  private _findDeviceInfo(click: RawClick): void {
    const userAgent = click.getUserAgent();

    // Basic device detection from user agent
    if (userAgent) {
      // Detect device type
      if (/mobile/i.test(userAgent)) {
        click.setDeviceType('mobile');
        click.set('connection_type', 'wifi');
      } else if (/tablet/i.test(userAgent)) {
        click.setDeviceType('tablet');
      } else {
        click.setDeviceType('desktop');
      }

      // Detect OS
      if (/windows/i.test(userAgent)) {
        click.setOs('Windows');
      } else if (/mac/i.test(userAgent)) {
        click.setOs('MacOS');
      } else if (/linux/i.test(userAgent)) {
        click.setOs('Linux');
      } else if (/android/i.test(userAgent)) {
        click.setOs('Android');
      } else if (/iphone|ipad/i.test(userAgent)) {
        click.setOs('iOS');
      }

      // Detect browser
      if (/chrome/i.test(userAgent)) {
        click.setBrowser('Chrome');
      } else if (/firefox/i.test(userAgent)) {
        click.setBrowser('Firefox');
      } else if (/safari/i.test(userAgent)) {
        click.setBrowser('Safari');
      } else if (/edge/i.test(userAgent)) {
        click.setBrowser('Edge');
      }
    }

    click.set('is_device_resolved', true);
  }

  /**
   * Check if request is from a bot
   * @artifact ARTIFACT-009: Simplified bot detection
   */
  private _checkIfBot(_request: { getUserAgent: () => string }, click: RawClick, logger: TrafficLogEntry): void {
    const userAgent = click.getUserAgent();

    if (userAgent) {
      // Simple bot detection
      const botPatterns = [
        /bot/i, /crawler/i, /spider/i, /scraper/i,
        /googlebot/i, /bingbot/i, /yandex/i,
        /facebookexternalhit/i, /twitterbot/i
      ];

      for (const pattern of botPatterns) {
        if (pattern.test(userAgent)) {
          click.setIsBot(true);
          logger.add('Bot detected from user agent');
          return;
        }
      }
    }

    click.setIsBot(false);
  }

  /**
   * Check if request is from a proxy
   * @artifact ARTIFACT-010: Simplified proxy detection
   */
  private _checkIfProxy(request: { getHeader: (n: string) => string | undefined }, click: RawClick, logger: TrafficLogEntry): void {
    // Check for common proxy headers
    const via = request.getHeader('Via');
    const forwarded = request.getHeader('X-Forwarded-For');

    if (via || forwarded?.includes(',')) {
      click.setIsProxy(true);
      logger.add('Proxy detected from headers');
    } else {
      click.setIsProxy(false);
    }
  }
}
