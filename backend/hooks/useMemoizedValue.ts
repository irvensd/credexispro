import { useRef, useCallback } from 'react';

interface Cache<T> {
  [key: string]: {
    value: T;
    timestamp: number;
  };
}

interface Options {
  maxAge?: number; // Maximum age of cached values in milliseconds
  maxSize?: number; // Maximum number of cached values
}

export function useMemoizedValue<T>(
  computeFn: () => T,
  dependencies: any[],
  options: Options = {}
) {
  const { maxAge = 5 * 60 * 1000, maxSize = 100 } = options;
  const cache = useRef<Cache<T>>({});
  const lastComputed = useRef<{ value: T; deps: any[] } | null>(null);

  const getCacheKey = useCallback((deps: any[]) => {
    return deps.map(dep => 
      typeof dep === 'object' ? JSON.stringify(dep) : String(dep)
    ).join('|');
  }, []);

  const cleanupCache = useCallback(() => {
    const now = Date.now();
    const entries = Object.entries(cache.current);
    
    // Remove expired entries
    entries.forEach(([key, { timestamp }]) => {
      if (now - timestamp > maxAge) {
        delete cache.current[key];
      }
    });

    // Remove oldest entries if cache is too large
    if (Object.keys(cache.current).length > maxSize) {
      const sortedEntries = entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const entriesToRemove = sortedEntries.slice(0, sortedEntries.length - maxSize);
      entriesToRemove.forEach(([key]) => {
        delete cache.current[key];
      });
    }
  }, [maxAge, maxSize]);

  const computeValue = useCallback(() => {
    const key = getCacheKey(dependencies);
    const now = Date.now();

    // Check if we have a valid cached value
    if (cache.current[key] && now - cache.current[key].timestamp <= maxAge) {
      return cache.current[key].value;
    }

    // Check if dependencies haven't changed
    if (
      lastComputed.current &&
      dependencies.every((dep, i) => dep === lastComputed.current!.deps[i])
    ) {
      return lastComputed.current.value;
    }

    // Compute new value
    const value = computeFn();
    cache.current[key] = { value, timestamp: now };
    lastComputed.current = { value, deps: [...dependencies] };

    // Cleanup cache
    cleanupCache();

    return value;
  }, [computeFn, dependencies, getCacheKey, maxAge, cleanupCache]);

  return computeValue();
} 