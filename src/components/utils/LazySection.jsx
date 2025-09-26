import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../ui/LoadingSpinner';

const LazySection = ({ 
  children, 
  threshold = 0.15, 
  rootMargin = '100px',
  fallback = <LoadingSpinner size="medium" ariaLabel="Loading section..." />,
  className = '',
  minHeight = '200px',
  animationType = 'fadeUp', // 'fadeUp', 'fadeIn', 'slideLeft', 'slideRight'
  delay = 0,
  staggerChildren = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          // Add slight delay before triggering animation for better effect
          setTimeout(() => setIsInView(true), delay);
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
  }, [threshold, rootMargin, hasLoaded, delay]);

  // Animation variants for different reveal effects
  const animationVariants = {
    fadeUp: {
      hidden: { opacity: 0, y: 50, scale: 0.95 },
      visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          duration: 0.6,
          ease: [0.25, 0.25, 0, 1],
          staggerChildren: staggerChildren ? 0.1 : 0
        }
      }
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: {
          duration: 0.5,
          staggerChildren: staggerChildren ? 0.1 : 0
        }
      }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 80 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration: 0.6,
          ease: [0.25, 0.25, 0, 1],
          staggerChildren: staggerChildren ? 0.1 : 0
        }
      }
    },
    slideRight: {
      hidden: { opacity: 0, x: -80 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration: 0.6,
          ease: [0.25, 0.25, 0, 1],
          staggerChildren: staggerChildren ? 0.1 : 0
        }
      }
    }
  };

  return (
    <motion.div 
      ref={sectionRef} 
      className={className}
      style={{ minHeight: hasLoaded ? 'auto' : minHeight }}
      variants={animationVariants[animationType]}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {isVisible ? children : fallback}
    </motion.div>
  );
};

export default LazySection;
