import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout: React.FC = () => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <div className="container py-8">
            <Outlet /> {/* This will render the current page's content */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;