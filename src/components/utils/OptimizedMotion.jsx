import React from 'react';
import { motion } from 'framer-motion';

// Optimized motion variants for common use cases
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { 
    duration: 0.4, 
    ease: [0.25, 0.46, 0.45, 0.94] 
  }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 }
};

export const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { 
    duration: 0.3, 
    ease: "easeOut" 
  }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { 
    duration: 0.3, 
    ease: "easeOut" 
  }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Performance-optimized motion component
const OptimizedMotion = React.memo(({ 
  children, 
  variant = 'fadeInUp',
  className = '',
  viewport = { once: true, amount: 0.3 },
  ...motionProps 
}) => {
  const variants = {
    fadeInUp,
    fadeIn,
    slideInLeft,
    scaleIn
  };

  const selectedVariant = variants[variant] || fadeInUp;

  return (
    <motion.div
      className={`will-change-transform ${className}`}
      {...selectedVariant}
      viewport={viewport}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
});

OptimizedMotion.displayName = 'OptimizedMotion';

// Hook for reduced motion detection
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Performance-aware wrapper
export const PerformanceMotion = React.memo(({ children, fallback = null, ...props }) => {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return fallback || <div className={props.className}>{children}</div>;
  }

  return <OptimizedMotion {...props}>{children}</OptimizedMotion>;
});

PerformanceMotion.displayName = 'PerformanceMotion';

export default OptimizedMotion;
