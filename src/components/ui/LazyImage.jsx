import React, { useState, useRef, useEffect, useCallback } from 'react';

// Optimized placeholder with better compression
const DEFAULT_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmM2Y0ZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+';

const LazyImage = React.memo(({
  src,
  alt,
  className = '',
  placeholder = DEFAULT_PLACEHOLDER,
  threshold = 0.1,
  rootMargin = '100px',
  sizes,
  srcSet,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef(null);
  const observerRef = useRef(null);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true); // Still set loaded to remove loading state
  }, []);

  useEffect(() => {
    const imageElement = imageRef.current;

    if (!imageElement || !('IntersectionObserver' in window)) {
      // Fallback for browsers without IntersectionObserver
      setImageSrc(src);
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setImageSrc(src);
          observerRef.current?.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current.observe(imageElement);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [src, threshold, rootMargin]);

  // Reset states when src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setImageSrc(placeholder);
  }, [src, placeholder]);

  return (
    <img
      ref={imageRef}
      src={imageSrc}
      alt={alt}
      sizes={sizes}
      srcSet={srcSet}
      className={`transition-opacity duration-300 will-change-auto ${
        isLoaded ? 'opacity-100' : 'opacity-50'
      } ${hasError ? 'bg-gray-200' : ''} ${className}`}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
});

export default LazyImage;
