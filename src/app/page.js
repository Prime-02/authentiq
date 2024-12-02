"use client";
import { useGlobalState } from "./GlobalStateProvider";
import { ButtonOne, ButtonTwo } from "@/components/reusables/buttons/Buttons";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { formData, addToEndpoint } = useGlobalState(); // Access global state
  const { products } = formData; // Extract the products array

  // Helper function to group products by category
  const groupProductsByCategory = (products) => {
    return products.reduce((acc, product) => {
      const category = product.category || "Others";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
  };

  const groupedProducts = groupProductsByCategory(products); // Grouped products

 const handleAddToCart = (productId) => {
   addToEndpoint({
     productId,
     endpoint: "https://isans.pythonanywhere.com/shop/cart/",
     action: "cart",
   });
 };
  const handleAddToWishlist = (productId) => {
    addToEndpoint({
      productId,
      endpoint: "https://isans.pythonanywhere.com/shop/wishlist/",
      action: "wishlist",
    });
  };

  return (
    <main className="my-32 w-[90%] mx-auto">
      <div className="w-full md:w-full mx-auto h-auto flex flex-col gap-y-8">
        <h1 className="font-extrabold text-3xl md:text-5xl">
          {"What would you like to buy from us?"}
        </h1>

        {/* Iterate over grouped products */}
        {Object.entries(groupedProducts).map(([category, items], ind) => (
          <div key={ind}>
            <h2 className="text-xl md:text-3xl font-bold mb-5">{category}</h2>
            <div className="flex gap-x-5 min-w-full overflow-x-auto scrollbar-none pb-16 scroll-snap-x scroll-snap-mandatory">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 flex flex-col min-h-full items-center justify-between p-5 bg-white shadow-2xl overflow-hidden rounded-lg scroll-snap-align-start"
                >
                  {/* Image */}
                  <Link
                    href={`/product/${product.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    passHref
                    className="rounded-lg mx-16 flex items-center justify-center flex-1"
                  >
                    <Image
                      src={`https://isans.pythonanywhere.com${product.image}`} // Append base URL to image path
                      alt={product.name}
                      width={250}
                      height={250}
                      className="object-cover drop-shadow-2xl hover:scale-125 transition w-auto h-auto"
                    />
                  </Link>
                  <div className="w-full flex flex-row items-center justify-between">
                    <Link
                      href={`/product/${product.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      passHref
                      className="flex text-start flex-col "
                    >
                      {/* Title */}
                      <figcaption className="mt-4 text-lg font-bold text-customGray">
                        {product.name}
                      </figcaption>

                      {/* Price */}
                      <p className="text-lg font-semibold text-customGray">
                        ${product.price}
                      </p>
                    </Link>
                    <span>
                      <ButtonOne
                        iconValue={<Heart size={20} />}
                        Clicked={() => handleAddToWishlist(product.id)}
                      />
                      <ButtonTwo
                        iconValue={<ShoppingCart size={20} />}
                        Clicked={() => handleAddToCart(product.id)}
                      />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
