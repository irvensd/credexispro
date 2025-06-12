// Cross-platform performance API
const getPerformance = () => {
  if (typeof window !== 'undefined' && window.performance) {
    return window.performance;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('perf_hooks').performance;
  } catch {
    return { now: () => Date.now() };
  }
};

const performance = getPerformance();

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  duration?: number;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private logBuffer: LogEntry[] = [];
  private readonly maxBufferSize = 100;
  private readonly flushInterval = 60000; // 1 minute
  private isDevelopment = process.env.NODE_ENV === 'development';

  private constructor() {
    // Start periodic flush
    setInterval(() => this.flush(), this.flushInterval);
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatLogEntry(entry: LogEntry): string {
    const { timestamp, level, message, context, duration, error } = entry;
    let logString = `[${timestamp}] ${level}: ${message}`;

    if (duration) {
      logString += ` (${duration.toFixed(2)}ms)`;
    }

    if (context) {
      logString += `\nContext: ${JSON.stringify(context, null, 2)}`;
    }

    if (error) {
      logString += `\nError: ${error.message}\nStack: ${error.stack}`;
    }

    return logString;
  }

  private async flush(): Promise<void> {
    if (this.logBuffer.length === 0) return;

    try {
      // In production, send logs to your logging service
      if (!this.isDevelopment) {
        await fetch('/api/logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.logBuffer),
        });
      }

      // Clear the buffer
      this.logBuffer = [];
    } catch (error) {
      console.error('Failed to flush logs:', error);
    }
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
    };

    // Add to buffer
    this.logBuffer.push(entry);

    // Log to console in development
    if (this.isDevelopment) {
      const logString = this.formatLogEntry(entry);
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(logString);
          break;
        case LogLevel.INFO:
          console.info(logString);
          break;
        case LogLevel.WARN:
          console.warn(logString);
          break;
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(logString);
          break;
      }
    }

    // Flush if buffer is full
    if (this.logBuffer.length >= this.maxBufferSize) {
      this.flush();
    }
  }

  public debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  public info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  public warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  public error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  public fatal(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.FATAL, message, context, error);
  }

  public async measure<T>(
    name: string,
    fn: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.info(`${name} completed`, { ...context, duration });
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.error(`${name} failed`, error as Error, { ...context, duration });
      throw error;
    }
  }
}

export const logger = Logger.getInstance(); 