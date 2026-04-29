import { ButtonTwo } from "@/components/reusables/buttons/Buttons";
import {
  ShoppingCart,
  Minus,
  Plus,
  Heart,
  Share2,
  Loader2,
} from "lucide-react";

const ProductActions = ({
  product,
  quantity,
  isProcessing,
  isWishlisted,
  isAuthenticated,
  onIncrement,
  onDecrement,
  onAddToCart,
  onWishlistToggle,
  onShare,
}) => {
  const inStock = product?.stock_quantity > 0;

  return (
    <>
      {/* Quantity Selector */}
      {inStock && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Quantity</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={onDecrement}
              disabled={quantity <= 1}
              className="p-2 rounded-lg border-2 border-gray-300 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Minus size={20} />
            </button>
            <span className="text-xl font-semibold w-12 text-center">
              {quantity}
            </span>
            <button
              onClick={onIncrement}
              disabled={quantity >= product?.stock_quantity}
              className="p-2 rounded-lg border-2 border-gray-300 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <ButtonTwo
          className="flex-1 rounded-lg py-3 text-lg"
          iconValue={
            isProcessing ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <ShoppingCart size={20} />
            )
          }
          buttonValue={
            isProcessing
              ? "Adding..."
              : !inStock
                ? "Out of Stock"
                : "Add to Cart"
          }
          Clicked={onAddToCart}
          disabled={!inStock || isProcessing}
        />
      </div>

      {/* Wishlist Button (Mobile) - Only for authenticated users */}
      {isAuthenticated && (
        <button
          onClick={onWishlistToggle}
          disabled={isProcessing}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 sm:hidden"
        >
          <Heart
            size={20}
            className={isWishlisted ? "fill-red-500 text-red-500" : ""}
          />
          <span>
            {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          </span>
        </button>
      )}

      {/* Share Button */}
      <button
        onClick={onShare}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Share2 size={20} />
        <span>Share this product</span>
      </button>
    </>
  );
};

export default ProductActions;
