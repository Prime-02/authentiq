"use client";
import { useGlobalState } from "@/app/GlobalStateProvider";
import React, { useEffect } from "react";

const Wishlist = () => {
  const { formData, fetchWishlist } = useGlobalState();
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);
  const cart = formData.cart;
  return (
    <div className="flex p-12 w-full justify-between mx-auto flex-col md:flex-row gap-4 h-screen ">
      <section className="  w-1/2">
        <h1 className="text-2xl md:text-4xl ">Shopping Wishlist</h1>
        <ul>
          {cart.map((cart, index) => (
            <li key={index}>
              <span>{cart.id}</span>
              <span>{cart.product_id}</span>
              <span>{cart.product}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="w-1/2 ">
        <h1 className="">Check Out</h1>
      </section>
    </div>
  );
};

export default Wishlist;
