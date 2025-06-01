import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { Suspense, lazy, useEffect, useCallback } from "react";
import CookieConsent from "./components/CookieConsent";
import { clearNonEssentialCookies } from "./utils/cookieManager";
import LoadingSpinner from "./components/LoadingSpinner";
import ServiceWorkerErrorNotifier from "./components/ServiceWorkerErrorNotifier";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import { CookieSettings } from "./types/global";
import ErrorBoundary from "./components/ErrorBoundary";

// Configure lazy loading with preload capability for better performance
const createLazyComponent = (
  factory: () => Promise<{
    default: React.ComponentType<Record<string, unknown>>;
  }>,
  preload = false,
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
const Blog = createLazyComponent(() => import("./pages/Blog"));
const BlogPost = createLazyComponent(() => import("./pages/BlogPost"));
const ProjectDetail = createLazyComponent(
  () => import("./pages/ProjectDetail"),
);

// Lazy load ServiceWorkerUpdater to improve initial load performance
const LazyServiceWorkerUpdater = lazy(
  () => import("./components/ServiceWorkerUpdater"),
);

// Intelligent preloading based on user navigation
const PreloadManager = () => {
  const location = useLocation();

  // Memoize preload functions to prevent recreation on every render
  const preloadHome = useCallback(() => {
    import("./pages/Work");
    import("./pages/Services");
  }, []);

  const preloadWork = useCallback(() => {
    import("./pages/Contact");
    import("./pages/ProjectDetail");
  }, []);

  const preloadServices = useCallback(() => {
    import("./pages/About");
  }, []);

  const preloadBlog = useCallback(() => {
    import("./pages/BlogPost");
  }, []);

  useEffect(() => {
    // Preload related pages based on current route
    if (location.pathname === "/") {
      preloadHome();
    } else if (location.pathname === "/work") {
      preloadWork();
    } else if (location.pathname === "/services") {
      preloadServices();
    } else if (location.pathname === "/blog") {
      preloadBlog();
    }
  }, [
    location.pathname,
    preloadHome,
    preloadWork,
    preloadServices,
    preloadBlog,
  ]);

  return null;
};

// Component to wrap routes with error boundary
const RouteErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const handleNavigateHome = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <ErrorBoundary componentName="Route" onNavigateHome={handleNavigateHome}>
      {children}
    </ErrorBoundary>
  );
};

// Optimized query client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute stale time for better caching
      gcTime: 5 * 60 * 1000, // 5 minutes garbage collection time
      refetchOnWindowFocus: false, // Disable refetching on window focus for better performance
      retry: (failureCount, error) => {
        // Don't retry on 404s or network errors (offline)
        if (
          error instanceof Error &&
          (error.message.includes("404") || error.message.includes("network"))
        ) {
          return false;
        }
        return failureCount < 2; // Retry twice at most
      },
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
    <ErrorBoundary componentName="App">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ServiceWorkerErrorNotifier />
            <BrowserRouter>
              <ErrorBoundary componentName="Router">
                <PreloadManager />
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <RouteErrorBoundary>
                          <Index />
                        </RouteErrorBoundary>
                      }
                    />
                    <Route
                      path="/work"
                      element={
                        <RouteErrorBoundary>
                          <Work />
                        </RouteErrorBoundary>
                      }
                    />
                    <Route
                      path="/work/:slug"
                      element={
                        <RouteErrorBoundary>
                          <ProjectDetail />
                        </RouteErrorBoundary>
                      }
                    />
                    <Route
                      path="/services"
                      element={
                        <RouteErrorBoundary>
                          <Services />
                        </RouteErrorBoundary>
                      }
                    />
                    <Route
                      path="/about"
                      element={
                        <RouteErrorBoundary>
                          <About />
                        </RouteErrorBoundary>
                      }
                    />
                    <Route
                      path="/contact"
                      element={
                        <RouteErrorBoundary>
                          <Contact />
                        </RouteErrorBoundary>
                      }
                    />
                    <Route
                      path="/blog"
                      element={
                        <RouteErrorBoundary>
                          <Blog />
                        </RouteErrorBoundary>
                      }
                    />
                    <Route
                      path="/blog/:slug"
                      element={
                        <RouteErrorBoundary>
                          <BlogPost />
                        </RouteErrorBoundary>
                      }
                    />
                    <Route
                      path="/legal"
                      element={
                        <RouteErrorBoundary>
                          <Legal />
                        </RouteErrorBoundary>
                      }
                    />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route
                      path="*"
                      element={
                        <RouteErrorBoundary>
                          <NotFound />
                        </RouteErrorBoundary>
                      }
                    />
                  </Routes>
                </Suspense>
                {/* ServiceWorkerUpdater is now inside BrowserRouter to benefit from code-splitting */}
                <Suspense fallback={null}>
                  <LazyServiceWorkerUpdater />
                </Suspense>
              </ErrorBoundary>
            </BrowserRouter>
            <CookieConsent
              onAccept={handleCookieAccept}
              onDecline={handleCookieDecline}
            />
            {/* Analytics Dashboard - only shows in development or when toggled */}
            {process.env.NODE_ENV === "development" && <AnalyticsDashboard />}
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
