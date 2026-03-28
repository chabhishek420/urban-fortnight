/**
 * Pipeline Payload
 * 
 * Carries state through the traffic processing pipeline.
 * Each stage can read and modify the payload.
 * 
 * @see keitaro_source/application/Traffic/Pipeline/Payload.php
 */
export class Payload {
  // Core request/response
  private _serverRequest: ServerRequest | null = null;
  private _response: Response | null = null;

  // Raw click data
  private _rawClick: RawClick | null = null;
  private _rawClicksToStore: RawClick[] = [];

  // Entity references
  private _campaign: Campaign | null = null;
  private _stream: BaseStream | null = null;
  private _landing: Landing | null = null;
  private _offer: Offer | null = null;

  // Action data
  private _actionType: string | null = null;
  private _actionPayload: unknown = null;
  private _actionOptions: Record<string, unknown> | null = null;

  // Forced values
  private _forcedOfferId: number | null = null;
  private _forcedCampaignId: number | null = null;
  private _forcedStreamId: number | null = null;

  // Flags
  private _tokenNeeded: boolean = false;
  private _addTokenToUrl: boolean = false;
  private _forceRedirectOffer: boolean = false;
  private _forceChooseOffer: boolean = false;
  private _aborted: boolean = false;

  // Cookie binding flags
  private _cookieBindStream: boolean = false;
  private _cookieBindLanding: boolean = false;
  private _cookieBindOffer: boolean = false;
  private _saveToken: boolean = false;
  private _saveUniquenessId: boolean = false;

  constructor(options: PayloadOptions = {}) {
    if (options.serverRequest) this._serverRequest = options.serverRequest;
    if (options.response) this._response = options.response;
    if (options.rawClick) this._rawClick = options.rawClick;
    if (options.campaign) this._campaign = options.campaign;
    if (options.stream) this._stream = options.stream;
    if (options.landing) this._landing = options.landing;
    if (options.offer) this._offer = options.offer;
    if (options.forceRedirectOffer) this._forceRedirectOffer = options.forceRedirectOffer;
  }

  // === Server Request ===
  getServerRequest(): ServerRequest {
    if (!this._serverRequest) {
      throw new Error('ServerRequest not set');
    }
    return this._serverRequest;
  }

  setServerRequest(request: ServerRequest): void {
    if (!request) {
      throw new Error('Cannot set empty ServerRequest');
    }
    this._serverRequest = request;
  }

  // === Response ===
  getResponse(): Response | null {
    return this._response;
  }

  setResponse(response: Response): void {
    if (!response) {
      throw new Error('Cannot set empty Response');
    }
    this._response = response;
  }

  // === Raw Click ===
  getRawClick(): RawClick | null {
    return this._rawClick;
  }

  setRawClick(click: RawClick): void {
    this._rawClick = click;
  }

  addRawClickToStore(click: RawClick): void {
    this._rawClicksToStore.push(click);
  }

  getRawClicksToStore(): RawClick[] {
    return this._rawClicksToStore;
  }

  // === Campaign ===
  getCampaign(): Campaign | null {
    return this._campaign;
  }

  setCampaign(campaign: Campaign | null): void {
    this._campaign = campaign;
  }

  // === Stream ===
  getStream(): BaseStream | null {
    return this._stream;
  }

  setStream(stream: BaseStream | null): void {
    this._stream = stream;
  }

  // === Landing ===
  getLanding(): Landing | null {
    return this._landing;
  }

  setLanding(landing: Landing | null): void {
    this._landing = landing;
  }

  // === Offer ===
  getOffer(): Offer | null {
    return this._offer;
  }

  setOffer(offer: Offer | null): void {
    this._offer = offer;
  }

  // === Action ===
  getActionType(): string | null {
    return this._actionType;
  }

  setActionType(type: string | null): void {
    this._actionType = type;
  }

  getActionPayload(): unknown {
    return this._actionPayload;
  }

  setActionPayload(payload: unknown): void {
    this._actionPayload = payload;
  }

  getActionOptions(): Record<string, unknown> | null {
    return this._actionOptions;
  }

  getActionOption<T = unknown>(key: string): T | null {
    return this._actionOptions?.[key] as T | null ?? null;
  }

  setActionOptions(options: Record<string, unknown> | null): void {
    this._actionOptions = options;
  }

  // === Forced IDs ===
  getForcedOfferId(): number | null {
    return this._forcedOfferId;
  }

  setForcedOfferId(id: number): void {
    this._forcedOfferId = id;
  }

  getForcedCampaignId(): number | null {
    return this._forcedCampaignId;
  }

  setForcedCampaignId(id: number): void {
    this._forcedCampaignId = id;
  }

  getForcedStreamId(): number | null {
    return this._forcedStreamId;
  }

  setForcedStreamId(id: number): void {
    this._forcedStreamId = id;
  }

  // === Flags ===
  isTokenNeeded(): boolean {
    return this._tokenNeeded;
  }

  setNeedToken(needed: boolean = true): void {
    this._tokenNeeded = needed;
  }

  shouldAddTokenToUrl(): boolean {
    return this._addTokenToUrl;
  }

  setAddTokenToUrl(add: boolean = true): void {
    this._addTokenToUrl = add;
  }

  isForceRedirectOffer(): boolean {
    return this._forceRedirectOffer;
  }

  setForceRedirectOffer(force: boolean = true): void {
    this._forceRedirectOffer = force;
  }

  isForceChooseOffer(): boolean {
    return this._forceChooseOffer;
  }

  setForceChooseOffer(force: boolean = true): void {
    this._forceChooseOffer = force;
  }

  isAborted(): boolean {
    return this._aborted;
  }

  abort(status: boolean = true): void {
    this._aborted = status;
  }

  // === Cookie Binding ===
  enableCookieBindStream(): void {
    this._cookieBindStream = true;
  }

  isCookieStreamBinded(): boolean {
    return this._cookieBindStream;
  }

  enableCookieBindLanding(): void {
    this._cookieBindLanding = true;
  }

  isCookieLandingBinded(): boolean {
    return this._cookieBindLanding;
  }

  enableCookieBindOffer(): void {
    this._cookieBindOffer = true;
  }

  isCookieOfferBinded(): boolean {
    return this._cookieBindOffer;
  }

  enableSaveToken(): void {
    this._saveToken = true;
  }

  isSaveTokenRequired(): boolean {
    return this._saveToken;
  }

  enableSaveUniquenessId(): void {
    this._saveUniquenessId = true;
  }

  isSaveUniquenessRequired(): boolean {
    return this._saveUniquenessId;
  }
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

// Import types - forward declarations
import type { ServerRequest } from '../request/server-request';
import type { Response } from '../response/response';
import type { RawClick } from '../model/raw-click';
import type { Campaign } from '../model/campaign';
import type { BaseStream } from '../model/base-stream';
import type { Landing } from '../model/landing';
import type { Offer } from '../model/offer';
