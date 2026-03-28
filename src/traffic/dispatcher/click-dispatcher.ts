/**
 * Click Dispatcher
 * 
 * Main dispatcher for processing regular click traffic.
 * Runs the first level pipeline stages to process the click.
 * 
 * @see keitaro_source/application/Traffic/Dispatcher/ClickDispatcher.php
 */

import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface';
import type { ServerRequest } from '../request/server-request';
import type { Response } from '../response/response';
import type { ContextInterface } from '../../core/context/context-interface';
import { Response as HttpResponse } from '../response/response';
import { StatusCode } from '../response/status-code';
import { Payload } from '../pipeline/payload';
import { Pipeline } from '../pipeline/pipeline';
import { TrafficLogEntry } from '../logging/traffic-log-entry';
import { RawClick } from '../model/raw-click';

export class ClickDispatcher implements DispatcherInterface {
  /**
   * Dispatch the click request through the pipeline
   */
  async dispatch(request: ServerRequest): Promise<Response> {
    const response = HttpResponse.buildHtml({
      disableCache: true
    });
    
    // Create log entry
    const logEntry = new TrafficLogEntry();
    logEntry.add('ClickDispatcher: Starting dispatch');
    
    // Check license (in production)
    if (this.isLicenseExpired()) {
      return this.getErrorResponse('License expired', StatusCode.PAYMENT_REQUIRED);
    }
    
    try {
      // Create pipeline payload
      const pipelinePayload = new Payload({
        serverRequest: request,
        response,
        rawClick: new RawClick()
      });
      pipelinePayload.setForceRedirectOffer(true);
      
      // Create and configure pipeline
      const pipeline = new Pipeline();
      pipeline.firstLevelStages();
      
      logEntry.add(`Pipeline stages: ${pipeline.getStages().length}`);
      
      // Run the pipeline
      const result = await pipeline.process(pipelinePayload, logEntry);
      
      // Get the final response
      const finalResponse = result.getResponse();
      
      logEntry.add('ClickDispatcher: Pipeline completed');
      
      // Log the entry (in production, this would go to a log file)
      console.log(logEntry.toString());
      
      return finalResponse || response;
      
    } catch (e) {
      const error = e as Error;
      logEntry.add(`Error: ${error.message}`);
      console.error('ClickDispatcher error:', error);
      console.log(logEntry.toString());
      return this.getErrorResponse(error.message);
    }
  }

  /**
   * Process context through the pipeline (for DispatcherInterface)
   */
  process(context: ContextInterface): ContextInterface {
    // This is a simplified sync version for compatibility
    // In production, use dispatch() which is async
    return context;
  }

  /**
   * Check if license is expired
   */
  private isLicenseExpired(): boolean {
    // In production: Check TsService for license status
    return false;
  }

  /**
   * Get error response
   */
  private getErrorResponse(_message: string, status: number = StatusCode.NOT_IMPLEMENTED): Response {
    // In production: Hide error message if not in debug mode
    const errorMessage = 'Sorry. Some internal problems. Please read System Log.';
    
    return HttpResponse.buildHtml({
      body: errorMessage,
      status
    });
  }
}
