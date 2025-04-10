/**
 * Performance monitoring and optimization utilities
 * Provides tools for measuring and improving application performance
 */

// Performance measurement
export const measurePerformance = (label: string, callback: () => void): number => {
  if (process.env.NODE_ENV === 'development') {
    console.time(label);
    callback();
    console.timeEnd(label);
    return performance.now();
  } else {
    callback();
    return 0;
  }
};

// Debounce function with TypeScript support
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>): void {
    const context = this;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
    
    if (callNow) {
      func.apply(context, args);
    }
  };
}

// Throttle function with TypeScript support
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastResult: ReturnType<T>;
  
  return function(this: any, ...args: Parameters<T>): void {
    const context = this;
    
    if (!inThrottle) {
      lastResult = func.apply(context, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Measure component render time
export const measureRenderTime = (componentName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
    }
    
    // Report to monitoring service if render time is too high
    if (renderTime > 100) {
      // Could send to monitoring service
      // if (window.Sentry) {
      //   window.Sentry.captureMessage(`Slow render: ${componentName} (${renderTime.toFixed(2)}ms)`);
      // }
    }
    
    return renderTime;
  };
};

// Lazy load an image
export const lazyLoadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

// Check if the browser supports certain features
export const browserSupports = {
  intersectionObserver: 'IntersectionObserver' in window,
  webp: () => {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  },
  webpLossless: () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    if (canvas.getContext && canvas.getContext('2d')) {
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, 1, 1);
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  },
  serviceWorker: 'serviceWorker' in navigator,
  webAnimations: 'animate' in document.createElement('div'),
  touchEvents: 'ontouchstart' in window,
};

export default {
  measurePerformance,
  debounce,
  throttle,
  measureRenderTime,
  lazyLoadImage,
  browserSupports,
};
