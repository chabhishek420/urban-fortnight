/**
 * Status 404 Action
 * 
 * Returns a 404 Not Found response.
 * 
 * @see keitaro_source/application/Traffic/Actions/Predefined/Status404.php
 */

import { AbstractAction, ActionType, ActionField } from './abstract-action';
import { StatusCode } from '../response/status-code';

export class Status404Action extends AbstractAction {
  protected _weight = 1001;

  constructor() {
    super('status_404');
  }

  getType(): ActionType {
    return ActionType.OTHER;
  }

  getField(): ActionField {
    return ActionField.NOTHING;
  }

  execute(): void {
    this.setStatus(StatusCode.NOT_FOUND);
    this.setContentType('text/html');
    this.setContent(`<!DOCTYPE html>
<html>
<head><title>404 Not Found</title></head>
<body>
<h1>Not Found</h1>
<p>The requested URL was not found on this server.</p>
</body>
</html>`);
  }
}
