import React, { useState, useEffect, useRef, useCallback } from 'react';
import SkeletonLoader from './SkeletonLoader';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  onLoad?: () => void;
  blurDataURL?: string;
  quality?: number;
  fetchPriority?: 'high' | 'low' | 'auto';
  sizes?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  objectFit = 'cover',
  priority = false,
  onLoad,
  blurDataURL,
  quality = 80,
  fetchPriority = 'auto',
  sizes = '100vw',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Generate WebP source if the original is jpg/jpeg/png
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const avifSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.avif');
  
  // Generate low quality placeholder for blur-up effect
  const placeholderSrc = blurDataURL || src.includes('?') 
    ? `${src}&quality=10&w=50` 
    : `${src}?quality=10&w=50`;
  
  // Add quality parameter to image URLs if provided
  const optimizedSrc = quality && quality < 100 && !src.includes('quality=') 
    ? `${src}${src.includes('?') ? '&' : '?'}quality=${quality}` 
    : src;
  
  const optimizedWebpSrc = quality && quality < 100 && !webpSrc.includes('quality=')
    ? `${webpSrc}${webpSrc.includes('?') ? '&' : '?'}quality=${quality}`
    : webpSrc;
    
  const optimizedAvifSrc = quality && quality < 100 && !avifSrc.includes('quality=')
    ? `${avifSrc}${avifSrc.includes('?') ? '&' : '?'}quality=${quality}`
    : avifSrc;
  
  // Handle image load event
  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
    if (onLoad) onLoad();
    
    // Report performance metrics
    try {
      if (window.performance && 
          typeof window.performance.getEntriesByName === 'function') {
        const entries = performance.getEntriesByName(optimizedSrc);
        const imgPerf = entries && entries.length > 0 ? entries[0] : null;
        
        if (imgPerf && 'duration' in imgPerf) {
          // Report to analytics or console for debugging
          if (process.env.NODE_ENV === 'development') {
            console.debug('Image loaded:', {
              src: optimizedSrc,
              duration: imgPerf.duration,
              transferSize: ('transferSize' in imgPerf) 
                ? (imgPerf as PerformanceResourceTiming).transferSize 
                : 'unknown',
            });
          }
        }
      }
    } catch (error) {
      // Silently catch any errors from performance API to avoid breaking the app
      console.debug('Performance measurement error:', error);
    }
  }, [optimizedSrc, onLoad]);
  
  // Handle image error
  const handleImageError = useCallback(() => {
    setIsError(true);
    console.error(`Failed to load image: ${src}`);
  }, [src]);
  
  // Reset state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
  }, [src]);

  // Add support for native lazy loading but use Intersection Observer as fallback
  useEffect(() => {
    // Only use IntersectionObserver if browser doesn't support native lazy loading
    // or if this is a priority image
    if (!priority && imgRef.current && !('loading' in HTMLImageElement.prototype)) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && imgRef.current) {
              // Set the real src when the image is in viewport
              imgRef.current.src = optimizedSrc;
              observer.unobserve(imgRef.current);
            }
          });
        },
        { 
          rootMargin: '200px 0px', // Start loading when image is 200px from viewport
          threshold: 0.01 // Trigger when at least 1% of the image is visible
        }
      );
      
      observer.observe(imgRef.current);
      
      // Store a reference to the current image element for cleanup
      const currentImgRef = imgRef.current;
      
      return () => {
        if (currentImgRef) observer.unobserve(currentImgRef);
      };
    }
  }, [src, priority, optimizedSrc]);
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : 'auto' }}
    >
      {!isLoaded && !isError && (
        <div className="absolute inset-0 z-0">
          <SkeletonLoader />
        </div>
      )}
      
      {isError ? (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
          <span>Image not available</span>
        </div>
      ) : (
        <picture>
          {/* AVIF format for browsers that support it */}
          <source 
            srcSet={optimizedAvifSrc}
            type="image/avif" 
            sizes={sizes}
          />
          
          {/* WebP format for browsers that support it */}
          <source 
            srcSet={optimizedWebpSrc}
            type="image/webp" 
            sizes={sizes}
          />
          
          {/* Original format as fallback */}
          <img
            ref={imgRef}
            src={priority ? optimizedSrc : placeholderSrc}
            alt={alt}
            width={width}
            height={height}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading={priority ? 'eager' : 'lazy'}
            {...(typeof document !== 'undefined' && 'fetchPriority' in document.createElement('img')
              ? { fetchpriority: fetchPriority }
              : {})}
            decoding="async"
            sizes={sizes}
            className={`w-full h-full transition-opacity duration-300 ${objectFit ? `object-${objectFit}` : 'object-cover'} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
              filter: !isLoaded && !isError ? 'blur(10px)' : 'none',
              transition: 'filter 0.3s ease-out, opacity 0.3s ease-out'
            }}
          />
        </picture>
      )}
    </div>
  );
};

export default OptimizedImage;
