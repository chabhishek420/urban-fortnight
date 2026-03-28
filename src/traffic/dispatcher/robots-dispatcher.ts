/**
 * Robots Dispatcher
 * 
 * Handles robots.txt requests.
 * Returns allow/disallow directives based on domain settings.
 * 
 * @see keitaro_source/application/Traffic/Dispatcher/RobotsDispatcher.php
 */
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface';
import type { ServerRequest } from '../request/server-request';
import type { Response } from '../response/response';
import { Response as HttpResponse } from '../response/response';
import { StatusCode } from '../response/status-code';
import { ContentType } from '../response/content-type';

export class RobotsDispatcher implements DispatcherInterface {
  static readonly ROBOTS_DISALLOW = 'User-agent: *\nDisallow: /';
  static readonly ROBOTS_ALLOW = 'User-agent: *\nAllow: /';

  /**
   * Dispatch robots.txt request
   */
  dispatch(request: ServerRequest): Response {
    const robotsContent = this.getRobotsContent(request);
    
    return new HttpResponse({
      status: StatusCode.OK,
      disableCache: true
    })
      .withHeader(ContentType.HEADER, ContentType.TEXT)
      .withBody(robotsContent);
  }

  /**
   * Get robots.txt content
   */
  private getRobotsContent(request: ServerRequest): string {
    const allowIndexing = this.findDomainRobots(request);
    
    if (!allowIndexing) {
      return RobotsDispatcher.ROBOTS_DISALLOW;
    }
    
    return RobotsDispatcher.ROBOTS_ALLOW;
  }

  /**
   * Find domain indexing setting
   */
  private findDomainRobots(_request: ServerRequest): boolean {
    // In production: Query CachedDomainRepository for domain settings
    // const domains = CachedDomainRepository::instance()->allActiveCached();
    // const requestedDomain = request.getUri().getHost();
    // Find matching domain and return allow_indexing setting
    
    // Default: disallow indexing
    return false;
  }
}
