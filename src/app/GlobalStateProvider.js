"use client";

import {
  useAuthStore,
  useCartStore,
  useUIStore,
  useWishlistStore,
} from "@/stores";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isAuthenticated } from "../../lib/axiosInstance";

// ── Create Context ─────────────────────────────────────────────────────────
const GlobalStateContext = createContext(null);

// ── Utility (pure function — no provider needed) ───────────────────────────
export const formatBalance = (balance) => {
  if (balance !== null && !isNaN(Number(balance))) {
    return Number(balance).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return "0.00";
};

// ── Provider ───────────────────────────────────────────────────────────────
export const GlobalStateProvider = ({ children }) => {
  const { fetchUserData } = useAuthStore();
  const { modalType } = useUIStore();
  const router = useRouter();
  const { fetchCart } = useCartStore();
  const { fetchWishlist } = useWishlistStore();

  useEffect(() => {
    // Fetch user data on initial load
    fetchUserData();
  }, [router, modalType]);

  useEffect(() => {
    if(!isAuthenticated()) return;
    fetchCart();
    fetchWishlist();
  }, []);

  // Add any global state values here if needed
  const globalState = {
    // Example: user, theme, etc.
  };

  return (
    <GlobalStateContext.Provider value={globalState}>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {children}
    </GlobalStateContext.Provider>
  );
};

// ── Hook ───────────────────────────────────────────────────────────────────
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
