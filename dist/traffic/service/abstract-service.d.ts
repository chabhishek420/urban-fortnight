/**
 * Abstract Service Base Class
 *
 * Provides singleton pattern for service classes.
 *
 * @see keitaro_source/application/Traffic/Service/AbstractService.php
 */
export declare abstract class AbstractService {
    private static _instances;
    /**
     * Get singleton instance of the service
     */
    static instance<T extends AbstractService>(this: new () => T): T;
    /**
     * Reset the singleton instance (useful for testing)
     */
    static reset<T extends AbstractService>(this: new () => T): void;
    /**
     * Clear all singleton instances
     */
    static resetAll(): void;
}
//# sourceMappingURL=abstract-service.d.ts.map