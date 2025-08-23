import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import CookieConsent from '../CookieConsent';
import ScrollToTopButton from '../ScrollToTopButton';
import ScrollToAnchor from '../utils/ScrollToAnchor';

const MainLayout = () => {
  return (
    <>
      <ScrollToAnchor />
      <Header />
      <Outlet />
      <Footer />
      <CookieConsent />
      <ScrollToTopButton />
    </>
  );
};

export default MainLayout;
