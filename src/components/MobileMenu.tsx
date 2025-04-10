import React, { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

// Define a constant for animation duration to ensure consistency
const ANIMATION_DURATION = 300; // in milliseconds

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: Array<{ title: string; href: string }>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, links }) => {
  // State to track if we're in the browser environment
  const [mounted, setMounted] = useState(false);
  // State to track if menu should be rendered at all (separate from animation)
  const [shouldRender, setShouldRender] = useState(false);
  // Ref to store timeout IDs for proper cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Effect to set mounted state when component mounts
  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      // Clear any pending timeouts when unmounting
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Effect to handle menu visibility and animations
  useEffect(() => {
    if (!mounted) return;
    
    if (isOpen) {
      // Immediately set shouldRender to true when opening
      setShouldRender(true);
    } else if (!isOpen && shouldRender) {
      // When closing, wait for animation to complete before unmounting
      // Clear any existing timeout first to prevent race conditions
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setShouldRender(false);
      }, ANIMATION_DURATION); // Match this with the CSS transition duration
    }
    
    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen, mounted, shouldRender]);

  // Effect to prevent body scroll when mobile menu is open
  useEffect(() => {
    if (!mounted) return;
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, mounted]);

  // Don't render anything if not mounted or shouldn't render
  if (!mounted || !shouldRender) return null;

  // Portal content - this will be rendered directly to document.body
  const menuContent = (
    <div 
      className={`fixed inset-0 bg-white dark:bg-zinc-900 z-[9999] transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ transitionDuration: `${ANIMATION_DURATION}ms` }}
    >
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 h-full flex flex-col">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-zinc-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors group focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-500 rounded-md p-1"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8 transform transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>
        
        <ul className="mt-6 sm:mt-8 flex flex-col items-center justify-center flex-grow space-y-6 sm:space-y-8">
          {links.map((link, index) => (
            <li 
              key={link.title}
              className={`text-center menu-item ${isOpen ? 'menu-item-visible' : ''}`}
              style={{ 
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
              }}
            >
              <a
                href={link.href}
                onClick={onClose}
                className={`text-xl sm:text-2xl font-medium transition-all duration-300 ${
                  link.title === 'Reach Out'
                    ? 'px-6 py-3 rounded-full bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] text-white hover:shadow-md inline-block'
                    : 'text-zinc-900 dark:text-white hover:text-primary dark:hover:text-primary'
                }`}
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto pb-8 flex flex-col items-center space-y-4">
          <div className="text-sm text-zinc-500 dark:text-zinc-300">
            &copy; {new Date().getFullYear()} ALAVI
          </div>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render the menu directly to document.body
  return createPortal(menuContent, document.body);
};

export default MobileMenu;
