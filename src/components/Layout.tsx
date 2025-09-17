import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showHeader = true, 
  showFooter = true 
}) => {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {showHeader && <Header />}
      <main>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;