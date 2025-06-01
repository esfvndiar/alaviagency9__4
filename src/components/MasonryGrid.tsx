import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../hooks/use-theme";

interface MasonryGridProps {
  children: React.ReactNode[];
  columns?: number;
  spacing?: number;
  className?: string;
  animateEntrance?: boolean;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({
  children,
  columns = 3,
  spacing = 16,
  className = "",
  animateEntrance = true,
}) => {
  const { theme } = useTheme();
  const [renderedItems, setRenderedItems] = useState<React.ReactNode[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);

  // Responsive columns
  const [responsiveColumns, setResponsiveColumns] = useState(columns);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setResponsiveColumns(1);
      } else if (window.innerWidth < 768) {
        setResponsiveColumns(2);
      } else {
        setResponsiveColumns(columns);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [columns]);

  useEffect(() => {
    // Initialize visibility state for animations
    setVisibleItems(Array(children.length).fill(false));

    // Stagger the visibility of items for animation
    if (animateEntrance) {
      children.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, 100 * index);
      });
    } else {
      setVisibleItems(Array(children.length).fill(true));
    }
  }, [children.length, animateEntrance, theme, children]);

  useEffect(() => {
    // Reset the rendered items when columns change
    const newRenderedItems: React.ReactNode[] = [];
    const columnHeights = Array(responsiveColumns).fill(0);

    // Distribute children among columns
    children.forEach((child, index) => {
      // Find the column with the smallest height
      const shortestColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights),
      );

      // Calculate position
      const xPos = shortestColumnIndex * (100 / responsiveColumns);
      const yPos = columnHeights[shortestColumnIndex];

      // Create a positioned item
      const item = (
        <div
          key={index}
          className={`absolute transition-all duration-700 ease-in-out ${
            visibleItems[index]
              ? "opacity-100 transform-none"
              : "opacity-0 translate-y-8"
          }`}
          style={{
            left: `${xPos}%`,
            top: `${yPos}px`,
            width: `calc(${100 / responsiveColumns}% - ${(spacing * (responsiveColumns - 1)) / responsiveColumns}px)`,
            padding: `${spacing / 2}px`,
          }}
        >
          {child}
        </div>
      );

      // Update the column height (estimate based on content)
      const estimatedHeight = 300 + spacing; // Adjust this based on your content
      columnHeights[shortestColumnIndex] += estimatedHeight;

      newRenderedItems.push(item);
    });

    setRenderedItems(newRenderedItems);

    // After rendering, adjust the container height to fit all items
    const maxColumnHeight = Math.max(...columnHeights);
    if (gridRef.current) {
      gridRef.current.style.height = `${maxColumnHeight}px`;
    }
  }, [children, responsiveColumns, spacing, visibleItems, gridRef]);

  return (
    <div
      ref={gridRef}
      className={`relative w-full ${className}`}
      style={{ minHeight: "200px" }}
    >
      {renderedItems}
    </div>
  );
};

export default MasonryGrid;
