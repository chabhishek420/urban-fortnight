"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildRawClickStage = void 0;
const stage_interface_js_1 = require("../../../core/pipeline/stage-interface.js");
const raw_click_js_1 = require("../../model/raw-click.js");
/**
 * Build Raw Click Stage
 */
class BuildRawClickStage {
    /**
     * Process the pipeline payload
     */
    process(payload, logEntry) {
        const request = payload.getServerRequest();
        const rawClick = payload.getRawClick();
        if (!request) {
            throw new stage_interface_js_1.StageException('Empty request', 'BuildRawClickStage');
        }
        // Create raw click if not set
        const click = rawClick ?? new raw_click_js_1.RawClick();
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
    _prepare(request, click, logger) {
        // Set datetime if not set
        if (!click.get('datetime')) {
            click.set('datetime', new Date());
        }
        // Set user agent if not set
        if (!click.getUserAgent()) {
            click.setUserAgent(request.getUserAgent());
        }
        // Set IP if not set
        const ip = click.get('ip');
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
    _findLanguage(request, click, _logger) {
        if (click.getLanguage())
            return;
        const acceptLanguage = request.getHeader('Accept-Language');
        if (acceptLanguage) {
            const lang = acceptLanguage.substring(0, 2).toUpperCase();
            click.setLanguage(lang);
        }
    }
    /**
     * Find other parameters
     */
    _findOtherParams(request, click) {
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
    _findSeReferrer(request, click) {
        if (click.get('se_referrer'))
            return;
        const seReferrer = request.getParam('se_referrer');
        if (seReferrer) {
            click.set('se_referrer', decodeURIComponent(seReferrer));
        }
    }
    /**
     * Find referrer
     */
    _findReferrer(request, click) {
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
    _findSource(request, click) {
        if (click.getSource())
            return;
        if (request.hasParam('source')) {
            click.setSource(request.getParam('source') ?? '');
        }
        else {
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
    _findXRequestedWith(request, click) {
        if (click.get('x_requested_with'))
            return;
        const value = request.getHeader('X-Requested-With');
        if (value?.trim()) {
            click.set('x_requested_with', value);
        }
    }
    /**
     * Find search engine
     */
    _findSearchEngine(request, click) {
        if (click.getSearchEngine())
            return;
        const se = request.getParam('se');
        if (se) {
            click.setSearchEngine(decodeURIComponent(se));
        }
        // Extract from se_referrer
        if (!click.getSearchEngine()) {
            const seReferrer = click.get('se_referrer');
            if (seReferrer) {
                try {
                    const url = new URL(seReferrer);
                    click.setSearchEngine(url.host);
                }
                catch {
                    // Invalid URL
                }
            }
        }
    }
    /**
     * Find keyword
     */
    _findKeyword(request, click, _logger) {
        if (click.getKeyword())
            return;
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
            const seReferrer = click.get('se_referrer');
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
    _extractKeywordFromReferrer(referrer) {
        try {
            const url = new URL(referrer);
            const keyword = url.searchParams.get('q') ?? url.searchParams.get('query') ?? url.searchParams.get('keyword');
            return keyword;
        }
        catch {
            return null;
        }
    }
    /**
     * Find default keyword
     */
    _findDefaultKeyword(request, click) {
        if (click.getKeyword())
            return;
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
    _findCosts(request, click) {
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
     */
    _findSubIds(request, click) {
        for (let i = 1; i <= 30; i++) {
            let subId = request.getParam(`sub_id_${i}`);
            if (subId !== undefined) {
                click.setSubIdN(i, decodeURIComponent(subId).trim());
            }
            // Also check subidN format
            subId = request.getParam(`subid${i}`);
            if (subId !== undefined) {
                click.setSubIdN(i, decodeURIComponent(subId).trim());
            }
        }
    }
    /**
     * Find extra params
     */
    _findExtraParams(request, click) {
        for (let i = 1; i <= 20; i++) {
            const extraParam = request.getParam(`extra_param_${i}`);
            if (extraParam) {
                click.setExtraParamN(i, decodeURIComponent(extraParam).trim());
            }
        }
    }
    /**
     * Find IP info (geo, ISP, etc.)
     * @artifact ARTIFACT-007: Simplified without GeoDB integration
     */
    _findIpInfo(_request, click, _logger) {
        // In original: IpInfoService.instance().getIpInfo()
        // Set resolution flags
        click.set('is_geo_resolved', false);
        click.set('is_isp_resolved', false);
    }
    /**
     * Find device info
     * @artifact ARTIFACT-008: Simplified without DeviceAtlas integration
     */
    _findDeviceInfo(click) {
        const userAgent = click.getUserAgent();
        // Basic device detection from user agent
        if (userAgent) {
            // Detect device type
            if (/mobile/i.test(userAgent)) {
                click.setDeviceType('mobile');
                click.set('connection_type', 'wifi');
            }
            else if (/tablet/i.test(userAgent)) {
                click.setDeviceType('tablet');
            }
            else {
                click.setDeviceType('desktop');
            }
            // Detect OS
            if (/windows/i.test(userAgent)) {
                click.setOs('Windows');
            }
            else if (/mac/i.test(userAgent)) {
                click.setOs('MacOS');
            }
            else if (/linux/i.test(userAgent)) {
                click.setOs('Linux');
            }
            else if (/android/i.test(userAgent)) {
                click.setOs('Android');
            }
            else if (/iphone|ipad/i.test(userAgent)) {
                click.setOs('iOS');
            }
            // Detect browser
            if (/chrome/i.test(userAgent)) {
                click.setBrowser('Chrome');
            }
            else if (/firefox/i.test(userAgent)) {
                click.setBrowser('Firefox');
            }
            else if (/safari/i.test(userAgent)) {
                click.setBrowser('Safari');
            }
            else if (/edge/i.test(userAgent)) {
                click.setBrowser('Edge');
            }
        }
        click.set('is_device_resolved', true);
    }
    /**
     * Check if request is from a bot
     * @artifact ARTIFACT-009: Simplified bot detection
     */
    _checkIfBot(_request, click, logger) {
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
    _checkIfProxy(request, click, logger) {
        // Check for common proxy headers
        const via = request.getHeader('Via');
        const forwarded = request.getHeader('X-Forwarded-For');
        if (via || forwarded?.includes(',')) {
            click.setIsProxy(true);
            logger.add('Proxy detected from headers');
        }
        else {
            click.setIsProxy(false);
        }
    }
}
exports.BuildRawClickStage = BuildRawClickStage;
//# sourceMappingURL=build-raw-click-stage.js.map