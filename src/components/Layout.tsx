import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { ThemeProvider } from './ThemeProvider';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // State to track if mobile menu is open
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo(0, 0);
  }, [location.pathname]); // Re-run when the route changes

  // Callback function to be passed to Navbar
  const handleMobileMenuToggle = (isOpen: boolean) => {
    setIsMobileMenuOpen(isOpen);
  };

  return (
    <ThemeProvider>
      <div className={`min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 transition-colors duration-300 ${isMobileMenuOpen ? 'overflow-hidden' : ''}`}>
        <div className="fixed inset-0 bg-gradient-to-b from-white via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 -z-10 transition-colors duration-300"></div>
        <div className="fixed inset-0 opacity-20 dark:opacity-10 -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-20 dark:opacity-10"></div>
        </div>
        
        <Navbar onMobileMenuToggle={handleMobileMenuToggle} />

        {/* Main content with page transition */}
        <main className="animate-fadeIn">
          {children}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Layout;