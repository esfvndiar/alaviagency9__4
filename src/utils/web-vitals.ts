import { Metric, onCLS, onFCP, onFID, onINP, onLCP, onTTFB } from 'web-vitals';

// Define types for metric reporting
type MetricName = 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';

interface MetricReport {
  name: string;
  value: number;
  id: string;
  navigationType: string | null;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  entries?: PerformanceEntry[];
}

type ReportHandler = (metrics: MetricReport) => void;

// Convert web-vitals metric to our standardized format
const createMetricReport = (metric: Metric): MetricReport => {
  return {
    name: metric.name,
    value: metric.value,
    id: metric.id,
    navigationType: metric.navigationType,
    rating: metric.rating,
    delta: metric.delta,
    entries: metric.entries
  };
};

// Send metrics to an analytics endpoint
const sendToAnalytics = async (metric: MetricReport) => {
  // Don't send metrics in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vitals:', metric);
    return;
  }

  try {
    const body = JSON.stringify({
      ...metric,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // Use sendBeacon if available for better reliability during page unload
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/metrics', body);
    } else {
      await fetch('/api/metrics', {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json'
        },
        // Keep the request from blocking the page unload
        keepalive: true
      });
    }
  } catch (error) {
    console.error('Failed to send metrics:', error);
  }
};

// Function to report all web vitals
export const reportWebVitals = (onReport?: ReportHandler): void => {
  const reportMetric = (metric: Metric) => {
    const report = createMetricReport(metric);
    
    // Call custom handler if provided
    if (onReport) {
      onReport(report);
    }
    
    // Send to analytics endpoint
    sendToAnalytics(report);
  };

  // Register all metrics
  onCLS(reportMetric);
  onFCP(reportMetric);
  onFID(reportMetric);
  onLCP(reportMetric);
  onTTFB(reportMetric);
  onINP(reportMetric);
};

// Function to get threshold values for each metric
export const getMetricThresholds = (metricName: MetricName): { good: number; poor: number } => {
  // Thresholds based on Google's Core Web Vitals
  switch (metricName) {
    case 'CLS':
      return { good: 0.1, poor: 0.25 };
    case 'FCP':
      return { good: 1800, poor: 3000 };
    case 'FID':
      return { good: 100, poor: 300 };
    case 'INP':
      return { good: 200, poor: 500 };
    case 'LCP':
      return { good: 2500, poor: 4000 };
    case 'TTFB':
      return { good: 800, poor: 1800 };
    default:
      return { good: 0, poor: 0 };
  }
};

// Calculate metric rating based on thresholds
export const getMetricRating = (metricName: MetricName, value: number): 'good' | 'needs-improvement' | 'poor' => {
  const thresholds = getMetricThresholds(metricName);
  
  if (value <= thresholds.good) {
    return 'good';
  } else if (value <= thresholds.poor) {
    return 'needs-improvement';
  } else {
    return 'poor';
  }
};

// Custom hook to display web vitals in dev mode (for debugging)
export const enableWebVitalsDebug = (): void => {
  if (process.env.NODE_ENV === 'development') {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeDebugOverlay);
    } else {
      initializeDebugOverlay();
    }
  }
};

// Initialize the debug overlay with proper CSS classes
function initializeDebugOverlay(): void {
  // Create container using CSS classes
  const container = document.createElement('div');
  container.className = 'web-vitals-debug';
  document.body.appendChild(container);
  
  // Add title
  const title = document.createElement('div');
  title.textContent = 'Core Web Vitals:';
  title.style.marginRight = '10px';
  title.style.fontWeight = 'bold';
  container.appendChild(title);

  // Display metrics with proper styling
  reportWebVitals((metric) => {
    // Create or update metric element
    let metricElement = document.querySelector(`.web-vitals-metric[data-metric="${metric.name}"]`) as HTMLElement;
    
    if (!metricElement) {
      metricElement = document.createElement('div');
      metricElement.className = `web-vitals-metric ${metric.rating}`;
      metricElement.setAttribute('data-metric', metric.name);
      container.appendChild(metricElement);
      
      // Add metric name
      const nameElement = document.createElement('div');
      nameElement.textContent = metric.name;
      nameElement.style.fontWeight = 'bold';
      metricElement.appendChild(nameElement);
      
      // Add value container
      const valueElement = document.createElement('div');
      valueElement.className = 'web-vitals-value';
      valueElement.setAttribute('data-value', 'true');
      valueElement.textContent = formatMetricValue(metric.name, metric.value);
      metricElement.appendChild(valueElement);
    } else {
      // Update rating class
      metricElement.className = `web-vitals-metric ${metric.rating}`;
      
      // Get value element
      const valueElement = metricElement.querySelector('[data-value="true"]') as HTMLElement;
      if (valueElement) {
        valueElement.textContent = formatMetricValue(metric.name, metric.value);
      }
    }
  });
  
  // Add close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'x';
  closeButton.style.position = 'absolute';
  closeButton.style.right = '5px';
  closeButton.style.top = '5px';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.color = 'white';
  closeButton.style.fontSize = '16px';
  closeButton.style.cursor = 'pointer';
  closeButton.addEventListener('click', () => {
    document.body.removeChild(container);
  });
  container.appendChild(closeButton);
}

// Format the metric value based on its type
function formatMetricValue(name: string, value: number): string {
  switch (name) {
    case 'CLS':
      return value.toFixed(3);
    case 'FID':
    case 'INP':
    case 'TTFB':
    case 'FCP':
    case 'LCP':
      return `${Math.round(value)}ms`;
    default:
      return value.toFixed(2);
  }
} 