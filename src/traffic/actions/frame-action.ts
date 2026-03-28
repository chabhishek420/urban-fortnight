/**
 * Frame Action
 * 
 * Embeds target URL in a frameset.
 * 
 * @see keitaro_source/application/Traffic/Actions/Predefined/Frame.php
 */

import { AbstractAction, ActionType, ActionField } from './abstract-action';

export class FrameAction extends AbstractAction {
  protected _weight = 200;

  constructor() {
    super('frame');
  }

  getType(): ActionType {
    return ActionType.REDIRECT;
  }

  getField(): ActionField {
    return ActionField.URL;
  }

  execute(): void {
    this.executeInContext();
  }

  protected executeDefault(): void {
    const url = this.getActionPayload();
    this.setDestinationInfo(url);
    
    const html = `<html>
            <head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" /></head>
            <frameset rows="100%"><frame src="${url}"></frameset></html>`;
    
    this.setContent(html);
  }
}
