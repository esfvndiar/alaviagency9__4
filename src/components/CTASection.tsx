import React, { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';
import { ArrowRight } from 'lucide-react';

const CTASection: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Reset hover state when component unmounts or when navigating
  useEffect(() => {
    return () => {
      setIsHovered(false);
    };
  }, []);

  return (
    <section id="contact" className="py-20 md:py-32 relative bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950 overflow-hidden">
      {/* Add gradient background elements for depth */}
      <div className="absolute -top-20 -left-20 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-cyberblue/5 dark:bg-cyberblue/20 rounded-full blur-[100px]" />
      <div className="absolute -bottom-20 -right-20 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-mintgreen/5 dark:bg-mintgreen/20 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-5 md:px-10 max-w-6xl relative z-10">
        {/* CTA Section */}
        <div className="mb-24">
          <ScrollReveal animation="fade-up">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-10">
              <div className="lg:col-span-6 text-left">
                <h2 className="text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] font-display font-bold tracking-tight leading-[0.8] -ml-2 md:-ml-4">
                  <span className="text-lava inline-block dark:text-gradient">HEY!</span>
                </h2>
              </div>
              <div className="lg:col-span-6 text-left lg:pl-0">
                <p className="text-xl md:text-2xl font-medium text-zinc-800 dark:text-white mb-8 max-w-md">
                  What are you waiting for? Let's create something big together.
                </p>
                <a 
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-white bg-gradient-to-r from-primary to-[#0ea5e9] hover:from-[#0ea5e9] hover:to-primary transition-all duration-500 shadow-md hover:shadow-lg hover:-translate-y-1 btn-animated btn-pulse"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  aria-label="Contact us"
                >
                  <span className="mr-2">Reach Out</span>
                  <ArrowRight className={`transition-transform duration-300 ease-in-out ${isHovered ? 'translate-x-2' : ''}`} />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
