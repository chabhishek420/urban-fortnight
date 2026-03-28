/**
 * Update Tokens Dispatcher
 * 
 * Handles token update requests.
 * Updates click tokens with additional parameters.
 * 
 * @see keitaro_source/application/Traffic/Dispatcher/UpdateTokensDispatcher.php
 */
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface';
import type { ServerRequest } from '../request/server-request';
import type { Response } from '../response/response';
import { Response as HttpResponse } from '../response/response';
import { StatusCode } from '../response/status-code';

export class UpdateTokensDispatcher implements DispatcherInterface {
  /**
   * Dispatch token update request
   */
  dispatch(request: ServerRequest): Response {
    const response = new HttpResponse({
      disableCache: true
    });
    
    // Check for sub_id
    if (!request.hasParam('sub_id')) {
      return new HttpResponse({
        status: StatusCode.BAD_REQUEST,
        body: `[UpdateTokens] SubId is empty in : ${JSON.stringify(request.getQueryParams())}`
      });
    }
    
    const subId = request.getParam('sub_id');
    const params = request.getQueryParams();
    
    // Update tokens
    this.updateTokens(subId ?? '', params);
    
    return response;
  }

  /**
   * Update tokens for a click
   */
  private updateTokens(subId: string, params: Record<string, string>): void {
    // In production: UpdateClickCommand::updateTokens(subId, params)
    console.log(`[UpdateTokens] Updating tokens for sub_id: ${subId}`, params);
  }
}
