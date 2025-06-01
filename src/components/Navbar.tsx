import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";

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
  { title: "Work", href: "/work" },
  { title: "Services", href: "/services" },
  { title: "Blog", href: "/blog" },
  { title: "About", href: "/about" },
  { title: "Reach Out", href: "/contact" },
];

// Reduced threshold for more responsive behavior
const SCROLL_THRESHOLD = 20;

const Navbar: React.FC<NavbarProps> = ({ onMobileMenuToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navState, setNavState] = useState<NavState>({
    scrolled: false,
    hidden: false,
    lastScrollY: 0,
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
          lastScrollY: currentScrollY,
        });

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });

      ticking.current = true;
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
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
          ? "bg-white/80 dark:bg-zinc-900/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      } ${navState.hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <a
          href="/"
          className="text-xl sm:text-2xl font-space-grotesk font-medium text-zinc-900 dark:text-white tracking-tight"
        >
          ALAVI
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.title}
              href={link.href}
              className={`text-sm font-medium transition-all duration-300 relative group ${
                // Added duration-300 here for consistency
                link.title === "Reach Out"
                  ? "px-4 py-2 rounded-full bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] text-white hover:shadow-lg hover:-translate-y-1 transform" // Increased shadow and translate, added transform base
                  : "text-zinc-800 dark:text-zinc-100 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {link.title}
              {link.title !== "Reach Out" && (
                <span className="absolute -bottom-1 left-0 block h-0.5 w-full bg-zinc-900 dark:bg-white transform scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100 transform-origin-left"></span>
              )}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={toggleMobileMenu}
            className="text-zinc-900 dark:text-white hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-500 rounded-md p-1"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu-content"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        links={NAV_LINKS}
        id="mobile-menu-content"
      />
    </nav>
  );
};

export default Navbar;
