/**
 * Landing Repository
 *
 * Repository for Landing entity database operations.
 *
 * @see keitaro_source/application/Traffic/Repository/LandingRepository.php
 */
import { BaseRepository, type RepositoryEntityDefinition } from '../../core/repository/base-repository.js';
import type { FindOptions } from '../../core/repository/repository-interface.js';
import { Landing } from '../model/landing.js';
import { EntityState } from '../../core/entity/state.js';
/**
 * Landing-specific find options
 */
export interface LandingFindOptions extends FindOptions {
    groupId?: number;
    landingType?: string;
    state?: EntityState;
}
/**
 * Landing Repository implementation
 */
export declare class LandingRepository extends BaseRepository<Landing> {
    /**
     * Get entity definition
     */
    getDefinition(): RepositoryEntityDefinition;
    /**
     * Find landings by group
     */
    findByGroupId(groupId: number, options?: FindOptions): Promise<Landing[]>;
    /**
     * Find landings by type
     */
    findByType(landingType: string, options?: FindOptions): Promise<Landing[]>;
    /**
     * Find all active landings with optional filtering
     */
    findAllActiveLandings(options?: LandingFindOptions): Promise<Landing[]>;
    /**
     * Find external landings
     */
    findExternalLandings(options?: FindOptions): Promise<Landing[]>;
    /**
     * Find local landings
     */
    findLocalLandings(options?: FindOptions): Promise<Landing[]>;
    /**
     * Get landing URLs as a map
     */
    getLandingUrls(): Promise<Map<number, string>>;
}
//# sourceMappingURL=landing-repository.d.ts.map