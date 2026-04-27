// components/CartItemsList.jsx
import React from "react";
import CartItem from "./CartItem";
import { useCartStore } from "@/stores";

const CartItemsList = () => {
  const { userCart } = useCartStore();

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-secondary border-b border-border">
        <div className="col-span-6 font-semibold text-muted">Product</div>
        <div className="col-span-2 text-center font-semibold text-muted">
          Price
        </div>
        <div className="col-span-2 text-center font-semibold text-muted">
          Quantity
        </div>
        <div className="col-span-2 text-right font-semibold text-muted">
          Total
        </div>
      </div>

      {/* Cart Items */}
      <div className="divide-y divide-border">
        {userCart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
    </>
  );
};

export default CartItemsList;
