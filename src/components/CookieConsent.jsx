import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem('cookie_consent')) {
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Failed to access localStorage:', error);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('cookie_consent', 'true');
    } catch (error) {
      console.error('Failed to write to localStorage:', error);
    }
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 bg-[#5c6284]/95 backdrop-blur-md text-white p-4 shadow-xl z-50 flex items-center justify-between flex-wrap gap-4"
          role="dialog"
          aria-labelledby="cookie-consent-title"
        >
          <div className="flex items-center">
            <Cookie className="h-6 w-6 mr-3 text-yellow-400" />
            <p id="cookie-consent-title" className="text-sm">
              We use cookies to improve your experience. By using our site, you agree to our use of cookies.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleAccept}
              className="bg-tt-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-tt-primary-dark transition-colors"
            >
              Accept
            </button>
            <button onClick={() => setIsVisible(false)} className="p-2 rounded-full hover:bg-gray-700 transition-colors" aria-label="Close cookie consent banner">
                <X className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
