import React, { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "../hooks/use-theme";
import { debounce } from "@/lib/utils";
import OptimizedImage from "@/components/OptimizedImage";

interface StorySection {
  id: string;
  title: string;
  content: React.ReactNode;
  image?: string;
  imageAlt?: string;
  backgroundColor?: string;
  textColor?: string;
  align?: "left" | "right" | "center";
}

interface ScrollStoryProps {
  sections: StorySection[];
  className?: string;
}

const ScrollStory: React.FC<ScrollStoryProps> = ({
  sections,
  className = "",
}) => {
  const { isDarkTheme } = useTheme();
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Initialize refs array
  useEffect(() => {
    sectionRefs.current = sections.map(() => null);
  }, [sections]);

  // Debounced scroll handler to improve performance
  const handleScroll = useCallback(() => {
    const debouncedCheck = debounce(() => {
      if (!containerRef.current) return;

      // Check if the container is in view
      const containerRect = containerRef.current.getBoundingClientRect();
      const isContainerInView =
        containerRect.top < window.innerHeight && containerRect.bottom > 0;

      setIsInView(isContainerInView);

      if (!isContainerInView) return;

      // Find the section that is most visible in the viewport
      const viewportCenter = window.innerHeight / 2;

      let closestSection = 0;
      let closestDistance = Infinity;

      sectionRefs.current.forEach((section, index) => {
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = index;
        }
      });

      setActiveSection(closestSection);
    }, 100);

    debouncedCheck();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      className={`scroll-story ${isInView ? "in-view" : ""} ${className}`}
      style={{
        backgroundColor: isDarkTheme ? "#121212" : "#f8f9fa",
        color: isDarkTheme ? "#e0e0e0" : "#333333",
      }}
    >
      {/* Progress indicator */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="flex flex-col space-y-4">
          {sections.map((section, index) => (
            <button
              key={section.id}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeSection
                  ? "bg-primary scale-125"
                  : "bg-zinc-300 dark:bg-zinc-700 scale-100"
              }`}
              onClick={() => {
                const sectionEl = sectionRefs.current[index];
                if (sectionEl) {
                  sectionEl.scrollIntoView({ behavior: "smooth" });
                }
              }}
              aria-label={`Scroll to ${section.title}`}
            />
          ))}
        </div>
      </div>

      {/* Sections */}
      {sections.map((section, index) => {
        const isActive = index === activeSection;
        const isNext = index === activeSection + 1;
        const isPrev = index === activeSection - 1;

        // Determine animation classes based on position
        const animationClass = isActive
          ? "opacity-100 transform-none"
          : isNext
            ? "opacity-0 translate-y-16"
            : isPrev
              ? "opacity-0 -translate-y-16"
              : "opacity-0";

        return (
          <div
            key={section.id}
            ref={(el) => {
              sectionRefs.current[index] = el;
              return undefined;
            }}
            className={`min-h-screen flex items-center justify-center py-20 ${
              section.backgroundColor || ""
            }`}
            id={section.id}
          >
            <div className="container mx-auto px-6">
              <div
                className={`grid grid-cols-1 ${
                  section.image ? "lg:grid-cols-2" : ""
                } gap-12 items-center`}
              >
                {/* Text content */}
                <div
                  className={`${
                    section.align === "center"
                      ? "text-center mx-auto"
                      : section.align === "right" && !section.image
                        ? "ml-auto text-right"
                        : ""
                  } ${section.image && section.align === "right" ? "order-2" : ""}`}
                >
                  <div
                    className={`transition-all duration-700 ease-out ${
                      isInView ? animationClass : "opacity-0"
                    }`}
                  >
                    <h2
                      className={`text-fluid-2xl font-display font-bold mb-6 ${
                        section.textColor || "text-zinc-900 dark:text-white"
                      }`}
                    >
                      {section.title}
                    </h2>
                    <div
                      className={`text-fluid-base ${
                        section.textColor || "text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {section.content}
                    </div>
                  </div>
                </div>

                {/* Image */}
                {section.image && (
                  <div
                    className={`transition-all duration-700 delay-300 ease-out ${
                      isInView ? animationClass : "opacity-0"
                    } ${section.align === "right" ? "order-1" : ""}`}
                  >
                    <div className="relative rounded-xl overflow-hidden shadow-2xl">
                      <OptimizedImage
                        src={section.image}
                        alt={section.imageAlt || section.title}
                        className="w-full h-auto"
                        objectFit="cover"
                        quality={85}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScrollStory;
