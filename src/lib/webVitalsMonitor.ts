// Web Vitals Monitoring System
// Compliant with Google Core Web Vitals requirements

import { getCLS, getFCP, getFID, getLCP, getTTFB, getINP } from 'web-vitals';

interface VitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  entries: PerformanceEntry[];
}

interface WebVitalsThresholds {
  LCP: { good: number; poor: number };
  FID: { good: number; poor: number };
  CLS: { good: number; poor: number };
  INP: { good: number; poor: number };
  FCP: { good: number; poor: number };
  TTFB: { good: number; poor: number };
}

// Core Web Vitals thresholds (Google standards)
const THRESHOLDS: WebVitalsThresholds = {
  LCP: { good: 2500, poor: 4000 },      // Largest Contentful Paint
  FID: { good: 100, poor: 300 },        // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },       // Cumulative Layout Shift
  INP: { good: 200, poor: 500 },        // Interaction to Next Paint
  FCP: { good: 1800, poor: 3000 },      // First Contentful Paint
  TTFB: { good: 800, poor: 1800 }       // Time to First Byte
};

class WebVitalsMonitor {
  private metrics: Map<string, VitalMetric> = new Map();
  private reportQueue: VitalMetric[] = [];
  private reportInterval: number = 5000; // 5 seconds
  private reportTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeMonitoring();
    this.setupPerformanceObserver();
    this.startReportingCycle();
  }

  private initializeMonitoring(): void {
    // Monitor Core Web Vitals
    getCLS(this.handleMetric.bind(this));
    getFCP(this.handleMetric.bind(this));
    getFID(this.handleMetric.bind(this));
    getLCP(this.handleMetric.bind(this));
    getTTFB(this.handleMetric.bind(this));
    getINP(this.handleMetric.bind(this));

    // Monitor resource loading
    this.monitorResourceTiming();
    
    // Monitor JavaScript errors
    this.monitorErrors();
  }

  private handleMetric(metric: any): void {
    const rating = this.getRating(metric.name, metric.value);
    
    const vitalMetric: VitalMetric = {
      name: metric.name,
      value: Math.round(metric.value),
      rating,
      entries: metric.entries || []
    };

    this.metrics.set(metric.name, vitalMetric);
    this.reportQueue.push(vitalMetric);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${metric.name}: ${Math.round(metric.value)}ms (${rating})`);
    }

    // Send to analytics if critical metric
    if (rating === 'poor') {
      this.sendToAnalytics(vitalMetric);
    }
  }

  private getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = THRESHOLDS[metricName as keyof WebVitalsThresholds];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  private setupPerformanceObserver(): void {
    if (!('PerformanceObserver' in window)) return;

    // Monitor long tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Tasks longer than 50ms
            this.reportLongTask(entry);
          }
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.warn('Long task monitoring not supported');
    }

    // Monitor layout shifts
    try {
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ((entry as any).hadRecentInput) continue;
          this.reportLayoutShift(entry as any);
        }
      });
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('Layout shift monitoring not supported');
    }
  }

  private monitorResourceTiming(): void {
    if (!('PerformanceObserver' in window)) return;

    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resourceEntry = entry as PerformanceResourceTiming;
        
        // Flag slow resources
        if (resourceEntry.duration > 1000) {
          this.reportSlowResource(resourceEntry);
        }
      }
    });

    try {
      resourceObserver.observe({ entryTypes: ['resource'] });
    } catch (e) {
      console.warn('Resource timing not supported');
    }
  }

  private monitorErrors(): void {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.reportError({
        type: 'javascript',
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        type: 'unhandled_promise',
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack
      });
    });
  }

  private reportLongTask(entry: PerformanceEntry): void {
    this.sendToAnalytics({
      name: 'long_task',
      value: entry.duration,
      rating: entry.duration > 100 ? 'poor' : 'needs-improvement',
      entries: [entry]
    });
  }

  private reportLayoutShift(entry: any): void {
    if (entry.value > 0.05) { // Report significant shifts
      this.sendToAnalytics({
        name: 'layout_shift',
        value: entry.value,
        rating: entry.value > 0.1 ? 'poor' : 'needs-improvement',
        entries: [entry]
      });
    }
  }

  private reportSlowResource(entry: PerformanceResourceTiming): void {
    this.sendToAnalytics({
      name: 'slow_resource',
      value: entry.duration,
      rating: 'poor',
      entries: [entry]
    });
  }

  private reportError(error: any): void {
    // Send to error tracking service
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: error.type === 'javascript',
        error_type: error.type,
        source: error.source,
        line: error.line
      });
    }

    // Also log to monitoring service
    this.sendErrorToMonitoring(error);
  }

  private startReportingCycle(): void {
    this.reportTimer = setInterval(() => {
      if (this.reportQueue.length > 0) {
        this.batchReport();
      }
    }, this.reportInterval);
  }

  private batchReport(): void {
    const batch = [...this.reportQueue];
    this.reportQueue = [];

    // Send to analytics
    if (window.gtag) {
      batch.forEach(metric => {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: metric.name,
          value: metric.value,
          metric_rating: metric.rating,
          non_interaction: true
        });
      });
    }

    // Send to monitoring endpoint
    this.sendBatchToMonitoring(batch);
  }

  private sendToAnalytics(metric: VitalMetric): void {
    if (window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Performance',
        value: metric.value,
        event_label: metric.rating,
        non_interaction: true
      });
    }
  }

  private sendBatchToMonitoring(metrics: VitalMetric[]): void {
    // Send to your monitoring endpoint
    const payload = {
      metrics,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: (navigator as any).connection?.effectiveType
    };

    // Using sendBeacon for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/monitoring/vitals', JSON.stringify(payload));
    }
  }

  private sendErrorToMonitoring(error: any): void {
    const payload = {
      error,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/monitoring/errors', JSON.stringify(payload));
    }
  }

  public getMetrics(): Map<string, VitalMetric> {
    return new Map(this.metrics);
  }

  public isPassingCoreWebVitals(): boolean {
    const lcp = this.metrics.get('LCP');
    const cls = this.metrics.get('CLS');
    const inp = this.metrics.get('INP');

    return (
      (!lcp || lcp.rating !== 'poor') &&
      (!cls || cls.rating !== 'poor') &&
      (!inp || inp.rating !== 'poor')
    );
  }

  public destroy(): void {
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
    }
    this.batchReport(); // Final report
  }
}

// Auto-initialize
const webVitalsMonitor = new WebVitalsMonitor();

// Export for use in other components
export default webVitalsMonitor;
export { VitalMetric, WebVitalsThresholds };

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}