import React, { useEffect, useState } from 'react';
import { Activity, BarChart2, Clock, Zap } from 'lucide-react';

interface BenchmarkResult {
  name: string;
  duration: number;
  timestamp: number;
}

interface LoadTestResult {
  concurrentUsers: number;
  averageResponseTime: number;
  requestsPerSecond: number;
  errorRate: number;
  timestamp: number;
}

export const PerformanceTestResults: React.FC = () => {
  const [benchmarkResults, setBenchmarkResults] = useState<Map<string, BenchmarkResult[]>>(new Map());
  const [loadTestResults, setLoadTestResults] = useState<LoadTestResult[]>([]);

  useEffect(() => {
    // Get all benchmark results
    const results = new Map<string, BenchmarkResult[]>();
    const benchmarkNames = ['asyncTest', 'syncTest', 'errorTest'];
    benchmarkNames.forEach(name => {
      results.set(name, []);
    });
    setBenchmarkResults(results);

    // Get load test results
    setLoadTestResults([]);
  }, []);

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (duration: number): string => {
    return `${duration.toFixed(2)}ms`;
  };

  const formatErrorRate = (errorRate: number): string => {
    return `${errorRate.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Performance Test Results</h2>
        <button
          onClick={() => {
            setBenchmarkResults(new Map());
            setLoadTestResults([]);
          }}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Clear Results
        </button>
      </div>

      {/* Benchmark Results */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Benchmark Results</h3>
        <div className="space-y-4">
          {Array.from(benchmarkResults.entries()).map(([name, results]) => (
            <div key={name} className="rounded-lg border border-gray-100 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{name}</h4>
                <span className="text-sm text-gray-500">
                  Last run: {formatTimestamp(results[results.length - 1]?.timestamp || 0)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Average Duration</p>
                    <p className="font-medium text-gray-900">
                      {formatDuration(results[results.length - 1]?.duration || 0)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Total Runs</p>
                    <p className="font-medium text-gray-900">{results.length}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Load Test Results */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Load Test Results</h3>
        <div className="space-y-4">
          {loadTestResults.map((result, index) => (
            <div key={index} className="rounded-lg border border-gray-100 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-medium text-gray-900">
                  Load Test {index + 1}
                </h4>
                <span className="text-sm text-gray-500">
                  {formatTimestamp(result.timestamp)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-500">Concurrent Users</p>
                    <p className="font-medium text-gray-900">{result.concurrentUsers}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Avg Response Time</p>
                    <p className="font-medium text-gray-900">
                      {formatDuration(result.averageResponseTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart2 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Requests/Second</p>
                    <p className="font-medium text-gray-900">
                      {result.requestsPerSecond.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-500">Error Rate</p>
                    <p className="font-medium text-gray-900">
                      {formatErrorRate(result.errorRate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 