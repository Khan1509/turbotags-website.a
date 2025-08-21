import React, { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const NavLink = React.memo(({ href, children, isExternal = false }) => (
  <a 
    href={href} 
    className="text-gray-800 transition hover:text-tt-dark-violet font-medium"
    target={isExternal ? '_blank' : '_self'}
    rel={isExternal ? 'noopener noreferrer' : ''}
  >
    {children}
  </a>
));

const MobileNavLink = React.memo(({ href, children, onClick, isExternal = false }) => (
  <a 
    href={href} 
    onClick={onClick} 
    className="block w-full py-4 text-center text-xl transition hover:bg-white/10"
    target={isExternal ? '_blank' : '_self'}
    rel={isExternal ? 'noopener noreferrer' : ''}
  >
    {children}
  </a>
));

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // Changed to lg breakpoint
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
          <a href="/" className="flex items-center gap-3">
            <img src="/favicon.svg" alt="TurboTags Logo" className="w-10 h-10 md:w-12 md:h-12 transition-transform hover:animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-tt-dark-violet leading-tight transition-transform hover:scale-105">
              TurboTags
            </h1>
          </a>
          
          <nav className="hidden lg:flex items-center space-x-5">
            <NavLink href="#home">Home</NavLink>
            <NavLink href="#why-choose">Features</NavLink>
            <NavLink href="/blog/index.html">Blog</NavLink>
            <NavLink href="/legal/privacy.html">Privacy</NavLink>
            <NavLink href="/legal/terms.html">Terms</NavLink>
            <NavLink href="/legal/disclaimer.html">Disclaimer</NavLink>
            <a href="https://ko-fi.com/turbotags1509" target="_blank" rel="noopener noreferrer" className="bg-tt-dark-violet text-white px-4 py-2 rounded-lg flex items-center hover:opacity-90 transition" aria-label="Support us on Ko-fi">
              <Heart className="mr-2 h-4 w-4" /> Support
            </a>
          </nav>
          
          <button onClick={() => setIsMenuOpen(true)} className="lg:hidden text-gray-800" aria-label="Open menu">
            <Menu size={32} />
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
          <button onClick={closeMenu} className="absolute top-5 right-5" aria-label="Close menu">
            <X size={40} />
          </button>
          <nav className="flex flex-col items-center w-full space-y-4">
            <MobileNavLink href="#home" onClick={closeMenu}>Home</MobileNavLink>
            <MobileNavLink href="#why-choose" onClick={closeMenu}>Features</MobileNavLink>
            <MobileNavLink href="/blog/index.html" onClick={closeMenu}>Blog</MobileNavLink>
            <MobileNavLink href="/legal/privacy.html" onClick={closeMenu}>Privacy</MobileNavLink>
            <MobileNavLink href="/legal/terms.html" onClick={closeMenu}>Terms</MobileNavLink>
            <MobileNavLink href="/legal/disclaimer.html" onClick={closeMenu}>Disclaimer</MobileNavLink>
            <MobileNavLink href="https://ko-fi.com/turbotags1509" onClick={closeMenu} isExternal={true}>
              Support Us
            </MobileNavLink>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default React.memo(Header);
