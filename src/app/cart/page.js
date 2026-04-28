// app/cart/page.jsx or wherever your cart page is
"use client";
import React, { useEffect } from "react";
import CartLoading from "./components/CartLoading";
import CartUnauthenticated from "./components/CartUnauthenticated";
import CartEmpty from "./components/CartEmpty";
import CartContent from "./components/CartContent";
import { useCartStore } from "@/stores";
import { isAuthenticated } from "../../../lib/axiosInstance";

const CartPage = () => {
  const { userCart, loadingCart, fetchCart } = useCartStore();

  React.useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    }
  }, [isAuthenticated]);

  // Loading state
  if (loadingCart && userCart.length === 0 && isAuthenticated) {
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
