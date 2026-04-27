// components/CartHeader.jsx
import React from "react";
import { ShoppingCart } from "lucide-react";
import { useAuthStore, useCartStore } from "@/stores";


const CartHeader = () => {
  const { userCartNo } = useCartStore();
  const { userFirstName } = useAuthStore();

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold">Shopping Cart</h1>
        {userFirstName && (
          <p className="text-secondary mt-2">Welcome back, {userFirstName}!</p>
        )}
      </div>
      <div className="flex items-center gap-2 text-secondary">
        <ShoppingCart size={20} />
        <span className="font-semibold">{userCartNo} items</span>
      </div>
    </div>
  );
};

export default CartHeader;
