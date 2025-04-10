import React, { Suspense, lazy } from 'react';
import ErrorBoundary from './ErrorBoundary';

// Skeleton loader component for lazy-loaded components
export const ComponentLoader: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4 mb-4"></div>
    <div className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded mb-4"></div>
    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3 mb-2"></div>
    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3"></div>
  </div>
);

// Lazy loaded components with proper typing
export const LazyHeroSection = lazy(() => import('./HeroSection'));
export const LazyAboutSection = lazy(() => import('./AboutSection'));
export const LazyFAQSection = lazy(() => import('./FAQSection'));
export const LazyServicesSection = lazy(() => import('../pages/Services'));
export const LazyCTASection = lazy(() => import('./CTASection'));
export const LazyContactSection = lazy(() => import('./ContactSection'));

// Generic wrapper for lazy-loaded components
export const LazyComponent: React.FC<{
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  props?: any;
  componentName?: string;
  fallback?: React.ReactNode;
  onError?: () => void;
}> = ({ component: Component, props, componentName, fallback, onError }) => {
  return (
    <ErrorBoundary 
      componentName={componentName || 'component'} 
      onReset={onError}
      fallback={fallback}
    >
      <Suspense fallback={<ComponentLoader />}>
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};
