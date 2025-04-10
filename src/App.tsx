import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { Suspense, lazy } from 'react';
import CookieConsent from "./components/CookieConsent";
import { CookieSettings, clearNonEssentialCookies } from "./utils/cookieManager";
import LoadingSpinner from "./components/LoadingSpinner";
import ServiceWorkerUpdater from "./components/ServiceWorkerUpdater";
import ServiceWorkerErrorNotifier from "./components/ServiceWorkerErrorNotifier";

// Lazy load all pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Work = lazy(() => import("./pages/Work"));
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Legal = lazy(() => import("./pages/Legal"));

const queryClient = new QueryClient();

const App = () => {
  const handleCookieAccept = (settings: CookieSettings) => {
    console.log("Cookie settings accepted:", settings);
    // Here you can initialize analytics, marketing tools, etc. based on settings
  };

  const handleCookieDecline = () => {
    console.log("Cookies declined, only necessary cookies will be used");
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
          </BrowserRouter>
          <ServiceWorkerUpdater />
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
