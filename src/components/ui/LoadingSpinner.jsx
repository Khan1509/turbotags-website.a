import React from 'react';

const LoadingSpinner = ({ size = 'medium', className = '', ariaLabel = 'Loading content...' }) => {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-12 w-12 border-2',
    large: 'h-16 w-16 border-3'
  };

  return (
    <div className={`flex justify-center items-center py-10 ${className}`}>
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-b-tt-dark-violet border-t-transparent border-l-transparent border-r-transparent will-change-transform`}
        role="status"
        aria-label={ariaLabel}
        aria-live="polite"
      >
        <span className="sr-only">{ariaLabel}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
