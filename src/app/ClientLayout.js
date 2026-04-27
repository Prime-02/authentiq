"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/Loader/LoadingScreen";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import { disablePageScroll, enablePageScroll } from "scroll-lock";

export default function ClientLayout({ children }) {
  const pathname = usePathname(); // Current route path
  const [loading, setLoading] = useState(false);

  


  // Check if the current path starts with '/admin'
  const shouldHideNavbarAndFooter =
    pathname.startsWith("/admin") || pathname.startsWith("/profile");

  useEffect(() => {
    const handleRouteChange = () => {
      setLoading(true);
      disablePageScroll(); // Disable scroll when loading starts
    };

    handleRouteChange();

    // Hide loading screen after navigation completes
    const timer = setTimeout(() => {
      setLoading(false);
      enablePageScroll(); // Re-enable scroll after loading ends
    }, Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000);

    return () => {
      clearTimeout(timer);
      enablePageScroll(); // Ensure scroll is re-enabled on cleanup
    };
  }, [pathname]);

  return (
    <main className="min-h-screen">
      {/* Loading screen */}
      {loading && (
        <div className="fixed z-50 h-screen w-full card justify-center flex flex-col items-center top-0 bottom-0 left-0 right-0 overflow-hidden">
          <span>
            <LoadingScreen />
          </span>
        </div>
      )}

      {/* Only render Navbar and Footer if not on excluded paths */}
      {!shouldHideNavbarAndFooter && <Navbar />}

      {/* Render the page content */}
      <div className="w-full min-h-screen">{children}</div>

      {!shouldHideNavbarAndFooter && <Footer />}
    </main>
  );
}
