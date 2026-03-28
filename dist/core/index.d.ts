/**
 * Core module exports
 */
export { ContextInterface, BaseContext } from './context/context-interface.js';
export { DispatcherInterface, SimpleDispatcher, AbstractDispatcher } from './dispatcher/dispatcher-interface.js';
export { EntityModelInterface, EntityFieldDefinition, EntityDefinition } from './entity/entity-model-interface.js';
export { EntityState, isActive, isDisabled, isDeleted, parseState } from './entity/state.js';
export { AbstractModel } from './model/abstract-model.js';
export { StageInterface, AbstractStage, StageException, CampaignNotFoundException, SendToCampaignException } from './pipeline/stage-interface.js';
export { TrafficRouter, TrafficRouterResult, TrafficRouterParams } from './router/traffic-router.js';
//# sourceMappingURL=index.d.ts.map