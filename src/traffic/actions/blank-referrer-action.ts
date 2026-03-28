/**
 * Blank Referrer Action
 * 
 * Performs a redirect while blanking the referrer.
 * 
 * @see keitaro_source/application/Traffic/Actions/Predefined/BlankReferrer.php
 */

import { AbstractAction, ActionType, ActionField } from './abstract-action';
import { RedirectService } from './service/redirect-service';

export class BlankReferrerAction extends AbstractAction {
  protected _weight = 3;

  constructor() {
    super('blank_referrer');
  }

  getType(): ActionType {
    return ActionType.REDIRECT;
  }

  getField(): ActionField {
    return ActionField.URL;
  }

  execute(): void {
    this.setDestinationInfo(this.getActionPayload());
    this.executeInContext();
  }

  protected executeDefault(): void {
    const url = this.getActionPayload();
    const redirectService = RedirectService.getInstance();
    
    const html = redirectService.metaRedirect(url, {
      delay: 0,
      noReferrer: true
    });
    
    this.setContent(html);
  }

  protected executeForScript(): void {
    const url = this.getActionPayload();
    const redirectService = RedirectService.getInstance();
    
    const html = redirectService.metaRedirect(url, {
      delay: 0,
      noReferrer: true
    });
    
    this.setContentType('application/javascript');
    
    // Escape for JavaScript
    const escaped = html.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
    this.setContent(`document.write("${escaped}");`);
  }
}
