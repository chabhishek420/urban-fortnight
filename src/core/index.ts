/**
 * Core module exports
 */

// Context
export { type ContextInterface, BaseContext } from './context/context-interface';

// Dispatcher
export { type DispatcherInterface, SimpleDispatcher, AbstractDispatcher } from './dispatcher/dispatcher-interface';

// Entity
export { type EntityModelInterface, type EntityFieldDefinition, type EntityDefinition } from './entity/entity-model-interface';
export { EntityState, isActive, isDisabled, isDeleted, parseState } from './entity/state';

// Model
export { AbstractModel } from './model/abstract-model';

// Pipeline
export { type StageInterface, AbstractStage, StageException, CampaignNotFoundException, SendToCampaignException } from './pipeline/stage-interface';

// Router
export { TrafficRouter, TrafficRouterResult, TrafficRouterParams } from './router/traffic-router';
