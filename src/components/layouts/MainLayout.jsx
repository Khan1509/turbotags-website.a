import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import ScrollToAnchor from '../utils/ScrollToAnchor';
import CookieConsent from '../CookieConsent';
import ScrollToTopButton from '../ScrollToTopButton';

const MainLayout = () => {
  return (
    <div className="min-h-screen w-full relative">
      {/* Radial Gradient Background from Bottom */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #475569 100%)",
        }}
      />
      {/* Your Content/Components */}
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
