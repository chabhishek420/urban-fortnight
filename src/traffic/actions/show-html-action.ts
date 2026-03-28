/**
 * Show HTML Action
 * 
 * Displays custom HTML content.
 * 
 * @see keitaro_source/application/Traffic/Actions/Predefined/ShowHtml.php
 */

import { AbstractAction, ActionType, ActionField } from './abstract-action';

export class ShowHtmlAction extends AbstractAction {
  protected _weight = 100;

  constructor() {
    super('show_html');
  }

  getType(): ActionType {
    return ActionType.OTHER;
  }

  getField(): ActionField {
    return ActionField.TEXT;
  }

  execute(): void {
    this.executeInContext();
  }

  protected executeDefault(): void {
    const html = this.buildContent();
    
    this.setContentType('text/html');
    this.setDestinationInfo(html.substring(0, 500)); // Truncate for storage
    this.setContent(html);
  }

  protected executeForScript(): void {
    const html = this.buildContent();
    
    this.setContentType('application/javascript');
    const code = `document.write(${JSON.stringify(html)});`;
    
    this.setDestinationInfo(code.substring(0, 500));
    this.setContent(code);
  }

  protected executeForFrame(): void {
    let html = this.buildContent();
    
    // Wrap in basic HTML if not already
    if (!html.toLowerCase().includes('<html')) {
      html = `<!DOCTYPE html>
<html>
<head><style>body{margin:0}</style></head>
<body>${html}</body>
</html>`;
    }
    
    this.setContentType('text/html');
    this.setDestinationInfo(html.substring(0, 500));
    this.setContent(html);
  }

  private buildContent(): string {
    return this.processMacros(this.getRawActionPayload());
  }
}
