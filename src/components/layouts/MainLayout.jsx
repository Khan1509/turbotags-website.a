import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import ScrollToAnchor from '../utils/ScrollToAnchor';
import CookieConsent from '../CookieConsent';
import ScrollToTopButton from '../ScrollToTopButton';

const MainLayout = () => {
  return (
    <>
      <ScrollToAnchor />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
      <ScrollToTopButton />
    </>
  );
};

export default MainLayout;
