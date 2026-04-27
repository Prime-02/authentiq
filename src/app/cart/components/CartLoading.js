// components/CartLoading.jsx
import React from "react";

const CartLoading = () => {
  return (
    <main className="my-32 w-[90%] mx-auto">
      <div className="w-full h-screen flex flex-col gap-y-12 items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
        </div>
        <p className="text-lg text-secondary">Loading your cart...</p>
      </div>
    </main>
  );
};

export default CartLoading;
