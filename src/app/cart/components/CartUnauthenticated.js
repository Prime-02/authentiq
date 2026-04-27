// components/CartUnauthenticated.jsx
import React from "react";
import { ShoppingCart } from "lucide-react";
import { useUIStore } from "@/stores";

const CartUnauthenticated = () => {
  const { openModal } = useUIStore();

  return (
    <main className="my-32 w-[90%] mx-auto">
      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="p-6 rounded-full bg-secondary">
            <ShoppingCart size={64} className="text-muted" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Your Cart Awaits
        </h1>
        <p className="text-secondary mb-8">
          Sign in to view and manage your shopping cart
        </p>
        <button
          onClick={() => openModal("login")}
          className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-semibold"
        >
          Sign In
        </button>
      </div>
    </main>
  );
};

export default CartUnauthenticated;
