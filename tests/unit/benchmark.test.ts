import { describe, it } from 'vitest';
import { ServerRequest } from '../../src/traffic/request/server-request';
import { BuildRawClickStage } from '../../src/traffic/pipeline/stage/build-raw-click-stage';
import { Payload } from '../../src/traffic/pipeline/payload';
import { TrafficLogEntry } from '../../src/traffic/logging/traffic-log-entry';

describe('Performance Benchmark', () => {
  it('Benchmark ServerRequest.getHeader', () => {
    const headers: Record<string, string> = {};
    for (let i = 0; i < 50; i++) {
      headers[`X-Header-${i}`] = `value-${i}`;
    }
    const request = new ServerRequest({ headers });

    const start = performance.now();
    const iterations = 100000;
    for (let i = 0; i < iterations; i++) {
      request.getHeader('X-Header-49');
      request.getHeader('Non-Existent');
    }
    const end = performance.now();
    console.log(`ServerRequest.getHeader: ${(end - start).toFixed(4)}ms for ${iterations} iterations`);
  });

  it('Benchmark BuildRawClickStage.process', () => {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://google.com'
    };
    const queryParams = {
      'sub_id_1': 'sid1',
      'extra_param_1': 'ep1',
      'keyword': 'test'
    };
    const request = new ServerRequest({
      headers,
      queryParams,
      uri: new URL('http://localhost/?campaign=test&sub_id_1=sid1&extra_param_1=ep1&keyword=test')
    });

    const stage = new BuildRawClickStage();
    const iterations = 1000;

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      const payload = new Payload({ serverRequest: request });
      const logEntry = new TrafficLogEntry();
      stage.process(payload, logEntry);
    }
    const end = performance.now();
    console.log(`BuildRawClickStage.process: ${(end - start).toFixed(4)}ms for ${iterations} iterations`);
  });
});
