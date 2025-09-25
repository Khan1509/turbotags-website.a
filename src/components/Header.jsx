import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomNavLink = React.memo(({ to, children, ariaLabel, ...props }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative z-10 text-slate-800 transition-colors duration-300 hover:text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 rounded-md px-4 py-2 ${
        isActive ? 'text-white nav-active' : ''
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
    className="block w-full py-4 text-center text-xl text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 rounded-md"
    aria-label={ariaLabel || children}
  >
    {children}
  </Link>
));

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pillStyle, setPillStyle] = useState({});
  const navRef = useRef(null);
  const location = useLocation();

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

  useEffect(() => {
    // Update pill position when route changes
    const updatePillPosition = () => {
      if (!navRef.current) return;
      
      const activeLink = navRef.current.querySelector('.nav-active');
      if (activeLink) {
        const navRect = navRef.current.getBoundingClientRect();
        const activeRect = activeLink.getBoundingClientRect();
        
        setPillStyle({
          left: activeRect.left - navRect.left,
          width: activeRect.width,
          height: activeRect.height,
        });
      }
    };

    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(updatePillPosition, 50);
    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="text-center px-4 md:px-8 py-4 sticky top-0 bg-white/70 backdrop-blur-md z-40 border-b border-indigo-100/60">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 rounded-lg p-2" aria-label="TurboTags - Go to homepage">
            <img
              src="/favicon.svg"
              alt="TurboTags Logo"
              className="w-10 h-10 md:w-12 md:h-12 transition-transform hover:rotate-180 hover:scale-110"
              loading="eager"
              decoding="async"
            />
            <div className="text-4xl md:text-5xl font-extrabold leading-tight transition-transform hover:scale-105 bg-gradient-to-r from-indigo-500 to-indigo-700 bg-clip-text text-transparent">
              TurboTags
            </div>
          </Link>

          <nav ref={navRef} className="hidden lg:flex items-center space-x-1 relative rounded-full p-1 bg-white/70 border border-indigo-100/60" role="navigation" aria-label="Main navigation">
            {/* Animated pill background */}
            <motion.div
              className="absolute rounded-full shadow-lg"
              style={{...pillStyle, backgroundColor: '#6366f1'}}
              initial={false}
              animate={pillStyle}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <CustomNavLink to="/" ariaLabel="Go to homepage">Home</CustomNavLink>
            <CustomNavLink to="/features" ariaLabel="Go to Features page">Features</CustomNavLink>
            <CustomNavLink to="/blog" ariaLabel="Go to Blog">Blog</CustomNavLink>
            <a href="https://ko-fi.com/turbotags1509" target="_blank" rel="noopener noreferrer" className="relative z-10 text-white px-4 py-2 ml-3 rounded-lg flex items-center hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2" style={{backgroundColor: '#6366f1', '--tw-ring-offset-color': 'white'}} aria-label="Support TurboTags on Ko-fi - Opens in new tab">
              <Heart className="mr-2 h-4 w-4" aria-hidden="true" /> Support
            </a>
          </nav>

          <button onClick={() => setIsMenuOpen(true)} className="lg:hidden text-slate-800 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2" aria-label="Open navigation menu" aria-expanded={isMenuOpen}>
            <Menu size={32} aria-hidden="true" />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className={`fixed top-0 left-0 h-full w-full text-white z-50 flex flex-col items-center justify-center transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{background: 'linear-gradient(160deg, #4f46e5 0%, #6366f1 100%)'}}
        >
          <button onClick={closeMenu} className="absolute top-5 right-5 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2" style={{'--tw-ring-offset-color': '#4f46e5'}} aria-label="Close navigation menu">
            <X size={40} aria-hidden="true" />
          </button>
          <nav className="flex flex-col items-center w-full space-y-4" role="navigation" aria-label="Mobile navigation">
            <MobileNavLink to="/" onClick={closeMenu} ariaLabel="Go to homepage">Home</MobileNavLink>
            <MobileNavLink to="/features" onClick={closeMenu} ariaLabel="Go to Features page">Features</MobileNavLink>
            <MobileNavLink to="/blog" onClick={closeMenu} ariaLabel="Go to Blog">Blog</MobileNavLink>
            <MobileNavLink to="/#faq" onClick={closeMenu} ariaLabel="Go to FAQ section">FAQ</MobileNavLink>
            <a href="https://ko-fi.com/turbotags1509" onClick={closeMenu} target="_blank" rel="noopener noreferrer" className="block w-full py-4 text-center text-xl text-slate-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 rounded-md" style={{'--tw-ring-offset-color': 'black'}} aria-label="Support TurboTags on Ko-fi - Opens in new tab">
              Support Us
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default React.memo(Header);
