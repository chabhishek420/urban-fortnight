/**
 * Entity State
 *
 * Represents the possible states of an entity in the system.
 *
 * @see keitaro_source/application/Core/Entity/State.php
 */
export declare enum EntityState {
    ACTIVE = "active",
    DISABLED = "disabled",
    DELETED = "deleted",
    PENDING = "pending",
    ARCHIVED = "archived"
}
/**
 * Check if state is active
 */
export declare function isActive(state: EntityState | string): boolean;
/**
 * Check if state is disabled
 */
export declare function isDisabled(state: EntityState | string): boolean;
/**
 * Check if state is deleted
 */
export declare function isDeleted(state: EntityState | string): boolean;
/**
 * Parse state from string
 */
export declare function parseState(value: string): EntityState;
//# sourceMappingURL=state.d.ts.map