"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import { Loader } from "lucide-react";

export default function ClientLayout({ children }) {
  const pathname = usePathname(); // Current route path
  const [loading, setLoading] = useState(false);

  // Check if the current path starts with '/admin'
  const shouldHideNavbarAndFooter =
    pathname.startsWith("/admin") || pathname.startsWith("/profile");

  useEffect(() => {
    const handleRouteChange = () => {
      setLoading(true);
    };

    handleRouteChange();

    // Hide loading screen after navigation completes
    const timer = setTimeout(
      () => {
        setLoading(false);
      },
      Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  return (
    <main className="min-h-screen">
      {/* Loading screen */}
      {loading && (
        <div className="fixed z-50 h-screen w-full card justify-center flex flex-col items-center top-0 bottom-0 left-0 right-0 overflow-hidden">
          <span>
            <Loader size={100} className="animate-spin" />
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
