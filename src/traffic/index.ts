/**
 * Traffic module exports
 */

// Request/Response
export { ServerRequest, type ServerRequestOptions } from './request/server-request';
export { Response, type ResponseOptions, type ResponseBuildOptions, type JsonResponseOptions } from './response/response';
export { StatusCode, isSuccessStatus, isRedirectStatus, isClientErrorStatus, isServerErrorStatus } from './response/status-code';
export { ContentType, getContentTypeFromExtension } from './response/content-type';

// Pipeline
export { Payload, type PayloadOptions } from './pipeline/payload';
export {
  Pipeline,
  PipelineFactory,
  PipelineException,
  type PipelineInterface,
  type PipelineConfig
} from './pipeline/pipeline';

// Core pipeline exports
export { type StageInterface, AbstractStage, StageException, CampaignNotFoundException, SendToCampaignException } from '../core/pipeline/stage-interface';

// Models
export { Campaign, CampaignType, CostType, UniquenessMethod, UniqueCheckMethod, VisitorBinding, type CampaignTypeValue, type CostTypeValue, type UniquenessMethodValue } from './model/campaign';
export { BaseStream, StreamType, StreamSchema, type StreamTypeValue, type StreamSchemaValue } from './model/base-stream';
export { Offer, OfferType, PayoutType, type OfferTypeValue, type PayoutTypeValue } from './model/offer';
export { Landing, LandingType, type LandingTypeValue } from './model/landing';
export { RawClick } from './model/raw-click';
export { AffiliateNetwork } from './model/affiliate-network';
export { TrafficSource } from './model/traffic-source';
export { Domain, type DomainState, type SslStatus, type NetworkStatus } from './model/domain';
export { User, type UserType } from './model/user';
export { Setting } from './model/setting';
export { Conversion, type ConversionStatus } from './model/conversion';
export { StreamFilter, FilterMode, FilterName, type FilterModeValue, type FilterNameValue, type StreamFilterData } from './model/stream-filter';

// Logging
export { TrafficLogEntry } from './logging/traffic-log-entry';

// Pipeline Stages
export { ExecuteActionStage } from './pipeline/stage/execute-action-stage';
export { StoreRawClicksStage } from './pipeline/stage/store-raw-clicks-stage';
export { PrepareRawClickToStoreStage } from './pipeline/stage/prepare-raw-click-to-store-stage';
export { CheckSendingToAnotherCampaignStage } from './pipeline/stage/check-sending-to-another-campaign-stage';

// Actions
export {
  AbstractAction,
  ActionField,
  ActionType,
  ActionTypes,
  ActionCategories,
  ActionDefinitions,
  createAction,
  registerAction,
  getRegisteredActionTypes,
  hasAction,
  HttpRedirectAction,
  IframeAction,
  MetaAction,
  DoubleMetaAction,
  JsAction,
  ShowHtmlAction,
  ShowTextAction,
  DoNothingAction,
  Status404Action,
  ToCampaignAction,
} from './actions/index';
