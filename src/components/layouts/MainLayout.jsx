import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div style={{ minHeight: '100vh' }}>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
