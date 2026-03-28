/**
 * Raw Click Model
 *
 * Represents raw click data before it's stored in the database.
 * This is the primary data structure that flows through the pipeline.
 *
 * @see keitaro_source/application/Traffic/RawClick.php
 */
export declare class RawClick {
    private _data;
    constructor(data?: Record<string, unknown>);
    getSubId(): string;
    setSubId(value: string): void;
    getParentSubId(): string | undefined;
    setParentSubId(value: string): void;
    getVisitorId(): number | undefined;
    setVisitorId(value: number): void;
    getCampaignId(): number | undefined;
    setCampaignId(value: number): void;
    getParentCampaignId(): number | undefined;
    setParentCampaignId(value: number): void;
    getStreamId(): number | undefined;
    setStreamId(value: number): void;
    getLandingId(): number | undefined;
    setLandingId(value: number): void;
    getOfferId(): number | undefined;
    setOfferId(value: number): void;
    getAffiliateNetworkId(): number | undefined;
    setAffiliateNetworkId(value: number): void;
    getIp(): string;
    setIp(value: string): void;
    getUserAgent(): string;
    setUserAgent(value: string): void;
    getReferrer(): string | undefined;
    setReferrer(value: string): void;
    getCountry(): string | undefined;
    setCountry(value: string): void;
    getRegion(): string | undefined;
    setRegion(value: string): void;
    getCity(): string | undefined;
    setCity(value: string): void;
    getIsp(): string | undefined;
    setIsp(value: string): void;
    getConnectionType(): string | undefined;
    setConnectionType(value: string): void;
    getDeviceType(): string | undefined;
    setDeviceType(value: string): void;
    getDeviceModel(): string | undefined;
    setDeviceModel(value: string): void;
    getOs(): string | undefined;
    setOs(value: string): void;
    getOsVersion(): string | undefined;
    setOsVersion(value: string): void;
    getBrowser(): string | undefined;
    setBrowser(value: string): void;
    getBrowserVersion(): string | undefined;
    setBrowserVersion(value: string): void;
    getLanguage(): string | undefined;
    setLanguage(value: string): void;
    getKeyword(): string | undefined;
    setKeyword(value: string): void;
    getSearchEngine(): string | undefined;
    setSearchEngine(value: string): void;
    getSource(): string | undefined;
    setSource(value: string): void;
    getSubIdN(n: number): string | undefined;
    setSubIdN(n: number, value: string): void;
    getExtraParamN(n: number): string | undefined;
    setExtraParamN(n: number, value: string): void;
    getCost(): number;
    setCost(value: number): void;
    getRevenue(): number;
    setRevenue(value: number): void;
    isBot(): boolean;
    setIsBot(value: boolean): void;
    isProxy(): boolean;
    setIsProxy(value: boolean): void;
    isUniqueStream(): boolean;
    setIsUniqueStream(value: boolean): void;
    isUniqueCampaign(): boolean;
    setIsUniqueCampaign(value: boolean): void;
    isUniqueGlobal(): boolean;
    setIsUniqueGlobal(value: boolean): void;
    getDestination(): string | undefined;
    setDestination(value: string): void;
    getDatetime(): Date;
    setDatetime(value: Date): void;
    get<T = unknown>(key: string): T | undefined;
    set(key: string, value: unknown): void;
    getData(): Record<string, unknown>;
}
//# sourceMappingURL=raw-click.d.ts.map