/**
 * Raw Click Model
 * 
 * Represents raw click data before it's stored in the database.
 * This is the primary data structure that flows through the pipeline.
 * 
 * @see keitaro_source/application/Traffic/RawClick.php
 */
export class RawClick {
  private _data: Map<string, unknown> = new Map();

  constructor(data: Record<string, unknown> = {}) {
    for (const [key, value] of Object.entries(data)) {
      this._data.set(key, value);
    }
  }

  // === Identity ===

  getSubId(): string {
    return this._data.get('sub_id') as string ?? '';
  }

  setSubId(value: string): void {
    this._data.set('sub_id', value);
  }

  getParentSubId(): string | undefined {
    return this._data.get('parent_sub_id') as string | undefined;
  }

  setParentSubId(value: string): void {
    this._data.set('parent_sub_id', value);
  }

  getVisitorId(): number | undefined {
    return this._data.get('visitor_id') as number | undefined;
  }

  setVisitorId(value: number): void {
    this._data.set('visitor_id', value);
  }

  // === Campaign/Stream/Landing/Offer IDs ===

  getCampaignId(): number | undefined {
    return this._data.get('campaign_id') as number | undefined;
  }

  setCampaignId(value: number): void {
    this._data.set('campaign_id', value);
  }

  getParentCampaignId(): number | undefined {
    return this._data.get('parent_campaign_id') as number | undefined;
  }

  setParentCampaignId(value: number): void {
    this._data.set('parent_campaign_id', value);
  }

  getStreamId(): number | undefined {
    return this._data.get('stream_id') as number | undefined;
  }

  setStreamId(value: number): void {
    this._data.set('stream_id', value);
  }

  getLandingId(): number | undefined {
    return this._data.get('landing_id') as number | undefined;
  }

  setLandingId(value: number): void {
    this._data.set('landing_id', value);
  }

  getOfferId(): number | undefined {
    return this._data.get('offer_id') as number | undefined;
  }

  setOfferId(value: number): void {
    this._data.set('offer_id', value);
  }

  getAffiliateNetworkId(): number | undefined {
    return this._data.get('affiliate_network_id') as number | undefined;
  }

  setAffiliateNetworkId(value: number): void {
    this._data.set('affiliate_network_id', value);
  }

  // === Visitor Info ===

  getIp(): string {
    return this._data.get('ip') as string ?? '';
  }

  setIp(value: string): void {
    this._data.set('ip', value);
  }

  getUserAgent(): string {
    return this._data.get('user_agent') as string ?? '';
  }

  setUserAgent(value: string): void {
    this._data.set('user_agent', value);
  }

  getReferrer(): string | undefined {
    return this._data.get('referrer') as string | undefined;
  }

  setReferrer(value: string): void {
    this._data.set('referrer', value);
  }

  // === Geo ===

  getCountry(): string | undefined {
    return this._data.get('country') as string | undefined;
  }

  setCountry(value: string): void {
    this._data.set('country', value);
  }

  getRegion(): string | undefined {
    return this._data.get('region') as string | undefined;
  }

  setRegion(value: string): void {
    this._data.set('region', value);
  }

  getCity(): string | undefined {
    return this._data.get('city') as string | undefined;
  }

  setCity(value: string): void {
    this._data.set('city', value);
  }

  getIsp(): string | undefined {
    return this._data.get('isp') as string | undefined;
  }

  setIsp(value: string): void {
    this._data.set('isp', value);
  }

  getConnectionType(): string | undefined {
    return this._data.get('connection_type') as string | undefined;
  }

  setConnectionType(value: string): void {
    this._data.set('connection_type', value);
  }

  // === Device ===

  getDeviceType(): string | undefined {
    return this._data.get('device_type') as string | undefined;
  }

  setDeviceType(value: string): void {
    this._data.set('device_type', value);
  }

  getDeviceModel(): string | undefined {
    return this._data.get('device_model') as string | undefined;
  }

  setDeviceModel(value: string): void {
    this._data.set('device_model', value);
  }

