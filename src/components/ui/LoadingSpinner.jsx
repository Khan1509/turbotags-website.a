import React from 'react';

const sizes = {
  small: 'w-6 h-6 border-2',
  medium: 'w-10 h-10 border-4',
  large: 'w-16 h-16 border-4',
};

const LoadingSpinner = ({ size = 'medium', ariaLabel = 'Loading...' }) => {
  return (
    <div
      className={`animate-spin rounded-full border-gray-300 border-t-tt-primary ${sizes[size]}`}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

export default LoadingSpinner;
