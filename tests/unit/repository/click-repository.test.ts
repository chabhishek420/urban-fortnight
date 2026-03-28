/**
 * ClickRepository Tests
 * 
 * Tests for click database operations with mocked Prisma
 */

import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { ClickRepository } from '../../../src/traffic/repository/click-repository';
import { RawClick } from '../../../src/traffic/model/raw-click';

// Create mock functions
const mockCreate = vi.fn();
const mockCreateMany = vi.fn();
const mockFindUnique = vi.fn();
const mockFindMany = vi.fn();
const mockUpdate = vi.fn();
const mockDeleteMany = vi.fn();
const mockCount = vi.fn();

// Mock the database module
vi.mock('../../../src/lib/db', () => ({
  getDb: vi.fn(() => ({
    click: {
      create: mockCreate,
      createMany: mockCreateMany,
      findUnique: mockFindUnique,
      findMany: mockFindMany,
      update: mockUpdate,
      deleteMany: mockDeleteMany,
      count: mockCount
    }
  }))
}));

describe('ClickRepository', () => {
  let repository: ClickRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    (ClickRepository as any).instance = undefined;
    repository = ClickRepository.getInstance();
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = ClickRepository.getInstance();
      const instance2 = ClickRepository.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('create', () => {
    it('should create click from RawClick', async () => {
      const rawClick = new RawClick({
        sub_id: 'test-sub-123',
        ip: '1.2.3.4',
        campaign_id: 10,
        stream_id: 20,
        visitor_id: 100,
        cost: 0.5
      });
      
      mockCreate.mockResolvedValue({
        clickId: 1,
        subId: 'test-sub-123',
        campaignId: 10,
        streamId: 20,
        visitorId: 100,
        cost: 0.5
      });
      
      const result = await repository.create(rawClick);
      
      expect(mockCreate).toHaveBeenCalled();
      expect(result.subId).toBe('test-sub-123');
      expect(result.campaignId).toBe(10);
    });

    it('should generate sub_id if not set', async () => {
      const rawClick = new RawClick({
        campaign_id: 1
      });
      
      mockCreate.mockResolvedValue({
        clickId: 1,
        subId: 'generated-sub-id'
      });
      
      await repository.create(rawClick);
      
      const createCall = mockCreate.mock.calls[0][0];
      expect(createCall.data.subId).toHaveLength(12);
    });

    it('should set correct uniqueness flags', async () => {
      const rawClick = new RawClick();
      rawClick.setIsUniqueStream(true);
      rawClick.setIsUniqueCampaign(true);
      rawClick.setIsUniqueGlobal(true);
      
      mockCreate.mockResolvedValue({ clickId: 1 });
      
      await repository.create(rawClick);
      
      const createCall = mockCreate.mock.calls[0][0];
      expect(createCall.data.isUniqueStream).toBe(true);
      expect(createCall.data.isUniqueCampaign).toBe(true);
      expect(createCall.data.isUniqueGlobal).toBe(true);
    });

    it('should set bot flag', async () => {
      const rawClick = new RawClick();
      rawClick.setIsBot(true);
      
      mockCreate.mockResolvedValue({ clickId: 1 });
      
      await repository.create(rawClick);
      
      const createCall = mockCreate.mock.calls[0][0];
      expect(createCall.data.isBot).toBe(true);
    });

    it('should set proxy flag', async () => {
      const rawClick = new RawClick();
      rawClick.setIsProxy(true);
      
      mockCreate.mockResolvedValue({ clickId: 1 });
      
      await repository.create(rawClick);
      
      const createCall = mockCreate.mock.calls[0][0];
      expect(createCall.data.isUsingProxy).toBe(true);
    });

    it('should set empty referrer flag', async () => {
      const rawClick = new RawClick();
      // No referrer set
      
      mockCreate.mockResolvedValue({ clickId: 1 });
      
      await repository.create(rawClick);
      
      const createCall = mockCreate.mock.calls[0][0];
      expect(createCall.data.isEmptyReferrer).toBe(true);
    });

    it('should set non-empty referrer flag', async () => {
      const rawClick = new RawClick();
      rawClick.setReferrer('https://google.com');
      
      mockCreate.mockResolvedValue({ clickId: 1 });
      
      await repository.create(rawClick);
      
      const createCall = mockCreate.mock.calls[0][0];
      expect(createCall.data.isEmptyReferrer).toBe(false);
    });
  });

  describe('createMany', () => {
    it('should create multiple clicks', async () => {
      const rawClicks = [
        new RawClick({ sub_id: 'click1', campaign_id: 1 }),
        new RawClick({ sub_id: 'click2', campaign_id: 1 }),
        new RawClick({ sub_id: 'click3', campaign_id: 1 })
      ];
      
      mockCreateMany.mockResolvedValue({ count: 3 });
      
      const result = await repository.createMany(rawClicks);
      
      expect(result).toBe(3);
      expect(mockCreateMany).toHaveBeenCalled();
    });

    it('should return 0 for empty array', async () => {
      mockCreateMany.mockResolvedValue({ count: 0 });
      
      const result = await repository.createMany([]);
      
      expect(result).toBe(0);
    });
  });

  describe('findBySubId', () => {
    it('should find click by sub_id', async () => {
      mockFindUnique.mockResolvedValue({
        clickId: 1,
        subId: 'test-sub-id'
      });
      
      const result = await repository.findBySubId('test-sub-id');
      
      expect(result).not.toBeNull();
      expect(result?.subId).toBe('test-sub-id');
    });

    it('should return null if not found', async () => {
      mockFindUnique.mockResolvedValue(null);
      
      const result = await repository.findBySubId('nonexistent');
      
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find click by ID', async () => {
      mockFindUnique.mockResolvedValue({
        clickId: 42,
        subId: 'test-sub'
      });
      
      const result = await repository.findById(42);
      
      expect(result).not.toBeNull();
      expect(result?.clickId).toBe(42);
    });

    it('should return null if not found', async () => {
      mockFindUnique.mockResolvedValue(null);
      
      const result = await repository.findById(999);
      
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update click by ID', async () => {
      mockUpdate.mockResolvedValue({
        clickId: 1,
        cost: 1.5
      });
      
      const result = await repository.update(1, { cost: 1.5 });
      
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { clickId: 1 },
        data: { cost: 1.5 }
      });
    });
  });

  describe('updateBySubId', () => {
    it('should update click by sub_id', async () => {
      mockUpdate.mockResolvedValue({
        subId: 'test-sub',
        cost: 2.0
      });
      
      const result = await repository.updateBySubId('test-sub', { cost: 2.0 });
      
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { subId: 'test-sub' },
        data: { cost: 2.0 }
      });
    });
  });

  describe('uniqueness checks', () => {
    it('should check if click exists for campaign', async () => {
      mockCount.mockResolvedValue(1);
      
      const result = await repository.existsForCampaign(100, 10);
      
      expect(result).toBe(true);
      expect(mockCount).toHaveBeenCalledWith({
        where: { visitorId: 100, campaignId: 10 }
      });
    });

    it('should check if click exists for stream', async () => {
      mockCount.mockResolvedValue(0);
      
      const result = await repository.existsForStream(100, 20);
      
      expect(result).toBe(false);
    });

    it('should check if click exists globally', async () => {
      mockCount.mockResolvedValue(3);
      
      const result = await repository.existsGlobal(100);
      
      expect(result).toBe(true);
    });
  });

  describe('countByCampaign', () => {
    it('should count clicks for campaign', async () => {
      mockCount.mockResolvedValue(500);
      
      const result = await repository.countByCampaign(10);
      
      expect(result).toBe(500);
    });

    it('should count clicks for campaign since date', async () => {
      mockCount.mockResolvedValue(100);
      const since = new Date('2024-01-01');
      
      const result = await repository.countByCampaign(10, since);
      
      expect(mockCount).toHaveBeenCalledWith({
        where: {
          campaignId: 10,
          datetime: { gte: since }
        }
      });
    });
  });

  describe('countByStream', () => {
    it('should count clicks for stream', async () => {
      mockCount.mockResolvedValue(250);
      
      const result = await repository.countByStream(20);
      
      expect(result).toBe(250);
    });
  });

  describe('findByDateRange', () => {
    it('should find clicks in date range', async () => {
      const mockClicks = [
        { clickId: 1, datetime: new Date('2024-01-02') },
        { clickId: 2, datetime: new Date('2024-01-03') }
      ];
      
      mockFindMany.mockResolvedValue(mockClicks);
      
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-05');
      
      const result = await repository.findByDateRange(start, end);
      
      expect(result).toHaveLength(2);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: {
          datetime: { gte: start, lte: end }
        },
        orderBy: { datetime: 'desc' },
        take: 1000
      });
    });

    it('should respect limit parameter', async () => {
      mockFindMany.mockResolvedValue([]);
      
      await repository.findByDateRange(new Date(), new Date(), 500);
      
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 500 })
      );
    });
  });

  describe('deleteOlderThan', () => {
    it('should delete old clicks', async () => {
      mockDeleteMany.mockResolvedValue({ count: 1000 });
      
      const cutoff = new Date('2023-01-01');
      const result = await repository.deleteOlderThan(cutoff);
      
      expect(result).toBe(1000);
      expect(mockDeleteMany).toHaveBeenCalledWith({
        where: { datetime: { lt: cutoff } }
      });
    });
  });

  describe('markConversion', () => {
    it('should mark click as sale', async () => {
      mockUpdate.mockResolvedValue({
        subId: 'test-sub',
        isSale: true,
        saleRevenue: 100
      });
      
      const result = await repository.markConversion('test-sub', 'sale', 100);
      
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { subId: 'test-sub' },
        data: { isSale: true, saleRevenue: 100 }
      });
    });

    it('should mark click as lead', async () => {
      mockUpdate.mockResolvedValue({
        subId: 'test-sub',
        isLead: true,
        leadRevenue: 50
      });
      
      const result = await repository.markConversion('test-sub', 'lead', 50);
      
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { subId: 'test-sub' },
        data: { isLead: true, leadRevenue: 50 }
      });
    });

    it('should mark click as rejected', async () => {
      mockUpdate.mockResolvedValue({
        subId: 'test-sub',
        isRejected: true
      });
      
      const result = await repository.markConversion('test-sub', 'rejected');
      
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { subId: 'test-sub' },
        data: { isRejected: true, rejectedRevenue: 0 }
      });
    });
  });

  describe('incrementRebills', () => {
    it('should throw if click not found', async () => {
      mockFindUnique.mockResolvedValue(null);
      
      await expect(repository.incrementRebills('nonexistent')).rejects.toThrow('Click not found');
    });
  });
});
