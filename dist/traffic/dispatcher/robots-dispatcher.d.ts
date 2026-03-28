/**
 * Robots Dispatcher
 *
 * Handles robots.txt requests.
 * Returns allow/disallow directives based on domain settings.
 *
 * @see keitaro_source/application/Traffic/Dispatcher/RobotsDispatcher.php
 */
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface.js';
import type { ServerRequest } from '../request/server-request.js';
import type { Response } from '../response/response.js';
export declare class RobotsDispatcher implements DispatcherInterface {
    static readonly ROBOTS_DISALLOW = "User-agent: *\nDisallow: /";
    static readonly ROBOTS_ALLOW = "User-agent: *\nAllow: /";
    /**
     * Dispatch robots.txt request
     */
    dispatch(request: ServerRequest): Response;
    /**
     * Get robots.txt content
     */
    private getRobotsContent;
    /**
     * Find domain indexing setting
     */
    private findDomainRobots;
}
//# sourceMappingURL=robots-dispatcher.d.ts.map