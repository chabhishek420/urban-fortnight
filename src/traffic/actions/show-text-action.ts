/**
 * Show Text Action
 * 
 * Displays plain text content.
 * 
 * @see keitaro_source/application/Traffic/Actions/Predefined/ShowText.php
 */

import { AbstractAction, ActionType, ActionField } from './abstract-action';

export class ShowTextAction extends AbstractAction {
  protected _weight = 101;

  constructor() {
    super('show_text');
  }

  getType(): ActionType {
    return ActionType.OTHER;
  }

  getField(): ActionField {
    return ActionField.TEXT;
  }

  execute(): void {
    const text = this.getActionPayload();
    
    this.setContentType('text/plain');
    this.setDestinationInfo(text.substring(0, 500));
    this.setContent(text);
  }
}
