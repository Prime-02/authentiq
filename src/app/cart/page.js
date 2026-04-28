// app/cart/page.jsx or wherever your cart page is
"use client";
import React from "react";
import CartLoading from "./components/CartLoading";
import CartUnauthenticated from "./components/CartUnauthenticated";
import CartEmpty from "./components/CartEmpty";
import CartContent from "./components/CartContent";
import { useAuthStore, useCartStore } from "@/stores";

const CartPage = () => {
  const { userCart, loadingCart, fetchCart } = useCartStore();
  const { userId, loadingUser, fetchUserData } = useAuthStore();

  // Check if user is authenticated
  const isAuthenticated = !!userId;

  React.useEffect(() => {
    if (!userId && !loadingUser) {
      fetchUserData();
    }
  }, [userId, loadingUser, fetchUserData]);

  React.useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    }
  }, [isAuthenticated]);

  // Loading state
  if (
    loadingUser ||
    (loadingCart && userCart.length === 0 && isAuthenticated)
  ) {
    return <CartLoading />;
  }

  // Unauthenticated state
  if (!isAuthenticated) {
    return <CartUnauthenticated />;
  }

  // Empty cart state
  if (userCart.length === 0) {
    return <CartEmpty />;
  }

  return <CartContent />;
};

export default CartPage;
