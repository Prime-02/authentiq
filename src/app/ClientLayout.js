"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/Loader/LoadingScreen";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import { useGlobalState } from "./GlobalStateProvider";


export default function ClientLayout({ children }) {
  const {formData} = useGlobalState()
  const pathname = usePathname(); // Current route path
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Tracks login state
  const [userName, setUserName] = useState(""); // Stores the logged-in user's name

  // Example login state (replace with actual auth logic)
  useEffect(() => {
    // Simulate a user login (replace this with real authentication logic)
    const user = formData.userId ? formData.userId : ''; // Replace with data from your auth logic
    if (user) {
      setIsLoggedIn(true);
      setUserName(user.name);

      // Add query parameter for the logged-in user
      if (!pathname.includes(`id=${user}`)) {
        const updatedPath = `${pathname}?id=${encodeURIComponent(user)}`;
        router.push(updatedPath);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [pathname, router]);

  // Check if the current path starts with '/admin'
  const shouldHideNavbarAndFooter = pathname.startsWith("/admin");

  useEffect(() => {
    // Show loading screen on route change
    const handleRouteChange = () => setLoading(true);

    // Trigger handleRouteChange on path update
    handleRouteChange();

    // Hide loading screen after navigation completes
    const timer = setTimeout(() => {
      setLoading(false);
    }, Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000);
    return () => clearTimeout(timer); // Clear timeout on unmount
  }, [pathname]);

  return (
    <main className="min-h-screen">
      {/* Loading screen */}
      {loading && (
        <div className="fixed z-50 h-screen w-full bg-white justify-center flex flex-col items-center top-0 bottom-0 left-0 right-0 overflow-hidden">
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
