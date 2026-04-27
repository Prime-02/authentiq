// components/CartEmpty.jsx
import React from "react";
import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/stores";

const CartEmpty = () => {
  const { userFirstName } = useAuthStore();

  return (
    <main className="my-32 w-[90%] mx-auto">
      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="p-6 rounded-full bg-secondary">
            <ShoppingCart size={64} className="text-muted" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-secondary mb-8">
          Hello, {userFirstName || "there"}! Looks like you haven't added
          anything to your cart yet
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-semibold"
        >
          Continue Shopping
          <ArrowLeft size={20} className="rotate-180" />
        </Link>
      </div>
    </main>
  );
};

export default CartEmpty;
