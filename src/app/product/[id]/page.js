"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useProductStore, useCartStore, useWishlistStore } from "@/stores";
import DynamicImage from "@/components/reusables/DynamicImage/DynamicImage";
import { ButtonTwo } from "@/components/reusables/buttons/Buttons";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  ArrowLeft,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { LoaderStyle5Component } from "@/components/Loader/Loader";
import Barcode from "@/components/barcode/BarcodePage";

const ProductPage = () => {
  const params = useParams();
  const { fetchProduct, loadingProducts } = useProductStore();
  const { addToCart, loadingMutation: cartLoading } = useCartStore();
  const {
    addToWishlist,
    removeWishlistItem,
    userWishlist,
    fetchWishlist,
    loadingMutation: wishlistLoading,
  } = useWishlistStore();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get product ID from URL
  const productSlug = params?.product || params?.id || params?.slug;

  // Fetch product details
  useEffect(() => {
    const loadProduct = async () => {
      if (productSlug) {
        const data = await fetchProduct(productSlug);
        if (data) {
          setProduct(data);
          // Set default selected size if sizes are available
          if (data.sizes) {
            const sizes = data.sizes.split(",");
            setSelectedSize(sizes[0].trim());
          }
        }
      }
    };

    loadProduct();
  }, [productSlug, fetchProduct]);

  // Fetch wishlist to check if product is wishlisted
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Check if current product is in wishlist
  useEffect(() => {
    if (product && userWishlist?.length > 0) {
      const isInWishlist = userWishlist.some(
        (item) =>
          item.product_id === product.id || item.product?.id === product.id,
      );
      setIsWishlisted(isInWishlist);
    }
  }, [product, userWishlist]);

  // Quantity handlers
  const incrementQuantity = () => {
    if (product?.stock_quantity && quantity < product.stock_quantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Add to cart handler
  const handleAddToCart = async () => {
    if (!product?.id) {
      return;
    }

    setIsProcessing(true);
    try {
      await addToCart(product.id, quantity);
      // Reset quantity after successful add
      setQuantity(1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Wishlist toggle handler
  const handleWishlistToggle = async () => {
    if (!product?.id) {
      return;
    }

    setIsProcessing(true);
    try {
      if (isWishlisted) {
        // Find the wishlist item ID
        const wishlistItem = userWishlist.find(
          (item) =>
            item.product_id === product.id || item.product?.id === product.id,
        );
        if (wishlistItem?.id) {
          await removeWishlistItem(wishlistItem.id);
          setIsWishlisted(false);
        }
      } else {
        await addToWishlist(product.id);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Share product handler
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    }
  };

  // Loading state
  if (loadingProducts) {
    return (
      <main className="my-32 w-[90%] mx-auto">
        <div className="w-full h-screen flex flex-col gap-y-12 items-center justify-center">
          <LoaderStyle5Component />
          <p className="text-lg">Loading product...</p>
        </div>
      </main>
    );
  }

  // Product not found
  if (!product) {
    return (
      <main className="my-32 w-[90%] mx-auto">
        <div className="w-full h-screen flex flex-col gap-y-6 items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold">Product Not Found</h1>
          <p className="text-lg text-gray-600">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mt-4"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const productImage = product?.image_url || product?.image;
  const sizes = product?.sizes
    ? product.sizes.split(",").map((s) => s.trim())
    : [];
  const inStock = product?.stock_quantity > 0;
  const lowStock = product?.stock_quantity > 0 && product?.stock_quantity <= 5;

  return (
    <main className="my-32 w-[90%] mx-auto">
      <div className="w-full mx-auto h-auto flex flex-col gap-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm md:text-base flex-wrap">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          {product?.category_id && (
            <>
              <Link
                href={`/category/${product?.category_name?.toLowerCase()?.replace(/\s+/g, "-") || "category"}`}
                className="text-gray-600 hover:text-gray-900"
              >
                {product?.category_name || "Category"}
              </Link>
              <span className="text-gray-400">/</span>
            </>
          )}
          <span className="text-gray-900 font-semibold truncate">
            {product?.name || "Product"}
          </span>
        </nav>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="flex flex-col gap-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gray-50">
              {productImage && (
                <DynamicImage
                  className="w-full h-full object-cover"
                  width={600}
                  height={600}
                  prod={product?.name || "Product"}
                  prop={productImage}
                />
              )}
              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
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
                      isWishlisted
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }`}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Product Information */}
          <div className="flex flex-col gap-y-6">
            {/* Product Name and Price */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {product?.name}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-3xl md:text-4xl font-bold text-green-600">
                  ${product?.price?.toLocaleString()}
                </p>
                {product?.original_price &&
                  product.original_price > product.price && (
                    <p className="text-xl text-gray-400 line-through">
                      ${product.original_price.toLocaleString()}
                    </p>
                  )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  inStock ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm md:text-base font-medium">
                {!inStock
                  ? "Out of Stock"
                  : lowStock
                    ? `Only ${product.stock_quantity} left in stock`
                    : "In Stock"}
              </span>
            </div>

            {/* Product Description */}
            {product?.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Size: {selectedSize}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-gray-500"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {inStock && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Quantity</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-2 rounded-lg border-2 border-gray-300 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
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
                Clicked={handleAddToCart}
                disabled={!inStock || isProcessing}
              />
              <button
                className="flex-1 px-6 py-3 rounded-lg border-2 border-black hover:bg-black hover:text-white transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!inStock || isProcessing}
              >
                Buy Now
              </button>
            </div>

            {/* Wishlist Button (Mobile) */}
            <button
              onClick={handleWishlistToggle}
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

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Share2 size={20} />
              <span>Share this product</span>
            </button>

            {/* Features/Services */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck size={24} className="text-gray-600" />
                <div>
                  <p className="font-semibold text-sm">Free Shipping</p>
                  <p className="text-xs text-gray-500">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={24} className="text-gray-600" />
                <div>
                  <p className="font-semibold text-sm">Secure Payment</p>
                  <p className="text-xs text-gray-500">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw size={24} className="text-gray-600" />
                <div>
                  <p className="font-semibold text-sm">Easy Returns</p>
                  <p className="text-xs text-gray-500">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Product Details */}
        {(product?.barcode || product?.sizes) && (
          <div className="mt-12 p-6 card rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product?.barcode && (
                <div>
                  <p className="text-sm text-gray-500">Barcode</p>
                  <Barcode value={product.barcode} height={25} displayValue={false} width={1} />
                </div>
              )}
              {product?.sizes && (
                <div>
                  <p className="text-sm text-gray-500">Available Sizes</p>
                  <p className="font-semibold">
                    {product.sizes.replace(/,/g, ", ")}
                  </p>
                </div>
              )}
              {product?.stock_quantity !== undefined && (
                <div>
                  <p className="text-sm text-gray-500">Stock Quantity</p>
                  <p className="font-semibold">
                    {product.stock_quantity} units
                  </p>
                </div>
              )}
              {product?.created_at && (
                <div>
                  <p className="text-sm text-gray-500">Added</p>
                  <p className="font-semibold">
                    {new Date(product.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductPage;
