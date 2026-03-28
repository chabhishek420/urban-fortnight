/**
 * Action Factory
 *
 * Creates action instances by type.
 *
 * @see keitaro_source/application/Traffic/Actions/Service/StreamActionService.php
 */
import { AbstractAction } from './abstract-action';
import { ActionTypeValue } from './action-types';
export { ActionTypeValue } from './action-types';
/**
 * Register an action class
 */
export declare function registerAction(type: ActionTypeValue, actionClass: new () => AbstractAction): void;
/**
 * Create an action by type
 */
export declare function createAction(type: ActionTypeValue): AbstractAction | null;
/**
 * Get all registered action types
 */
export declare function getRegisteredActionTypes(): ActionTypeValue[];
/**
 * Check if action type is registered
 */
export declare function hasAction(type: string): boolean;
/**
 * Get default action type
 */
export declare function getDefaultActionType(): ActionTypeValue;
//# sourceMappingURL=action-factory.d.ts.map