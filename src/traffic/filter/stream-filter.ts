/**
 * Stream Filter Model
 * 
 * Represents a filter applied to a stream.
 * 
 * @see keitaro_source/application/Traffic/Model/StreamFilter.php
 */

/**
 * Filter mode constants
 */
export const FilterMode = {
  ACCEPT: 'accept',
  REJECT: 'reject'
} as const;

export type FilterModeValue = typeof FilterMode[keyof typeof FilterMode];

/**
 * Stream filter interface
 */
export interface StreamFilterData {
  id: number;
  streamId: number;
  name: string;
  mode: FilterModeValue;
  payload: unknown;
}

/**
 * Stream Filter class
 */
export class StreamFilter {
  private _data: StreamFilterData;

  constructor(data: Partial<StreamFilterData> = {}) {
    this._data = {
      id: data.id ?? 0,
      streamId: data.streamId ?? 0,
      name: data.name ?? '',
      mode: data.mode ?? FilterMode.ACCEPT,
      payload: data.payload ?? null
    };
  }

  getId(): number {
    return this._data.id;
  }

  getStreamId(): number {
    return this._data.streamId;
  }

  getName(): string {
    return this._data.name;
  }

  getMode(): FilterModeValue {
    return this._data.mode;
  }

  getPayload<T = unknown>(): T {
    return this._data.payload as T;
  }

  setData(data: Partial<StreamFilterData>): void {
    Object.assign(this._data, data);
  }
}
