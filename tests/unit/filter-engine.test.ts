/**
 * Filter Engine Tests
 * 
 * Tests for the filter orchestration engine
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FilterEngine, checkFilters } from '../../src/traffic/filter/filter-engine';
import type { AbstractFilter } from '../../src/traffic/filter/filter-interface';
import type { StreamFilter } from '../../src/traffic/model/stream-filter';
import type { RawClick } from '../../src/traffic/model/raw-click';
import { RawClick } from '../../src/traffic/model/raw-click';

// Mock filter that always passes
class PassingFilter implements AbstractFilter {
  private _key: string;
  
  constructor(key: string = 'passing_filter') {
    this._key = key;
  }
  
  getKey(): string { return this._key; }
  getGroup(): string { return 'test'; }
  isPass(_filter: StreamFilter, _rawClick: RawClick): boolean { return true; }
  setServerRequest(): void {}
  setLogger(): void {}
}

// Mock filter that always blocks
class BlockingFilter implements AbstractFilter {
  private _key: string;
  
  constructor(key: string = 'blocking_filter') {
    this._key = key;
  }
  
  getKey(): string { return this._key; }
  getGroup(): string { return 'test'; }
  isPass(_filter: StreamFilter, _rawClick: RawClick): boolean { return false; }
  setServerRequest(): void {}
  setLogger(): void {}
}

// Mock stream filter data
function createMockStreamFilter(name: string, payload: any = {}): StreamFilter {
  return {
    getName: () => name,
    getPayload: () => payload,
    getMode: () => 'accept'
  } as StreamFilter;
}

// Mock stream
function createMockStream(isFilterOr: boolean = false) {
  return {
    getId: () => 1,
    getName: () => 'Test Stream',
    isFilterOr: () => isFilterOr
  } as any;
}

// Mock server request
function createMockServerRequest() {
  return {
    getIp: () => '127.0.0.1',
    getUserAgent: () => 'Test',
    getUri: () => new URL('http://test.local/')
  } as any;
}

describe('FilterEngine', () => {
  let engine: FilterEngine;
  let rawClick: RawClick;
  let logger: { add: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    rawClick = new RawClick({ sub_id: 'test' });
    logger = { add: vi.fn() };
    
    engine = new FilterEngine({
      serverRequest: createMockServerRequest(),
      stream: createMockStream(),
      rawClick,
      logger
    });
  });

  describe('registerFilter', () => {
    it('should register filter implementations', () => {
      const filter = new PassingFilter();
      engine.registerFilter('test_filter', filter);
      
      expect(engine.getFilter('test_filter')).toBe(filter);
    });
  });

  describe('getFilter', () => {
    it('should return registered filter', () => {
      const filter = new PassingFilter('my_filter');
      engine.registerFilter('my_filter', filter);
      
      expect(engine.getFilter('my_filter')).toBe(filter);
    });

    it('should return undefined for unregistered filter', () => {
      expect(engine.getFilter('nonexistent')).toBeUndefined();
    });
  });

  describe('isPass', () => {
    it('should pass when no filters', () => {
      const result = engine.isPass([]);
      expect(result).toBe(true);
    });

    it('should pass when all filters pass (AND mode)', () => {
      engine.registerFilter('filter1', new PassingFilter('filter1'));
      engine.registerFilter('filter2', new PassingFilter('filter2'));
      
      const filters = [
        createMockStreamFilter('filter1'),
        createMockStreamFilter('filter2')
      ];
      
      expect(engine.isPass(filters)).toBe(true);
    });

    it('should block when any filter fails (AND mode)', () => {
      engine.registerFilter('filter1', new PassingFilter('filter1'));
      engine.registerFilter('filter2', new BlockingFilter('filter2'));
      
      const filters = [
        createMockStreamFilter('filter1'),
        createMockStreamFilter('filter2')
      ];
      
      expect(engine.isPass(filters)).toBe(false);
    });

    it('should handle unknown filters gracefully', () => {
      const filters = [createMockStreamFilter('unknown_filter')];
      
      // Should not throw, just skip unknown filter
      expect(engine.isPass(filters)).toBe(true);
    });

    it('should log filter evaluation', () => {
      engine.registerFilter('test', new PassingFilter('test'));
      engine.isPass([createMockStreamFilter('test')]);
      
      expect(logger.add).toHaveBeenCalled();
    });
  });

  describe('isPass with OR mode', () => {
    beforeEach(() => {
      engine = new FilterEngine({
        serverRequest: createMockServerRequest(),
        stream: createMockStream(true), // OR mode
        rawClick,
        logger
      });
    });

    it('should pass when any filter passes (OR mode)', () => {
      engine.registerFilter('filter1', new BlockingFilter('filter1'));
      engine.registerFilter('filter2', new PassingFilter('filter2'));
      
      const filters = [
        createMockStreamFilter('filter1'),
        createMockStreamFilter('filter2')
      ];
      
      expect(engine.isPass(filters)).toBe(true);
    });

    it('should block when all filters fail (OR mode)', () => {
      engine.registerFilter('filter1', new BlockingFilter('filter1'));
      engine.registerFilter('filter2', new BlockingFilter('filter2'));
      
      const filters = [
        createMockStreamFilter('filter1'),
        createMockStreamFilter('filter2')
      ];
      
      expect(engine.isPass(filters)).toBe(false);
    });
  });

  describe('evaluateFilter', () => {
    it('should evaluate a single filter', () => {
      engine.registerFilter('pass', new PassingFilter('pass'));
      engine.registerFilter('block', new BlockingFilter('block'));
      
      expect(engine.evaluateFilter(createMockStreamFilter('pass'))).toBe(true);
      expect(engine.evaluateFilter(createMockStreamFilter('block'))).toBe(false);
    });

    it('should return true for unknown filter', () => {
      expect(engine.evaluateFilter(createMockStreamFilter('unknown'))).toBe(true);
    });
  });
});

describe('checkFilters convenience function', () => {
  it('should check filters with provided implementations', () => {
    const rawClick = new RawClick();
    const serverRequest = createMockServerRequest();
    const stream = createMockStream();
    
    const implementations = new Map<string, AbstractFilter>();
    implementations.set('pass', new PassingFilter('pass'));
    
    const filters = [createMockStreamFilter('pass')];
    
    const result = checkFilters(
      serverRequest,
      stream,
      rawClick,
      filters,
      implementations
    );
    
    expect(result).toBe(true);
  });
});
