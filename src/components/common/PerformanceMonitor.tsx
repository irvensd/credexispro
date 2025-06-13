import React, { useEffect, useState } from 'react';
import { Activity, Clock, X, Zap } from 'lucide-react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean;
  value: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or when explicitly enabled
    if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_SHOW_PERF_MONITOR === 'true') {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Measure FCP (First Contentful Paint)
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        setMetrics((prev) => ({
          ...prev,
          fcp: Math.round(entries[0].startTime),
        }));
      }
    });
    fcpObserver.observe({ entryTypes: ['paint'] });

    // Measure LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        setMetrics((prev) => ({
          ...prev,
          lcp: Math.round(entries[entries.length - 1].startTime),
        }));
      }
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // Measure FID (First Input Delay)
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        setMetrics((prev) => ({
          ...prev,
          fid: Math.round(entries[0].duration),
        }));
      }
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Measure CLS (Cumulative Layout Shift)
    const clsObserver = new PerformanceObserver((entryList) => {
      let clsValue = 0;
      for (const entry of entryList.getEntries()) {
        const layoutShiftEntry = entry as LayoutShiftEntry;
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
        }
      }
      setMetrics((prev) => ({
        ...prev,
        cls: Math.round(clsValue * 1000) / 1000,
      }));
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // Measure TTFB (Time to First Byte)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      setMetrics((prev) => ({
        ...prev,
        ttfb: Math.round(navigationEntry.responseStart - navigationEntry.requestStart),
      }));
    }

    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-white p-4 shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Performance Metrics</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-500"
          aria-label="Close performance monitor"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Zap className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-gray-600">FCP:</span>
          <span className="text-sm font-medium">{metrics.fcp}ms</span>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-green-500" />
          <span className="text-sm text-gray-600">LCP:</span>
          <span className="text-sm font-medium">{metrics.lcp}ms</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-yellow-500" />
          <span className="text-sm text-gray-600">FID:</span>
          <span className="text-sm font-medium">{metrics.fid}ms</span>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-red-500" />
          <span className="text-sm text-gray-600">CLS:</span>
          <span className="text-sm font-medium">{metrics.cls}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-purple-500" />
          <span className="text-sm text-gray-600">TTFB:</span>
          <span className="text-sm font-medium">{metrics.ttfb}ms</span>
        </div>
      </div>
    </div>
  );
}; 