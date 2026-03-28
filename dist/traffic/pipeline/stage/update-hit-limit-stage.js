"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHitLimitStage = void 0;
const stage_interface_js_1 = require("../../../core/pipeline/stage-interface.js");
/**
 * Update Hit Limit Stage
 */
class UpdateHitLimitStage {
    static LIMIT = 'limit';
    /**
     * Process the pipeline payload
     */
    process(payload, _logEntry) {
        const stream = payload.getStream();
        const rawClick = payload.getRawClick();
        if (!rawClick) {
            throw new stage_interface_js_1.StageException('Empty rawClick', 'UpdateHitLimitStage');
        }
        // Check if stream has limit filter
        if (stream && this._hasLimitFilter(stream)) {
            this._storeHit(stream, rawClick.getDatetime());
        }
        return payload;
    }
    /**
     * Check if stream has limit filter
     */
    _hasLimitFilter(stream) {
        const filters = this._getStreamFilters(stream);
        if (filters && Array.isArray(filters)) {
            for (const filter of filters) {
                if (filter.name === UpdateHitLimitStage.LIMIT) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Store hit for rate limiting
     * @artifact ARTIFACT-033: Placeholder - needs hit limit service
     */
    _storeHit(_stream, _datetime) {
        // TODO: Implement hit limit service
        // In original: HitLimitService.instance().store(stream, rawClick.getDateTime())
    }
    /**
     * Get stream filters
     * @artifact ARTIFACT-034: Placeholder - needs filter repository
     */
    _getStreamFilters(_stream) {
        // TODO: Implement stream filter repository
        return null;
    }
}
exports.UpdateHitLimitStage = UpdateHitLimitStage;
//# sourceMappingURL=update-hit-limit-stage.js.map