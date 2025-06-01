import { useState, useEffect, useCallback } from "react";

interface AccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: "small" | "medium" | "large" | "extra-large";
  screenReader: boolean;
  keyboardNavigation: boolean;
}

interface AccessibilityState extends AccessibilityPreferences {
  announcements: string[];
  focusVisible: boolean;
}

export const useAccessibility = () => {
  const [state, setState] = useState<AccessibilityState>({
    reducedMotion: false,
    highContrast: false,
    fontSize: "medium",
    screenReader: false,
    keyboardNavigation: false,
    announcements: [],
    focusVisible: false,
  });

  // Detect user preferences
  useEffect(() => {
    const detectPreferences = () => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const highContrast = window.matchMedia(
        "(prefers-contrast: high)",
      ).matches;
      const screenReader =
        window.navigator.userAgent.includes("NVDA") ||
        window.navigator.userAgent.includes("JAWS") ||
        window.navigator.userAgent.includes("VoiceOver");

      setState((prev) => ({
        ...prev,
        reducedMotion,
        highContrast,
        screenReader,
      }));
    };

    detectPreferences();

    // Listen for preference changes
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const contrastQuery = window.matchMedia("(prefers-contrast: high)");

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setState((prev) => ({ ...prev, reducedMotion: e.matches }));
    };

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setState((prev) => ({ ...prev, highContrast: e.matches }));
    };

    motionQuery.addEventListener("change", handleMotionChange);
    contrastQuery.addEventListener("change", handleContrastChange);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      contrastQuery.removeEventListener("change", handleContrastChange);
    };
  }, []);

  // Detect keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setState((prev) => ({
          ...prev,
          keyboardNavigation: true,
          focusVisible: true,
        }));
      }
    };

    const handleMouseDown = () => {
      setState((prev) => ({ ...prev, focusVisible: false }));
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  // Screen reader announcements
  const announce = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      setState((prev) => ({
        ...prev,
        announcements: [...prev.announcements, message],
      }));

      // Create live region for screen readers
      const liveRegion = document.createElement("div");
      liveRegion.setAttribute("aria-live", priority);
      liveRegion.setAttribute("aria-atomic", "true");
      liveRegion.className = "sr-only";
      liveRegion.textContent = message;

      document.body.appendChild(liveRegion);

      // Remove after announcement
      setTimeout(() => {
        document.body.removeChild(liveRegion);
        setState((prev) => ({
          ...prev,
          announcements: prev.announcements.filter((a) => a !== message),
        }));
      }, 1000);
    },
    [],
  );

  // Font size management
  const setFontSize = useCallback(
    (size: AccessibilityPreferences["fontSize"]) => {
      setState((prev) => ({ ...prev, fontSize: size }));

      // Apply font size to document
      const fontSizeMap = {
        small: "14px",
        medium: "16px",
        large: "18px",
        "extra-large": "20px",
      };

      document.documentElement.style.fontSize = fontSizeMap[size];

      // Store preference
      localStorage.setItem("accessibility-font-size", size);
    },
    [],
  );

  // High contrast toggle
  const toggleHighContrast = useCallback(() => {
    const newHighContrast = !state.highContrast;
    setState((prev) => ({ ...prev, highContrast: newHighContrast }));

    if (newHighContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }

    localStorage.setItem(
      "accessibility-high-contrast",
      String(newHighContrast),
    );
  }, [state.highContrast]);

  // Skip to content functionality
  const skipToContent = useCallback(
    (targetId: string) => {
      const target = document.getElementById(targetId);
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        announce(`Skipped to ${target.getAttribute("aria-label") || targetId}`);
      }
    },
    [announce],
  );

  // Focus management
  const manageFocus = useCallback(
    (element: HTMLElement | null) => {
      if (element && state.keyboardNavigation) {
        element.focus();
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    },
    [state.keyboardNavigation],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboardShortcuts = (e: KeyboardEvent) => {
      // Alt + 1: Skip to main content
      if (e.altKey && e.key === "1") {
        e.preventDefault();
        skipToContent("main-content");
      }

      // Alt + 2: Skip to navigation
      if (e.altKey && e.key === "2") {
        e.preventDefault();
        skipToContent("main-navigation");
      }

      // Alt + 3: Skip to footer
      if (e.altKey && e.key === "3") {
        e.preventDefault();
        skipToContent("footer");
      }

      // Ctrl + Plus: Increase font size
      if (e.ctrlKey && e.key === "+") {
        e.preventDefault();
        const sizes: AccessibilityPreferences["fontSize"][] = [
          "small",
          "medium",
          "large",
          "extra-large",
        ];
        const currentIndex = sizes.indexOf(state.fontSize);
        if (currentIndex < sizes.length - 1) {
          setFontSize(sizes[currentIndex + 1]);
          announce(`Font size increased to ${sizes[currentIndex + 1]}`);
        }
      }

      // Ctrl + Minus: Decrease font size
      if (e.ctrlKey && e.key === "-") {
        e.preventDefault();
        const sizes: AccessibilityPreferences["fontSize"][] = [
          "small",
          "medium",
          "large",
          "extra-large",
        ];
        const currentIndex = sizes.indexOf(state.fontSize);
        if (currentIndex > 0) {
          setFontSize(sizes[currentIndex - 1]);
          announce(`Font size decreased to ${sizes[currentIndex - 1]}`);
        }
      }
    };

    document.addEventListener("keydown", handleKeyboardShortcuts);
    return () =>
      document.removeEventListener("keydown", handleKeyboardShortcuts);
  }, [state.fontSize, setFontSize, skipToContent, announce]);

  // Load saved preferences
  useEffect(() => {
    const savedFontSize = localStorage.getItem(
      "accessibility-font-size",
    ) as AccessibilityPreferences["fontSize"];
    const savedHighContrast =
      localStorage.getItem("accessibility-high-contrast") === "true";

    if (savedFontSize) {
      setFontSize(savedFontSize);
    }

    if (savedHighContrast) {
      toggleHighContrast();
    }
  }, [setFontSize, toggleHighContrast]);

  return {
    ...state,
    announce,
    setFontSize,
    toggleHighContrast,
    skipToContent,
    manageFocus,
  };
};

// Accessibility utilities
export const a11yUtils = {
  // Generate unique IDs for form elements
  generateId: (prefix: string = "a11y") =>
    `${prefix}-${Math.random().toString(36).substr(2, 9)}`,

  // Check if element is focusable
  isFocusable: (element: HTMLElement): boolean => {
    const focusableElements = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ];

    return focusableElements.some((selector) => element.matches(selector));
  },

  // Get all focusable elements within a container
  getFocusableElements: (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(", ");

    return Array.from(container.querySelectorAll(focusableSelectors));
  },

  // Trap focus within a container (useful for modals)
  trapFocus: (container: HTMLElement) => {
    const focusableElements = a11yUtils.getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    // Return cleanup function
    return () => container.removeEventListener("keydown", handleKeyDown);
  },
};

export default useAccessibility;
