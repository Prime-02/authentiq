"use client";
import { useGlobalState } from "@/app/GlobalStateProvider";
import { Loader } from "@/components/Loader/Loader";
import { ButtonOne, ButtonTwo } from "@/components/reusables/buttons/Buttons";
import DynamicImage from "@/components/reusables/DynamicImage/DynamicImage";
import { ShoppingCart, Trash } from "lucide-react";
import React, { useEffect } from "react";

const Wishlist = () => {
  const { formData, fetchWishlist, addToEndpoint, loading, deleteItem } =
    useGlobalState();
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
        {wishlistItems.length > 0 ? wishlistItems.map((item, index) => (
          <li
            key={index}
            className="flex relative flex-row w-full justify-start gap-x-12   mx-auto border-b border-gray-400 py-5"
          >
            <div className=" w-1/2 h-72 flex items-center justify-center card rounded-lg">
              <DynamicImage
                prop={item.product.image}
                prod={item.product.name}
                className=" object-cover"
              />
            </div>
            <div className="relative w-64 flex flex-col ">
              <h3>{item.product.name}</h3>
              <span className="flex items-center gap-x-2 text-gray-500">
                <p> {item.product.category}</p>
                <span className="h-8 w-[1px] bg-gray-500"></span>
                <p> {item.product.sizes.join(", ")}</p>
              </span>
              <p> ${item.product.price}</p>
              <span className="absolute bottom-0">
                <ButtonTwo
                  disabled={loading === `cart${item.product.id}` ? true : false}
                  className={`rounded-md`}
                  iconValue={<ShoppingCart size={15} />}
                  buttonValue={`Add to Cart`}
                  Clicked={() => handleAddToCart(item.product.id)}
                />
              </span>
            </div>
            <span className="absolute right-3 top-7 cursor-pointer">
              {loading === `deleting_wishlist_${item.id}` ? (
                <Loader smaillerSize={true} />
              ) : (
                <Trash onClick={() => deleteItem(item.id, `wishlist`)} size={15}/>
              )}
            </span>
          </li>
        ))
      : <section>
        <h1>
          No item added to your wish list
        </h1>
      </section>
      } 
      </ul>
    </div>
  );
};

export default Wishlist;
