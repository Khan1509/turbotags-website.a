import React, { useState, useEffect, useRef } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';

const LazySection = ({ 
  children, 
  threshold = 0.1, 
  rootMargin = '100px',
  fallback = <LoadingSpinner size="medium" ariaLabel="Loading section..." />,
  className = '',
  minHeight = '200px' // Add minHeight prop to reserve space
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
      observer.disconnect();
    };
  }, [threshold, rootMargin, hasLoaded]);

  return (
    <div 
      ref={sectionRef} 
      className={className} 
      style={{ minHeight: hasLoaded ? 'auto' : minHeight }}
    >
      {isVisible ? children : fallback}
    </div>
  );
};

export default LazySection;
