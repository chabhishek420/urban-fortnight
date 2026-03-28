/**
 * Form Submit Action
 * 
 * Submits a form via JavaScript to the target URL.
 * 
 * @see keitaro_source/application/Traffic/Actions/Predefined/FormSubmit.php
 */

import { AbstractAction, ActionType, ActionField } from './abstract-action';

export class FormSubmitAction extends AbstractAction {
  protected _weight = 5;
  protected _delay = 0;

  constructor() {
    super('form_submit');
  }

  getType(): ActionType {
    return ActionType.REDIRECT;
  }

  getField(): ActionField {
    return ActionField.URL;
  }

  execute(): void {
    const url = this.getActionPayload();
    const delayMs = this._delay * 1000;
    
    let content = '<!doctype html>\n';
    content += '<head>\n';
    content += `<script>window.onload = function(){
            setTimeout(function() {
                document.forms[0].submit();
            }, ${delayMs});
        };</script>\n`;
    content += '</head><body>\n';
    content += `<form action="${url}" method="POST">`;
    
    // Add POST parameters from request
    const request = this.getServerRequest();
    const body = request.getParsedBody();
    
    if (body && typeof body === 'object') {
      for (const [name, value] of Object.entries(body)) {
        const escapedName = this.escapeHtml(name);
        const escapedValue = this.escapeHtml(String(value));
        content += `<input type="hidden" name="${escapedName}" value="${escapedValue}" />\n`;
      }
    }
    
    content += '</form>\n';
    content += '</body></html>\n';
    
    this.setContent(content);
    this.setDestinationInfo(url);
  }

  /**
   * Escape HTML entities
   */
  private escapeHtml(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
