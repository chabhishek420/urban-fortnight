/**
 * Traffic Log Entry Tests
 * 
 * Tests for the logging system used during traffic processing
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TrafficLogEntry } from '../../src/traffic/logging/traffic-log-entry';

describe('TrafficLogEntry', () => {
  let logEntry: TrafficLogEntry;

  beforeEach(() => {
    logEntry = new TrafficLogEntry();
  });

  describe('message logging', () => {
    it('should add messages', () => {
      logEntry.add('First message');
      logEntry.add('Second message');
      
      const messages = logEntry.getMessages();
      expect(messages).toHaveLength(2);
      expect(messages[0]).toBe('First message');
      expect(messages[1]).toBe('Second message');
    });

    it('should return a copy of messages', () => {
      logEntry.add('Original');
      const messages = logEntry.getMessages();
      messages.push('Modified');
      
      expect(logEntry.getMessages()).toHaveLength(1);
    });

    it('should check if messages exist', () => {
      expect(logEntry.hasMessages()).toBe(false);
      logEntry.add('Test');
      expect(logEntry.hasMessages()).toBe(true);
    });

    it('should handle empty messages', () => {
      logEntry.add('');
      expect(logEntry.hasMessages()).toBe(true);
      expect(logEntry.getMessages()).toContain('');
    });

    it('should handle long messages', () => {
      const longMessage = 'x'.repeat(10000);
      logEntry.add(longMessage);
      expect(logEntry.getMessages()[0]).toBe(longMessage);
    });
  });

  describe('profiling', () => {
    it('should track execution time', async () => {
      logEntry.startProfiling();
      
      // Wait a small amount of time
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const elapsed = logEntry.stopProfiling('Test execution');
      // Allow tolerance for timer resolution
      expect(elapsed).toBeGreaterThanOrEqual(8);
    });

    it('should add profiling message', async () => {
      logEntry.startProfiling();
      await new Promise(resolve => setTimeout(resolve, 5));
      logEntry.stopProfiling('Test timer');
      
      const messages = logEntry.getMessages();
      const lastMessage = messages[messages.length - 1];
      expect(lastMessage).toMatch(/Test timer: \d+ms/);
    });

    it('should use default label for profiling', async () => {
      logEntry.startProfiling();
      await new Promise(resolve => setTimeout(resolve, 5));
      logEntry.stopProfiling();
      
      const messages = logEntry.getMessages();
      const lastMessage = messages[messages.length - 1];
      expect(lastMessage).toMatch(/Execution time: \d+ms/);
    });

    it('should return elapsed time in milliseconds', async () => {
      logEntry.startProfiling();
      await new Promise(resolve => setTimeout(resolve, 5));
      const elapsed = logEntry.stopProfiling();
      
      expect(elapsed).toBeGreaterThanOrEqual(5);
      expect(elapsed).toBeLessThan(200); // Should be reasonably fast
    });

    it('can be called multiple times', async () => {
      logEntry.startProfiling();
      await new Promise(resolve => setTimeout(resolve, 10));
      const first = logEntry.stopProfiling('First');
      
      logEntry.startProfiling();
      await new Promise(resolve => setTimeout(resolve, 10));
      const second = logEntry.stopProfiling('Second');
      
      // Allow tolerance for timer resolution
      expect(first).toBeGreaterThanOrEqual(8);
      expect(second).toBeGreaterThanOrEqual(8);
    });
  });

  describe('raw click logging', () => {
    it('should store raw click data', () => {
      const rawClick = { sub_id: 'test-123', ip: '1.2.3.4' };
      logEntry.logRawClick(rawClick, {});
      
      expect(logEntry.getRawClick()).toEqual(rawClick);
    });

    it('should store request data with raw click', () => {
      const rawClick = { sub_id: 'test' };
      const request = { ip: '127.0.0.1', userAgent: 'Test' };
      logEntry.logRawClick(rawClick, request);
      
      expect(logEntry.getRawClick()).toEqual(rawClick);
    });

    it('should handle null raw click', () => {
      logEntry.logRawClick(null, {});
      expect(logEntry.getRawClick()).toBeNull();
    });
  });

  describe('toString', () => {
    it('should join messages with newlines', () => {
      logEntry.add('Line 1');
      logEntry.add('Line 2');
      logEntry.add('Line 3');
      
      expect(logEntry.toString()).toBe('Line 1\nLine 2\nLine 3');
    });

    it('should return empty string when no messages', () => {
      expect(logEntry.toString()).toBe('');
    });

    it('should handle single message', () => {
      logEntry.add('Only message');
      expect(logEntry.toString()).toBe('Only message');
    });
  });

  describe('clear', () => {
    it('should clear all messages', () => {
      logEntry.add('Message 1');
      logEntry.add('Message 2');
      logEntry.clear();
      
      expect(logEntry.hasMessages()).toBe(false);
      expect(logEntry.getMessages()).toHaveLength(0);
    });

    it('should clear raw click data', () => {
      logEntry.logRawClick({ test: true }, {});
      logEntry.clear();
      
      expect(logEntry.getRawClick()).toBeNull();
    });

    it('should allow adding messages after clear', () => {
      logEntry.add('Before clear');
      logEntry.clear();
      logEntry.add('After clear');
      
      expect(logEntry.getMessages()).toEqual(['After clear']);
    });
  });

  describe('practical usage scenarios', () => {
    it('should track pipeline stage execution', () => {
      logEntry.add('Starting pipeline');
      logEntry.add('[FindCampaignStage] Searching campaign');
      logEntry.add('[FindCampaignStage] Found campaign: Test (ID: 1)');
      logEntry.add('[ChooseStreamStage] Selecting stream');
      logEntry.add('[ChooseStreamStage] Selected stream: Main');
      
      expect(logEntry.hasMessages()).toBe(true);
      expect(logEntry.getMessages().length).toBe(5);
    });

    it('should track filter evaluation', () => {
      logEntry.add('Checking stream #1');
      logEntry.add('Stream contains no filters. Passed.');
      logEntry.add('All filters are checked. Passed.');
      
      const output = logEntry.toString();
      expect(output).toContain('Checking stream');
      expect(output).toContain('Passed');
    });
  });
});
