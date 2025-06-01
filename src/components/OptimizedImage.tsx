import React, { useState, useEffect, useRef, useCallback } from "react";
import SkeletonLoader from "./SkeletonLoader";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  priority?: boolean;
  onLoad?: () => void;
  blurDataURL?: string;
  quality?: number;
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
  loading?: "lazy" | "eager";
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  objectFit = "cover",
  priority = false,
  onLoad,
  blurDataURL,
  quality = 80,
  fetchPriority = "auto",
  sizes = "100vw",
  loading,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>("");
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Detect browser support for modern formats
  const supportsWebP = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  }, []);

  const supportsAVIF = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL("image/avif").indexOf("data:image/avif") === 0;
  }, []);

  // Generate optimized sources
  const generateSources = useCallback(() => {
    const baseUrl = src.split("?")[0];
    const params = new URLSearchParams(src.split("?")[1] || "");

    if (quality < 100) {
      params.set("quality", quality.toString());
    }

    if (width) {
      params.set("w", width.toString());
    }

    const queryString = params.toString();
    const urlWithParams = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    return {
      avif: supportsAVIF()
        ? baseUrl.replace(/\.(jpg|jpeg|png|webp)$/i, ".avif") +
          (queryString ? `?${queryString}` : "")
        : null,
      webp: supportsWebP()
        ? baseUrl.replace(/\.(jpg|jpeg|png)$/i, ".webp") +
          (queryString ? `?${queryString}` : "")
        : null,
      original: urlWithParams,
      placeholder: blurDataURL || `${baseUrl}?quality=10&w=50&blur=10`,
    };
  }, [src, quality, width, blurDataURL, supportsAVIF, supportsWebP]);

  const sources = generateSources();

  // Handle image load event with performance tracking
  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
    if (onLoad) onLoad();

    // Performance tracking
    if (typeof window !== "undefined" && window.performance) {
      try {
        const resourceEntries = performance.getEntriesByName(currentSrc);

        if (resourceEntries.length > 0) {
          const entry = resourceEntries[0] as PerformanceResourceTiming;
          const loadTime = entry.responseEnd - entry.requestStart;

          // Report metrics in development
          if (process.env.NODE_ENV === "development") {
            console.debug("Image Performance:", {
              src: currentSrc,
              loadTime: `${loadTime.toFixed(2)}ms`,
              transferSize: entry.transferSize
                ? `${(entry.transferSize / 1024).toFixed(2)}KB`
                : "unknown",
              decodedBodySize: entry.decodedBodySize
                ? `${(entry.decodedBodySize / 1024).toFixed(2)}KB`
                : "unknown",
              compressionRatio:
                entry.transferSize && entry.decodedBodySize
                  ? `${((1 - entry.transferSize / entry.decodedBodySize) * 100).toFixed(1)}%`
                  : "unknown",
            });
          }
        }
      } catch (error) {
        console.debug("Performance measurement error:", error);
      }
    }
  }, [currentSrc, onLoad]);

  // Handle image error with fallback
  const handleImageError = useCallback(() => {
    setIsError(true);
    console.error(`Failed to load image: ${src}`);
  }, [src]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === "eager") {
      setCurrentSrc(sources.avif || sources.webp || sources.original);
      return;
    }

    const currentImgRef = imgRef.current;
    if (!currentImgRef) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSrc(sources.avif || sources.webp || sources.original);
            if (observerRef.current && currentImgRef) {
              observerRef.current.unobserve(currentImgRef);
            }
          }
        });
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      },
    );

    observerRef.current.observe(currentImgRef);

    return () => {
      if (observerRef.current && currentImgRef) {
        observerRef.current.unobserve(currentImgRef);
      }
    };
  }, [priority, loading, sources]);

  // Reset state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
    setCurrentSrc("");
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "auto",
        aspectRatio: width && height ? `${width}/${height}` : undefined,
      }}
    >
      {/* Loading skeleton */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 z-10">
          <SkeletonLoader />
        </div>
      )}

      {/* Error fallback */}
      {isError ? (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 min-h-[200px]">
          <div className="text-center">
            <div className="text-2xl mb-2">📷</div>
            <span className="text-sm">Image not available</span>
          </div>
        </div>
      ) : (
        <picture>
          {/* AVIF format for maximum compression */}
          {sources.avif && (
            <source srcSet={sources.avif} type="image/avif" sizes={sizes} />
          )}

          {/* WebP format for better compression */}
          {sources.webp && (
            <source srcSet={sources.webp} type="image/webp" sizes={sizes} />
          )}

          {/* Original format as fallback */}
          <img
            ref={imgRef}
            src={currentSrc || sources.placeholder}
            alt={alt}
            width={width}
            height={height}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading={loading || (priority ? "eager" : "lazy")}
            fetchPriority={fetchPriority}
            decoding="async"
            sizes={sizes}
            className={`w-full h-full transition-all duration-500 ease-out ${
              objectFit ? `object-${objectFit}` : "object-cover"
            } ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
            style={{
              filter:
                !isLoaded && !isError && currentSrc ? "blur(10px)" : "none",
              transform: isLoaded ? "scale(1)" : "scale(1.05)",
            }}
          />
        </picture>
      )}
    </div>
  );
};

export default OptimizedImage;
