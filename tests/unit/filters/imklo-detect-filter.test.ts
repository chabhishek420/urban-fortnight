/**
 * Tests for ImkloDetect Filter
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { 
  ImkloDetectFilter, 
  ImkloMode,
  setImkloDetectService, 
  getImkloDetectService,
  type ImkloDetectService,
  type ImkloCheckParams
} from '@/traffic/filter/imklo-detect-filter.js';
import { StreamFilter } from '@/traffic/filter/stream-filter.js';
import { RawClick } from '@/traffic/model/raw-click.js';

describe('ImkloDetectFilter', () => {
  let filter: ImkloDetectFilter;
  let isWhiteResult = true;
  let checkCalls: ImkloCheckParams[] = [];

  const mockService: ImkloDetectService = {
    checkVisitor: async (params: ImkloCheckParams) => {
      checkCalls.push(params);
      return isWhiteResult;
    }
  };

  beforeEach(() => {
    filter = new ImkloDetectFilter();
    isWhiteResult = true;
    checkCalls = [];
    setImkloDetectService(mockService);
  });

  afterEach(() => {
    setImkloDetectService(null as unknown as ImkloDetectService);
  });

  describe('filter metadata', () => {
    it('should have correct key', () => {
      expect(filter.getKey()).toBe('imklo_detect');
    });

    it('should have correct group', () => {
      expect(filter.getGroup()).toBe('filters.groups.geo');
    });

    it('should have correct modes', () => {
      const modes = filter.getModes();
      expect(modes[ImkloMode.BLACK]).toBe('Black (Block suspicious)');
      expect(modes[ImkloMode.WHITE]).toBe('White (Allow only legitimate)');
    });
  });

  describe('BLACK mode (block suspicious)', () => {
    it('should pass when visitor is NOT white (suspicious)', async () => {
      isWhiteResult = false;
      
      const rawClick = {
        getIp: () => '192.168.1.1',
        getUserAgent: () => 'Mozilla/5.0',
        getDateTime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: ImkloMode.BLACK,
        payload: null
      });

      // Set mock server request
      filter.setServerRequest({
        getParam: () => null,
        getHeader: () => null,
        getHeaders: () => ({}),
        getQueryParams: () => ({}),
        getUri: () => ({ pathname: '/test' }),
        hasParam: () => false
      } as any);

      const result = await filter.isPassAsync(streamFilter, rawClick);
      
      // BLACK mode: pass when NOT white (block suspicious traffic)
      expect(result).toBe(true);
    });

    it('should reject when visitor IS white (legitimate)', async () => {
      isWhiteResult = true;
      
      const rawClick = {
        getIp: () => '192.168.1.1',
        getUserAgent: () => 'Mozilla/5.0',
        getDateTime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: ImkloMode.BLACK,
        payload: null
      });

      filter.setServerRequest({
        getParam: () => null,
        getHeader: () => null,
        getHeaders: () => ({}),
        getQueryParams: () => ({}),
        getUri: () => ({ pathname: '/test' }),
        hasParam: () => false
      } as any);

      const result = await filter.isPassAsync(streamFilter, rawClick);
      
      // BLACK mode: reject when white (legitimate traffic passes through)
      expect(result).toBe(false);
    });
  });

  describe('WHITE mode (allow only legitimate)', () => {
    it('should pass when visitor IS white (legitimate)', async () => {
      isWhiteResult = true;
      
      const rawClick = {
        getIp: () => '192.168.1.1',
        getUserAgent: () => 'Mozilla/5.0',
        getDateTime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: ImkloMode.WHITE,
        payload: null
      });

      filter.setServerRequest({
        getParam: () => null,
        getHeader: () => null,
        getHeaders: () => ({}),
        getQueryParams: () => ({}),
        getUri: () => ({ pathname: '/test' }),
        hasParam: () => false
      } as any);

      const result = await filter.isPassAsync(streamFilter, rawClick);
      
      // WHITE mode: pass when white (legitimate)
      expect(result).toBe(true);
    });

    it('should reject when visitor is NOT white (suspicious)', async () => {
      isWhiteResult = false;
      
      const rawClick = {
        getIp: () => '192.168.1.1',
        getUserAgent: () => 'Mozilla/5.0',
        getDateTime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: ImkloMode.WHITE,
        payload: null
      });

      filter.setServerRequest({
        getParam: () => null,
        getHeader: () => null,
        getHeaders: () => ({}),
        getQueryParams: () => ({}),
        getUri: () => ({ pathname: '/test' }),
        hasParam: () => false
      } as any);

      const result = await filter.isPassAsync(streamFilter, rawClick);
      
      // WHITE mode: reject when NOT white (suspicious)
      expect(result).toBe(false);
    });
  });

  describe('parameter preparation', () => {
    it('should prepare correct params for IMKLO API', async () => {
      const rawClick = {
        getIp: () => '10.0.0.1',
        getUserAgent: () => 'TestBrowser/1.0',
        getDateTime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: ImkloMode.WHITE,
        payload: null
      });

      filter.setServerRequest({
        getParam: (name: string) => {
          if (name === 'original_host') return 'tracker.example.com';
          return null;
        },
        getHeader: (name: string) => {
          if (name === 'referer') return 'https://google.com/';
          return null;
        },
        getHeaders: () => ({ 'x-forwarded-for': '10.0.0.1' }),
        getQueryParams: () => ({ campaign: 'test', keyword: 'buy' }),
        getUri: () => ({ pathname: '/click/test' }),
        hasParam: () => false
      } as any);

      await filter.isPassAsync(streamFilter, rawClick);

      expect(checkCalls.length).toBe(1);
      const params = checkCalls[0]!;
      expect(params.ip).toBe('10.0.0.1');
      expect(params.user_agent).toBe('TestBrowser/1.0');
      expect(params.domain).toBe('tracker.example.com');
      expect(params.referer).toBe('https://google.com/');
      expect(params.url).toBe('/click/test');
    });
  });

  describe('error handling', () => {
    it('should allow click on service error', async () => {
      const errorService: ImkloDetectService = {
        checkVisitor: async () => {
          throw new Error('Service unavailable');
        }
      };
      setImkloDetectService(errorService);

      const rawClick = {
        getIp: () => '192.168.1.1',
        getUserAgent: () => 'Mozilla/5.0',
        getDateTime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: ImkloMode.WHITE,
        payload: null
      });

      filter.setServerRequest({
        getParam: () => null,
        getHeader: () => null,
        getHeaders: () => ({}),
        getQueryParams: () => ({}),
        getUri: () => ({ pathname: '/test' }),
        hasParam: () => false
      } as any);

      const result = await filter.isPassAsync(streamFilter, rawClick);
      
      // On error, should allow (return true)
      expect(result).toBe(true);
    });

    it('should allow when no service configured', () => {
      setImkloDetectService(null as unknown as ImkloDetectService);

      const rawClick = {
        getIp: () => '192.168.1.1',
        getDateTime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: ImkloMode.WHITE,
        payload: null
      });

      const result = filter.isPass(streamFilter, rawClick);
      expect(result).toBe(true);
    });

    it('should allow when no server request set', () => {
      const rawClick = {
        getIp: () => '192.168.1.1',
        getDateTime: () => new Date(),
      } as RawClick;

      const streamFilter = new StreamFilter({
        mode: ImkloMode.WHITE,
        payload: null
      });

      // Don't set server request
      const result = filter.isPass(streamFilter, rawClick);
      expect(result).toBe(true);
    });
  });
});

describe('ImkloDetectService', () => {
  it('should set and get service', () => {
    const service: ImkloDetectService = {
      checkVisitor: async () => true
    };

    setImkloDetectService(service);
    expect(getImkloDetectService()).toBe(service);
  });
});
