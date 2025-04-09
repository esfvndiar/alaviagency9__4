import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import MobileMenu from './MobileMenu';

interface NavLink {
  title: string;
  href: string;
}

interface NavState {
  scrolled: boolean;
  hidden: boolean;
  lastScrollY: number;
}

interface NavbarProps {
  onMobileMenuToggle?: (isOpen: boolean) => void;
}

const NAV_LINKS: NavLink[] = [
  { title: 'Home', href: '/' },
  { title: 'Work', href: '/work' },
  { title: 'Services', href: '/services' },
  { title: 'About', href: '/about' },
  { title: 'Reach Out', href: '/contact' }
];

// Reduced threshold for more responsive behavior
const SCROLL_THRESHOLD = 20;

const Navbar: React.FC<NavbarProps> = ({ onMobileMenuToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navState, setNavState] = useState<NavState>({
    scrolled: false,
    hidden: false,
    lastScrollY: 0
  });
  
  // Use ref to track the last scroll position for more accurate calculations
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Improved scroll handler with requestAnimationFrame for better performance
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        const isScrollingDown = currentScrollY > lastScrollY.current;
        
        setNavState({
          scrolled: currentScrollY > SCROLL_THRESHOLD,
          hidden: isScrollingDown && currentScrollY > SCROLL_THRESHOLD,
          lastScrollY: currentScrollY
        });
        
        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
      
      ticking.current = true;
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Notify parent component when menu state changes
  useEffect(() => {
    onMobileMenuToggle?.(isMenuOpen);
  }, [isMenuOpen, onMobileMenuToggle]);

  // Callback function to toggle mobile menu
  const toggleMobileMenu = () => {
    const newIsOpen = !isMenuOpen;
    setIsMenuOpen(newIsOpen);
    if (onMobileMenuToggle) {
      onMobileMenuToggle(newIsOpen);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        navState.scrolled 
          ? 'bg-white/30 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      } ${navState.hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <a 
          href="/" 
          className="text-xl sm:text-2xl font-space-grotesk font-medium text-zinc-900 tracking-tight"
        >
          ALAVI
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.title}
              href={link.href}
              className="text-sm font-medium text-zinc-800 hover:text-zinc-900 transition-colors relative group"
            >
              {link.title}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-zinc-900 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-zinc-900 hover:text-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-200 rounded-md p-1"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        links={NAV_LINKS}
      />
    </nav>
  );
};

export default Navbar;
