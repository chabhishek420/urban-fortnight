/**
 * SubId Action
 * 
 * Sets the sub_id on the click for tracking purposes.
 * 
 * @see keitaro_source/application/Traffic/Actions/Predefined/SubId.php
 */

import { AbstractAction, ActionType, ActionField } from './abstract-action';

export class SubIdAction extends AbstractAction {
  constructor() {
    super('sub_id');
  }

  getType(): ActionType {
    return ActionType.HIDDEN;
  }

  getField(): ActionField {
    return ActionField.TEXT;
  }

  execute(): void {
    const subId = this.getActionPayload();
    const rawClick = this.getRawClick();
    
    // Set the sub_id on the click
    rawClick.setSubId(subId);
  }
}
