import React, { useEffect, useState, useRef, useMemo } from 'react';
import { ArrowDown } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [staticText, setStaticText] = useState('');
  const [dynamicText, setDynamicText] = useState('');
  const [isTypingStatic, setIsTypingStatic] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(80);
  
  // Refs for timeouts to properly clean them up
  const staticTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dynamicTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const fullStaticText = "Together we create";
  
  // Use useMemo to prevent rotatingTexts from changing on every render
  const rotatingTexts = useMemo(() => [
    "Innovation",
    "Revolution",
    "Digital Worlds",
    "Experiences",
    "The Future",
    "Possibilities",
    "Excellence",
    "Solutions",
    "Transformations"
  ], []);

  // Handle the static text typing animation
  useEffect(() => {
    if (!isTypingStatic) return;
    
    if (staticText === fullStaticText) {
      // Finished typing static text, wait before starting dynamic text
      delayTimeoutRef.current = setTimeout(() => {
        setIsTypingStatic(false);
      }, 500);
      return;
    }
    
    staticTimeoutRef.current = setTimeout(() => {
      setStaticText(fullStaticText.substring(0, staticText.length + 1));
    }, 100);
    
    // Cleanup function
    return () => {
      if (staticTimeoutRef.current) clearTimeout(staticTimeoutRef.current);
      if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
    };
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
        delayTimeoutRef.current = setTimeout(() => setIsDeleting(true), 2000);
        return;
      } else if (isDeleting && dynamicText === '') {
        // Finished deleting, move to next word
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    dynamicTimeoutRef.current = setTimeout(handleTyping, typingSpeed);
    
    // Cleanup function
    return () => {
      if (dynamicTimeoutRef.current) clearTimeout(dynamicTimeoutRef.current);
      if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
    };
  }, [dynamicText, isDeleting, loopNum, rotatingTexts, typingSpeed, isTypingStatic]);

  // Cleanup function to clear all timeouts when the component unmounts
  useEffect(() => {
    return () => {
      if (staticTimeoutRef.current) clearTimeout(staticTimeoutRef.current);
      if (dynamicTimeoutRef.current) clearTimeout(dynamicTimeoutRef.current);
      if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="relative font-space-grotesk text-5xl md:text-7xl font-medium mb-0 inline-block">
            <div className="text-zinc-900 dark:text-white block mb-2 md:mb-4 h-[1.2em] relative flex items-center justify-center">
              <span>{staticText}</span>
              {isTypingStatic && <span className="inline-block w-[2px] h-[1em] bg-zinc-900 dark:bg-white animate-blink ml-[2px] align-middle"></span>}
            </div>
            <div className="h-[1.2em] relative flex items-center justify-center mt-1">
              <span className="text-gradient">{dynamicText}</span>
              {!isTypingStatic && <span className="inline-block w-[2px] h-[1em] bg-gradient-to-r from-blue-500 to-purple-500 animate-blink ml-[2px] align-middle"></span>}
            </div>
          </h1>
          
          <p className="text-zinc-600 dark:text-zinc-300 text-lg md:text-xl mt-8 max-w-2xl mx-auto">
            We transform your vision into exceptional digital experiences that inspire, engage, and deliver results.
          </p>
          
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4">
            <a 
              href="#services" 
              className="px-8 py-3 bg-zinc-900 dark:bg-zinc-800 text-white rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center"
            >
              Explore Solutions
              <ArrowDown className="ml-2 h-4 w-4" />
            </a>
            <a 
              href="#contact" 
              className="px-8 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-full hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="text-zinc-500 dark:text-zinc-400 text-sm mb-2">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-zinc-300 dark:border-zinc-600 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
