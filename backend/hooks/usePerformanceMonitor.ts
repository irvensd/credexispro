import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  firstContentfulPaint?: number;
  timeToInteractive?: number;
  domContentLoaded?: number;
  loadTime?: number;
}

export function usePerformanceMonitor() {
  const metrics = useRef<PerformanceMetrics>({});

  useEffect(() => {
    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length > 0) {
        metrics.current.firstContentfulPaint = entries[0].startTime;
      }
    });
    fcpObserver.observe({ entryTypes: ['paint'] });

    // Time to Interactive
    const ttiObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length > 0) {
        metrics.current.timeToInteractive = entries[0].startTime;
      }
    });
    ttiObserver.observe({ entryTypes: ['longtask'] });

    // DOM Content Loaded
    metrics.current.domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;

    // Load Time
    metrics.current.loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;

    return () => {
      fcpObserver.disconnect();
      ttiObserver.disconnect();
    };
  }, []);

  return metrics.current;
} 