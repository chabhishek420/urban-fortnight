/**
 * Pipeline Tests
 * 
 * Tests for the pipeline orchestrator that executes stages in sequence
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Pipeline, PipelineException, PipelineFactory } from '../../src/traffic/pipeline/pipeline';
import type { StageInterface } from '../../src/core/pipeline/stage-interface';
import { StageException } from '../../src/core/pipeline/stage-interface';
import { Payload } from '../../src/traffic/pipeline/payload';
import { TrafficLogEntry } from '../../src/traffic/logging/traffic-log-entry';
import { RawClick } from '../../src/traffic/model/raw-click';
import { Response } from '../../src/traffic/response/response';

// Mock stage that passes through
class MockStage implements StageInterface {
  constructor(private name: string = 'MockStage') {}
  
  process(payload: Payload, logEntry: TrafficLogEntry): Payload {
    logEntry.add(`${this.name} executed`);
    return payload;
  }
}

// Mock stage that modifies payload
class ModifyingStage implements StageInterface {
  process(payload: Payload, logEntry: TrafficLogEntry): Payload {
    logEntry.add('ModifyingStage executed');
    const click = payload.getRawClick();
    if (click) {
      click.set('modified', true);
    }
    return payload;
  }
}

// Mock stage that throws
class ThrowingStage implements StageInterface {
  process(_payload: Payload, _logEntry: TrafficLogEntry): never {
    throw new Error('Stage failed');
  }
}

// Mock stage that aborts
class AbortingStage implements StageInterface {
  process(payload: Payload, logEntry: TrafficLogEntry): Payload {
    logEntry.add('Aborting');
    payload.abort(true);
    return payload;
  }
}

// Mock stage that returns null (invalid)
class NullReturningStage implements StageInterface {
  process(_payload: Payload, _logEntry: TrafficLogEntry): null {
    return null;
  }
}

// Helper to create test payload
function createTestPayload(): Payload {
  const rawClick = new RawClick({ sub_id: 'test-sub-id' });
  
  // Create minimal mock server request
  const mockServerRequest = {
    getIp: () => '127.0.0.1',
    getUserAgent: () => 'Test Agent',
    getReferrer: () => '',
    getUri: () => new URL('http://test.local/campaign'),
    getParam: () => undefined,
    getQueryParams: () => ({}),
    getHeaders: () => ({}),
    getHeader: () => undefined,
    getMethod: () => 'GET',
    getCookie: () => undefined,
    setCookie: vi.fn(),
    getQueryParam: () => undefined
  } as any;

  // Use real Response class
  const mockResponse = new Response();
  
  const payload = new Payload({
    serverRequest: mockServerRequest,
    response: mockResponse,
    rawClick
  });
  
  return payload;
}

describe('Pipeline', () => {
  let pipeline: Pipeline;
  let logEntry: TrafficLogEntry;

  beforeEach(() => {
    pipeline = new Pipeline();
    logEntry = new TrafficLogEntry();
  });

  describe('constructor', () => {
    it('should create empty pipeline', () => {
      expect(pipeline.getStages()).toHaveLength(0);
    });

    it('should accept initial stages', () => {
      const stages = [new MockStage('Stage1'), new MockStage('Stage2')];
      const p = new Pipeline(stages);
      expect(p.getStages()).toHaveLength(2);
    });
  });

  describe('addStage', () => {
    it('should add stages', () => {
      pipeline.addStage(new MockStage('Stage1'));
      pipeline.addStage(new MockStage('Stage2'));
      
      expect(pipeline.getStages()).toHaveLength(2);
    });

    it('should return this for chaining', () => {
      const result = pipeline.addStage(new MockStage());
      expect(result).toBe(pipeline);
    });
  });

  describe('setStages', () => {
    it('should replace all stages', () => {
      pipeline.addStage(new MockStage('Old'));
      pipeline.setStages([new MockStage('New1'), new MockStage('New2')]);
      
      expect(pipeline.getStages()).toHaveLength(2);
    });
  });

  describe('getStages', () => {
    it('should return a copy of stages', () => {
      pipeline.addStage(new MockStage());
      const stages = pipeline.getStages();
      stages.push(new MockStage());
      
      // Original should not be affected
      expect(pipeline.getStages()).toHaveLength(1);
    });
  });

  describe('process', () => {
    it('should throw if no stages are set', async () => {
      const payload = createTestPayload();
      
      await expect(pipeline.process(payload, logEntry)).rejects.toThrow(PipelineException);
      await expect(pipeline.process(payload, logEntry)).rejects.toThrow('No stages set');
    });

    it('should execute stages in sequence', async () => {
      pipeline.addStage(new MockStage('Stage1'));
      pipeline.addStage(new MockStage('Stage2'));
      pipeline.addStage(new MockStage('Stage3'));
      
      const payload = createTestPayload();
      await pipeline.process(payload, logEntry);
      
      const messages = logEntry.getMessages();
      expect(messages).toContain('Stage1 executed');
      expect(messages).toContain('Stage2 executed');
      expect(messages).toContain('Stage3 executed');
    });

    it('should pass payload through all stages', async () => {
      pipeline.addStage(new ModifyingStage());
      
      const payload = createTestPayload();
      const result = await pipeline.process(payload, logEntry);
      
      expect(result.getRawClick()?.get('modified')).toBe(true);
    });

    it('should log pipeline start', async () => {
      pipeline.addStage(new MockStage());
      const payload = createTestPayload();
      
      await pipeline.process(payload, logEntry);
      
      expect(logEntry.getMessages()).toContain('Starting pipeline');
    });

    it('should handle async stages', async () => {
      const asyncStage: StageInterface = {
        async process(payload: Payload, logEntry: TrafficLogEntry) {
          await new Promise(r => setTimeout(r, 10));
          logEntry.add('Async stage done');
          return payload;
        }
      };
      
      pipeline.addStage(asyncStage);
      const payload = createTestPayload();
      
      await pipeline.process(payload, logEntry);
      expect(logEntry.getMessages()).toContain('Async stage done');
    });

    it('should throw PipelineException on stage error', async () => {
      pipeline.addStage(new ThrowingStage());
      const payload = createTestPayload();
      
      await expect(pipeline.process(payload, logEntry)).rejects.toThrow(PipelineException);
    });

    it('should include stage name in error', async () => {
      pipeline.addStage(new ThrowingStage());
      const payload = createTestPayload();
      
      try {
        await pipeline.process(payload, logEntry);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(PipelineException);
        if (error instanceof PipelineException) {
          expect(error.stageName).toBeDefined();
        }
      }
    });

    it('should validate payload after each stage', async () => {
      pipeline.addStage(new NullReturningStage());
      const payload = createTestPayload();
      
      await expect(pipeline.process(payload, logEntry)).rejects.toThrow("doesn't return payload");
    });
  });

  describe('aborted payload', () => {
    it('should stop processing on abort', async () => {
      pipeline.addStage(new MockStage('Before'));
      pipeline.addStage(new AbortingStage());
      pipeline.addStage(new MockStage('After')); // Should not execute
      
      const payload = createTestPayload();
      await pipeline.process(payload, logEntry);
      
      expect(logEntry.getMessages()).toContain('Before executed');
      expect(logEntry.getMessages()).toContain('Aborting');
      expect(logEntry.getMessages()).not.toContain('After executed');
    });

    it('should return aborted payload', async () => {
      pipeline.addStage(new AbortingStage());
      const payload = createTestPayload();
      
      const result = await pipeline.process(payload, logEntry);
      expect(result.isAborted()).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset repeat count', async () => {
      pipeline.addStage(new MockStage());
      (pipeline as any)._repeats = 5;
      
      pipeline.reset();
      expect(pipeline.getRepeats()).toBe(0);
    });
  });

  describe('freezeStages', () => {
    it('should freeze stages', () => {
      pipeline.freezeStages();
      expect((pipeline as any)._stagesFrozen).toBe(true);
    });
  });
});

describe('PipelineException', () => {
  it('should create exception with message', () => {
    const error = new PipelineException('Test error');
    expect(error.message).toBe('Test error');
    expect(error.name).toBe('PipelineException');
  });

  it('should include stage name', () => {
    const error = new PipelineException('Test error', 'TestStage');
    expect(error.stageName).toBe('TestStage');
  });

  it('should include cause', () => {
    const cause = new Error('Original error');
    const error = new PipelineException('Wrapped', 'Stage', cause);
    expect(error.cause).toBe(cause);
  });
});

describe('PipelineFactory', () => {
  let factory: PipelineFactory;

  beforeEach(() => {
    factory = new PipelineFactory();
  });

  describe('createCustomPipeline', () => {
    it('should create pipeline with custom stages', () => {
      const stages = [new MockStage('A'), new MockStage('B')];
      const pipeline = factory.createCustomPipeline(stages);
      
      expect(pipeline.getStages()).toHaveLength(2);
    });
  });

  describe('createFromConfig', () => {
    it('should create pipeline from config', () => {
      const config = {
        stages: [new MockStage('Config1'), new MockStage('Config2')],
        frozen: true
      };
      
      const pipeline = factory.createFromConfig(config);
      expect(pipeline.getStages()).toHaveLength(2);
    });
  });
});
