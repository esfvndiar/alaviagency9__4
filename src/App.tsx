import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { Suspense, lazy, useEffect, useState } from 'react';
import CookieConsent from "./components/CookieConsent";
import { clearNonEssentialCookies } from "./utils/cookieManager";
import LoadingSpinner from "./components/LoadingSpinner";
import ServiceWorkerUpdater from "./components/ServiceWorkerUpdater";
import ServiceWorkerErrorNotifier from "./components/ServiceWorkerErrorNotifier";
import { CookieSettings } from "./types/global";

// Configure lazy loading with preload capability for better performance
const createLazyComponent = (
  factory: () => Promise<{ default: React.ComponentType<unknown> }>, 
  preload = false
) => {
  const Component = lazy(factory);
  // Preload critical components
  if (preload) {
    // Start loading the component in the background
    factory();
  }
  return Component;
};

// Lazy load all pages with priority hints
const Index = createLazyComponent(() => import("./pages/Index"), true); // Preload home page
const Work = createLazyComponent(() => import("./pages/Work"));
const Services = createLazyComponent(() => import("./pages/Services"));
const About = createLazyComponent(() => import("./pages/About"));
const Contact = createLazyComponent(() => import("./pages/Contact"));
const NotFound = createLazyComponent(() => import("./pages/NotFound"));
const Legal = createLazyComponent(() => import("./pages/Legal"));

// Lazy load ServiceWorkerUpdater to improve initial load performance
const LazyServiceWorkerUpdater = lazy(() => import("./components/ServiceWorkerUpdater"));

// Intelligent preloading based on user navigation
const PreloadManager = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Preload related pages based on current route
    if (location.pathname === '/') {
      // Preload likely next pages when on home page
      import("./pages/Work");
      import("./pages/Services");
    } else if (location.pathname === '/work') {
      // Preload contact when on work page
      import("./pages/Contact");
    } else if (location.pathname === '/services') {
      // Preload about and contact when on services page
      import("./pages/About");
    }
  }, [location.pathname]);
  
  return null;
};

// Optimized query client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute stale time for better caching
      gcTime: 5 * 60 * 1000, // 5 minutes garbage collection time
      refetchOnWindowFocus: false, // Disable refetching on window focus for better performance
    },
  },
});

const App = () => {
  const handleCookieAccept = (_settings: CookieSettings) => {
    // Here you can initialize analytics, marketing tools, etc. based on settings
  };

  const handleCookieDecline = () => {
    clearNonEssentialCookies();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ServiceWorkerErrorNotifier />
          <BrowserRouter>
            <PreloadManager />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/work" element={<Work />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/legal" element={<Legal />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            {/* ServiceWorkerUpdater is now inside BrowserRouter to benefit from code-splitting */}
            <Suspense fallback={null}>
              <LazyServiceWorkerUpdater />
            </Suspense>
          </BrowserRouter>
          <CookieConsent 
            onAccept={handleCookieAccept}
            onDecline={handleCookieDecline}
          />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
