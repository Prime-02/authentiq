"use client";
import { useGlobalState } from "@/app/GlobalStateProvider";
import { ButtonOne, ButtonTwo } from "@/components/reusables/buttons/Buttons";
import DynamicImage from "@/components/reusables/DynamicImage/DynamicImage";
import { ShoppingCart } from "lucide-react";
import React, { useEffect } from "react";

const Wishlist = () => {
  const { formData, fetchWishlist, addToEndpoint, loading } = useGlobalState();
  const handleAddToCart = (productId) => {
    addToEndpoint({
      productId,
      endpoint: "https://isans.pythonanywhere.com/shop/cart/",
      action: "cart",
    });
  };

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const wishlistItems = formData.wishlist || [];

  return (
    <div className="flex flex-col py-24  w-[80%] md:w-1/2 mx-auto">
      {/* Wishlist Section */}
      <h1 className="text-2xl md:text-4xl mb-10 ">Wishlist</h1>
      <ul>
        {wishlistItems.map((item, index) => (
          <li
            key={index}
            className="flex flex-row w-full justify-start gap-x-5 border-b border-gray-400 py-5"
          >
            <div className=" w-44 h-72 flex items-center justify-center card rounded-lg">
              <DynamicImage
                prop={item.product.image}
                prod={item.product.name}
                className=" object-cover"
              />
            </div>
            <div className="relative w-64">
              <h3>{item.product.name}</h3>
              <span className="flex items-center gap-x-2 text-gray-500">
                <p> {item.product.category}</p>
                <span className="h-8 w-[1px] bg-gray-500"></span>
                <p> {item.product.sizes.join(", ")}</p>
              </span>
              <p> ${item.product.price}</p>
              <span className="absolute bottom-0">
                <ButtonTwo
                disabled={loading === `cart`? true : false}
                  className={`rounded-md`}
                  iconValue={<ShoppingCart size={15} />}
                  buttonValue={`Add to Cart`}
                  Clicked={()=>handleAddToCart(item.id)}
                />
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Wishlist;
