// Advanced Analytics and Performance Monitoring
interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
  navigationType?: string;
}

interface ErrorReport {
  message: string;
  stack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  timestamp: number;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  componentStack?: string;
}

class Analytics {
  private sessionId: string;
  private userId?: string;
  private isEnabled: boolean;
  private queue: AnalyticsEvent[] = [];
  private performanceObserver?: PerformanceObserver;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isEnabled = process.env.NODE_ENV === 'production';
    this.initializePerformanceObserver();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializePerformanceObserver(): void {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return;

    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackPerformanceEntry(entry);
        }
      });

      // Observe different types of performance entries
      this.performanceObserver.observe({ 
        entryTypes: ['navigation', 'resource', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] 
      });
    } catch (error) {
      console.debug('Performance Observer not supported:', error);
    }
  }

  private trackPerformanceEntry(entry: PerformanceEntry): void {
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
      name: entry.entryType,
      value: entry.duration || (entry as PerformanceNavigationTiming | PerformancePaintTiming).value || 0,
      rating: this.getPerformanceRating(entry.entryType, entry.duration || (entry as PerformanceNavigationTiming | PerformancePaintTiming).value || 0),
    };

    this.sendMetric(metric);
  }

  private getPerformanceRating(type: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: Record<string, { good: number; poor: number }> = {
      'largest-contentful-paint': { good: 2500, poor: 4000 },
      'first-input': { good: 100, poor: 300 },
      'cumulative-layout-shift': { good: 0.1, poor: 0.25 },
      'first-contentful-paint': { good: 1800, poor: 3000 },
      'navigation': { good: 2000, poor: 4000 },
    };

    const threshold = thresholds[type];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  // Public methods
  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public track(eventName: string, properties?: Record<string, unknown>): void {
    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
    };

    if (this.isEnabled) {
      this.sendEvent(event);
    } else {
      console.debug('Analytics Event:', event);
    }
  }

  public trackPageView(path: string, title?: string): void {
    this.track('page_view', {
      path,
      title: title || document.title,
      referrer: document.referrer,
      timestamp: Date.now(),
    });
  }

  public trackError(error: Error, componentStack?: string): void {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.userId,
      sessionId: this.sessionId,
      componentStack,
    };

    if (this.isEnabled) {
      this.sendError(errorReport);
    } else {
      console.debug('Error Report:', errorReport);
    }
  }

  public trackUserInteraction(element: string, action: string, properties?: Record<string, unknown>): void {
    this.track('user_interaction', {
      element,
      action,
      ...properties,
    });
  }

  public trackFormSubmission(formName: string, success: boolean, errors?: string[]): void {
    this.track('form_submission', {
      form_name: formName,
      success,
      errors,
      timestamp: Date.now(),
    });
  }

  public trackFeatureUsage(feature: string, properties?: Record<string, unknown>): void {
    this.track('feature_usage', {
      feature,
      ...properties,
    });
  }

  private async sendEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const response = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
        keepalive: true,
      });

      if (!response.ok) {
        throw new Error(`Analytics request failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to send analytics event:', error);
      // Queue for retry
      this.queue.push(event);
    }
  }

  private async sendMetric(metric: PerformanceMetric): Promise<void> {
    try {
      const response = await fetch('/api/analytics/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...metric,
          sessionId: this.sessionId,
          userId: this.userId,
          timestamp: Date.now(),
        }),
        keepalive: true,
      });

      if (!response.ok) {
        throw new Error(`Metrics request failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to send performance metric:', error);
    }
  }

  private async sendError(errorReport: ErrorReport): Promise<void> {
    try {
      const response = await fetch('/api/analytics/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
        keepalive: true,
      });

      if (!response.ok) {
        throw new Error(`Error reporting failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to send error report:', error);
    }
  }

  public async flushQueue(): Promise<void> {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    for (const event of events) {
      await this.sendEvent(event);
    }
  }

  public destroy(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    this.flushQueue();
  }
}

// Create singleton instance
export const analytics = new Analytics();

// React hook for analytics
export const useAnalytics = () => {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackUserInteraction: analytics.trackUserInteraction.bind(analytics),
    trackFormSubmission: analytics.trackFormSubmission.bind(analytics),
    trackFeatureUsage: analytics.trackFeatureUsage.bind(analytics),
    setUserId: analytics.setUserId.bind(analytics),
  };
};

// Auto-track page views for SPA
export const setupAutoTracking = () => {
  // Track initial page view
  analytics.trackPageView(window.location.pathname);

  // Track navigation changes
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    analytics.trackPageView(window.location.pathname);
  };

  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    analytics.trackPageView(window.location.pathname);
  };

  // Track back/forward navigation
  window.addEventListener('popstate', () => {
    analytics.trackPageView(window.location.pathname);
  });

  // Track unload to flush queue
  window.addEventListener('beforeunload', () => {
    analytics.flushQueue();
  });
};

export default analytics; 