import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomNavLink = React.memo(({ to, children, ariaLabel, ...props }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `text-brand-dark-grey transition hover:text-brand-blue font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 rounded-md px-2 py-1 ${
        isActive ? 'text-brand-blue' : ''
      }`
    }
    aria-label={ariaLabel || children}
    {...props}
  >
    {children}
  </NavLink>
));

const MobileNavLink = React.memo(({ to, children, onClick, ariaLabel }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block w-full py-4 text-center text-xl transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-dark-blue rounded-md"
    aria-label={ariaLabel || children}
  >
    {children}
  </Link>
));

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="text-center px-4 md:px-8 py-4 sticky top-0 bg-brand-light-grey/80 backdrop-blur-sm z-40">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-brand-dark-blue focus:ring-offset-2 rounded-lg p-2" aria-label="TurboTags - Go to homepage">
            <motion.img 
              src="/favicon.svg" 
              alt="TurboTags Logo" 
              className="w-10 h-10 md:w-12 md:h-12"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            />
            <div className="text-4xl md:text-5xl font-extrabold text-brand-dark-blue leading-tight transition-transform hover:scale-105">
              TurboTags
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-5" role="navigation" aria-label="Main navigation">
            <CustomNavLink to="/" ariaLabel="Go to homepage">Home</CustomNavLink>
            <CustomNavLink to="/features" ariaLabel="Go to Features page">Features</CustomNavLink>
            <CustomNavLink to="/blog" ariaLabel="Go to Blog">Blog</CustomNavLink>
            <a href="https://ko-fi.com/turbotags1509" target="_blank" rel="noopener noreferrer" className="bg-brand-dark-blue text-white px-4 py-2 rounded-lg flex items-center hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-dark-blue" aria-label="Support TurboTags on Ko-fi - Opens in new tab">
              <Heart className="mr-2 h-4 w-4" aria-hidden="true" /> Support
            </a>
          </nav>
          
          <button onClick={() => setIsMenuOpen(true)} className="lg:hidden text-brand-dark-grey p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-dark-blue focus:ring-offset-2" aria-label="Open navigation menu" aria-expanded={isMenuOpen}>
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
          className="fixed top-0 left-0 h-full w-full bg-brand-dark-blue text-white z-50 flex flex-col items-center justify-center"
        >
          <button onClick={closeMenu} className="absolute top-5 right-5 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-dark-blue" aria-label="Close navigation menu">
            <X size={40} aria-hidden="true" />
          </button>
          <nav className="flex flex-col items-center w-full space-y-4" role="navigation" aria-label="Mobile navigation">
            <MobileNavLink to="/" onClick={closeMenu} ariaLabel="Go to homepage">Home</MobileNavLink>
            <MobileNavLink to="/features" onClick={closeMenu} ariaLabel="Go to Features page">Features</MobileNavLink>
            <MobileNavLink to="/blog" onClick={closeMenu} ariaLabel="Go to Blog">Blog</MobileNavLink>
            <MobileNavLink to="/#faq" onClick={closeMenu} ariaLabel="Go to FAQ section">FAQ</MobileNavLink>
            <a href="https://ko-fi.com/turbotags1509" onClick={closeMenu} target="_blank" rel="noopener noreferrer" className="block w-full py-4 text-center text-xl transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-dark-blue rounded-md" aria-label="Support TurboTags on Ko-fi - Opens in new tab">
              Support Us
            </a>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default React.memo(Header);
