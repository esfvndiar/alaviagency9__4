import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card" | "avatar" | "button";
  width?: string | number;
  height?: string | number;
  animation?: boolean;
}

const SkeletonLoader: React.FC<SkeletonProps> = ({
  className = "",
  variant = "rectangular",
  width,
  height,
  animation = true,
}) => {
  const baseClasses = `${animation ? "animate-pulse" : ""} bg-gray-200 dark:bg-gray-700`;

  const getVariantClasses = () => {
    switch (variant) {
      case "text":
        return "h-4 rounded";
      case "circular":
        return "rounded-full";
      case "card":
        return "rounded-xl overflow-hidden";
      case "avatar":
        return "rounded-full w-12 h-12";
      case "button":
        return "rounded-full h-10";
      case "rectangular":
      default:
        return "rounded";
    }
  };

  const variantClasses = getVariantClasses();
  const styles: React.CSSProperties = {
    width:
      width !== undefined
        ? typeof width === "number"
          ? `${width}px`
          : width
        : undefined,
    height:
      height !== undefined
        ? typeof height === "number"
          ? `${height}px`
          : height
        : undefined,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={styles}
      aria-hidden="true"
    />
  );
};

export const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden w-72 h-[500px]">
    <SkeletonLoader variant="rectangular" height={280} className="w-full" />
    <div className="p-4 space-y-3">
      <SkeletonLoader variant="text" width="70%" />
      <SkeletonLoader variant="text" width="40%" />
      <div className="pt-2">
        <SkeletonLoader
          variant="text"
          width="100%"
          height={8}
          className="mb-2"
        />
        <SkeletonLoader
          variant="text"
          width="100%"
          height={8}
          className="mb-2"
        />
        <SkeletonLoader variant="text" width="60%" height={8} />
      </div>
    </div>
  </div>
);

export const SkeletonValueCard: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-[300px]">
    <SkeletonLoader
      variant="circular"
      width={50}
      height={50}
      className="mb-4"
    />
    <SkeletonLoader variant="text" width="60%" className="mb-3" />
    <div className="space-y-2">
      <SkeletonLoader variant="text" width="100%" />
      <SkeletonLoader variant="text" width="100%" />
      <SkeletonLoader variant="text" width="80%" />
    </div>
  </div>
);

export default SkeletonLoader;
