/**
 * RawClick Model Tests
 * 
 * Tests for the RawClick data model that carries click information
 * through the traffic processing pipeline.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { RawClick } from '../../src/traffic/model/raw-click';

describe('RawClick', () => {
  let rawClick: RawClick;

  beforeEach(() => {
    rawClick = new RawClick();
  });

  describe('constructor', () => {
    it('should create empty RawClick with no data', () => {
      const click = new RawClick();
      expect(click.getSubId()).toBe('');
      expect(click.getIp()).toBe('');
      expect(click.getCost()).toBe(0);
    });

    it('should accept initial data object', () => {
      const click = new RawClick({
        sub_id: 'abc123',
        ip: '192.168.1.1',
        country: 'US',
        cost: 0.5
      });

      expect(click.getSubId()).toBe('abc123');
      expect(click.getIp()).toBe('192.168.1.1');
      expect(click.getCountry()).toBe('US');
      expect(click.getCost()).toBe(0.5);
    });

    it('should handle empty object', () => {
      const click = new RawClick({});
      expect(click.getSubId()).toBe('');
      expect(click.getCost()).toBe(0);
    });
  });

  describe('identity fields', () => {
    it('should get and set sub_id', () => {
      rawClick.setSubId('test-sub-123');
      expect(rawClick.getSubId()).toBe('test-sub-123');
    });

    it('should return empty string for unset sub_id', () => {
      expect(rawClick.getSubId()).toBe('');
    });

    it('should get and set parent_sub_id', () => {
      rawClick.setParentSubId('parent-sub-456');
      expect(rawClick.getParentSubId()).toBe('parent-sub-456');
    });

    it('should return undefined for unset parent_sub_id', () => {
      expect(rawClick.getParentSubId()).toBeUndefined();
    });

    it('should get and set visitor_id', () => {
      rawClick.setVisitorId(12345);
      expect(rawClick.getVisitorId()).toBe(12345);
    });
  });

  describe('campaign/stream/landing/offer IDs', () => {
    it('should get and set campaign_id', () => {
      rawClick.setCampaignId(1);
      expect(rawClick.getCampaignId()).toBe(1);
    });

    it('should get and set parent_campaign_id', () => {
      rawClick.setParentCampaignId(2);
      expect(rawClick.getParentCampaignId()).toBe(2);
    });

    it('should get and set stream_id', () => {
      rawClick.setStreamId(100);
      expect(rawClick.getStreamId()).toBe(100);
    });

    it('should get and set landing_id', () => {
      rawClick.setLandingId(50);
      expect(rawClick.getLandingId()).toBe(50);
    });

    it('should get and set offer_id', () => {
      rawClick.setOfferId(25);
      expect(rawClick.getOfferId()).toBe(25);
    });

    it('should get and set affiliate_network_id', () => {
      rawClick.setAffiliateNetworkId(10);
      expect(rawClick.getAffiliateNetworkId()).toBe(10);
    });

    it('should return undefined for unset IDs', () => {
      expect(rawClick.getCampaignId()).toBeUndefined();
      expect(rawClick.getStreamId()).toBeUndefined();
    });
  });

  describe('visitor info', () => {
    it('should get and set IP address', () => {
      rawClick.setIp('8.8.8.8');
      expect(rawClick.getIp()).toBe('8.8.8.8');
    });

    it('should return empty string for unset IP', () => {
      expect(rawClick.getIp()).toBe('');
    });

    it('should get and set user agent', () => {
      const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
      rawClick.setUserAgent(ua);
      expect(rawClick.getUserAgent()).toBe(ua);
    });

    it('should get and set referrer', () => {
      rawClick.setReferrer('https://google.com/search');
      expect(rawClick.getReferrer()).toBe('https://google.com/search');
    });
  });

  describe('geo fields', () => {
    it('should get and set country', () => {
      rawClick.setCountry('US');
      expect(rawClick.getCountry()).toBe('US');
    });

    it('should get and set region', () => {
      rawClick.setRegion('California');
      expect(rawClick.getRegion()).toBe('California');
    });

    it('should get and set city', () => {
      rawClick.setCity('San Francisco');
      expect(rawClick.getCity()).toBe('San Francisco');
    });

    it('should get and set ISP', () => {
      rawClick.setIsp('Google Cloud');
      expect(rawClick.getIsp()).toBe('Google Cloud');
    });

    it('should get and set connection type', () => {
      rawClick.setConnectionType('mobile');
      expect(rawClick.getConnectionType()).toBe('mobile');
    });
  });

  describe('device fields', () => {
    it('should get and set device type', () => {
      rawClick.setDeviceType('mobile');
      expect(rawClick.getDeviceType()).toBe('mobile');
    });

    it('should get and set device model', () => {
      rawClick.setDeviceModel('iPhone 14');
      expect(rawClick.getDeviceModel()).toBe('iPhone 14');
    });

    it('should get and set OS', () => {
      rawClick.setOs('iOS');
      expect(rawClick.getOs()).toBe('iOS');
    });

    it('should get and set OS version', () => {
      rawClick.setOsVersion('16.5');
      expect(rawClick.getOsVersion()).toBe('16.5');
    });

    it('should get and set browser', () => {
      rawClick.setBrowser('Safari');
      expect(rawClick.getBrowser()).toBe('Safari');
    });

    it('should get and set browser version', () => {
      rawClick.setBrowserVersion('16.5');
      expect(rawClick.getBrowserVersion()).toBe('16.5');
    });

    it('should get and set language', () => {
      rawClick.setLanguage('en-US');
      expect(rawClick.getLanguage()).toBe('en-US');
    });
  });

  describe('traffic source fields', () => {
    it('should get and set keyword', () => {
      rawClick.setKeyword('buy shoes online');
      expect(rawClick.getKeyword()).toBe('buy shoes online');
    });

    it('should get and set search engine', () => {
      rawClick.setSearchEngine('google');
      expect(rawClick.getSearchEngine()).toBe('google');
    });

    it('should get and set source', () => {
      rawClick.setSource('facebook');
      expect(rawClick.getSource()).toBe('facebook');
    });
  });

  describe('sub_id_n fields', () => {
    it('should get and set sub_id_1 through sub_id_10', () => {
      for (let i = 1; i <= 10; i++) {
        rawClick.setSubIdN(i, `sub_${i}_value`);
        expect(rawClick.getSubIdN(i)).toBe(`sub_${i}_value`);
      }
    });

    it('should return undefined for unset sub_id_n', () => {
      expect(rawClick.getSubIdN(5)).toBeUndefined();
    });
  });

  describe('extra_param fields', () => {
    it('should get and set extra_param_1 through extra_param_10', () => {
      for (let i = 1; i <= 10; i++) {
        rawClick.setExtraParamN(i, `extra_${i}_value`);
        expect(rawClick.getExtraParamN(i)).toBe(`extra_${i}_value`);
      }
    });

    it('should return undefined for unset extra_param_n', () => {
      expect(rawClick.getExtraParamN(5)).toBeUndefined();
    });
  });

  describe('cost and revenue', () => {
    it('should get and set cost', () => {
      rawClick.setCost(1.5);
      expect(rawClick.getCost()).toBe(1.5);
    });

    it('should default cost to 0', () => {
      expect(rawClick.getCost()).toBe(0);
    });

    it('should get and set revenue', () => {
      rawClick.setRevenue(100.0);
      expect(rawClick.getRevenue()).toBe(100.0);
    });

    it('should default revenue to 0', () => {
      expect(rawClick.getRevenue()).toBe(0);
    });

    it('should handle decimal values', () => {
      rawClick.setCost(0.001);
      expect(rawClick.getCost()).toBeCloseTo(0.001, 3);
    });
  });

  describe('flag fields', () => {
    it('should get and set is_bot flag', () => {
      expect(rawClick.isBot()).toBe(false);
      rawClick.setIsBot(true);
      expect(rawClick.isBot()).toBe(true);
    });

    it('should treat numeric 1 as true for is_bot', () => {
      rawClick.set('is_bot', 1);
      expect(rawClick.isBot()).toBe(true);
    });

    it('should treat numeric 0 as false for is_bot', () => {
      rawClick.set('is_bot', 0);
      expect(rawClick.isBot()).toBe(false);
    });

    it('should get and set is_using_proxy flag', () => {
      expect(rawClick.isProxy()).toBe(false);
      rawClick.setIsProxy(true);
      expect(rawClick.isProxy()).toBe(true);
    });

    it('should get and set is_unique_stream flag', () => {
      expect(rawClick.isUniqueStream()).toBe(false);
      rawClick.setIsUniqueStream(true);
      expect(rawClick.isUniqueStream()).toBe(true);
    });

    it('should get and set is_unique_campaign flag', () => {
      expect(rawClick.isUniqueCampaign()).toBe(false);
      rawClick.setIsUniqueCampaign(true);
      expect(rawClick.isUniqueCampaign()).toBe(true);
    });

    it('should get and set is_unique_global flag', () => {
      expect(rawClick.isUniqueGlobal()).toBe(false);
      rawClick.setIsUniqueGlobal(true);
      expect(rawClick.isUniqueGlobal()).toBe(true);
    });
  });

  describe('destination', () => {
    it('should get and set destination URL', () => {
      rawClick.setDestination('https://offer.example.com/landing');
      expect(rawClick.getDestination()).toBe('https://offer.example.com/landing');
    });

    it('should return undefined for unset destination', () => {
      expect(rawClick.getDestination()).toBeUndefined();
    });
  });

  describe('datetime', () => {
    it('should get current date by default', () => {
      const now = new Date();
      const datetime = rawClick.getDatetime();
      // Should be within 1 second
      expect(Math.abs(datetime.getTime() - now.getTime())).toBeLessThan(1000);
    });

    it('should get and set datetime', () => {
      const customDate = new Date('2023-01-15T10:30:00Z');
      rawClick.setDatetime(customDate);
      expect(rawClick.getDatetime()).toEqual(customDate);
    });
  });

  describe('generic access', () => {
    it('should get arbitrary values with get()', () => {
      rawClick.set('custom_field', 'custom_value');
      expect(rawClick.get('custom_field')).toBe('custom_value');
    });

    it('should return undefined for non-existent keys', () => {
      expect(rawClick.get('non_existent')).toBeUndefined();
    });

    it('should set arbitrary values with set()', () => {
      rawClick.set('new_field', 123);
      expect(rawClick.get('new_field')).toBe(123);
    });

    it('should support typed get()', () => {
      rawClick.set('number_field', 42);
      const value = rawClick.get<number>('number_field');
      expect(typeof value).toBe('number');
    });

    it('should return all data with getData()', () => {
      rawClick.setSubId('test123');
      rawClick.setIp('1.2.3.4');
      rawClick.setCountry('US');
      
      const data = rawClick.getData();
      
      expect(data.sub_id).toBe('test123');
      expect(data.ip).toBe('1.2.3.4');
      expect(data.country).toBe('US');
    });

    it('should return a copy of data from getData()', () => {
      rawClick.setSubId('original');
      const data = rawClick.getData();
      data.sub_id = 'modified';
      
      // Original should not be affected
      expect(rawClick.getSubId()).toBe('original');
    });
  });

  describe('data persistence', () => {
    it('should preserve all data when creating from existing RawClick', () => {
      const original = new RawClick({
        sub_id: 'original-sub',
        ip: '10.0.0.1',
        country: 'GB',
        device_type: 'desktop',
        is_bot: true,
        cost: 2.5
      });

      const copy = new RawClick(original.getData());
      
      expect(copy.getSubId()).toBe('original-sub');
      expect(copy.getIp()).toBe('10.0.0.1');
      expect(copy.getCountry()).toBe('GB');
      expect(copy.getDeviceType()).toBe('desktop');
      expect(copy.isBot()).toBe(true);
      expect(copy.getCost()).toBe(2.5);
    });

    it('should handle nested data objects', () => {
      const data = {
        sub_id: 'nested-test',
        custom_object: { key: 'value', nested: { deep: true } }
      };
      
      const click = new RawClick(data);
      const retrieved = click.get('custom_object');
      
      expect(retrieved).toEqual({ key: 'value', nested: { deep: true } });
    });
  });

  describe('edge cases', () => {
    it('should handle null values', () => {
      rawClick.set('null_field', null);
      expect(rawClick.get('null_field')).toBeNull();
    });

    it('should handle empty string values', () => {
      rawClick.setSubId('');
      expect(rawClick.getSubId()).toBe('');
    });

    it('should handle zero values', () => {
      rawClick.setCost(0);
      expect(rawClick.getCost()).toBe(0);
    });

    it('should handle very large numbers', () => {
      rawClick.setCost(999999999.999999);
      expect(rawClick.getCost()).toBe(999999999.999999);
    });

    it('should handle Unicode in string fields', () => {
      rawClick.setKeyword('搜索关键词 🔍');
      expect(rawClick.getKeyword()).toBe('搜索关键词 🔍');
    });
  });
});
