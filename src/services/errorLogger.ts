// src/services/errorLogger.ts

import { AppError, ErrorHandler } from '@/lib/errorHandling';

interface ErrorLogEntry extends AppError {
  userAgent: string;
  url: string;
  timestamp: Date;
  sessionId: string;
}

export class ErrorLoggerService {
  private static instance: ErrorLoggerService;
  private sessionId: string;
  private errorQueue: ErrorLogEntry[] = [];
  private maxQueueSize = 50;
  private flushInterval = 30000; // 30 seconds
  private flushTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.setupErrorListener();
    this.startFlushTimer();
  }

  static getInstance(): ErrorLoggerService {
    if (!ErrorLoggerService.instance) {
      ErrorLoggerService.instance = new ErrorLoggerService();
    }
    return ErrorLoggerService.instance;
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupErrorListener(): void {
    const errorHandler = ErrorHandler.getInstance();
    errorHandler.addErrorListener((error) => {
      this.logError(error);
    });
  }

  private logError(error: AppError): void {
    const logEntry: ErrorLogEntry = {
      ...error,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date(),
      sessionId: this.sessionId
    };

    this.errorQueue.push(logEntry);

    // Store in localStorage for persistence
    this.saveToLocalStorage();

    // Flush if queue is full
    if (this.errorQueue.length >= this.maxQueueSize) {
      this.flush();
    }
  }

  private saveToLocalStorage(): void {
    try {
      const errors = localStorage.getItem('error_logs');
      const existingErrors = errors ? JSON.parse(errors) : [];
      
      // Keep only last 100 errors in localStorage
      const allErrors = [...existingErrors, ...this.errorQueue].slice(-100);
      
      localStorage.setItem('error_logs', JSON.stringify(allErrors));
    } catch (error) {
      console.error('Failed to save errors to localStorage:', error);
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      if (this.errorQueue.length > 0) {
        this.flush();
      }
    }, this.flushInterval);
  }

  private async flush(): Promise<void> {
    if (this.errorQueue.length === 0) return;

    const errorsToSend = [...this.errorQueue];
    this.errorQueue = [];

    try {
      // In production, send to error logging service
      if (process.env.NODE_ENV === 'production' && process.env.VITE_ERROR_LOGGING_ENDPOINT) {
        await this.sendToServer(errorsToSend);
      } else {
        // In development, just log to console
        console.group('Error Batch Log');
        errorsToSend.forEach(error => {
          console.error(error);
        });
        console.groupEnd();
      }
    } catch (error) {
      console.error('Failed to flush errors:', error);
      // Re-add errors to queue if sending failed
      this.errorQueue.unshift(...errorsToSend);
    }
  }

  private async sendToServer(errors: ErrorLogEntry[]): Promise<void> {
    const endpoint = process.env.VITE_ERROR_LOGGING_ENDPOINT;
    if (!endpoint) return;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        errors,
        sessionId: this.sessionId,
        appVersion: process.env.VITE_APP_VERSION || 'unknown'
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to send errors: ${response.statusText}`);
    }
  }

  getStoredErrors(): ErrorLogEntry[] {
    try {
      const errors = localStorage.getItem('error_logs');
      return errors ? JSON.parse(errors) : [];
    } catch {
      return [];
    }
  }

  clearStoredErrors(): void {
    localStorage.removeItem('error_logs');
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

// Initialize error logger when the module loads
if (typeof window !== 'undefined') {
  ErrorLoggerService.getInstance();
}