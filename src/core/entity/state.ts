/**
 * Entity State
 * 
 * Represents the possible states of an entity in the system.
 * 
 * @see keitaro_source/application/Core/Entity/State.php
 */
export enum EntityState {
  ACTIVE = 'active',
  DISABLED = 'disabled',
  DELETED = 'deleted',
  PENDING = 'pending',
  ARCHIVED = 'archived'
}

/**
 * Check if state is active
 */
export function isActive(state: EntityState | string): boolean {
  return state === EntityState.ACTIVE;
}

/**
 * Check if state is disabled
 */
export function isDisabled(state: EntityState | string): boolean {
  return state === EntityState.DISABLED;
}

/**
 * Check if state is deleted
 */
export function isDeleted(state: EntityState | string): boolean {
  return state === EntityState.DELETED;
}

/**
 * Parse state from string
 */
export function parseState(value: string): EntityState {
  const normalized = value.toLowerCase();
  switch (normalized) {
    case 'active':
    case 'enabled':
    case '1':
      return EntityState.ACTIVE;
    case 'disabled':
    case '0':
      return EntityState.DISABLED;
    case 'deleted':
      return EntityState.DELETED;
    case 'pending':
      return EntityState.PENDING;
    case 'archived':
      return EntityState.ARCHIVED;
    default:
      return EntityState.ACTIVE;
  }
}
