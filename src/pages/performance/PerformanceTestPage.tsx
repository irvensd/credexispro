import React, { useState } from 'react';
import { Activity, BarChart2, Clock, Zap } from 'lucide-react';
import { performanceTest } from '../../utils/performanceTest';
import { PerformanceTestResults } from '../../components/common/PerformanceTestResults';

export const PerformanceTestPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [endpoint, setEndpoint] = useState('/api/test');
  const [concurrentUsers, setConcurrentUsers] = useState(5);
  const [testDuration, setTestDuration] = useState(30);
  const [selectedTest, setSelectedTest] = useState<'benchmark' | 'load'>('benchmark');

  const runBenchmarkTest = async () => {
    setIsRunning(true);
    try {
      // Run async test
      await performanceTest.benchmark('asyncTest', async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      }, 10);

      // Run sync test
      await performanceTest.benchmark('syncTest', () => {
        let sum = 0;
        for (let i = 0; i < 1000000; i++) {
          sum += i;
        }
      }, 10);

      // Run error test
      await performanceTest.benchmark('errorTest', () => {
        throw new Error('Test error');
      }, 1).catch(() => {
        // Expected error
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runLoadTest = async () => {
    setIsRunning(true);
    try {
      await performanceTest.loadTest(endpoint, concurrentUsers, testDuration);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Performance Testing</h1>

      {/* Test Configuration */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setSelectedTest('benchmark')}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              selectedTest === 'benchmark'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Benchmark Tests
          </button>
          <button
            onClick={() => setSelectedTest('load')}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              selectedTest === 'load'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Load Tests
          </button>
        </div>

        {selectedTest === 'benchmark' ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Benchmark Configuration</h2>
            <p className="text-sm text-gray-500">
              Run performance benchmarks on various operations to measure execution time.
            </p>
            <button
              onClick={runBenchmarkTest}
              disabled={isRunning}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isRunning ? 'Running Tests...' : 'Run Benchmark Tests'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Load Test Configuration</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="endpoint" className="block text-sm font-medium text-gray-700">
                  Endpoint
                </label>
                <input
                  type="text"
                  id="endpoint"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="users" className="block text-sm font-medium text-gray-700">
                  Concurrent Users
                </label>
                <input
                  type="number"
                  id="users"
                  value={concurrentUsers}
                  onChange={(e) => setConcurrentUsers(Number(e.target.value))}
                  min="1"
                  max="100"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Test Duration (seconds)
                </label>
                <input
                  type="number"
                  id="duration"
                  value={testDuration}
                  onChange={(e) => setTestDuration(Number(e.target.value))}
                  min="1"
                  max="300"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={runLoadTest}
              disabled={isRunning}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isRunning ? 'Running Load Test...' : 'Run Load Test'}
            </button>
          </div>
        )}
      </div>

      {/* Test Results */}
      <PerformanceTestResults />
    </div>
  );
}; 