"use client";
import DynamicImage from "@/components/reusables/DynamicImage/DynamicImage";
import { useGlobalState } from "./GlobalStateProvider";
import { ButtonOne, ButtonTwo } from "@/components/reusables/buttons/Buttons";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Loader, LoaderStyle5Component } from "@/components/Loader/Loader";

export default function Home() {
  const { formData, addToEndpoint, loading, fetchProducts } = useGlobalState(); // Access global state
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
      payloadID: "product",
    });
  };

  return (
    <main className="my-32 w-[90%] mx-auto">
      <div className="w-full md:w-full mx-auto h-auto flex flex-col gap-y-8">
        <h1
          onClick={() => fetchProducts()}
          className="font-extrabold text-3xl md:text-5xl cursor-pointer"
        >
          {"What would you like to buy from us?"}
        </h1>

        {/* Iterate over grouped products */}
        {products.length === 0 ? <LoaderStyle5Component/> : 
        Object.entries(groupedProducts).map(([category, items], ind) => (
          <div key={ind}>
            <h2 className="text-xl md:text-3xl font-bold mb-5">{category}</h2>
            <div className="flex gap-x-5 min-w-full overflow-x-auto scrollbar-none pb-16 scroll-snap-x scroll-snap-mandatory">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 flex flex-col min-h-full items-center justify-between p-5 card relative shadow-2xl overflow-hidden rounded-lg w-full 
                  sm:w-1/2 md:w-1/3 lg:w-1/4 scroll-snap-align-start"
                >
                  <span className="absolute top-2 right-2 cursor-pointer">
                    {loading === `wishlist${product.id}` ? (
                      <Loader smaillerSize={true} />
                    ) : (
                      <Heart
                        size={20}
                        onClick={() => handleAddToWishlist(product.id)}
                      />
                    )}
                  </span>

                  {/* Image */}
                  <Link
                    href={`/product/${product.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    passHref
                    className="rounded-lg  flex items-center justify-center flex-1"
                  >
                    <DynamicImage
                      className={`object-cover drop-shadow-2xl hover:scale-90 transition w-auto h-auto`}
                      width={250}
                      height={250}
                      prod={product.name}
                      prop={product.image}
                    />
                  </Link>
                  <div className="w-full flex flex-col items-start justify-between">
                    <Link
                      href={`/product/${product.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      passHref
                      className="flex text-start flex-col "
                    >
                      {/* Title */}
                      <figcaption className="mt-4 text-lg font-bold">
                        {product.name}
                      </figcaption>
                    </Link>

                    <span className="flex justify-between w-full items-end mt-8">
                      <p className="text-base font-semibold">
                        ${product.price}
                      </p>
                      <ButtonTwo
                        disabled={
                          loading === `cart${product.id}` ? true : false
                        }
                        className={`rounded-md`}
                        iconValue={<ShoppingCart size={15} />}
                        buttonValue={`Add to Cart`}
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
