import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = value => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

const CookieConsent = () => {
  const [consent, setConsent] = useLocalStorage('cookieConsent', null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (consent === null) {
        setIsVisible(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [consent]);

  const handleAccept = () => {
    setConsent('accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    setConsent('rejected');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 bg-gray-800/90 text-white p-4 z-50 backdrop-blur-sm"
          role="dialog"
          aria-live="polite"
          aria-label="Cookie Consent"
        >
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-center sm:text-left">
              🍪 We use cookies to enhance your experience and analyze our traffic. <Link to="/legal#cookies" className="underline hover:text-gray-300">Read our cookie policy for details</Link>.
            </p>
            <div className="flex space-x-4 flex-shrink-0">
              <button onClick={handleAccept} className="bg-tt-dark-violet text-white px-4 py-2 rounded-lg text-sm hover:bg-tt-medium-violet transition">
                Accept All
              </button>
              <button onClick={handleReject} className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition">
                Reject
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
