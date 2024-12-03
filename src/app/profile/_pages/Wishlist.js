"use client";
import { useGlobalState } from "@/app/GlobalStateProvider";
import React, { useEffect } from "react";

const Wishlist = () => {
  const { formData, fetchWishlist } = useGlobalState();
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);
  const wishlist = formData.wishlist;
  return (
    <div className="flex p-12 w-full justify-between mx-auto flex-col md:flex-row gap-4 h-screen ">
      <section className="  w-1/2">
        <h1 className="text-2xl md:text-4xl ">Shopping Wishlist</h1>
        <ul>
          {wishlist.map((wishlist, index) => (
            <li key={index}>
              <span>{wishlist.id}</span>
              <span>{wishlist.product_id}</span>
              <span>{wishlist.product}</span>
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
