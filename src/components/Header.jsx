import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const NavLink = React.memo(({ to, children, isExternal = false, ariaLabel, ...props }) => (
  <Link
    to={to}
    className="text-gray-800 transition hover:text-tt-dark-violet font-medium focus:outline-none focus:ring-2 focus:ring-tt-dark-violet focus:ring-offset-2 rounded-md px-2 py-1"
    target={isExternal ? '_blank' : '_self'}
    rel={isExternal ? 'noopener noreferrer' : ''}
    aria-label={ariaLabel || children}
    {...props}
  >
    {children}
  </Link>
));

const MobileNavLink = React.memo(({ to, children, onClick, isExternal = false, ariaLabel }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block w-full py-4 text-center text-xl transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-tt-dark-violet rounded-md"
    target={isExternal ? '_blank' : '_self'}
    rel={isExternal ? 'noopener noreferrer' : ''}
    aria-label={ariaLabel || children}
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
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="text-center px-4 md:px-8 py-4 sticky top-0 bg-gray-50/80 backdrop-blur-sm z-40">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-tt-dark-violet focus:ring-offset-2 rounded-lg p-2" aria-label="TurboTags - Go to homepage">
            <img src="/favicon.svg" alt="TurboTags Logo" className="w-10 h-10 md:w-12 md:h-12 transition-transform hover:animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-tt-dark-violet leading-tight transition-transform hover:scale-105">
              TurboTags
            </h1>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-5" role="navigation" aria-label="Main navigation">
            <NavLink to="/" ariaLabel="Go to homepage">Home</NavLink>
            <NavLink to="/about" ariaLabel="Learn about TurboTags">About</NavLink>
            <NavLink to="/features" ariaLabel="Explore TurboTags features">Features</NavLink>
            <NavLink to="/blog" ariaLabel="Read our blog posts">Blog</NavLink>
            <a href="https://ko-fi.com/turbotags1509" target="_blank" rel="noopener noreferrer" className="bg-tt-dark-violet text-white px-4 py-2 rounded-lg flex items-center hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-tt-dark-violet" aria-label="Support TurboTags on Ko-fi - Opens in new tab">
              <Heart className="mr-2 h-4 w-4" aria-hidden="true" /> Support
            </a>
          </nav>
          
          <button onClick={() => setIsMenuOpen(true)} className="lg:hidden text-gray-800 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-tt-dark-violet focus:ring-offset-2" aria-label="Open navigation menu" aria-expanded={isMenuOpen}>
            <Menu size={32} aria-hidden="true" />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 h-full w-full bg-tt-dark-violet text-white z-50 flex flex-col items-center justify-center"
        >
          <button onClick={closeMenu} className="absolute top-5 right-5 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-tt-dark-violet" aria-label="Close navigation menu">
            <X size={40} aria-hidden="true" />
          </button>
          <nav className="flex flex-col items-center w-full space-y-4" role="navigation" aria-label="Mobile navigation">
            <MobileNavLink to="/" onClick={closeMenu} ariaLabel="Go to homepage">Home</MobileNavLink>
            <MobileNavLink to="/about" onClick={closeMenu} ariaLabel="Learn about TurboTags">About</MobileNavLink>
            <MobileNavLink to="/features" onClick={closeMenu} ariaLabel="Explore TurboTags features">Features</MobileNavLink>
            <MobileNavLink to="/blog" onClick={closeMenu} ariaLabel="Read our blog posts">Blog</MobileNavLink>
            <MobileNavLink to="/legal/privacy" onClick={closeMenu} ariaLabel="Read our privacy policy">Privacy Policy</MobileNavLink>
            <MobileNavLink to="/legal/terms" onClick={closeMenu} ariaLabel="Read our terms of service">Terms of Service</MobileNavLink>
            <MobileNavLink to="/legal/disclaimer" onClick={closeMenu} ariaLabel="Read our disclaimer">Disclaimer</MobileNavLink>
            <a href="https://ko-fi.com/turbotags1509" onClick={closeMenu} target="_blank" rel="noopener noreferrer" className="block w-full py-4 text-center text-xl transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-tt-dark-violet rounded-md" aria-label="Support TurboTags on Ko-fi - Opens in new tab">
              Support Us on Ko-fi
            </a>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default React.memo(Header);
