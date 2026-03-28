/**
 * Filter Index
 * 
 * Exports all filter-related classes and utilities.
 */
export { StreamFilter, FilterMode, type StreamFilterData } from '../model/stream-filter';
export { 
  AbstractFilter, 
  type FilterInterface, 
  FilterGroup,
  type FilterGroupValue 
} from './filter-interface';
export { FilterEngine, checkFilters, type FilterEngineOptions } from './filter-engine';

// Check Filters - Main filter evaluation class
export { CheckFilters, checkStreamFilters } from './check-filters';

// Geo filters
export { CountryFilter, RegionFilter, CityFilter } from './geo-filters';
export { IpFilter } from './ip-filter';
export { Ipv6Filter } from './misc-filters';

// Device filters
export { 
  DeviceTypeFilter, 
  OsFilter, 
  BrowserFilter, 
  BrowserVersionFilter,
  LanguageFilter,
  ConnectionTypeFilter,
  IspFilter
} from './device-filters';
export { DeviceModelFilter, OsVersionFilter, HideClickDetectFilter } from './misc-filters';

// Bot/proxy filters
export { IsBotFilter, ProxyFilter, UserAgentFilter, OperatorFilter } from './bot-filter';

// Traffic filters
export { KeywordFilter, SourceFilter, ReferrerFilter } from './traffic-filters';
export { ParameterFilter, AnyParamFilter, EmptyReferrerFilter } from './parameter-filter';

// Schedule/time filters
export { ScheduleFilter, IntervalFilter } from './schedule-filters';

// Limit filters
export { LimitFilter, setHitLimitService, getHitLimitService, type HitLimitService } from './limit-filter';

// Uniqueness filter
export { 
  UniquenessFilter, 
  setUniquenessService, 
  getUniquenessService,
  UniquenessScope,
  type UniquenessScopeValue,
  type UniquenessService 
} from './uniqueness-filter';

// Anti-fraud filters
export { 
  ImkloDetectFilter, 
  ImkloMode,
  setImkloDetectService, 
  getImkloDetectService,
  HttpImkloDetectService,
  type ImkloDetectService,
  type ImkloCheckParams
} from './imklo-detect-filter';

// Helper to create all filters
import { AbstractFilter } from './filter-interface';
import { CountryFilter, RegionFilter, CityFilter } from './geo-filters';
import { IpFilter } from './ip-filter';
import { Ipv6Filter, DeviceModelFilter, OsVersionFilter, HideClickDetectFilter } from './misc-filters';
import { 
  DeviceTypeFilter, 
  OsFilter, 
  BrowserFilter, 
  BrowserVersionFilter,
  LanguageFilter,
  ConnectionTypeFilter,
  IspFilter
} from './device-filters';
import { IsBotFilter, ProxyFilter, UserAgentFilter, OperatorFilter } from './bot-filter';
import { KeywordFilter, SourceFilter, ReferrerFilter } from './traffic-filters';
import { ParameterFilter, AnyParamFilter, EmptyReferrerFilter } from './parameter-filter';
import { ScheduleFilter, IntervalFilter } from './schedule-filters';
import { LimitFilter } from './limit-filter';
import { UniquenessFilter } from './uniqueness-filter';
import { ImkloDetectFilter } from './imklo-detect-filter';

/**
 * Create all built-in filters
 */
export function createAllFilters(): Map<string, AbstractFilter> {
  const filters = new Map<string, AbstractFilter>();
  
  // Geo filters
  filters.set('country', new CountryFilter());
  filters.set('region', new RegionFilter());
  filters.set('city', new CityFilter());
  filters.set('ip', new IpFilter());
  filters.set('ipv6', new Ipv6Filter());
  filters.set('isp', new IspFilter());
  filters.set('operator', new OperatorFilter());
  
  // Device filters
  filters.set('device_type', new DeviceTypeFilter());
  filters.set('device_model', new DeviceModelFilter());
  filters.set('os', new OsFilter());
  filters.set('os_version', new OsVersionFilter());
  filters.set('browser', new BrowserFilter());
  filters.set('browser_version', new BrowserVersionFilter());
  filters.set('language', new LanguageFilter());
  filters.set('connection_type', new ConnectionTypeFilter());
  
  // Bot/proxy filters
  filters.set('is_bot', new IsBotFilter());
  filters.set('is_using_proxy', new ProxyFilter());
  filters.set('user_agent', new UserAgentFilter());
  filters.set('hide_click_detect', new HideClickDetectFilter());
  
  // Traffic filters (keyword/source are custom additions not in PHP source)
  filters.set('keyword', new KeywordFilter());
  filters.set('source', new SourceFilter());
  filters.set('referrer', new ReferrerFilter());
  filters.set('empty_referrer', new EmptyReferrerFilter());
  filters.set('parameter', new ParameterFilter());
  filters.set('any_param', new AnyParamFilter());
  
  // Schedule filters
  filters.set('schedule', new ScheduleFilter());
  filters.set('interval', new IntervalFilter());
  
  // Limit filters
  filters.set('limit', new LimitFilter());
  
  // Uniqueness filter
  filters.set('uniqueness', new UniquenessFilter());
  
  // Anti-fraud filters
  filters.set('imklo_detect', new ImkloDetectFilter());
  
  return filters;
}
