/**
 * Abstract Service Base Class
 * 
 * Provides singleton pattern for service classes.
 * 
 * @see keitaro_source/application/Traffic/Service/AbstractService.php
 */
export abstract class AbstractService {
  private static _instances: Map<string, AbstractService> = new Map();

  /**
   * Get singleton instance of the service
   */
  public static instance<T extends AbstractService>(this: new () => T): T {
    const className = this.name;
    if (!AbstractService._instances.has(className)) {
      AbstractService._instances.set(className, new this());
    }
    return AbstractService._instances.get(className) as T;
  }

  /**
   * Reset the singleton instance (useful for testing)
   */
  public static reset<T extends AbstractService>(this: new () => T): void {
    const className = this.name;
    AbstractService._instances.delete(className);
  }

  /**
   * Clear all singleton instances
   */
  public static resetAll(): void {
    AbstractService._instances.clear();
  }
}
