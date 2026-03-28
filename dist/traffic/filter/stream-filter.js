"use strict";
/**
 * Stream Filter Model
 *
 * Represents a filter applied to a stream.
 *
 * @see keitaro_source/application/Traffic/Model/StreamFilter.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamFilter = exports.FilterMode = void 0;
/**
 * Filter mode constants
 */
exports.FilterMode = {
    ACCEPT: 'accept',
    REJECT: 'reject'
};
/**
 * Stream Filter class
 */
class StreamFilter {
    _data;
    constructor(data = {}) {
        this._data = {
            id: data.id ?? 0,
            streamId: data.streamId ?? 0,
            name: data.name ?? '',
            mode: data.mode ?? exports.FilterMode.ACCEPT,
            payload: data.payload ?? null
        };
    }
    getId() {
        return this._data.id;
    }
    getStreamId() {
        return this._data.streamId;
    }
    getName() {
        return this._data.name;
    }
    getMode() {
        return this._data.mode;
    }
    getPayload() {
        return this._data.payload;
    }
    setData(data) {
        Object.assign(this._data, data);
    }
}
exports.StreamFilter = StreamFilter;
//# sourceMappingURL=stream-filter.js.map