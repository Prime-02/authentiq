import DynamicImage from "@/components/reusables/DynamicImage/DynamicImage";
import { Heart, Loader2 } from "lucide-react";

const ProductGallery = ({
  productImage,
  productName,
  isWishlisted,
  isProcessing,
  isAuthenticated,
  onWishlistToggle,
}) => {
  return (
    <div className="flex flex-col gap-y-4">
      {/* Main Image */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gray-50">
        {productImage && (
          <DynamicImage
            className="w-full h-full object-cover"
            width={600}
            height={600}
            prod={productName || "Product"}
            prop={productImage}
          />
        )}
        {/* Wishlist Button - Only show for authenticated users */}
        {isAuthenticated && (
          <button
            onClick={onWishlistToggle}
            disabled={isProcessing}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            {isProcessing ? (
              <Loader2 size={24} className="animate-spin text-gray-600" />
            ) : (
              <Heart
                size={24}
                className={`transition-colors ${
                  isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;
