"use client";
import DynamicImage from "@/components/reusables/DynamicImage/DynamicImage";
import { useWishlistStore } from "@/stores";
import { useCartStore } from "@/stores/useCartStore";
import { useUIStore } from "@/stores/useUIStore";
import {
  ShoppingCart,
  Trash2,
  Heart,
  ArrowLeft,
  ShoppingBag,
  Loader2,
  Loader,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { isAuthenticated } from "../../../lib/axiosInstance";

const Wishlist = () => {
  const {
    userWishlist,
    wishlistNo,
    loadingWishlist,
    fetchWishlist,
    removeWishlistItem,
  } = useWishlistStore();

  const { addToCart, loadingMutation: cartLoading } = useCartStore();
  const { openModal } = useUIStore();

  const [addingToCartId, setAddingToCartId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      openModal("login");
      return;
    }

    setAddingToCartId(productId);
    try {
      await addToCart(productId, 1);
      toast.success("Product added to cart!");
      // Optional: Remove from wishlist after adding to cart
      // await removeWishlistItem(wishlistItemId);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setAddingToCartId(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm("Remove this item from your wishlist?")) {
      return;
    }

    setDeletingId(itemId);
    try {
      await removeWishlistItem(itemId);
      toast.success("Item removed from wishlist");
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleMoveAllToCart = async () => {
    if (userWishlist.length === 0) return;

    let successCount = 0;
    for (const item of userWishlist) {
      try {
        await addToCart(item.product_id || item.product?.id, 1);
        successCount++;
      } catch (error) {
        console.error(`Failed to add ${item.product?.name}:`, error);
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} item(s) added to cart!`);
    }
  };

  // Loading state
  if (loadingWishlist && userWishlist.length === 0 && isAuthenticated) {
    return (
      <main className="my-32 w-[90%] mx-auto">
        <div className="w-full h-screen flex flex-col gap-y-12 items-center justify-center">
          <div className="relative">
            <Loader size={100} className="animate-spin" />
          </div>
          <p className="text-lg text-secondary">Loading your wishlist...</p>
        </div>
      </main>
    );
  }

  // Unauthenticated state
  if (!isAuthenticated) {
    return (
      <main className="my-32 w-[90%] mx-auto">
        <div className="w-full max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-full bg-secondary">
              <Heart size={64} className="text-muted" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Your Wishlist Awaits
          </h1>
          <p className="text-secondary mb-8">
            Sign in to save your favorite items and never lose track of what you
            love
          </p>
          <button
            onClick={() => openModal("login")}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-semibold"
          >
            Sign In
          </button>
        </div>
      </main>
    );
  }

  // Empty wishlist state
  if (userWishlist.length === 0) {
    return (
      <main className="my-32 w-[90%] mx-auto">
        <div className="w-full max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-full bg-secondary">
              <Heart size={64} className="text-muted" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Your Wishlist is Empty
          </h1>
          <p className="text-secondary mb-4">
            Start adding items you love to your wishlist
          </p>
          <p className="text-muted text-sm mb-8">
            Save products you&apos;re interested in and come back to them
            anytime
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-semibold"
          >
            <ShoppingBag size={20} />
            Explore Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="my-32 w-[90%] mx-auto">
      <div className="w-full mx-auto h-auto flex flex-col gap-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">My Wishlist</h1>
            <p className="text-secondary mt-2">
              Products you&apos;ve saved for later
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary">
              <Heart size={18} className="text-primary-600 fill-primary-600" />
              <span className="font-semibold">{wishlistNo} items</span>
            </div>
            {userWishlist.length > 0 && (
              <button
                onClick={handleMoveAllToCart}
                disabled={cartLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white transition-all font-semibold disabled:opacity-50"
              >
                <ShoppingCart size={18} />
                Add All to Cart
              </button>
            )}
          </div>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {userWishlist.map((item) => {
            const product = item.product || {};
            const productId = product.id || item.product_id;
            const productName = product.name || "Product";
            const productImage =
              product.image_url || product.image || "/placeholder.jpg";
            const productPrice = product.price || 0;
            const originalPrice = product.original_price || null;
            const discount =
              originalPrice && originalPrice > productPrice
                ? Math.round(
                    ((originalPrice - productPrice) / originalPrice) * 100,
                  )
                : 0;
            const category =
              product.category_name || product.category || "Uncategorized";
            const sizes = product.sizes
              ? product.sizes.split(",").map((s) => s.trim())
              : [];
            const inStock = product.stock_quantity > 0;

            return (
              <div
                key={item.id}
                className="card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image Container */}
                <Link href={`/shop/${productId}`} className="relative block">
                  <div className="relative aspect-square overflow-hidden bg-secondary">
                    <DynamicImage
                      prop={productImage}
                      prod={productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                        -{discount}%
                      </div>
                    )}
                    {!inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold px-3 py-1 bg-black/70 rounded-lg">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link href={`/shop/${productId}`}>
                    <h3 className="font-semibold text-lg hover:text-primary-600 transition-colors line-clamp-1">
                      {productName}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 text-sm text-muted mt-1">
                    <span>{category}</span>
                    {sizes.length > 0 && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-muted"></span>
                        <span>{sizes.join(", ")}</span>
                      </>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary-600">
                      ${productPrice.toFixed(2)}
                    </span>
                    {originalPrice && originalPrice > productPrice && (
                      <span className="text-sm text-muted line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleAddToCart(productId, item.id)}
                      disabled={!inStock || addingToCartId === productId}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingToCartId === productId ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <ShoppingCart size={18} />
                      )}
                      <span className="text-sm">Add to Cart</span>
                    </button>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={deletingId === item.id}
                      className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                    >
                      {deletingId === item.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back to Shop Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors font-semibold"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Wishlist;
