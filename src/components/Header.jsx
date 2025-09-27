import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomNavLink = React.memo(({ to, children, ariaLabel, ...props }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative z-10 transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-2 rounded-md px-4 py-2 ${
        isActive ? 'nav-active' : ''
      }`
    }
    style={{
      color: '#1f2937'
    }}
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
    className="block w-full py-4 text-center text-xl text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-2 rounded-md"
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
    <header className="text-center px-4 md:px-8 py-4 sticky top-0 z-40" style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-2 rounded-lg p-2" aria-label="TurboTags - Go to homepage">
            <picture className="transition-transform hover:scale-110">
              <source media="(min-width: 1024px)" srcSet="/turbotags_header_logo_1000x320.svg?v=3" />
              <source media="(min-width: 768px)" srcSet="/turbotags_header_logo_500x160.svg?v=3" />
              <img
                src="/turbotags_header_logo_250x80.svg?v=3"
                alt="TurboTags Logo"
                className="h-6 md:h-8 lg:h-10 w-auto"
                loading="eager"
                decoding="async"
              />
            </picture>
          </Link>

          <nav ref={navRef} className="hidden lg:flex items-center space-x-1 relative rounded-full p-1" style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)'
          }} role="navigation" aria-label="Main navigation">
            {/* Animated pill background */}
            <motion.div
              className="absolute rounded-full shadow-lg"
              style={{...pillStyle, background: 'rgba(255, 255, 255, 0.25)', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'}}
              initial={false}
              animate={pillStyle}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <CustomNavLink to="/" ariaLabel="Go to homepage">Home</CustomNavLink>
            <CustomNavLink to="/features" ariaLabel="Go to Features page">Features</CustomNavLink>
            <CustomNavLink to="/blog" ariaLabel="Go to Blog">Blog</CustomNavLink>
            <a href="https://ko-fi.com/turbotags1509" target="_blank" rel="noopener noreferrer" className="relative z-10 text-white px-4 py-2 ml-3 rounded-lg flex items-center hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-offset-2" style={{background: 'linear-gradient(135deg, #475569 0%, #334155 100%)', boxShadow: '0 4px 15px rgba(71, 85, 105, 0.3)', '--tw-ring-color': '#4a90e2', '--tw-ring-offset-color': 'black'}} aria-label="Support TurboTags on Ko-fi - Opens in new tab">
              <Heart className="mr-2 h-4 w-4" aria-hidden="true" /> Support
            </a>
          </nav>

          <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-2" style={{color: '#1f2937'}} aria-label="Open navigation menu" aria-expanded={isMenuOpen}>
            <Menu size={32} aria-hidden="true" />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className={`fixed top-0 left-0 h-full w-full text-white z-50 flex flex-col items-center justify-center transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{background: 'radial-gradient(60% 50% at 50% 0%, rgba(99,102,241,0.25), transparent), rgba(2,6,23,0.98)'}}
        >
          <button onClick={closeMenu} className="absolute top-5 right-5 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2" style={{'--tw-ring-offset-color': '#334155'}} aria-label="Close navigation menu">
            <X size={40} aria-hidden="true" />
          </button>
          <nav className="flex flex-col items-center w-full space-y-4" role="navigation" aria-label="Mobile navigation">
            <MobileNavLink to="/" onClick={closeMenu} ariaLabel="Go to homepage">Home</MobileNavLink>
            <MobileNavLink to="/features" onClick={closeMenu} ariaLabel="Go to Features page">Features</MobileNavLink>
            <MobileNavLink to="/blog" onClick={closeMenu} ariaLabel="Go to Blog">Blog</MobileNavLink>
            <MobileNavLink to="/#faq" onClick={closeMenu} ariaLabel="Go to FAQ section">FAQ</MobileNavLink>
            <a href="https://ko-fi.com/turbotags1509" onClick={closeMenu} target="_blank" rel="noopener noreferrer" className="block w-full py-4 text-center text-xl text-slate-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-2 rounded-md" style={{'--tw-ring-offset-color': 'black'}} aria-label="Support TurboTags on Ko-fi - Opens in new tab">
              Support Us
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default React.memo(Header);
