import React, { useEffect, useState, useRef, useMemo } from 'react';
import { ArrowDown } from 'lucide-react';

// Animation constants for 120fps performance
const TYPING_FRAME_DURATION = 8; // ~8.33ms per frame at 120fps
const TYPING_SPEED_NORMAL = 80;
const TYPING_SPEED_FAST = 30;
const TYPING_PAUSE = 2000;
const STATIC_TEXT_PAUSE = 500;

const HeroSection: React.FC = () => {
  // Consolidate related state to reduce re-renders
  const [texts, setTexts] = useState({
    staticText: '',
    dynamicText: ''
  });
  // Use refs for animation state that doesn't need to trigger re-renders
  const isTypingStaticRef = useRef(true);
  const isDeletingRef = useRef(false);
  const loopNumRef = useRef(0);
  
  // Only use state for values that need to cause a re-render
  const [isTypingStatic, setIsTypingStatic] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Use refs for animation state to avoid re-renders and improve performance
  const typingSpeedRef = useRef(TYPING_SPEED_NORMAL);
  const rafIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const isAnimatingRef = useRef(true);
  const animationQueueRef = useRef<Array<() => void>>([]);
  
  const fullStaticText = "Together we create";
  
  // Use useMemo to prevent array recreation on each render
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

  // High-performance animation loop using requestAnimationFrame
  useEffect(() => {
    let timeoutId: number | null = null;
    
    const animate = (timestamp: number) => {
      // First frame initialization
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
        rafIdRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Calculate elapsed time for frame pacing
      const elapsed = timestamp - lastTimeRef.current;
      
      // Only process animation at the appropriate FPS
      if (elapsed < typingSpeedRef.current) {
        rafIdRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Update timestamp for next frame
      lastTimeRef.current = timestamp;
      
      // Process animation queue if any
      if (animationQueueRef.current.length > 0) {
        const action = animationQueueRef.current.shift();
        action?.();
        rafIdRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Static text typing animation
      if (isTypingStatic) {
        if (texts.staticText.length < fullStaticText.length) {
          // Batch state updates to reduce renders
          if (animationQueueRef.current.length === 0) {
            setTexts(prevTexts => ({ 
              ...prevTexts, 
              staticText: fullStaticText.substring(0, prevTexts.staticText.length + 1) 
            }));
          }
        } else {
          // Finished typing static text, schedule transition to dynamic text
          if (timeoutId === null) {
            timeoutId = window.setTimeout(() => {
              setIsTypingStatic(false);
              timeoutId = null;
            }, STATIC_TEXT_PAUSE);
          }
        }
      } 
      // Dynamic text animation
      else {
        const i = loopNumRef.current % rotatingTexts.length;
        const fullText = rotatingTexts[i];
        
        if (isDeleting) {
          // Optimize deletion speed
          typingSpeedRef.current = TYPING_SPEED_FAST;
          
          if (texts.dynamicText.length > 0) {
            // Batch state updates to reduce renders
            if (animationQueueRef.current.length === 0) {
              setTexts(prevTexts => ({ 
                ...prevTexts, 
                dynamicText: fullText.substring(0, prevTexts.dynamicText.length - 1) 
              }));
            }
          } else {
            // When finished deleting, move to the next word
            setIsDeleting(false);
            loopNumRef.current = loopNumRef.current + 1;
          }
        } else {
          // Reset to normal typing speed
          typingSpeedRef.current = TYPING_SPEED_NORMAL;
          
          if (texts.dynamicText.length < fullText.length) {
            // Batch state updates to reduce renders
            if (animationQueueRef.current.length === 0) {
              setTexts(prevTexts => ({ 
                ...prevTexts, 
                dynamicText: fullText.substring(0, prevTexts.dynamicText.length + 1) 
              }));
            }
          } else {
            // When finished typing a word, schedule deletion after pause
            if (timeoutId === null) {
              timeoutId = window.setTimeout(() => {
                setIsDeleting(true);
                timeoutId = null;
              }, TYPING_PAUSE);
            }
          }
        }
      }
      
      // Continue animation loop if still animating
      if (isAnimatingRef.current) {
        rafIdRef.current = requestAnimationFrame(animate);
      }
    };
    
    // Start animation with requestAnimationFrame
    rafIdRef.current = requestAnimationFrame(animate);
    
    // Cleanup function
    return () => {
      isAnimatingRef.current = false;
      
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [texts.staticText.length, texts.dynamicText.length, isTypingStatic, isDeleting, rotatingTexts]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Minimalist background with stronger color treatment */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Base gradient background with stronger colors */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-zinc-50/90 to-blue-50/30 dark:from-zinc-900 dark:via-zinc-900/95 dark:to-blue-950/20 transition-all duration-1000"></div>
        
        {/* Enhanced top gradient accent */}
        <div 
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyberblue/[0.08] via-transparent to-mintgreen/[0.08] opacity-100 dark:opacity-40"
          style={{ transform: 'translate3d(0,0,0)' }}
        ></div>
        
        {/* Centered gradient sphere with stronger presence */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-[100%] bg-gradient-to-tr from-cyberblue/[0.07] via-blue-400/[0.02] to-mintgreen/[0.07] blur-3xl transform-gpu animate-[pulse-slow_60s_linear_infinite]"
          style={{ transform: 'translate3d(-50%, -50%, 0)' }}
        ></div>
        
        {/* Enhanced corner accents */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-mintgreen/[0.05] to-transparent blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-cyberblue/[0.05] to-transparent blur-2xl"></div>
        
        {/* Soft color vignette for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(14,165,233,0.03)_70%,rgba(16,185,129,0.03)_100%)] mix-blend-soft-light"></div>
      </div>
      
      <div className="container mx-auto px-6 py-12 max-w-7xl relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="relative font-space-grotesk text-5xl md:text-7xl font-bold mb-0 inline-block">
            <div className="text-zinc-900 dark:text-white block mb-2 md:mb-4 h-[1.2em] relative flex items-center justify-center">
              <span className="transform-gpu">{texts.staticText}</span>
              {isTypingStatic && (
                <span
                  className="inline-block w-[2px] h-[1em] bg-zinc-900 dark:bg-white animate-blink ml-[2px] align-middle will-change-opacity"
                  style={{ transform: 'translate3d(0,0,0)' }}
                />
              )}
            </div>
            <div className="h-[1.2em] relative flex items-center justify-center mt-1">
              <span
                className="text-gradient will-change-transform"
                style={{ transform: 'translate3d(0,0,0)' }}
              >
                {texts.dynamicText}
              </span>
              {!isTypingStatic && (
                <span
                  className="inline-block w-[2px] h-[1em] bg-gradient-to-r from-cyberblue to-mintgreen animate-blink ml-[2px] align-middle will-change-opacity"
                  style={{ transform: 'translate3d(0,0,0)' }}
                />
              )}
            </div>
          </h1>
          
          <p className="mt-10 max-w-2xl mx-auto text-zinc-700 dark:text-zinc-300 text-lg md:text-xl leading-relaxed font-light tracking-wide">
            We transform your vision into 
            <span className="font-medium text-blue-600 dark:text-blue-400 mx-1 relative transform-gpu">
              exceptional digital experiences
              <span 
                className="absolute -bottom-0.5 left-0 w-full h-px bg-gradient-to-r from-cyberblue/50 to-mintgreen/50 will-change-transform"
                style={{ transform: 'translate3d(0,0,0)' }}
              />
            </span>
            that inspire, engage, and deliver results.
          </p>
          
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4">
            <a 
              href="#services" 
              className="px-8 py-3 bg-zinc-900 dark:bg-zinc-800 text-white rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-120fps hover:shadow-gpu hover:scale-105 flex items-center transform-gpu"
              style={{ transform: 'translate3d(0,0,0)' }}
            >
              Explore Solutions
              <ArrowDown className="ml-2 h-4 w-4 will-change-transform transform-gpu" />
            </a>
            <a 
              href="#contact" 
              className="px-8 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-full hover:border-zinc-300 dark:hover:border-zinc-600 transition-120fps hover:shadow-gpu hover:scale-105 transform-gpu"
              style={{ transform: 'translate3d(0,0,0)' }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator with hardware acceleration */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center will-change-transform" style={{ transform: 'translate3d(-50%, 0, 0)' }}>
        <span className="text-zinc-500 dark:text-zinc-400 text-sm mb-2">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-zinc-300 dark:border-zinc-600 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full mt-2 animate-bounce will-change-transform transform-gpu" />
        </div>
      </div>
    </section>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(HeroSection);
