import { logger } from './logger';

interface PerformanceMetric {
  name: string;
  value: number;
  tags?: Record<string, string>;
}

interface ErrorReport {
  error: Error;
  context?: Record<string, any>;
  user?: {
    id?: string;
    email?: string;
  };
}

interface UserInteraction {
  type: string;
  target: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

class Monitoring {
  private static instance: Monitoring;
  private metrics: PerformanceMetric[] = [];
  private interactions: UserInteraction[] = [];
  private readonly maxInteractions = 100;
  private readonly flushInterval = 60000; // 1 minute

  private constructor() {
    this.startFlushInterval();
    this.setupErrorHandling();
    this.setupPerformanceObserver();
  }

  public static getInstance(): Monitoring {
    if (!Monitoring.instance) {
      Monitoring.instance = new Monitoring();
    }
    return Monitoring.instance;
  }

  private startFlushInterval(): void {
    setInterval(() => this.flush(), this.flushInterval);
  }

  private setupErrorHandling(): void {
    window.addEventListener('error', (event) => {
      this.reportError({
        error: event.error || new Error(event.message),
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        error: event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        context: {
          type: 'unhandledrejection',
        },
      });
    });
  }

  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      // Observe long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric({
            name: 'long_task',
            value: entry.duration,
            tags: {
              name: entry.name,
            },
          });
        });
      });

      longTaskObserver.observe({ entryTypes: ['longtask'] });

      // Observe layout shifts
      const layoutShiftObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            this.recordMetric({
              name: 'layout_shift',
              value: entry.value,
              tags: {
                name: entry.name,
              },
            });
          }
        });
      });

      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });

      // Observe first input delay
      const firstInputObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric({
            name: 'first_input_delay',
            value: entry.duration,
            tags: {
              name: entry.name,
            },
          });
        });
      });

      firstInputObserver.observe({ entryTypes: ['first-input'] });
    }
  }

  public recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    logger.info('Performance metric recorded', { metric });
  }

  public recordInteraction(interaction: UserInteraction): void {
    this.interactions.push(interaction);
    if (this.interactions.length > this.maxInteractions) {
      this.interactions.shift();
    }
    logger.info('User interaction recorded', { interaction });
  }

  public reportError(report: ErrorReport): void {
    logger.error('Error reported', new Error(JSON.stringify({
      message: report.error.message,
      stack: report.error.stack,
      context: report.context,
      user: report.user,
    })));
  }

  private async flush(): Promise<void> {
    if (this.metrics.length === 0 && this.interactions.length === 0) {
      return;
    }

    try {
      // In a real application, you would send this data to your monitoring service
      // For example: await monitoringService.sendMetrics(this.metrics);
      // await monitoringService.sendInteractions(this.interactions);

      logger.info('Monitoring data flushed', {
        metricsCount: this.metrics.length,
        interactionsCount: this.interactions.length,
      });

      this.metrics = [];
      this.interactions = [];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Failed to flush monitoring data', new Error(errorMessage));
    }
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public getInteractions(): UserInteraction[] {
    return [...this.interactions];
  }
}

export const monitoring = Monitoring.getInstance(); 