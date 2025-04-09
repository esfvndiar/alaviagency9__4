import React, { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [staticText, setStaticText] = useState('');
  const [dynamicText, setDynamicText] = useState('');
  const [isTypingStatic, setIsTypingStatic] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(80);
  
  const fullStaticText = "Together we create";
  const rotatingTexts = [
    "Innovation",
    "Revolution",
    "Digital Worlds",
    "Experiences",
    "The Future",
    "Possibilities",
    "Excellence",
    "Solutions",
    "Transformations"
  ];

  // Handle the static text typing animation
  useEffect(() => {
    if (!isTypingStatic) return;
    
    if (staticText === fullStaticText) {
      // Finished typing static text, wait before starting dynamic text
      setTimeout(() => {
        setIsTypingStatic(false);
      }, 500);
      return;
    }
    
    const timer = setTimeout(() => {
      setStaticText(fullStaticText.substring(0, staticText.length + 1));
    }, 100);
    
    return () => clearTimeout(timer);
  }, [staticText, isTypingStatic]);

  // Handle the dynamic text typing animation
  useEffect(() => {
    if (isTypingStatic) return;
    
    const handleTyping = () => {
      const i = loopNum % rotatingTexts.length;
      const fullText = rotatingTexts[i];

      setDynamicText(isDeleting 
        ? fullText.substring(0, dynamicText.length - 1) 
        : fullText.substring(0, dynamicText.length + 1)
      );

      // Set typing speed based on action
      setTypingSpeed(isDeleting ? 30 : 80);

      // Handle deletion and rotation logic
      if (!isDeleting && dynamicText === fullText) {
        // Finished typing, wait before deleting
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && dynamicText === '') {
        // Finished deleting, move to next word
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [dynamicText, isDeleting, loopNum, rotatingTexts, typingSpeed, isTypingStatic]);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-zinc-50 overflow-hidden">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="relative font-space-grotesk text-5xl md:text-7xl font-medium mb-0 inline-block">
            <div className="text-zinc-900 block mb-2 md:mb-4 h-[1.2em] relative flex items-center justify-center">
              <span>{staticText}</span>
              {isTypingStatic && <span className="inline-block w-[2px] h-[1em] bg-zinc-900 animate-blink ml-[2px] align-middle"></span>}
            </div>
            <div className="h-[1.2em] relative flex items-center justify-center">
              <span className="animated-gradient-text block min-h-[1em]">
                {dynamicText}
              </span>
              {!isTypingStatic && <span className="inline-block w-[2px] h-[1em] bg-zinc-900 animate-blink ml-[2px] align-middle"></span>}
            </div>
          </h1>
          
          <p className="text-xl md:text-2xl mt-8 mb-8 opacity-0 animate-fade-in animation-delay-1000 bg-gradient-to-r from-blue-400 to-blue-900 bg-clip-text text-transparent font-medium">
            We transform your vision into exceptional digital experiences that inspire, engage, and deliver results.
          </p>

          <div className="mt-12 opacity-0 animate-fade-in animation-delay-1500 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#services" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#8b5cf6] hover:to-[#6366f1] transition-all duration-500 shadow-md hover:shadow-lg hover:-translate-y-1 btn-animated btn-pulse"
            >
              Discover Our Services
              <ArrowDown className="ml-2 -mr-1 w-5 h-5" />
            </a>
            
            <a 
              href="#contact" 
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium rounded-full text-white bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] hover:from-[#0ea5e9] hover:to-[#14b8a6] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 relative btn-animated btn-highlight"
            >
              <span className="relative z-10">Reach Out</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
