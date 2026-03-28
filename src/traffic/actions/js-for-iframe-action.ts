/**
 * JS for Iframe Action
 * 
 * Specialized redirect action for iframe contexts.
 * 
 * @see keitaro_source/application/Traffic/Actions/Predefined/JsForIframe.php
 */

import { AbstractAction, ActionType, ActionField } from './abstract-action';
import { RedirectService } from './service/redirect-service';

export class JsForIframeAction extends AbstractAction {
  protected _weight = 999;

  constructor() {
    super('js_for_iframe');
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
    this.executeForFrame();
  }

  protected executeForFrame(): void {
    const url = this.getActionPayload();
    this.setDestinationInfo(url);
    
    const redirectService = RedirectService.getInstance();
    this.setContent(redirectService.frameRedirect(url));
  }
}
