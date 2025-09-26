import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import ScrollToAnchor from '../utils/ScrollToAnchor';
import CookieConsent from '../CookieConsent';
import ScrollToTopButton from '../ScrollToTopButton';
import ParticlesBackground from '../ui/ParticlesBackground';

const MainLayout = () => {
  return (
    <div className="min-h-screen w-full relative theme-indigo" style={{ background: 'var(--color-bg)' }}>
      {/* Base gradient background */}
      <div
        className="absolute inset-0 z-[-1]"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(79, 70, 229, 0.15), transparent 70%), radial-gradient(circle at 20% 80%, rgba(124, 58, 237, 0.1), transparent 50%), radial-gradient(circle at 80% 20%, rgba(34, 211, 238, 0.08), transparent 60%)",
        }}
      />
      
      {/* Futuristic Particle Background - above gradient, below content */}
      <ParticlesBackground particleCount={30} speed={0.6} connectionDistance={140} />
      
      {/* Main Content */}
      <div className="relative z-10">
        <ScrollToAnchor />
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
        <CookieConsent />
        <ScrollToTopButton />
      </div>
    </div>
  );
};

export default MainLayout;
