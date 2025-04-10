import React, { useEffect, useState, useRef, useMemo } from 'react';
import { ArrowDown } from 'lucide-react';

// Animation constants for 120fps performance
const TYPING_FRAME_DURATION = 8; // ~8.33ms per frame at 120fps
const TYPING_SPEED_NORMAL = 80;
const TYPING_SPEED_FAST = 30;
const TYPING_PAUSE = 2000;
const STATIC_TEXT_PAUSE = 500;

const HeroSection: React.FC = () => {
  const [staticText, setStaticText] = useState('');
  const [dynamicText, setDynamicText] = useState('');
  const [isTypingStatic, setIsTypingStatic] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  
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
        if (staticText.length < fullStaticText.length) {
          setStaticText(prevText => fullStaticText.substring(0, prevText.length + 1));
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
        const i = loopNum % rotatingTexts.length;
        const fullText = rotatingTexts[i];
        
        if (isDeleting) {
          // Optimize deletion speed
          typingSpeedRef.current = TYPING_SPEED_FAST;
          
          if (dynamicText.length > 0) {
            setDynamicText(prevText => fullText.substring(0, prevText.length - 1));
          } else {
            // When finished deleting, move to the next word
            setIsDeleting(false);
            setLoopNum(prevNum => prevNum + 1);
          }
        } else {
          // Reset to normal typing speed
          typingSpeedRef.current = TYPING_SPEED_NORMAL;
          
          if (dynamicText.length < fullText.length) {
            setDynamicText(prevText => fullText.substring(0, prevText.length + 1));
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
  }, [staticText.length, dynamicText.length, isTypingStatic, isDeleting, loopNum, rotatingTexts]);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="relative font-space-grotesk text-5xl md:text-7xl font-bold mb-0 inline-block">
            <div className="text-zinc-900 dark:text-white block mb-2 md:mb-4 h-[1.2em] relative flex items-center justify-center">
              <span className="transform-gpu">{staticText}</span>
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
                {dynamicText}
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
      
      {/* Background elements with hardware acceleration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-br from-cyberblue/10 to-transparent rounded-full blur-3xl transform-gpu"
          style={{ transform: 'translate3d(0,0,0)' }}
        />
        <div 
          className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-gradient-to-bl from-mintgreen/10 to-transparent rounded-full blur-3xl transform-gpu"
          style={{ transform: 'translate3d(0,0,0)' }}
        />
        <div 
          className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-gradient-to-tr from-cyberblue/10 to-transparent rounded-full blur-3xl transform-gpu"
          style={{ transform: 'translate3d(0,0,0)' }}
        />
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
