import React, { useState, useRef, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  priority = false,
  sizes = '100vw',
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(priority ? src : null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef(null);

  // Generate responsive image sources with WebP support
  const generateSrcSet = (originalSrc) => {
    if (!originalSrc) return '';
    
    // For now, disable srcset generation for local images to avoid 404s
    // until we have a build process that generates the variants
    if (!originalSrc.startsWith('data:') && !originalSrc.startsWith('http')) {
      return originalSrc; // Return simple string for local images
    }
    
    // For external URLs and data URLs, return as-is
    return originalSrc;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // Skip lazy loading for priority images
    
    let observer;
    if (imageRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(imageRef.current);
            }
          });
        },
        { 
          rootMargin: '50px', // Load images 50px before they enter viewport
          threshold: 0.1 
        }
      );
      observer.observe(imageRef.current);
    }
    
    return () => {
      if (observer && imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Placeholder for loading state
  const placeholderSrc = `data:image/svg+xml;base64,${btoa(`
    <svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">Loading...</text>
    </svg>
  `)}`;

  // Error placeholder
  const errorPlaceholder = `data:image/svg+xml;base64,${btoa(`
    <svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#fef2f2"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#ef4444" text-anchor="middle" dy=".3em">Image not found</text>
    </svg>
  `)}`;

  const srcSetData = imageSrc ? generateSrcSet(imageSrc) : null;

  return (
    <div 
      ref={imageRef} 
      className={`relative w-full ${className}`}
      style={{ 
        aspectRatio: width && height ? `${width} / ${height}` : undefined
      }}
    >
      {/* WebP version with srcset for modern browsers */}
      {imageSrc && srcSetData && typeof srcSetData === 'object' && (
        <picture>
          <source
            srcSet={srcSetData.webpSrcSet}
            sizes={sizes}
            type="image/webp"
          />
          <source
            srcSet={srcSetData.fallbackSrcSet}
            sizes={sizes}
          />
          <img
            src={hasError ? errorPlaceholder : (imageSrc || placeholderSrc)}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            width={width}
            height={height}
            {...props}
          />
        </picture>
      )}
      
      {/* Fallback for simple images */}
      {imageSrc && (!srcSetData || typeof srcSetData === 'string') && (
        <img
          src={hasError ? errorPlaceholder : (imageSrc || placeholderSrc)}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          width={width}
          height={height}
          {...props}
        />
      )}
      
      {/* Loading placeholder */}
      {!imageSrc && (
        <img
          src={placeholderSrc}
          alt={alt}
          className="w-full h-full object-cover"
          width={width}
          height={height}
          {...props}
        />
      )}
      
      {/* Loading overlay */}
      {imageSrc && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;