import { performanceTest } from './performanceTest';

describe('PerformanceTest', () => {
  beforeEach(() => {
    // Reset performance marks and measures
    performance.clearMarks();
    performance.clearMeasures();
    performanceTest.clearResults();
  });

  describe('benchmark', () => {
    it('should measure function execution time', async () => {
      const testFn = async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      };

      const result = await performanceTest.benchmark('asyncTest', testFn, 3);

      expect(result).toHaveProperty('name', 'asyncTest');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('timestamp');
      expect(result.duration).toBeGreaterThanOrEqual(100);
    });

    it('should handle synchronous functions', async () => {
      const testFn = () => {
        let sum = 0;
        for (let i = 0; i < 1000; i++) {
          sum += i;
        }
      };

      const result = await performanceTest.benchmark('syncTest', testFn, 5);

      expect(result).toHaveProperty('name', 'syncTest');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('timestamp');
      expect(result.duration).toBeGreaterThan(0);
    });

    it('should handle errors gracefully', async () => {
      const testFn = () => {
        throw new Error('Test error');
      };

      await expect(performanceTest.benchmark('errorTest', testFn, 1)).rejects.toThrow('Test error');
    });
  });

  describe('loadTest', () => {
    it('should simulate concurrent requests', async () => {
      const mockFetch = jest.fn().mockImplementation(() => 
        Promise.resolve({ ok: true, json: () => Promise.resolve({ data: 'test' }) })
      );
      global.fetch = mockFetch;

      const result = await performanceTest.loadTest('/api/test', 3, 2);

      expect(result).toHaveProperty('concurrentUsers', 3);
      expect(result).toHaveProperty('averageResponseTime');
      expect(result).toHaveProperty('requestsPerSecond');
      expect(result).toHaveProperty('errorRate', 0);
      expect(result).toHaveProperty('timestamp');
      expect(mockFetch).toHaveBeenCalled();
    });

    it('should handle failed requests', async () => {
      const mockFetch = jest.fn().mockImplementation(() => 
        Promise.reject(new Error('Network error'))
      );
      global.fetch = mockFetch;

      const result = await performanceTest.loadTest('/api/test', 2, 2);

      expect(result).toHaveProperty('errorRate');
      expect(result.errorRate).toBeGreaterThan(0);
      expect(result).toHaveProperty('averageResponseTime');
      expect(result).toHaveProperty('requestsPerSecond');
    });

    it('should respect concurrency limits', async () => {
      const mockFetch = jest.fn().mockImplementation(() => 
        Promise.resolve({ ok: true, json: () => Promise.resolve({ data: 'test' }) })
      );
      global.fetch = mockFetch;

      const startTime = Date.now();
      await performanceTest.loadTest('/api/test', 5, 2);
      const endTime = Date.now();
      const duration = endTime - startTime;

      // With 5 concurrent users, the test should take roughly 2 seconds
      // (allowing for some overhead)
      expect(duration).toBeGreaterThanOrEqual(1800);
      expect(duration).toBeLessThanOrEqual(3000);
    });
  });

  describe('results management', () => {
    it('should store and retrieve benchmark results', async () => {
      const testFn = () => {
        let sum = 0;
        for (let i = 0; i < 1000; i++) {
          sum += i;
        }
      };

      await performanceTest.benchmark('testBenchmark', testFn, 3);
      const results = performanceTest.getBenchmarkResults('testBenchmark');

      expect(results).toHaveLength(1);
      expect(results[0]).toHaveProperty('name', 'testBenchmark');
      expect(results[0]).toHaveProperty('duration');
      expect(results[0]).toHaveProperty('timestamp');
    });

    it('should store and retrieve load test results', async () => {
      const mockFetch = jest.fn().mockImplementation(() => 
        Promise.resolve({ ok: true, json: () => Promise.resolve({ data: 'test' }) })
      );
      global.fetch = mockFetch;

      await performanceTest.loadTest('/api/test', 2, 1);
      const results = performanceTest.getLoadTestResults();

      expect(results).toHaveLength(1);
      expect(results[0]).toHaveProperty('concurrentUsers', 2);
      expect(results[0]).toHaveProperty('averageResponseTime');
      expect(results[0]).toHaveProperty('requestsPerSecond');
      expect(results[0]).toHaveProperty('errorRate');
      expect(results[0]).toHaveProperty('timestamp');
    });

    it('should clear all results', async () => {
      const testFn = () => {
        let sum = 0;
        for (let i = 0; i < 1000; i++) {
          sum += i;
        }
      };

      await performanceTest.benchmark('testBenchmark', testFn, 3);
      await performanceTest.loadTest('/api/test', 2, 1);

      performanceTest.clearResults();

      expect(performanceTest.getBenchmarkResults('testBenchmark')).toHaveLength(0);
      expect(performanceTest.getLoadTestResults()).toHaveLength(0);
    });
  });
}); 