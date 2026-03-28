/**
 * HTTP Redirect Action
 * 
 * Performs a standard HTTP 302 redirect to the target URL.
 * 
 * @see keitaro_source/application/Traffic/Actions/Predefined/HttpRedirect.php
 */

import { AbstractAction, ActionType, ActionField } from './abstract-action';
import { StatusCode } from '../response/status-code';

export class HttpRedirectAction extends AbstractAction {
  protected _weight = 1;

  constructor() {
    super('http_redirect');
  }

  getType(): ActionType {
    return ActionType.REDIRECT;
  }

  getField(): ActionField {
    return ActionField.URL;
  }

  execute(): void {
    const url = this.getActionPayload();
    
    // Set Location header
    this.addHeader('Location: ' + url);
    
    // Check for kversion parameter (for client compatibility)
    const request = this.getServerRequest();
    const kversion = request.getParam('kversion');
    
    if (kversion) {
      // Version 3.4+ uses 302
      this.setStatus(StatusCode.FOUND);
    } else {
      this.setStatus(StatusCode.FOUND);
    }
    
    // Store destination in click
    this.setDestinationInfo(url);
  }
}
