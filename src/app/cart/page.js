"use client";
import React, { useEffect } from "react";
import { useGlobalState } from "../GlobalStateProvider";
import DynamicImage from "@/components/reusables/DynamicImage/DynamicImage";
import { ButtonTwo } from "@/components/reusables/buttons/Buttons";
import { Loader } from "@/components/Loader/Loader";
import { Minus, Plus, ShoppingCart, Trash } from "lucide-react";

const Cart = () => {
  const { formData, fetchCart, loading, deleteItem, addToEndpoint } =
    useGlobalState();
   const handleAddToCart = (productId) => {
     addToEndpoint({
       productId,
       endpoint: "https://isans.pythonanywhere.com/shop/cart/",
       action: "cart",
     });
   };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const cart = formData.cart || [];

  // Group items by `id` and `name`
  const groupedCart = cart.reduce((acc, item) => {
    const existingItem = acc.find(
      (groupedItem) =>
        groupedItem.product.id === item.product.id &&
        groupedItem.product.name === item.product.name
    );

    if (existingItem) {
      existingItem.quantity += 1; // Increment quantity if item already exists
    } else {
      acc.push({ ...item, quantity: 1 }); // Add new item with quantity 1
    }

    return acc;
  }, []);

  // Calculate subtotal
  const subtotal = groupedCart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // Shipping and tax estimates
  const shippingEstimate = 5; // Flat rate
  const taxEstimate = 8; // Flat rate
  const total = subtotal + shippingEstimate + taxEstimate; // Grand total

  return (
    <div className="flex p-12 w-[90%] justify-between mx-auto flex-col md:flex-row gap-4 h-auto min-h-screen">
      <section className="flex flex-col">
        <h1 className="text-2xl md:text-4xl">Shopping Cart</h1>
        <ul>
          {groupedCart.length > 0 ? (
            groupedCart.map((item, index) => (
              <li
                key={index}
                className="flex relative flex-row w-full justify-start gap-x-12 mx-auto border-b border-gray-400 py-5"
              >
                <div className="w-1/2 h-72 flex items-center justify-center card rounded-lg px-3">
                  <DynamicImage
                    prop={item.product.image}
                    prod={item.product.name}
                    className="object-cover"
                  />
                </div>
                <div className="relative w-64 flex flex-col">
                  <h3>{item.product.name}</h3>
                  <span className="flex items-center gap-x-2 text-gray-500">
                    <p>{item.product.category}</p>
                    <span className="h-8 w-[1px] bg-gray-500"></span>
                    <p>{item.product.sizes.join(", ")}</p>
                  </span>
                  <p>${item.product.price}</p>
                  <p className="text-xs">
                    <strong>Available quantity: </strong>
                    {item.product.quantity}
                  </p>
                  <span className="absolute w-full flex justify-between items-center bottom-0">
                    <ButtonTwo
                      disabled={loading === `cart${item.product.id}`}
                      className={`rounded-md`}
                      iconValue={<Minus size={15} />}
                    />
                    <p className="text-sm text-gray-400">{item.quantity}</p>
                    <ButtonTwo
                      disabled={loading === `cart${item.product.id}`}
                      className={`rounded-md`}
                      iconValue={<Plus size={15} />}
                      Clicked={() => handleAddToCart(item.product.id)}
                    />
                  </span>
                </div>
                <span className="absolute right-3 top-7 cursor-pointer">
                  {loading === `deleting_cart_${item.id}` ? (
                    <Loader smallerSize={true} />
                  ) : (
                    <Trash
                      onClick={() => deleteItem(item.id, `cart`)}
                      size={15}
                    />
                  )}
                </span>
              </li>
            ))
          ) : (
            <section>
              <h1>No item added to your Cart</h1>
            </section>
          )}
        </ul>
      </section>
      <section className="w-full md:w-1/3">
        <h1 className="text-xl md:text-2xl my-10">Order Summary</h1>
        <div className="flex flex-col gap-4 space-y-3">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping Estimate</p>
            <p>${shippingEstimate.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Tax Estimate</p>
            <p>${taxEstimate.toFixed(2)}</p>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <p>Total</p>
            <p>${total.toFixed(2)}</p>
          </div>
          <ButtonTwo className={`rounded-md`} buttonValue={`Check Out`} />
        </div>
      </section>
    </div>
  );
};

export default Cart;
