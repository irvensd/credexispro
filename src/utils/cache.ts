interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  useLocalStorage?: boolean;
}

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl?: number;
}

class Cache {
  private static instance: Cache;
  private memoryCache: Map<string, CacheEntry<any>>;
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.memoryCache = new Map();
    this.startCleanupInterval();
  }

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  private startCleanupInterval(): void {
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  private cleanup(): void {
    const now = Date.now();

    // Clean up memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (this.isExpired(entry, now)) {
        this.memoryCache.delete(key);
      }
    }

    // Clean up localStorage
    if (typeof window !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('cache_')) {
          try {
            const entry = JSON.parse(localStorage.getItem(key) || '');
            if (this.isExpired(entry, now)) {
              localStorage.removeItem(key);
            }
          } catch (error) {
            // Invalid entry, remove it
            localStorage.removeItem(key);
          }
        }
      }
    }
  }

  private isExpired(entry: CacheEntry<any>, now: number): boolean {
    if (!entry.ttl) return false;
    return now - entry.timestamp > entry.ttl;
  }

  private getStorageKey(key: string): string {
    return `cache_${key}`;
  }

  public async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    const { useLocalStorage = false } = options;
    const now = Date.now();

    // Try memory cache first
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && !this.isExpired(memoryEntry, now)) {
      return memoryEntry.value as T;
    }

    // Try localStorage if enabled
    if (useLocalStorage && typeof window !== 'undefined') {
      try {
        const storageKey = this.getStorageKey(key);
        const storedEntry = localStorage.getItem(storageKey);
        if (storedEntry) {
          const entry: CacheEntry<T> = JSON.parse(storedEntry);
          if (!this.isExpired(entry, now)) {
            // Also update memory cache
            this.memoryCache.set(key, entry);
            return entry.value;
          }
        }
      } catch (error) {
        console.error('Error reading from localStorage:', error);
      }
    }

    return null;
  }

  public async set<T>(
    key: string,
    value: T,
    options: CacheOptions = {}
  ): Promise<void> {
    const { ttl = this.defaultTTL, useLocalStorage = false } = options;
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl,
    };

    // Update memory cache
    this.memoryCache.set(key, entry);

    // Update localStorage if enabled
    if (useLocalStorage && typeof window !== 'undefined') {
      try {
        const storageKey = this.getStorageKey(key);
        localStorage.setItem(storageKey, JSON.stringify(entry));
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    }
  }

  public async delete(key: string, options: CacheOptions = {}): Promise<void> {
    const { useLocalStorage = false } = options;

    // Remove from memory cache
    this.memoryCache.delete(key);

    // Remove from localStorage if enabled
    if (useLocalStorage && typeof window !== 'undefined') {
      try {
        const storageKey = this.getStorageKey(key);
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.error('Error removing from localStorage:', error);
      }
    }
  }

  public async clear(options: CacheOptions = {}): Promise<void> {
    const { useLocalStorage = false } = options;

    // Clear memory cache
    this.memoryCache.clear();

    // Clear localStorage if enabled
    if (useLocalStorage && typeof window !== 'undefined') {
      try {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key?.startsWith('cache_')) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    }
  }
}

export const cache = Cache.getInstance(); 