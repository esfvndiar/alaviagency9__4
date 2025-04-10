import React, { useState, useEffect, useRef } from 'react';
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
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Generate WebP source if the original is jpg/jpeg/png
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  // Generate low quality placeholder for blur-up effect
  const placeholderSrc = blurDataURL || `${src}?quality=10&w=50`;
  
  // Add quality parameter to image URLs if provided
  const optimizedSrc = quality && quality < 100 && !src.includes('quality=') 
    ? `${src}${src.includes('?') ? '&' : '?'}quality=${quality}` 
    : src;
  
  const optimizedWebpSrc = quality && quality < 100 && !webpSrc.includes('quality=')
    ? `${webpSrc}${webpSrc.includes('?') ? '&' : '?'}quality=${quality}`
    : webpSrc;
  
  // Handle image load event
  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  // Handle image error
  const handleImageError = () => {
    setIsError(true);
    console.error(`Failed to load image: ${src}`);
  };
  
  // Reset state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
  }, [src]);

  // Implement intersection observer for lazy loading
  useEffect(() => {
    if (!priority && imgRef.current) {
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
        { rootMargin: '200px 0px' } // Start loading when image is 200px from viewport
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
          {/* WebP format for browsers that support it */}
          <source 
            srcSet={priority ? optimizedWebpSrc : undefined}
            data-srcset={!priority ? optimizedWebpSrc : undefined}
            type="image/webp" 
          />
          
          {/* Original format as fallback */}
          <img
            ref={imgRef}
            src={priority ? optimizedSrc : placeholderSrc}
            data-src={!priority ? optimizedSrc : undefined}
            alt={alt}
            width={width}
            height={height}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
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
