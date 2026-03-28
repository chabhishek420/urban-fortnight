/**
 * Geo Filter Tests
 * 
 * Tests for country, region, and city filtering
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CountryFilter, RegionFilter, CityFilter } from '../../../src/traffic/filter/geo-filters';
import { RawClick } from '../../../src/traffic/model/raw-click';
import { FilterMode } from '../../../src/traffic/filter/stream-filter';

// Mock stream filter
function createMockStreamFilter(payload: string[], mode: FilterMode = FilterMode.ACCEPT) {
  return {
    getName: () => 'geo',
    getPayload: () => payload,
    getMode: () => mode
  } as any;
}

describe('CountryFilter', () => {
  let filter: CountryFilter;

  beforeEach(() => {
    filter = new CountryFilter();
  });

  describe('filter metadata', () => {
    it('should have correct key', () => {
      expect(filter.getKey()).toBe('country');
    });

    it('should be in GEO group', () => {
      expect(filter.getGroup()).toBe('filters.groups.geo');
    });
  });

  describe('country matching', () => {
    it('should match country code', () => {
      const rawClick = new RawClick({ country: 'US' });
      const streamFilter = createMockStreamFilter(['US']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should match country code case-insensitively', () => {
      const rawClick = new RawClick({ country: 'us' });
      const streamFilter = createMockStreamFilter(['US']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should match any country in list', () => {
      const rawClick = new RawClick({ country: 'GB' });
      const streamFilter = createMockStreamFilter(['US', 'GB', 'CA']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should not match different country', () => {
      const rawClick = new RawClick({ country: 'US' });
      const streamFilter = createMockStreamFilter(['GB', 'CA']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('empty country handling', () => {
    it('should match empty country with "empty" query', () => {
      const rawClick = new RawClick({}); // No country
      const streamFilter = createMockStreamFilter(['empty']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should match empty country with "null" query', () => {
      const rawClick = new RawClick({}); // No country
      const streamFilter = createMockStreamFilter(['null']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should not match empty country with actual country query', () => {
      const rawClick = new RawClick({}); // No country
      const streamFilter = createMockStreamFilter(['US']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('reject mode', () => {
    it('should reject matching country in reject mode', () => {
      const rawClick = new RawClick({ country: 'US' });
      const streamFilter = createMockStreamFilter(['US'], FilterMode.REJECT);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });

    it('should allow non-matching country in reject mode', () => {
      const rawClick = new RawClick({ country: 'US' });
      const streamFilter = createMockStreamFilter(['GB', 'CA'], FilterMode.REJECT);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should pass when null payload', () => {
      const rawClick = new RawClick({ country: 'US' });
      const streamFilter = createMockStreamFilter(null as any);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should pass when empty payload array', () => {
      const rawClick = new RawClick({ country: 'US' });
      const streamFilter = createMockStreamFilter([]);
      
      // Empty array - no match found, accept mode returns false
      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });
});

describe('RegionFilter', () => {
  let filter: RegionFilter;

  beforeEach(() => {
    filter = new RegionFilter();
  });

  describe('filter metadata', () => {
    it('should have correct key', () => {
      expect(filter.getKey()).toBe('region');
    });
  });

  describe('region matching', () => {
    it('should match region exactly', () => {
      const rawClick = new RawClick({ region: 'California' });
      const streamFilter = createMockStreamFilter(['California']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should match region case-insensitively', () => {
      const rawClick = new RawClick({ region: 'CALIFORNIA' });
      const streamFilter = createMockStreamFilter(['california']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should match partial region (contains)', () => {
      const rawClick = new RawClick({ region: 'State of California' });
      const streamFilter = createMockStreamFilter(['california']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should not match different region', () => {
      const rawClick = new RawClick({ region: 'Texas' });
      const streamFilter = createMockStreamFilter(['California']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('empty region handling', () => {
    it('should match empty region with "empty" query', () => {
      const rawClick = new RawClick({}); // No region
      const streamFilter = createMockStreamFilter(['empty']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });
  });
});

describe('CityFilter', () => {
  let filter: CityFilter;

  beforeEach(() => {
    filter = new CityFilter();
  });

  describe('filter metadata', () => {
    it('should have correct key', () => {
      expect(filter.getKey()).toBe('city');
    });
  });

  describe('city matching', () => {
    it('should match city exactly', () => {
      const rawClick = new RawClick({ city: 'San Francisco' });
      const streamFilter = createMockStreamFilter(['San Francisco']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should match city case-insensitively', () => {
      const rawClick = new RawClick({ city: 'SAN FRANCISCO' });
      const streamFilter = createMockStreamFilter(['san francisco']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should match partial city (contains)', () => {
      const rawClick = new RawClick({ city: 'San Francisco Bay Area' });
      const streamFilter = createMockStreamFilter(['francisco']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(true);
    });

    it('should not match different city', () => {
      const rawClick = new RawClick({ city: 'Los Angeles' });
      const streamFilter = createMockStreamFilter(['San Francisco']);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });

  describe('reject mode', () => {
    it('should reject matching city in reject mode', () => {
      const rawClick = new RawClick({ city: 'San Francisco' });
      const streamFilter = createMockStreamFilter(['San Francisco'], FilterMode.REJECT);
      
      expect(filter.isPass(streamFilter, rawClick)).toBe(false);
    });
  });
});

describe('Geo filter integration scenarios', () => {
  it('should filter US traffic only', () => {
    const countryFilter = new CountryFilter();
    const streamFilter = createMockStreamFilter(['US']);
    
    const usClick = new RawClick({ country: 'US' });
    const ukClick = new RawClick({ country: 'GB' });
    const deClick = new RawClick({ country: 'DE' });
    
    expect(countryFilter.isPass(streamFilter, usClick)).toBe(true);
    expect(countryFilter.isPass(streamFilter, ukClick)).toBe(false);
    expect(countryFilter.isPass(streamFilter, deClick)).toBe(false);
  });

  it('should block specific countries', () => {
    const countryFilter = new CountryFilter();
    const streamFilter = createMockStreamFilter(['CN', 'RU', 'KP'], FilterMode.REJECT);
    
    const cnClick = new RawClick({ country: 'CN' });
    const ruClick = new RawClick({ country: 'RU' });
    const usClick = new RawClick({ country: 'US' });
    
    expect(countryFilter.isPass(streamFilter, cnClick)).toBe(false);
    expect(countryFilter.isPass(streamFilter, ruClick)).toBe(false);
    expect(countryFilter.isPass(streamFilter, usClick)).toBe(true);
  });

  it('should filter by country and region combination', () => {
    const countryFilter = new CountryFilter();
    const regionFilter = new RegionFilter();
    
    const californiaClick = new RawClick({ country: 'US', region: 'California' });
    const texasClick = new RawClick({ country: 'US', region: 'Texas' });
    const londonClick = new RawClick({ country: 'GB', region: 'England' });
    
    const usCountryFilter = createMockStreamFilter(['US']);
    const caRegionFilter = createMockStreamFilter(['California']);
    
    // California passes both filters
    expect(countryFilter.isPass(usCountryFilter, californiaClick)).toBe(true);
    expect(regionFilter.isPass(caRegionFilter, californiaClick)).toBe(true);
    
    // Texas passes country but not region
    expect(countryFilter.isPass(usCountryFilter, texasClick)).toBe(true);
    expect(regionFilter.isPass(caRegionFilter, texasClick)).toBe(false);
    
    // London fails both
    expect(countryFilter.isPass(usCountryFilter, londonClick)).toBe(false);
    expect(regionFilter.isPass(caRegionFilter, londonClick)).toBe(false);
  });
});
