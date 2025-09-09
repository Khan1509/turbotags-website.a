import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// A safe custom hook to use localStorage that handles SSR
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      }
    } catch (error) {
      console.error('LocalStorage error:', error);
    }
  }, [key]);

  const setValue = value => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (isClient && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('LocalStorage error:', error);
    }
  };

  return [storedValue, setValue];
};


const RatingWidget = () => {
  const [userRating, setUserRating] = useLocalStorage('userWebsiteRating', 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(userRating > 0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setHasRated(userRating > 0);
  }, [userRating]);

  const handleRating = (rate) => {
    if (!hasRated) {
      setUserRating(rate);
      setHasRated(true);
    }
  };

  const stars = Array(5).fill(0);

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="text-center">
        <div className="flex flex-col items-center">
          <h3 className="font-semibold text-gray-700 mb-2">Loading...</h3>
          <div className="flex items-center mb-2">
            {stars.map((_, index) => (
              <Star key={index} className="h-7 w-7 text-gray-300" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex flex-col items-center">
        <h3 className="font-semibold text-gray-700 mb-2">
          {hasRated ? "Thanks for your feedback!" : "Enjoying TurboTags? Rate us!"}
        </h3>
        <div className="flex items-center mb-2">
          {stars.map((_, index) => {
            const ratingValue = index + 1;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: hasRated ? 1 : 1.2 }}
                whileTap={{ scale: hasRated ? 1 : 0.9 }}
                onMouseEnter={() => !hasRated && setHoverRating(ratingValue)}
                onMouseLeave={() => !hasRated && setHoverRating(0)}
                onClick={() => handleRating(ratingValue)}
                className={`cursor-${hasRated ? 'default' : 'pointer'}`}
                aria-label={`Rate ${ratingValue} stars`}
              >
                <Star
                  className={`h-7 w-7 transition-colors ${
                    ratingValue <= (hoverRating || userRating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill={ratingValue <= (hoverRating || userRating) ? 'currentColor' : 'none'}
                />
              </motion.div>
            );
          })}
        </div>
        {hasRated && <p className="text-sm text-gray-500">You rated {userRating} out of 5 stars.</p>}
      </div>
      <AnimatePresence>
       {!hasRated && (
        <motion.blockquote 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-gray-600 italic max-w-3xl mx-auto mt-4"
        >
          "TurboTags has revolutionized my content process. The AI tags are spot-on and have significantly increased my reach."
          <cite className="not-italic font-semibold block mt-1">- Sarah M., Content Creator</cite>
        </motion.blockquote>
       )}
      </AnimatePresence>
    </div>
  );
};

export default RatingWidget;
