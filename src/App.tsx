import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Work from "./pages/Work";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Legal from "./pages/Legal";
import CookieConsent from "./components/CookieConsent";
import { CookieSettings, clearNonEssentialCookies } from "./utils/cookieManager";

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
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
        </BrowserRouter>
        <CookieConsent 
          onAccept={handleCookieAccept}
          onDecline={handleCookieDecline}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
