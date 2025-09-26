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
    <div className="min-h-screen w-full relative">
      {/* Radial Gradient Background from Bottom */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(60% 40% at 50% 0%, rgba(148,163,184,0.35) 0%, transparent 70%), linear-gradient(180deg, #e5e7eb 0%, #cbd5e1 60%, #e2e8f0 100%)",
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
