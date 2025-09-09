import React, { useState, useEffect, useRef } from 'react';

const LazyImage = ({ src, alt, className, ...props }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
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
        { rootMargin: '100px' }
      );
      observer.observe(imageRef.current);
    }
    return () => {
      if (observer && imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [src]);

  const handleError = () => {
    setHasError(true);
  };

  const placeholderSrc = `https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/e2e8f0/64748b?text=Image+Not+Found`;

  return (
    <img
      ref={imageRef}
      src={hasError ? placeholderSrc : imageSrc || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
      alt={alt}
      className={`${className} ${!imageSrc && 'bg-gray-200'}`}
      onError={handleError}
      {...props}
    />
  );
};

export default LazyImage;