  getOs(): string | undefined {
    return this._data.get('os') as string | undefined;
  }

  setOs(value: string): void {
    this._data.set('os', value);
  }

  getOsVersion(): string | undefined {
    return this._data.get('os_version') as string | undefined;
  }

  setOsVersion(value: string): void {
    this._data.set('os_version', value);
  }

  getBrowser(): string | undefined {
    return this._data.get('browser') as string | undefined;
  }

  setBrowser(value: string): void {
    this._data.set('browser', value);
  }

  getBrowserVersion(): string | undefined {
    return this._data.get('browser_version') as string | undefined;
  }

  setBrowserVersion(value: string): void {
    this._data.set('browser_version', value);
  }

  getLanguage(): string | undefined {
    return this._data.get('language') as string | undefined;
  }

  setLanguage(value: string): void {
    this._data.set('language', value);
  }

  // === Traffic Source ===

  getKeyword(): string | undefined {
    return this._data.get('keyword') as string | undefined;
  }

  setKeyword(value: string): void {
    this._data.set('keyword', value);
  }

  getSearchEngine(): string | undefined {
    return this._data.get('search_engine') as string | undefined;
  }

  setSearchEngine(value: string): void {
    this._data.set('search_engine', value);
  }

  getSource(): string | undefined {
    return this._data.get('source') as string | undefined;
  }

  setSource(value: string): void {
    this._data.set('source', value);
  }

  // === Sub IDs ===

  getSubIdN(n: number): string | undefined {
    return this._data.get(`sub_id_${n}`) as string | undefined;
  }

  setSubIdN(n: number, value: string): void {
    this._data.set(`sub_id_${n}`, value);
  }

  // === Extra Params ===

  getExtraParamN(n: number): string | undefined {
    return this._data.get(`extra_param_${n}`) as string | undefined;
  }

  setExtraParamN(n: number, value: string): void {
    this._data.set(`extra_param_${n}`, value);
  }

  // === Costs & Revenue ===

  getCost(): number {
    return this._data.get('cost') as number ?? 0;
  }

  setCost(value: number): void {
    this._data.set('cost', value);
  }

  getRevenue(): number {
    return this._data.get('revenue') as number ?? 0;
  }

  setRevenue(value: number): void {
    this._data.set('revenue', value);
  }

  // === Flags ===

  isBot(): boolean {
    return this._data.get('is_bot') === true || this._data.get('is_bot') === 1;
  }

  setIsBot(value: boolean): void {
    this._data.set('is_bot', value);
  }

  isProxy(): boolean {
    return this._data.get('is_using_proxy') === true || this._data.get('is_using_proxy') === 1;
  }

  setIsProxy(value: boolean): void {
    this._data.set('is_using_proxy', value);
  }

  isUniqueStream(): boolean {
    return this._data.get('is_unique_stream') === true;
  }

  setIsUniqueStream(value: boolean): void {
    this._data.set('is_unique_stream', value);
  }

  isUniqueCampaign(): boolean {
    return this._data.get('is_unique_campaign') === true;
  }

  setIsUniqueCampaign(value: boolean): void {
    this._data.set('is_unique_campaign', value);
  }

  isUniqueGlobal(): boolean {
    return this._data.get('is_unique_global') === true;
  }

  setIsUniqueGlobal(value: boolean): void {
    this._data.set('is_unique_global', value);
  }

  // === Destination ===

  getDestination(): string | undefined {
    return this._data.get('destination') as string | undefined;
  }

  setDestination(value: string): void {
    this._data.set('destination', value);
  }

  // === Timestamps ===

  getDatetime(): Date {
    const dt = this._data.get('datetime');
    return dt instanceof Date ? dt : new Date();
  }

  setDatetime(value: Date): void {
    this._data.set('datetime', value);
  }

  // === Generic Access ===

  get<T = unknown>(key: string): T | undefined {
    return this._data.get(key) as T | undefined;
  }

  set(key: string, value: unknown): void {
    this._data.set(key, value);
  }

  getData(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of this._data) {
      result[key] = value;
    }
    return result;
  }
}
