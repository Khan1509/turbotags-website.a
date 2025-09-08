import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToAnchor = () => {
  const location = useLocation();
  const lastHash = useRef('');

  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    try {
      if (location.hash) {
        lastHash.current = location.hash.slice(1);
      }

      if (lastHash.current) {
        setTimeout(() => {
          try {
            const element = document.getElementById(lastHash.current);
            if (element && element.scrollIntoView) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              lastHash.current = '';
            }
          } catch (scrollError) {
            console.warn('Scroll to element failed:', scrollError);
          }
        }, 100);
      } else {
        try {
          window.scrollTo(0, 0);
        } catch (scrollError) {
          console.warn('Scroll to top failed:', scrollError);
        }
      }
    } catch (error) {
      console.warn('ScrollToAnchor error:', error);
    }
  }, [location]);

  return null;
};

export default ScrollToAnchor;
