// components/CartEmpty.jsx
import React from "react";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, ArrowRight } from "lucide-react";
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
        <div className="w-full  justify-center flex items-center gap-x-4">
          <Link
            href="/"
            className="flex items-center btn btn-link gap-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
          <Link
            href="/cart/order_history"
            className="flex items-center btn btn-link gap-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            Order History
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default CartEmpty;
