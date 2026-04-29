// components/ProductCard/ProductCard.jsx
"use client";
import { useState } from "react";
import { Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import Link from "next/link";
import DynamicImage from "@/components/reusables/DynamicImage/DynamicImage";
import { ButtonTwo } from "@/components/reusables/buttons/Buttons";
import { useCartStore } from "@/stores/useCartStore";
import { useWishlistStore } from "@/stores/useWishlistStore";

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const { addToCart, loadingMutation: cartLoading } = useCartStore();
  const {
    addToWishlist,
    removeWishlistItem,
    userWishlist,
    loadingMutation: wishlistLoading,
  } = useWishlistStore();

  // Return null if product is invalid
  if (!product?.id) return null;

  const productImage = product?.image_url || product?.image;
  const hasStock = product?.stock_quantity > 0;
  const stockAvailable =
    product?.stock_quantity !== undefined && product?.stock_quantity !== null;

  // Check if product is in wishlist
  const checkWishlistStatus = () => {
    if (userWishlist && userWishlist.length > 0) {
      const found = userWishlist.some(
        (item) => item.product_id === product.id || item.id === product.id,
      );
      setIsInWishlist(found);
    }
  };

  // Call check on mount and when wishlist changes
  useState(() => {
    checkWishlistStatus();
  }, [userWishlist]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const newQty = prev + delta;
      if (newQty < 1) return 1;
      if (stockAvailable && newQty > product.stock_quantity) {
        return product.stock_quantity;
      }
      return newQty;
    });
  };

  const handleAddToCart = async () => {
    if (!hasStock && stockAvailable) {
      toast.error("This product is out of stock.");
      return;
    }
    await addToCart(product.id, quantity);
    setQuantity(1); // Reset quantity after adding
  };

  const handleWishlistToggle = async () => {
    if (isInWishlist) {
      // Find the wishlist item ID to remove
      const wishlistItem = userWishlist.find(
        (item) => item.product_id === product.id || item.id === product.id,
      );
      if (wishlistItem) {
        await removeWishlistItem(wishlistItem.id);
        setIsInWishlist(false);
      }
    } else {
      await addToWishlist(product.id);
      setIsInWishlist(true);
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-between p-5 card relative shadow-xl overflow-hidden rounded-lg hover:shadow-2xl transition-shadow duration-300">
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        disabled={wishlistLoading}
        className="absolute top-2 right-2 cursor-pointer z-10 disabled:opacity-50 disabled:cursor-not-allowed"
        title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={20}
          className={`transition-colors ${
            isInWishlist ? "fill-red-500 text-red-500" : "hover:text-red-500"
          }`}
        />
      </button>

      {/* Product Image */}
      {productImage && (
        <Link
          href={`/product/${product?.id}`}
          className="rounded-lg flex items-center justify-center flex-1 w-full mb-4"
        >
          <DynamicImage
            className="object-cover drop-shadow-2xl hover:scale-90 transition-transform duration-300 w-auto h-auto"
            width={250}
            height={250}
            prod={product.name || "Product"}
            prop={productImage}
          />
        </Link>
      )}

      {/* Product Details */}
      <div className="w-full flex flex-col items-start gap-y-2">
        {/* Product Name */}
        {product.name && (
          <Link href={`/product/${product?.id}`} className="flex flex-col">
            <figcaption className="text-lg font-bold hover:text-blue-600 transition-colors">
              {product.name}
            </figcaption>
          </Link>
        )}

        {/* Product Description */}
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Available Sizes */}
        {product.sizes && (
          <p className="text-sm text-gray-500">
            Available sizes: {product.sizes.replace(/,/g, ", ")}
          </p>
        )}

        {/* Stock Status */}
        {stockAvailable && (
          <p className="text-sm">
            {hasStock ? (
              <span className="text-green-600">
                In Stock ({product.stock_quantity} available)
              </span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </p>
        )}

        {/* Quantity Selector */}
        {hasStock && stockAvailable && (
          <div className="flex items-center gap-2 w-full">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-1.5  disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                type="button"
              >
                <Minus size={14} />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 1) {
                    if (stockAvailable && val <= product.stock_quantity) {
                      setQuantity(val);
                    } else if (stockAvailable) {
                      setQuantity(product.stock_quantity);
                    } else {
                      setQuantity(val);
                    }
                  }
                }}
                className="w-12 text-center text-sm border-x card py-1 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="1"
                max={product.stock_quantity}
              />
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={stockAvailable && quantity >= product.stock_quantity}
                className="p-1.5  disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                type="button"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Price and Add to Cart */}
        <div className="flex justify-between items-center w-full mt-4">
          <p className="text-xl font-bold">
            ₦{product.price?.toLocaleString() || "0"}
          </p>
          <ButtonTwo
            Clicked={handleAddToCart}
            className="rounded-md"
            iconValue={cartLoading ? null : <ShoppingCart size={15} />}
            buttonValue={cartLoading ? "Adding..." : "Add to Cart"}
            disabled={(!hasStock && stockAvailable) || cartLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
