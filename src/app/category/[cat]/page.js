"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCategoryStore, useProductStore } from "@/stores";
import DynamicImage from "@/components/reusables/DynamicImage/DynamicImage";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LoaderStyle5Component } from "@/components/Loader/Loader";
import ProductCard from "@/components/ProductCard/ProductCard";

const CategoryPage = () => {
  const params = useParams();
  const { categories, loadingCategories, fetchCategories } = useCategoryStore();
  const { products, loadingProducts, fetchProducts } = useProductStore();

  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);

  // Fetch categories with products
  useEffect(() => {
    fetchCategories({
      includeProducts: true,
      maxProducts: 100,
    });
  }, [fetchCategories]);

  // Find the matching category from the URL slug
  useEffect(() => {
    if (categories?.length > 0 && params?.cat) {
      const slug = params.cat.toLowerCase().replace(/-/g, " ");

      // Try exact match first (case insensitive)
      let foundCategory = categories.find(
        (cat) => cat?.name?.toLowerCase() === slug,
      );

      // If not found, try with original slug format
      if (!foundCategory) {
        foundCategory = categories.find((cat) => {
          const catSlug = cat?.name?.toLowerCase()?.replace(/\s+/g, "-");
          return catSlug === params?.cat?.toLowerCase();
        });
      }

      if (foundCategory) {
        setCurrentCategory(foundCategory);
      } else {
        setCurrentCategory(null);
      }
    }
  }, [categories, params?.cat]);

  // Fetch products for the found category
  useEffect(() => {
    if (currentCategory?.id) {
      fetchProducts({
        category_id: currentCategory.id,
        limit: 100,
      });
    }
  }, [currentCategory, fetchProducts]);

  // Update category products when products store updates
  useEffect(() => {
    if (products) {
      setCategoryProducts(products);
    }
  }, [products]);

  // Loading state
  if (loadingCategories || loadingProducts) {
    return (
      <main className="my-32 w-[90%] mx-auto">
        <div className="w-full h-screen flex flex-col gap-y-12 items-center justify-center">
          <LoaderStyle5Component />
          <p className="text-lg">Loading category...</p>
          {params?.cat && (
            <p className="text-sm text-gray-500">URL param: {params.cat}</p>
          )}
        </div>
      </main>
    );
  }

  // Category not found
  if (!currentCategory) {
    return (
      <main className="my-32 w-[90%] mx-auto">
        <div className="w-full h-screen flex flex-col gap-y-6 items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold">Category Not Found</h1>
          <p className="text-lg text-gray-600 capitalize">
            {params?.cat
              ? `The category "${params.cat.replace(/-/g, " ")}" doesn't exist or has been removed.`
              : "No category specified."}
          </p>
          {categories?.length > 0 && (
            <div className="text-sm text-gray-500">
              <p className="font-semibold mb-2">Available categories:</p>
              {categories.map((cat) =>
                cat?.name ? (
                  <div key={cat.id || Math.random()}>
                    <Link
                      href={`/category/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {cat.name}
                    </Link>
                  </div>
                ) : null,
              )}
            </div>
          )}
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mt-4"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="my-32 w-[90%] mx-auto">
      <div className="w-full mx-auto h-auto flex flex-col gap-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm md:text-base">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">
            {currentCategory?.name || "Category"}
          </span>
        </div>

        {/* Category Hero Section */}
        {currentCategory?.image_url && (
          <div className="relative w-full h-[250px] md:h-[350px] lg:h-[400px] rounded-2xl overflow-hidden shadow-2xl">
            <DynamicImage
              className="w-full h-full object-cover"
              width={1200}
              height={400}
              prod={currentCategory?.name || "Category"}
              prop={currentCategory.image_url}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <h1 className="text-white text-3xl md:text-5xl font-bold mb-3">
                {currentCategory?.name || "Category"}
              </h1>
              {currentCategory?.description && (
                <p className="text-white/90 text-lg md:text-xl max-w-2xl">
                  {currentCategory.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex flex-col gap-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-3xl font-bold">
              {categoryProducts?.length > 0
                ? `${categoryProducts.length} Product${categoryProducts.length !== 1 ? "s" : ""}`
                : "Products"}
            </h2>
          </div>

          {!categoryProducts || categoryProducts.length === 0 ? (
            <div className="w-full py-20 flex flex-col items-center justify-center gap-y-4">
              <ShoppingCart size={48} className="text-gray-400" />
              <p className="text-xl text-gray-600">
                No products found in this category
              </p>
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Browse other categories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product?.id || Math.random()}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;
