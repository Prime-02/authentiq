// components/CartLoading.jsx
import { Loader } from "lucide-react";
import React from "react";

const CartLoading = () => {
  return (
    <main className="my-32 w-[90%] mx-auto">
      <div className="w-full h-screen flex flex-col gap-y-12 items-center justify-center">
        <div className="relative">
          <Loader className="animate-spin" size={100} />
        </div>
        <p className="text-lg text-secondary">Loading your cart...</p>
      </div>
    </main>
  );
};

export default CartLoading;
