/**
 * Iframe Action
 * 
 * Embeds the target URL in an iframe.
 * 
 * @see keitaro_source/application/Traffic/Actions/Predefined/Iframe.php
 */

import { AbstractAction, ActionType, ActionField } from './abstract-action';
import { StatusCode } from '../response/status-code';

export class IframeAction extends AbstractAction {
  protected _weight = 6;

  constructor() {
    super('iframe');
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
    
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
</head>
<style type="text/css">
  body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
  iframe {
    width: 100%;
    height: 100%;
    min-height: 10000px;
    border: 0;
  }
</style>
<body>
  <iframe src="${url}"></iframe>
</body>
</html>`;
    
    this.setContentType('text/html');
    this.setContent(html);
    this.setDestinationInfo(url);
  }

  protected executeForFrame(): void {
    const url = this.getActionPayload();
    
    // For frame context, just redirect
    this.addHeader('Location: ' + url);
    this.setStatus(StatusCode.FOUND);
    this.setDestinationInfo(url);
  }
}
