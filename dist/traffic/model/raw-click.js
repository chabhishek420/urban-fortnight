"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawClick = void 0;
/**
 * Raw Click Model
 *
 * Represents raw click data before it's stored in the database.
 * This is the primary data structure that flows through the pipeline.
 *
 * @see keitaro_source/application/Traffic/RawClick.php
 */
class RawClick {
    _data = new Map();
    constructor(data = {}) {
        for (const [key, value] of Object.entries(data)) {
            this._data.set(key, value);
        }
    }
    // === Identity ===
    getSubId() {
        return this._data.get('sub_id') ?? '';
    }
    setSubId(value) {
        this._data.set('sub_id', value);
    }
    getParentSubId() {
        return this._data.get('parent_sub_id');
    }
    setParentSubId(value) {
        this._data.set('parent_sub_id', value);
    }
    getVisitorId() {
        return this._data.get('visitor_id');
    }
    setVisitorId(value) {
        this._data.set('visitor_id', value);
    }
    // === Campaign/Stream/Landing/Offer IDs ===
    getCampaignId() {
        return this._data.get('campaign_id');
    }
    setCampaignId(value) {
        this._data.set('campaign_id', value);
    }
    getParentCampaignId() {
        return this._data.get('parent_campaign_id');
    }
    setParentCampaignId(value) {
        this._data.set('parent_campaign_id', value);
    }
    getStreamId() {
        return this._data.get('stream_id');
    }
    setStreamId(value) {
        this._data.set('stream_id', value);
    }
    getLandingId() {
        return this._data.get('landing_id');
    }
    setLandingId(value) {
        this._data.set('landing_id', value);
    }
    getOfferId() {
        return this._data.get('offer_id');
    }
    setOfferId(value) {
        this._data.set('offer_id', value);
    }
    getAffiliateNetworkId() {
        return this._data.get('affiliate_network_id');
    }
    setAffiliateNetworkId(value) {
        this._data.set('affiliate_network_id', value);
    }
    // === Visitor Info ===
    getIp() {
        return this._data.get('ip') ?? '';
    }
    setIp(value) {
        this._data.set('ip', value);
    }
    getUserAgent() {
        return this._data.get('user_agent') ?? '';
    }
    setUserAgent(value) {
        this._data.set('user_agent', value);
    }
    getReferrer() {
        return this._data.get('referrer');
    }
    setReferrer(value) {
        this._data.set('referrer', value);
    }
    // === Geo ===
    getCountry() {
        return this._data.get('country');
    }
    setCountry(value) {
        this._data.set('country', value);
    }
    getRegion() {
        return this._data.get('region');
    }
    setRegion(value) {
        this._data.set('region', value);
    }
    getCity() {
        return this._data.get('city');
    }
    setCity(value) {
        this._data.set('city', value);
    }
    getIsp() {
        return this._data.get('isp');
    }
    setIsp(value) {
        this._data.set('isp', value);
    }
    getConnectionType() {
        return this._data.get('connection_type');
    }
    setConnectionType(value) {
        this._data.set('connection_type', value);
    }
    // === Device ===
    getDeviceType() {
        return this._data.get('device_type');
    }
    setDeviceType(value) {
        this._data.set('device_type', value);
    }
    getDeviceModel() {
        return this._data.get('device_model');
    }
    setDeviceModel(value) {
        this._data.set('device_model', value);
    }
    getOs() {
        return this._data.get('os');
    }
    setOs(value) {
        this._data.set('os', value);
    }
    getOsVersion() {
        return this._data.get('os_version');
    }
    setOsVersion(value) {
        this._data.set('os_version', value);
    }
    getBrowser() {
        return this._data.get('browser');
    }
    setBrowser(value) {
        this._data.set('browser', value);
    }
    getBrowserVersion() {
        return this._data.get('browser_version');
    }
    setBrowserVersion(value) {
        this._data.set('browser_version', value);
    }
    getLanguage() {
        return this._data.get('language');
    }
    setLanguage(value) {
        this._data.set('language', value);
    }
    // === Traffic Source ===
    getKeyword() {
        return this._data.get('keyword');
    }
    setKeyword(value) {
        this._data.set('keyword', value);
    }
    getSearchEngine() {
        return this._data.get('search_engine');
    }
    setSearchEngine(value) {
        this._data.set('search_engine', value);
    }
    getSource() {
        return this._data.get('source');
    }
    setSource(value) {
        this._data.set('source', value);
    }
    // === Sub IDs ===
    getSubIdN(n) {
        return this._data.get(`sub_id_${n}`);
    }
    setSubIdN(n, value) {
        this._data.set(`sub_id_${n}`, value);
    }
    // === Extra Params ===
    getExtraParamN(n) {
        return this._data.get(`extra_param_${n}`);
    }
    setExtraParamN(n, value) {
        this._data.set(`extra_param_${n}`, value);
    }
    // === Costs & Revenue ===
    getCost() {
        return this._data.get('cost') ?? 0;
    }
    setCost(value) {
        this._data.set('cost', value);
    }
    getRevenue() {
        return this._data.get('revenue') ?? 0;
    }
    setRevenue(value) {
        this._data.set('revenue', value);
    }
    // === Flags ===
    isBot() {
        return this._data.get('is_bot') === true || this._data.get('is_bot') === 1;
    }
    setIsBot(value) {
        this._data.set('is_bot', value);
    }
    isProxy() {
        return this._data.get('is_using_proxy') === true || this._data.get('is_using_proxy') === 1;
    }
    setIsProxy(value) {
        this._data.set('is_using_proxy', value);
    }
    isUniqueStream() {
        return this._data.get('is_unique_stream') === true;
    }
    setIsUniqueStream(value) {
        this._data.set('is_unique_stream', value);
    }
    isUniqueCampaign() {
        return this._data.get('is_unique_campaign') === true;
    }
    setIsUniqueCampaign(value) {
        this._data.set('is_unique_campaign', value);
    }
    isUniqueGlobal() {
        return this._data.get('is_unique_global') === true;
    }
    setIsUniqueGlobal(value) {
        this._data.set('is_unique_global', value);
    }
    // === Destination ===
    getDestination() {
        return this._data.get('destination');
    }
    setDestination(value) {
        this._data.set('destination', value);
    }
    // === Timestamps ===
    getDatetime() {
        const dt = this._data.get('datetime');
        return dt instanceof Date ? dt : new Date();
    }
    setDatetime(value) {
        this._data.set('datetime', value);
    }
    // === Generic Access ===
    get(key) {
        return this._data.get(key);
    }
    set(key, value) {
        this._data.set(key, value);
    }
    getData() {
        const result = {};
        for (const [key, value] of this._data) {
            result[key] = value;
        }
        return result;
    }
}
exports.RawClick = RawClick;
//# sourceMappingURL=raw-click.js.map