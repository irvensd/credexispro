import { environment } from '../config/environment';
import { cache } from '../utils/cache';
import { monitoring } from '../utils/monitoring';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  useCache?: boolean;
  cacheTTL?: number;
  retryOnError?: boolean;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

class ApiService {
  private static instance: ApiService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = environment.apiUrl;
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private async fetchWithRetry(
    url: string,
    options: RequestOptions,
    retryCount = 0
  ): Promise<Response> {
    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      if (
        options.retryOnError !== false &&
        retryCount < environment.maxRetries
      ) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.fetchWithRetry(url, options, retryCount + 1);
      }
      throw error;
    }
  }

  private getCacheKey(url: string, options: RequestOptions): string {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  public async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const startTime = performance.now();

    try {
      // Check cache for GET requests
      if (options.method === 'GET' && options.useCache !== false) {
        const cacheKey = this.getCacheKey(url, options);
        const cachedData = await cache.get<T>(cacheKey, {
          ttl: options.cacheTTL || environment.cacheTTL,
        });

        if (cachedData) {
          monitoring.recordMetric({
            name: 'cache_hit',
            value: 1,
            tags: { endpoint },
          });
          return {
            data: cachedData,
            status: 200,
            headers: new Headers(),
          };
        }
      }

      // Make the request
      const response = await this.fetchWithRetry(url, options);
      const data = await response.json();

      // Cache GET responses
      if (options.method === 'GET' && options.useCache !== false) {
        const cacheKey = this.getCacheKey(url, options);
        await cache.set(cacheKey, data, {
          ttl: options.cacheTTL || environment.cacheTTL,
        });
      }

      // Record metrics
      const duration = performance.now() - startTime;
      monitoring.recordMetric({
        name: 'api_request_duration',
        value: duration,
        tags: { endpoint, method: options.method || 'GET' },
      });

      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      // Record error
      monitoring.reportError({
        error: error instanceof Error ? error : new Error(String(error)),
        context: {
          url,
          method: options.method || 'GET',
          retryCount: options.retryOnError !== false ? environment.maxRetries : 0,
        },
      });

      throw error;
    }
  }

  public async get<T>(
    endpoint: string,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public async post<T>(
    endpoint: string,
    data: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data,
    });
  }

  public async put<T>(
    endpoint: string,
    data: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data,
    });
  }

  public async patch<T>(
    endpoint: string,
    data: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data,
    });
  }

  public async delete<T>(
    endpoint: string,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = ApiService.getInstance(); 