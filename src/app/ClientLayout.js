// app/layout.js (Global Client Layout)
"use client";

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/Loader/LoadingScreen';
import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navbar/Navbar';

export default function ClientLayout({ children }) {
  const pathname = usePathname(); // Current route path
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Check if the current path starts with '/usr'
  const shouldHideNavbarAndFooter =  pathname.startsWith('/admin');

  useEffect(() => {
    // Show loading screen on route change
    const handleRouteChange = () => setLoading(true);


    // Trigger handleRouteChange on path update
    handleRouteChange();

    // Hide loading screen after navigation completes
    const timer = setTimeout(() => {
      setLoading(false);

    }, 1000); // Adjust the delay as necessary

    return () => clearTimeout(timer); // Clear timeout on unmount
  }, [pathname]);

  return (
    <>
      {/* Loading screen */}
      {loading && (
        <div className="fixed z-50 h-screen w-full bg-white  justify-center flex flex-col items-center overflow-hidden">
            <span>
              <LoadingScreen/>
            </span>
        </div>
      )}

      {/* Only render Navbar and Footer if not on excluded paths */}
      {!shouldHideNavbarAndFooter && <Navbar />}

      {/* Render the page content */}
      {children}

      {!shouldHideNavbarAndFooter && <Footer />}
    </>
  );
}
