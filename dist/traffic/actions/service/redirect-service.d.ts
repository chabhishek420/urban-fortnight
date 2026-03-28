/**
 * Redirect Service
 *
 * Provides helper methods for various redirect types.
 *
 * @see keitaro_source/application/Traffic/Actions/Service/RedirectService.php
 */
export interface MetaRedirectOptions {
    delay?: number;
    noReferrer?: boolean;
}
/**
 * Redirect Service
 */
export declare class RedirectService {
    private static instance;
    static getInstance(): RedirectService;
    /**
     * Generate script redirect code
     */
    scriptRedirect(url: string): string;
    /**
     * Generate frame redirect code
     */
    frameRedirect(url: string): string;
    /**
     * Generate meta redirect HTML
     */
    metaRedirect(url: string, options?: MetaRedirectOptions): string;
}
//# sourceMappingURL=redirect-service.d.ts.map