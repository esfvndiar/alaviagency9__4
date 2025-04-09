import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { openCookieSettings } from '../utils/cookieManager';

const Footer: React.FC = () => {
  return (
    <footer className="py-10 md:py-16 relative">
      {/* Background glass effect */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm -z-10"></div>
      
      <div className="container mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-start border-t border-zinc-100 pt-10">
          <div className="mb-8 md:mb-0 md:max-w-xs">
            <a 
              href="#home" 
              className="font-display text-xl font-medium text-zinc-900 tracking-tight mb-6 inline-block relative group"
            >
              ALAVI
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <p className="text-zinc-600 max-w-xs text-sm mt-4">
              Creative digital solutions for modern businesses.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-x-24 gap-y-8 md:grid-cols-2 md:ml-auto md:mr-8">
            
            <div>
              <h3 className="text-sm font-medium text-zinc-900 mb-4">Contact</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="mailto:hello@alavi.com" 
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors flex items-center group"
                  >
                    hello@alavi.com
                    <ArrowUpRight className="w-3 h-3 ml-1 transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </li>
                <li>
                  <a 
                    href="tel:+1234567890" 
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors relative group"
                  >
                    +1 (234) 567-890
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary/40 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-zinc-900 mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="/legal" 
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors relative group"
                    rel="noopener noreferrer"
                  >
                    Datenschutz & Impressum
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary/40 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
                <li>
                  <button 
                    onClick={() => openCookieSettings()}
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors relative group"
                  >
                    Cookie-Einstellungen
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary/40 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mt-10 pt-6 border-t border-zinc-100">
          <p className="text-xs text-zinc-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ALAVI. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {["Twitter", "Instagram", "LinkedIn"].map((social, i) => (
              <a 
                key={i}
                href="#" 
                className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors relative group"
              >
                {social}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary/30 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
