import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie_consent');
      // Migrate legacy 'true' value to 'accepted'
      if (consent === 'true') {
        localStorage.setItem('cookie_consent', 'accepted');
      }
      // Show banner only if no consent recorded
      if (!consent || consent === null) {
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Failed to access localStorage:', error);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('cookie_consent', 'accepted');
    } catch (error) {
      console.error('Failed to write to localStorage:', error);
    }
    setIsVisible(false);
  };

  const handleReject = () => {
    try {
      localStorage.setItem('cookie_consent', 'rejected');
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
          className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md text-slate-800 p-4 shadow-xl z-50 flex items-center justify-between flex-wrap gap-4 border-t border-slate-200"
          role="dialog"
          aria-labelledby="cookie-consent-title"
        >
          <div className="flex items-center">
            <Cookie className="h-6 w-6 mr-3 text-yellow-400" />
            <p id="cookie-consent-title" className="text-sm">
              We use cookies to improve your experience. By using our site, you agree to our use of cookies.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAccept}
              className="bg-[#475569] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#334155] transition-colors border border-[#475569]"
            >
              Accept
            </button>
            <button
              onClick={handleReject}
              className="bg-transparent text-slate-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-black/5 transition-colors border border-slate-300"
            >
              Reject
            </button>
            <button onClick={() => setIsVisible(false)} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Close cookie consent banner">
                <X className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
