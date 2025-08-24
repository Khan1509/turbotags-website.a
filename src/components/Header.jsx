import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const NavLink = React.memo(({ to, children, isExternal = false, ariaLabel, ...props }) => (
  <Link 
    to={to} 
    className="text-gray-800 transition hover:text-tt-dark-violet font-medium focus:outline-none focus:ring-2 focus:ring-tt-medium-violet focus:ring-opacity-50 rounded px-2 py-1"
    target={isExternal ? '_blank' : '_self'}
    rel={isExternal ? 'noopener noreferrer' : ''}
    aria-label={ariaLabel}
    {...props}
  >
    {children}
  </Link>
));

const MobileNavLink = React.memo(({ to, children, onClick, isExternal = false, ariaLabel }) => (
  <Link 
    to={to} 
    onClick={onClick} 
    className="block w-full py-4 text-center text-xl transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
    target={isExternal ? '_blank' : '_self'}
    rel={isExternal ? 'noopener noreferrer' : ''}
    aria-label={ariaLabel}
  >
    {children}
  </Link>
));

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header 
      className="text-center px-4 md:px-8 py-4 sticky top-0 bg-gray-50/80 backdrop-blur-sm z-40"
      role="banner"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-tt-medium-violet focus:ring-opacity-50 rounded px-2 py-1"
            aria-label="TurboTags home page - AI-powered tag and hashtag generator"
          >
            <img 
              src="/favicon.svg" 
              alt="TurboTags Logo" 
              className="w-10 h-10 md:w-12 md:h-12 transition-transform hover:animate-pulse"
              width="48"
              height="48"
            />
            <h1 className="text-4xl md:text-5xl font-extrabold text-tt-dark-violet leading-tight transition-transform hover:scale-105">
              TurboTags
            </h1>
          </Link>
          
          <nav 
            className="hidden lg:flex items-center space-x-5"
            role="navigation"
            aria-label="Main navigation"
          >
            <NavLink 
              to="/#home" 
              ariaLabel="Go to home section of TurboTags website"
            >
              Home
            </NavLink>
            <NavLink 
              to="/about" 
              ariaLabel="Learn more about TurboTags AI tag generator"
            >
              About
            </NavLink>
            <NavLink 
              to="/#why-choose" 
              ariaLabel="Discover TurboTags features and benefits"
            >
              Features
            </NavLink>
            <NavLink 
              to="/blog" 
              ariaLabel="Read TurboTags blog for social media growth tips"
            >
              Blog
            </NavLink>
            <a 
              href="https://ko-fi.com/turbotags1509" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-tt-dark-violet text-white px-4 py-2 rounded-lg flex items-center hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50" 
              aria-label="Support TurboTags development on Ko-fi platform"
            >
              <Heart className="mr-2 h-4 w-4" aria-hidden="true" /> 
              Support
            </a>
          </nav>
          
          <button 
            onClick={() => setIsMenuOpen(true)} 
            className="lg:hidden text-gray-800 focus:outline-none focus:ring-2 focus:ring-tt-medium-violet focus:ring-opacity-50 rounded p-1" 
            aria-label="Open mobile navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <Menu size={32} />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div 
          id="mobile-menu"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 h-full w-full bg-tt-dark-violet text-white z-50 flex flex-col items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <h2 id="mobile-menu-title" className="sr-only">Mobile Navigation Menu</h2>
          
          <button 
            onClick={closeMenu} 
            className="absolute top-5 right-5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded p-1" 
            aria-label="Close mobile navigation menu"
          >
            <X size={40} />
          </button>
          
          <nav 
            className="flex flex-col items-center w-full space-y-4"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <MobileNavLink 
              to="/#home" 
              onClick={closeMenu}
              ariaLabel="Go to home section of TurboTags website"
            >
              Home
            </MobileNavLink>
            <MobileNavLink 
              to="/about" 
              onClick={closeMenu}
              ariaLabel="Learn more about TurboTags AI tag generator"
            >
              About
            </MobileNavLink>
            <MobileNavLink 
              to="/#why-choose" 
              onClick={closeMenu}
              ariaLabel="Discover TurboTags features and benefits"
            >
              Features
            </MobileNavLink>
            <MobileNavLink 
              to="/blog" 
              onClick={closeMenu}
              ariaLabel="Read TurboTags blog for social media growth tips"
            >
              Blog
            </MobileNavLink>
            <MobileNavLink 
              to="/legal/privacy" 
              onClick={closeMenu}
              ariaLabel="Read TurboTags privacy policy and data handling"
            >
              Privacy
            </MobileNavLink>
            <MobileNavLink 
              to="/legal/terms" 
              onClick={closeMenu}
              ariaLabel="Read TurboTags terms of service and usage conditions"
            >
              Terms
            </MobileNavLink>
            <MobileNavLink 
              to="/legal/disclaimer" 
              onClick={closeMenu}
              ariaLabel="Read TurboTags disclaimer and limitations"
            >
              Disclaimer
            </MobileNavLink>
            <a 
              href="https://ko-fi.com/turbotags1509" 
              onClick={closeMenu} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block w-full py-4 text-center text-xl transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
              aria-label="Support TurboTags development on Ko-fi platform"
            >
              Support Us
            </a>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default React.memo(Header);
