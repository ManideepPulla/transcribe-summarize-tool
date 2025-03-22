
import React from 'react';
import { useIsMobile } from '../hooks/use-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className={`flex-1 container mx-auto py-4 ${isMobile ? 'px-2' : 'px-6'}`}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
