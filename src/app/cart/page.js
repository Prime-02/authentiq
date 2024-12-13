"use client";
import React, { useEffect } from "react";
import { useGlobalState } from "../GlobalStateProvider";
import DynamicImage from "@/components/reusables/DynamicImage/DynamicImage";
import { ButtonTwo } from "@/components/reusables/buttons/Buttons";
import { Loader } from "@/components/Loader/Loader";
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingCart, Trash } from "lucide-react";
import Link from "next/link";
import CheckOut from "@/components/checkout/CheckOut";
import { DeliveryCompany } from "@/components/checkout/DeliveryCompany";

const Cart = () => {
  const {
    formData,
    fetchCart,
    loading,
    deleteItem,
    addToEndpoint,
    fetchOrderHistory,
  } = useGlobalState();
  const user = formData.userFirstName ? formData.userFirstName : `user`;
  const handleAddToCart = (productId) => {
    addToEndpoint({
      productId,
      endpoint: "https://isans.pythonanywhere.com/shop/cart/",
      action: "cart",
    });
  };

  useEffect(() => {
    fetchCart();
    fetchOrderHistory();
  }, [fetchCart, fetchOrderHistory]);

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
    <main className="w-full overflow-x-hidden">
      <header className="flex w-full justify-between px-8">
        <Link
          href={`/`}
          className="flex items-center gap-x-2 text-blue-600 hover:underline"
        >
          <p>
            <ArrowLeft size={15} />
          </p>
          <p>Back</p>
        </Link>
        <Link
          href={`cart/order_history`}
          className="flex items-center gap-x-2 text-blue-600 hover:underline"
        >
          <p>Order History</p>
          <p>
            <ArrowRight size={15} />
          </p>
        </Link>
      </header>
      <div
        className={`flex ${
          groupedCart.length > 0 ? "flex-col-reverse" : "flex-col"
        } md:flex-row p-6 md:p-12 w-full md:w-full justify-between mx-auto gap-6 h-auto min-h-screen`}
      >
        {/* Order Summary Section */}
        {groupedCart.length > 0 && (
          <section className="w-full card md:w-1/2 p-6 rounded-2xl shadow-xl h-fit">
            <div>
              <CheckOut />
            </div>
            <div>
              <DeliveryCompany />
            </div>
          </section>
        )}
        {/* Shopping Cart Section */}
        <section className="flex flex-col w-full md:w-1/2">
          <h1 className="text-lg md:text-2xl font-semibold mb-6">
            Order Summary
          </h1>
          <ul className="space-y-6">
            {groupedCart.length > 0 ? (
              groupedCart.map((item, index) => (
                <li
                  key={index}
                  className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 border-b border-gray-400 pb-6"
                >
                  {/* Product Image */}
                  <div className="w-full md:w-1/2 h-56 md:h-72 flex items-center justify-center card rounded-lg overflow-hidden bg-gray-100">
                    <DynamicImage
                      prop={item.product.image}
                      prod={item.product.name}
                      className="object-cover "
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col relative flex-1">
                    <h3 className="text-lg md:text-xl font-semibold">
                      {item.product.name}
                    </h3>
                    <span className="flex items-center gap-x-2  text-sm md:text-base my-2">
                      <p>{item.product.category}</p>
                      <span className="h-6 w-[1px] bg-gray-400"></span>
                      <p>{item.product.sizes.join(", ")}</p>
                    </span>
                    <p className=" text-sm md:text-base">
                      ${item.product.price}
                    </p>
                    <p className="text-xs ">
                      <strong>Available quantity: </strong>
                      {item.product.quantity}
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      {/* Quantity Controls */}
                      <ButtonTwo
                        disabled={loading === `cart${item.product.id}`}
                        className="rounded-md"
                        iconValue={<Minus size={15} />}
                      />
                      <p className="text-sm md:text-base ">{item.quantity}</p>
                      <ButtonTwo
                        disabled={loading === `cart${item.product.id}`}
                        className="rounded-md"
                        iconValue={<Plus size={15} />}
                        Clicked={() => handleAddToCart(item.product.id)}
                      />
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div className="text-center py-6">
                <h2 className="text-xl md:text-2xl ">
                  No items in your cart.{" "}
                  <Link
                    href={`/`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Start Shopping
                  </Link>
                </h2>
              </div>
            )}
          </ul>
          {groupedCart.length > 0 && (
            <section className="w-full">
              <div className="space-y-4">
                <div className="flex justify-between text-sm md:text-base">
                  <p>Subtotal</p>
                  <p>${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <p>Shipping Estimate</p>
                  <p>${shippingEstimate.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <p>Tax Estimate</p>
                  <p>${taxEstimate.toFixed(2)}</p>
                </div>
                <div className="flex justify-between font-bold text-lg md:text-xl mt-4">
                  <p>Total</p>
                  <p>${total.toFixed(2)}</p>
                </div>
              </div>
            </section>
          )}
        </section>
      </div>
    </main>
  );
};

export default Cart;
