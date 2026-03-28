"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractService = void 0;
/**
 * Abstract Service Base Class
 *
 * Provides singleton pattern for service classes.
 *
 * @see keitaro_source/application/Traffic/Service/AbstractService.php
 */
class AbstractService {
    static _instances = new Map();
    /**
     * Get singleton instance of the service
     */
    static instance() {
        const className = this.name;
        if (!AbstractService._instances.has(className)) {
            AbstractService._instances.set(className, new this());
        }
        return AbstractService._instances.get(className);
    }
    /**
     * Reset the singleton instance (useful for testing)
     */
    static reset() {
        const className = this.name;
        AbstractService._instances.delete(className);
    }
    /**
     * Clear all singleton instances
     */
    static resetAll() {
        AbstractService._instances.clear();
    }
}
exports.AbstractService = AbstractService;
//# sourceMappingURL=abstract-service.js.map