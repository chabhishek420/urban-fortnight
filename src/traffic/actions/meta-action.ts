/**
 * Meta Refresh Action
 * 
 * Performs a redirect using HTML meta refresh tag.
 * 
 * @see keitaro_source/application/Traffic/Actions/Predefined/Meta.php
 */

import { AbstractAction, ActionType, ActionField } from './abstract-action';

export class MetaAction extends AbstractAction {
  protected _weight = 2;

  constructor() {
    super('meta');
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
    const html = this.buildMetaRedirect(url);
    this.setContentType('text/html');
    this.setContent(html);
  }

  protected executeForScript(): void {
    const url = this.getActionPayload();
    const html = this.buildMetaRedirect(url);
    
    this.setContentType('application/javascript');
    this.setContent(`document.write(${JSON.stringify(html)});`);
  }

  private buildMetaRedirect(url: string): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0;url=${url}">
  <title>Redirecting...</title>
</head>
<body>
  <p>Redirecting to <a href="${url}">${url}</a></p>
  <script>window.location.href="${url}";</script>
</body>
</html>`;
  }
}
