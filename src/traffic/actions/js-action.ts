/**
 * JavaScript Redirect Action
 * 
 * Performs redirect using JavaScript.
 * 
 * @see keitaro_source/application/Traffic/Actions/Predefined/Js.php
 */

import { AbstractAction, ActionType, ActionField } from './abstract-action';

export class JsAction extends AbstractAction {
  protected _weight = 4;

  constructor() {
    super('js');
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
    const html = this.buildJsRedirect(url);
    
    this.setContentType('text/html');
    this.setContent(html);
  }

  protected executeForScript(): void {
    const url = this.getActionPayload();
    const script = this.buildJsCode(url);
    
    this.setContentType('application/javascript');
    this.setContent(script);
  }

  protected executeForFrame(): void {
    const url = this.getActionPayload();
    
    // For frame, just redirect
    this.addHeader('Location: ' + url);
    this.setContent('');
  }

  private buildJsRedirect(url: string): string {
    return `<!DOCTYPE html>
<html>
<head>
  <script>
    window.location.href = "${url}";
  </script>
</head>
<body>
  <p>Redirecting...</p>
</body>
</html>`;
  }

  private buildJsCode(url: string): string {
    return `window.location.href = "${url}";`;
  }
}
