import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?:
    | "fade-up"
    | "fade-down"
    | "fade-left"
    | "fade-right"
    | "scale"
    | "rotate"
    | "none";
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
  animation = "fade-up",
  threshold = 0.1,
  delay = 0,
  duration = 800,
  className = "",
  rootMargin = "0px",
  once = true,
  staggered = false,
  disabled = false,
  priority = false,
}) => {
  const [isVisible, setIsVisible] = useState(disabled || priority);
  const ref = useRef<HTMLDivElement>(null);

  // Check if reduced motion is preferred
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    // Skip if disabled, priority, or reduced motion is preferred
    if (disabled || priority || prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const currentRef = ref.current;
    if (!currentRef) return;

    // Observer configuration
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin,
      threshold: staggered ? Math.max(0.15, threshold) : threshold,
    };

    // Create observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > threshold) {
          // Apply delay if specified
          if (delay > 0 || staggered) {
            const delayTime = staggered ? Math.random() * 150 : delay;
            setTimeout(() => {
              setIsVisible(true);
            }, delayTime);
          } else {
            setIsVisible(true);
          }

          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      });
    }, options);

    // Start observing
    observer.observe(currentRef);

    // Cleanup function
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [
    threshold,
    rootMargin,
    once,
    staggered,
    delay,
    disabled,
    priority,
    prefersReducedMotion,
  ]);

  // Map animation type to appropriate CSS classes
  const getAnimationClass = () => {
    // Skip animation class if animations are disabled or reduced motion is preferred
    if (disabled || prefersReducedMotion || animation === "none") {
      return "";
    }

    switch (animation) {
      case "fade-up":
        return "reveal-fade-up";
      case "fade-down":
        return "reveal-fade-down";
      case "fade-left":
        return "reveal-fade-left";
      case "fade-right":
        return "reveal-fade-right";
      case "scale":
        return "reveal-scale";
      case "rotate":
        return "reveal-rotate";
      default:
        return "reveal-fade-up";
    }
  };

  // Get optimized styles based on animation type
  const getOptimizedStyles = () => {
    // Skip optimization if animations are disabled
    if (disabled || prefersReducedMotion) {
      return {};
    }

    let willChangeValue = "opacity";

    if (animation === "fade-up" || animation === "fade-down") {
      willChangeValue = "opacity, transform";
    } else if (animation === "fade-left" || animation === "fade-right") {
      willChangeValue = "opacity, transform";
    } else if (animation === "scale") {
      willChangeValue = "opacity, transform";
    } else if (animation === "rotate") {
      willChangeValue = "opacity, transform";
    }

    return {
      willChange: isVisible ? "auto" : willChangeValue, // Reset will-change after animation completes
      transitionDuration: `${duration}ms`,
      transitionTimingFunction: "cubic-bezier(0.165, 0.84, 0.44, 1)", // Optimized easing
    };
  };

  // Combine all classes
  const animationClass = getAnimationClass();
  const combinedStyles = getOptimizedStyles();

  return (
    <div
      ref={ref}
      className={`${animationClass} ${isVisible ? "revealed" : ""} ${className} hardware-accelerated`}
      style={combinedStyles}
      aria-hidden={false} // Don't hide content from screen readers
      data-scroll-reveal={animation}
    >
      {children}
    </div>
  );
};

export default React.memo(ScrollReveal); // Memoize to prevent unnecessary re-renders
