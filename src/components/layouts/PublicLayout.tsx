import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../ui/Navbar';
import Footer from '../ui/Footer';
import FeedbackButton from '../ui/FeedbackButton';
import Loader from '../loader';

const PublicLayout: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = 'visible';
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white dark:bg-black">
          <Loader />
        </div>
      )}

      <Navbar />
      <main className={`flex-grow transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Outlet />
      </main>
      <Footer />
      <FeedbackButton />
    </div>
  );
};

export default PublicLayout;
