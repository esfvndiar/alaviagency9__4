import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

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
  
  // Effect to set mounted state when component mounts
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Effect to handle menu visibility and animations
  useEffect(() => {
    if (!mounted) return;
    
    if (isOpen) {
      // Immediately set shouldRender to true when opening
      setShouldRender(true);
    } else if (!isOpen && shouldRender) {
      // When closing, wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match this with the CSS transition duration
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, mounted, shouldRender]);

  // Effect to prevent body scroll when mobile menu is open
  useEffect(() => {
    if (!mounted) return;
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, mounted]);

  // Don't render anything if not mounted or shouldn't render
  if (!mounted || !shouldRender) return null;

  // Portal content - this will be rendered directly to document.body
  const menuContent = (
    <div 
      className={`fixed inset-0 bg-white z-[9999] transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ backgroundColor: 'white' }}
    >
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 h-full flex flex-col bg-white">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-zinc-900 hover:text-primary transition-colors group focus:outline-none focus:ring-2 focus:ring-zinc-200 rounded-md p-1"
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
                animationDelay: `${index * 100 + 150}ms`,
                transitionDelay: !isOpen ? '0ms' : `${index * 50}ms`
              }}
            >
              <a
                href={link.href}
                className="text-2xl sm:text-3xl font-display font-medium text-zinc-900 hover:text-primary transition-all duration-300 relative group"
                onClick={onClose}
              >
                {link.title}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto text-center pb-6 sm:pb-8">
          <a
            href="mailto:info@alavi.dev"
            className="text-sm text-zinc-600 hover:text-primary transition-colors"
          >
            info@alavi.dev
          </a>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render the menu directly to document.body
  return createPortal(menuContent, document.body);
};

export default MobileMenu;
