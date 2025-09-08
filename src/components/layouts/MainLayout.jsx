import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import ScrollToAnchor from '../utils/ScrollToAnchor';

const MainLayout = () => {
  return (
    <>
      <ScrollToAnchor />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
