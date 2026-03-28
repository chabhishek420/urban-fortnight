/**
 * Tests for StreamFilter Model
 * 
 * Tests stream filter data model
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { StreamFilter, FilterMode, FilterModeValue } from '../../../src/traffic/filter/stream-filter.js';

describe('StreamFilter', () => {
  describe('constructor', () => {
    it('should create with default values', () => {
      const filter = new StreamFilter();

      expect(filter.getId()).toBe(0);
      expect(filter.getStreamId()).toBe(0);
      expect(filter.getName()).toBe('');
      expect(filter.getMode()).toBe(FilterMode.ACCEPT);
      expect(filter.getPayload()).toBeNull();
    });

    it('should create with partial data', () => {
      const filter = new StreamFilter({
        id: 123,
        name: 'Test Filter'
      });

      expect(filter.getId()).toBe(123);
      expect(filter.getName()).toBe('Test Filter');
    });

    it('should create with all data', () => {
      const filter = new StreamFilter({
        id: 1,
        streamId: 100,
        name: 'Geo Filter',
        mode: FilterMode.REJECT,
        payload: ['US', 'UK']
      });

      expect(filter.getId()).toBe(1);
      expect(filter.getStreamId()).toBe(100);
      expect(filter.getName()).toBe('Geo Filter');
      expect(filter.getMode()).toBe(FilterMode.REJECT);
      expect(filter.getPayload()).toEqual(['US', 'UK']);
    });
  });

  describe('getters', () => {
    let filter: StreamFilter;

    beforeEach(() => {
      filter = new StreamFilter({
        id: 42,
        streamId: 100,
        name: 'Test Filter',
        mode: FilterMode.REJECT,
        payload: { countries: ['US'] }
      });
    });

    it('should return id', () => {
      expect(filter.getId()).toBe(42);
    });

    it('should return streamId', () => {
      expect(filter.getStreamId()).toBe(100);
    });

    it('should return name', () => {
      expect(filter.getName()).toBe('Test Filter');
    });

    it('should return mode', () => {
      expect(filter.getMode()).toBe(FilterMode.REJECT);
    });

    it('should return payload', () => {
      expect(filter.getPayload()).toEqual({ countries: ['US'] });
    });

    it('should return typed payload', () => {
      const payload = filter.getPayload<{ countries: string[] }>();
      expect(payload.countries).toEqual(['US']);
    });
  });

  describe('setData', () => {
    it('should update individual fields', () => {
      const filter = new StreamFilter();

      filter.setData({ id: 999 });

      expect(filter.getId()).toBe(999);
    });

    it('should update multiple fields', () => {
      const filter = new StreamFilter();

      filter.setData({
        id: 100,
        streamId: 200,
        name: 'Updated',
        mode: FilterMode.REJECT
      });

      expect(filter.getId()).toBe(100);
      expect(filter.getStreamId()).toBe(200);
      expect(filter.getName()).toBe('Updated');
      expect(filter.getMode()).toBe(FilterMode.REJECT);
    });

    it('should preserve unmodified fields', () => {
      const filter = new StreamFilter({
        id: 1,
        name: 'Original'
      });

      filter.setData({ mode: FilterMode.REJECT });

      expect(filter.getId()).toBe(1);
      expect(filter.getName()).toBe('Original');
      expect(filter.getMode()).toBe(FilterMode.REJECT);
    });

    it('should update payload', () => {
      const filter = new StreamFilter();

      filter.setData({ payload: ['test1', 'test2'] });

      expect(filter.getPayload()).toEqual(['test1', 'test2']);
    });
  });
});

describe('FilterMode', () => {
  it('should have ACCEPT value', () => {
    expect(FilterMode.ACCEPT).toBe('accept');
  });

  it('should have REJECT value', () => {
    expect(FilterMode.REJECT).toBe('reject');
  });

  it('should be usable as type', () => {
    const mode: FilterModeValue = FilterMode.ACCEPT;
    expect(mode).toBe('accept');
  });

  it('should accept valid string values', () => {
    const acceptMode: FilterModeValue = 'accept';
    const rejectMode: FilterModeValue = 'reject';

    expect(acceptMode).toBe(FilterMode.ACCEPT);
    expect(rejectMode).toBe(FilterMode.REJECT);
  });
});
