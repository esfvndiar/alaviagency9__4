import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'rotate';
  threshold?: number;
  delay?: number;
  duration?: number;
  className?: string;
  rootMargin?: string;
  once?: boolean;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  threshold = 0.1,
  delay = 0,
  duration = 800,
  className = '',
  rootMargin = '0px',
  once = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip if already animated and once is true
    if (hasAnimated && once) return;
    
    const currentRef = ref.current;
    if (!currentRef) return;

    // Use requestAnimationFrame for smoother visual updates
    let animationFrameId: number;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Use requestAnimationFrame to batch visual updates
        if (entry.isIntersecting) {
          animationFrameId = requestAnimationFrame(() => {
            setIsVisible(true);
            setHasAnimated(true);
          });
        } else if (!once) {
          animationFrameId = requestAnimationFrame(() => {
            setIsVisible(false);
          });
        }
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [threshold, rootMargin, once, hasAnimated]);

  // Map animation type to appropriate CSS classes
  const getAnimationClass = () => {
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

  // Get delay class based on delay prop
  const getDelayClass = () => {
    if (delay === 0) return '';
    if (delay <= 100) return 'delay-100';
    if (delay <= 200) return 'delay-200';
    if (delay <= 300) return 'delay-300';
    if (delay <= 400) return 'delay-400';
    if (delay <= 500) return 'delay-500';
    if (delay <= 600) return 'delay-600';
    if (delay <= 700) return 'delay-700';
    return 'delay-800';
  };

  // Combine all classes
  const animationClass = getAnimationClass();
  const delayClass = getDelayClass();
  const durationStyle = { transitionDuration: `${duration}ms` };

  return (
    <div
      ref={ref}
      className={`${animationClass} ${isVisible ? 'revealed' : ''} ${delayClass} ${className}`}
      style={durationStyle}
      aria-hidden={!isVisible}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
