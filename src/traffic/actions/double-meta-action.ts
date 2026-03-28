/**
 * Double Meta Refresh Action
 * 
 * Performs two meta refresh redirects to blank the referrer.
 * 
 * @see keitaro_source/application/Traffic/Actions/Predefined/DoubleMeta.php
 */

import { AbstractAction, ActionType, ActionField } from './abstract-action';

export class DoubleMetaAction extends AbstractAction {
  protected _weight = 3;

  constructor() {
    super('double_meta');
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
    
    // First meta refresh to intermediate page
    const intermediateUrl = this.buildIntermediateUrl(url);
    const html = this.buildMetaRedirect(intermediateUrl);
    
    this.setContentType('text/html');
    this.setContent(html);
  }

  protected executeForScript(): void {
    const url = this.getActionPayload();
    const intermediateUrl = this.buildIntermediateUrl(url);
    const html = this.buildMetaRedirect(intermediateUrl);
    
    this.setContentType('application/javascript');
    this.setContent(`document.write(${JSON.stringify(html)});`);
  }

  private buildIntermediateUrl(targetUrl: string): string {
    // Create a data URL that will do the second redirect
    const secondRedirect = this.buildSecondRedirect(targetUrl);
    return `data:text/html;charset=utf-8,${encodeURIComponent(secondRedirect)}`;
  }

  private buildSecondRedirect(url: string): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0;url=${url}">
</head>
<body>
  <script>window.location.replace("${url}");</script>
</body>
</html>`;
  }

  private buildMetaRedirect(url: string): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0;url=${url}">
</head>
<body></body>
</html>`;
  }
}
