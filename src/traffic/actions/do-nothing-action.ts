/**
 * Do Nothing Action
 * 
 * Returns an empty response.
 * 
 * @see keitaro_source/application/Traffic/Actions/Predefined/DoNothing.php
 */

import { AbstractAction, ActionType, ActionField } from './abstract-action';

export class DoNothingAction extends AbstractAction {
  protected _weight = 1000;

  constructor() {
    super('do_nothing');
  }

  getType(): ActionType {
    return ActionType.HIDDEN;
  }

  getField(): ActionField {
    return ActionField.NOTHING;
  }

  execute(): void {
    // Do nothing - return empty response
    this.setContent('');
  }
}
