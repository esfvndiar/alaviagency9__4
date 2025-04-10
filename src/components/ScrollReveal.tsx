import React, { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'rotate' | 'none';
  threshold?: number;
  delay?: number;
  duration?: number;
  className?: string;
  rootMargin?: string;
  once?: boolean;
  staggered?: boolean;
  disabled?: boolean;
  priority?: boolean;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  threshold = 0.1,
  delay = 0,
  duration = 800,
  className = '',
  rootMargin = '0px',
  once = true,
  staggered = false,
  disabled = false,
  priority = false
}) => {
  const [isVisible, setIsVisible] = useState(disabled || priority);
  const [hasAnimated, setHasAnimated] = useState(disabled || priority);
  const ref = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  // Check if reduced motion is preferred
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Memoize animation setup to reduce renders
  const setupAnimation = useCallback(() => {
    // Skip animations if disabled or if user prefers reduced motion
    if (disabled || prefersReducedMotion) {
      setIsVisible(true);
      setHasAnimated(true);
      return;
    }
    
    // Skip if already animated and once is true
    if (hasAnimated && once) return;
    
    const currentRef = ref.current;
    if (!currentRef) return;

    // Create the observer with a more efficient callback
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Only process the first entry
        const entry = entries[0];
        
        // Use requestAnimationFrame to batch visual updates
        if (entry.isIntersecting) {
          if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
          }
          
          // Add a small staggered delay for smoother performance if staggered is true
          if (staggered) {
            const timeoutId = setTimeout(() => {
              animationFrameIdRef.current = requestAnimationFrame(() => {
                setIsVisible(true);
                setHasAnimated(true);
              });
            }, Math.random() * 150); // Random delay between 0-150ms for staggered effect
            
            // Store the timeout ID for cleanup
            timeoutIdRef.current = timeoutId;
          } else if (delay > 0) {
            // Apply specific delay if requested
            const timeoutId = setTimeout(() => {
              animationFrameIdRef.current = requestAnimationFrame(() => {
                setIsVisible(true);
                setHasAnimated(true);
              });
            }, delay);
            
            timeoutIdRef.current = timeoutId;
          } else {
            // No delay needed, apply immediately on next frame
            animationFrameIdRef.current = requestAnimationFrame(() => {
              setIsVisible(true);
              setHasAnimated(true);
            });
          }
        } else if (!once) {
          if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
          }
          
          // For repeat animations, use RAF for smoother transitions
          animationFrameIdRef.current = requestAnimationFrame(() => {
            setIsVisible(false);
          });
        }
      },
      {
        root: null,
        rootMargin,
        threshold: staggered ? Math.max(0.15, threshold) : threshold, // Slightly higher threshold for staggered animations
      }
    );

    // Start observing
    observerRef.current.observe(currentRef);
  }, [threshold, rootMargin, once, hasAnimated, staggered, delay, disabled, prefersReducedMotion]);

  useEffect(() => {
    // For priority elements, make them visible immediately without animation
    if (priority) {
      setIsVisible(true);
      setHasAnimated(true);
      return;
    }
    
    setupAnimation();

    // Cleanup function
    return () => {
      if (observerRef.current && ref.current) {
        observerRef.current.unobserve(ref.current);
        observerRef.current.disconnect();
      }
      
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [setupAnimation, priority]);

  // Map animation type to appropriate CSS classes
  const getAnimationClass = () => {
    // Skip animation class if animations are disabled or reduced motion is preferred
    if (disabled || prefersReducedMotion || animation === 'none') {
      return '';
    }
    
    switch (animation) {
      case 'fade-up':
        return 'reveal-fade-up';
      case 'fade-down':
        return 'reveal-fade-down';
      case 'fade-left':
        return 'reveal-fade-left';
      case 'fade-right':
        return 'reveal-fade-right';
      case 'scale':
        return 'reveal-scale';
      case 'rotate':
        return 'reveal-rotate';
      default:
        return 'reveal-fade-up';
    }
  };

  // Get optimized styles based on animation type
  const getOptimizedStyles = () => {
    // Skip optimization if animations are disabled
    if (disabled || prefersReducedMotion) {
      return {};
    }
    
    let willChangeValue = 'opacity';
    
    if (animation === 'fade-up' || animation === 'fade-down') {
      willChangeValue = 'opacity, transform';
    } else if (animation === 'fade-left' || animation === 'fade-right') {
      willChangeValue = 'opacity, transform';
    } else if (animation === 'scale') {
      willChangeValue = 'opacity, transform';
    } else if (animation === 'rotate') {
      willChangeValue = 'opacity, transform';
    }
    
    return {
      willChange: isVisible ? 'auto' : willChangeValue, // Reset will-change after animation completes
      transitionDuration: `${duration}ms`,
      transitionTimingFunction: 'cubic-bezier(0.165, 0.84, 0.44, 1)', // Optimized easing
    };
  };

  // Combine all classes
  const animationClass = getAnimationClass();
  const combinedStyles = getOptimizedStyles();

  return (
    <div
      ref={ref}
      className={`${animationClass} ${isVisible ? 'revealed' : ''} ${className} hardware-accelerated`}
      style={combinedStyles}
      aria-hidden={false} // Don't hide content from screen readers
      data-scroll-reveal={animation}
    >
      {children}
    </div>
  );
};

export default React.memo(ScrollReveal); // Memoize to prevent unnecessary re-renders
