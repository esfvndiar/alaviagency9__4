import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { openCookieSettings } from '../utils/cookieManager';
import ThemeToggle from './ThemeToggle';
import { siteConfig } from '../config/site-config';

const socialIcons: { [key: string]: React.ReactNode } = {
  x: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  instagram: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218 1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
    </svg>
  ),
  // LinkedIn will remain text for now, add icon later if desired
};

const footerSocials = ['x', 'instagram', 'linkedin'];

const Footer: React.FC = () => {
  return (
    <footer className="py-10 md:py-16 relative">
      {/* Background glass effect */}
      <div className="absolute inset-0 bg-white/70 dark:bg-zinc-900/90 backdrop-blur-sm -z-10"></div>
      
      <div className="container mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-start border-t border-zinc-100 dark:border-zinc-800 pt-10">
          <div className="mb-8 md:mb-0 md:max-w-xs">
            <a 
              href="#home" 
              className="font-display text-xl font-medium text-zinc-900 dark:text-white tracking-tight mb-6 inline-block relative group"
            >
              ALAVI
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-xs text-sm mt-4">
              Creative digital solutions for modern businesses.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-x-24 gap-y-8 md:grid-cols-2 md:ml-auto md:mr-8">
            
            <div>
              <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-4">Contact</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href={`mailto:${siteConfig.contact.email}`} 
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center group"
                  >
                    {siteConfig.contact.email}
                    <ArrowUpRight className="w-3 h-3 ml-1 transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </li>
                <li>
                  <a 
                    href={`tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`} 
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors relative group"
                  >
                    {siteConfig.contact.phone}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary/40 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="/legal" 
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors relative group"
                    rel="noopener noreferrer"
                  >
                    Privacy & Imprint
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary/40 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
                <li>
                  <button 
                    onClick={() => openCookieSettings()}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors relative group"
                  >
                    Cookie Settings
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary/40 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mt-10 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ALAVI. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <ThemeToggle />
            {footerSocials.map((key) => {
              const socialKey = key as keyof typeof siteConfig.social;
              const url = siteConfig.social[socialKey];
              if (!url) return null; // Don't render if URL is missing in config
              
              return (
                <a 
                  key={key}
                  href={url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors block transform transition-transform duration-200 ease-in-out hover:scale-110"
                  aria-label={key.charAt(0).toUpperCase() + key.slice(1)} // Add aria-label for accessibility
                >
                  {socialIcons[key] ? socialIcons[key] : key.charAt(0).toUpperCase() + key.slice(1)} {/* Use icon or fallback to text */}
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
