/**
 * Pipeline Payload
 *
 * Carries state through the traffic processing pipeline.
 * Each stage can read and modify the payload.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Payload.php
 */
export declare class Payload {
    private _serverRequest;
    private _response;
    private _rawClick;
    private _rawClicksToStore;
    private _campaign;
    private _stream;
    private _landing;
    private _offer;
    private _actionType;
    private _actionPayload;
    private _actionOptions;
    private _forcedOfferId;
    private _forcedCampaignId;
    private _forcedStreamId;
    private _tokenNeeded;
    private _addTokenToUrl;
    private _forceRedirectOffer;
    private _forceChooseOffer;
    private _aborted;
    private _cookieBindStream;
    private _cookieBindLanding;
    private _cookieBindOffer;
    private _saveToken;
    private _saveUniquenessId;
    constructor(options?: PayloadOptions);
    getServerRequest(): ServerRequest;
    setServerRequest(request: ServerRequest): void;
    getResponse(): Response | null;
    setResponse(response: Response): void;
    getRawClick(): RawClick | null;
    setRawClick(click: RawClick): void;
    addRawClickToStore(click: RawClick): void;
    getRawClicksToStore(): RawClick[];
    getCampaign(): Campaign | null;
    setCampaign(campaign: Campaign | null): void;
    getStream(): BaseStream | null;
    setStream(stream: BaseStream | null): void;
    getLanding(): Landing | null;
    setLanding(landing: Landing | null): void;
    getOffer(): Offer | null;
    setOffer(offer: Offer | null): void;
    getActionType(): string | null;
    setActionType(type: string | null): void;
    getActionPayload(): unknown;
    setActionPayload(payload: unknown): void;
    getActionOptions(): Record<string, unknown> | null;
    getActionOption<T = unknown>(key: string): T | null;
    setActionOptions(options: Record<string, unknown> | null): void;
    getForcedOfferId(): number | null;
    setForcedOfferId(id: number): void;
    getForcedCampaignId(): number | null;
    setForcedCampaignId(id: number): void;
    getForcedStreamId(): number | null;
    setForcedStreamId(id: number): void;
    isTokenNeeded(): boolean;
    setNeedToken(needed?: boolean): void;
    shouldAddTokenToUrl(): boolean;
    setAddTokenToUrl(add?: boolean): void;
    isForceRedirectOffer(): boolean;
    setForceRedirectOffer(force?: boolean): void;
    isForceChooseOffer(): boolean;
    setForceChooseOffer(force?: boolean): void;
    isAborted(): boolean;
    abort(status?: boolean): void;
    enableCookieBindStream(): void;
    isCookieStreamBinded(): boolean;
    enableCookieBindLanding(): void;
    isCookieLandingBinded(): boolean;
    enableCookieBindOffer(): void;
    isCookieOfferBinded(): boolean;
    enableSaveToken(): void;
    isSaveTokenRequired(): boolean;
    enableSaveUniquenessId(): void;
    isSaveUniquenessRequired(): boolean;
}
/**
 * Payload constructor options
 */
export interface PayloadOptions {
    serverRequest?: ServerRequest;
    response?: Response;
    rawClick?: RawClick;
    campaign?: Campaign;
    stream?: BaseStream;
    landing?: Landing;
    offer?: Offer;
    forceRedirectOffer?: boolean;
}
import type { ServerRequest } from '../request/server-request.js';
import type { Response } from '../response/response.js';
import type { RawClick } from '../model/raw-click.js';
import type { Campaign } from '../model/campaign.js';
import type { BaseStream } from '../model/base-stream.js';
import type { Landing } from '../model/landing.js';
import type { Offer } from '../model/offer.js';
//# sourceMappingURL=payload.d.ts.map