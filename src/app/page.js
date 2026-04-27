"use client";
import { useEffect, useState } from "react";
import DynamicImage from "@/components/reusables/DynamicImage/DynamicImage";
import { LoaderStyle5Component } from "@/components/Loader/Loader";
import { useCategoryStore } from "@/stores";
import ProductCard from "@/components/ProductCard/ProductCard";
import Link from "next/link";

export default function Home() {
  const { categories, loadingCategories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    // Fetch categories with limited products for better performance
    fetchCategories({
      includeProducts: true,
      maxProducts: 10,
    });
  }, [fetchCategories]);

  // Group all products by category
  const groupedCategories = categories.filter(
    (category) => category.products && category.products.length > 0,
  );

  if (loadingCategories) {
    return (
      <main className="my-32 w-[90%] mx-auto">
        <div className="w-full md:w-full mx-auto h-auto flex flex-col gap-y-8">
          <h1 className="font-extrabold text-3xl md:text-5xl">
            {"What would you like to buy from us?"}
          </h1>
          <div className="w-full h-screen flex-col gap-y-12 flex items-center">
            <LoaderStyle5Component />
            <p>Loading products...</p>
          </div>
        </div>
      </main>
    );
  }

  if (groupedCategories.length === 0) {
    return (
      <main className="my-32 w-[90%] mx-auto">
        <div className="w-full md:w-full mx-auto h-auto flex flex-col gap-y-8">
          <h1 className="font-extrabold text-3xl md:text-5xl">
            {"What would you like to buy from us?"}
          </h1>
          <div className="w-full h-screen flex-col gap-y-12 flex items-center">
            <LoaderStyle5Component />
            <p>No products available</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="my-32 w-[90%] mx-auto">
      <div className="w-full mx-auto h-auto flex flex-col gap-y-8">
        <h1 className="font-extrabold text-3xl md:text-5xl">
          {"What would you like to buy from us?"}
        </h1>

        {/* Iterate over categories with hero images */}
        {groupedCategories.map((category, ind) => (
          <div key={category.id || ind} className="flex flex-col gap-y-8">
            {/* Hero Section with Category Image */}
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
              {/* Category Image as Hero */}
              {category?.image_url && (
                <DynamicImage
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  width={1200}
                  height={500}
                  prod={category?.name || "Category"}
                  prop={category.image_url}
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <h2 className="text-white text-3xl md:text-5xl font-bold mb-4">
                  {category?.name || "Category"}
                </h2>
                {category?.description && (
                  <p className="text-white/90 text-lg md:text-xl mb-6 max-w-2xl">
                    {category.description}
                  </p>
                )}
                <Link
                  href={`/category/${category?.name?.toLowerCase()?.replace(/\s+/g, "-") || ""}`}
                  className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Shop {category?.name || "Category"}
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>

            </div>

            {/* Products Grid Below Hero */}
            <div>

              <div className="flex gap-x-5 min-w-full overflow-x-auto scrollbar-none pb-6 scroll-snap-x scroll-snap-mandatory">
                {category?.products?.map((product) => (
                  <div
                    key={product?.id || Math.random()}
                    className="flex-shrink-0 w-full sm:w-[calc(50%-10px)] md:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)] scroll-snap-align-start"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Show more indicator if there are more products */}
              {category?.products?.length === 10 && (
                <div className="mt-4 text-center">
                  <Link
                    href={`/category/${category?.name?.toLowerCase()?.replace(/\s+/g, "-") || ""}`}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    See more products in {category?.name || "this category"}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
