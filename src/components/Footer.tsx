
import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-10 md:py-16 relative">
      {/* Background glass effect */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm -z-10"></div>
      
      <div className="container mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-start border-t border-zinc-100 pt-10">
          <div className="mb-8 md:mb-0">
            <a href="#home" className="font-display text-xl font-medium text-zinc-900 tracking-tight mb-6 inline-block">
              ALAVI
            </a>
            <p className="text-zinc-600 max-w-xs text-sm mt-4">
              Creative digital solutions for modern businesses.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-x-12 gap-y-8 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-medium text-zinc-900 mb-4">Navigation</h3>
              <ul className="space-y-3">
                {["Home", "Services", "About", "Contact"].map((item, i) => (
                  <li key={i}>
                    <a 
                      href={`#${item.toLowerCase()}`} 
                      className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-zinc-900 mb-4">Contact</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="mailto:hello@alavi.com" 
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors flex items-center"
                  >
                    hello@alavi.com
                    <ArrowUpRight className="w-3 h-3 ml-1" />
                  </a>
                </li>
                <li>
                  <a 
                    href="tel:+1234567890" 
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    +1 (234) 567-890
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mt-10 pt-6 border-t border-zinc-100">
          <p className="text-xs text-zinc-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} ALAVI. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {["Twitter", "Instagram", "LinkedIn"].map((social, i) => (
              <a 
                key={i}
                href="#" 
                className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
