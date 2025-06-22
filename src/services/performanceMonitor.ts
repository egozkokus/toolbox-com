// src/services/performanceMonitor.ts

interface PerformanceMetric {
    name: string;
    value: number;
    timestamp: number;
    metadata?: Record<string, any>;
  }
  
  interface PerformanceReport {
    metrics: PerformanceMetric[];
    timestamp: number;
    userAgent: string;
    url: string;
    connectionType?: string;
  }
  
  class PerformanceMonitor {
    private static instance: PerformanceMonitor;
    private metrics: PerformanceMetric[] = [];
    private observers: PerformanceObserver[] = [];
  
    private constructor() {
      if (typeof window !== 'undefined') {
        this.initializeObservers();
        this.measureInitialMetrics();
      }
    }
  
    static getInstance(): PerformanceMonitor {
      if (!PerformanceMonitor.instance) {
        PerformanceMonitor.instance = new PerformanceMonitor();
      }
      return PerformanceMonitor.instance;
    }
  
    private initializeObservers() {
      // Observe Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.recordMetric('LCP', lastEntry.startTime, {
              element: (lastEntry as any).element?.tagName,
              size: (lastEntry as any).size,
            });
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
          this.observers.push(lcpObserver);
        } catch (e) {
          console.error('Failed to observe LCP:', e);
        }
  
        // Observe First Input Delay
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.entryType === 'first-input') {
                this.recordMetric('FID', entry.processingStart - entry.startTime, {
                  eventType: (entry as any).name,
                });
              }
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
          this.observers.push(fidObserver);
        } catch (e) {
          console.error('Failed to observe FID:', e);
        }
  
        // Observe Cumulative Layout Shift
        try {
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
                this.recordMetric('CLS', clsValue);
              }
            });
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
          this.observers.push(clsObserver);
        } catch (e) {
          console.error('Failed to observe CLS:', e);
        }
  
        // Observe long tasks
        try {
          const longTaskObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              this.recordMetric('Long Task', entry.duration, {
                startTime: entry.startTime,
              });
            });
          });
          longTaskObserver.observe({ entryTypes: ['longtask'] });
          this.observers.push(longTaskObserver);
        } catch (e) {
          console.error('Failed to observe long tasks:', e);
        }
      }
    }
  
    private measureInitialMetrics() {
      if ('performance' in window) {
        // Navigation timing
        window.addEventListener('load', () => {
          setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            
            if (navigation) {
              this.recordMetric('Page Load Time', navigation.loadEventEnd - navigation.fetchStart);
              this.recordMetric('DOM Content Loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart);
              this.recordMetric('Time to First Byte', navigation.responseStart - navigation.fetchStart);
              this.recordMetric('DNS Lookup', navigation.domainLookupEnd - navigation.domainLookupStart);
              this.recordMetric('TCP Connection', navigation.connectEnd - navigation.connectStart);
              this.recordMetric('Response Time', navigation.responseEnd - navigation.responseStart);
              this.recordMetric('DOM Processing', navigation.domComplete - navigation.domInteractive);
            }
  
            // Paint timing
            const paintEntries = performance.getEntriesByType('paint');
            paintEntries.forEach((entry) => {
              this.recordMetric(entry.name === 'first-paint' ? 'FP' : 'FCP', entry.startTime);
            });
  
            // Memory usage (if available)
            if ((performance as any).memory) {
              const memory = (performance as any).memory;
              this.recordMetric('JS Heap Size', memory.usedJSHeapSize, {
                total: memory.totalJSHeapSize,
                limit: memory.jsHeapSizeLimit,
              });
            }
          }, 0);
        });
      }
    }
  
    recordMetric(name: string, value: number, metadata?: Record<string, any>) {
      const metric: PerformanceMetric = {
        name,
        value,
        timestamp: Date.now(),
        metadata,
      };
  
      this.metrics.push(metric);
  
      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${name}: ${value.toFixed(2)}ms`, metadata);
      }
  
      // Send to analytics if configured
      this.sendToAnalytics(metric);
    }
  
    measureOperation<T>(name: string, operation: () => T): T {
      const startTime = performance.now();
      
      try {
        const result = operation();
        
        if (result instanceof Promise) {
          return result.then((value) => {
            const duration = performance.now() - startTime;
            this.recordMetric(`Operation: ${name}`, duration);
            return value;
          }) as any;
        }
        
        const duration = performance.now() - startTime;
        this.recordMetric(`Operation: ${name}`, duration);
        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        this.recordMetric(`Operation: ${name} (failed)`, duration);
        throw error;
      }
    }
  
    getMetrics(): PerformanceMetric[] {
      return [...this.metrics];
    }
  
    getReport(): PerformanceReport {
      return {
        metrics: this.getMetrics(),
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        connectionType: (navigator as any).connection?.effectiveType,
      };
    }
  
    clearMetrics() {
      this.metrics = [];
    }
  
    private sendToAnalytics(metric: PerformanceMetric) {
      // Send to Google Analytics, Sentry, or custom analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'performance', {
          event_category: 'Performance',
          event_label: metric.name,
          value: Math.round(metric.value),
          ...metric.metadata,
        });
      }
    }
  
    destroy() {
      this.observers.forEach(observer => observer.disconnect());
      this.observers = [];
      this.metrics = [];
    }
  }
  
  // Export singleton instance
  export const performanceMonitor = PerformanceMonitor.getInstance();
  
  // React hook for performance monitoring
  export const usePerformanceMonitor = () => {
    return {
      measureOperation: <T,>(name: string, operation: () => T) => 
        performanceMonitor.measureOperation(name, operation),
      recordMetric: (name: string, value: number, metadata?: Record<string, any>) =>
        performanceMonitor.recordMetric(name, value, metadata),
      getMetrics: () => performanceMonitor.getMetrics(),
      getReport: () => performanceMonitor.getReport(),
    };
  };