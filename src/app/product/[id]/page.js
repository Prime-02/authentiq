"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useProductStore, useCartStore, useWishlistStore } from "@/stores";
import { Loader } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductBreadcrumb from "./components/ProductBreadcrumb";
import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import ProductActions from "./components/ProductActions";
import ProductFeatures from "./components/ProductFeatures";
import ProductDetails from "./components/ProductDetails";
import ProductReviews from "./components/ProductReviews";
import { isAuthenticated } from "../../../../lib/axiosInstance";

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
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);

  // Get product ID from URL
  const productSlug = params?.product || params?.id || params?.slug;

  // Check authentication status
  useEffect(() => {
    setIsAuthenticatedUser(isAuthenticated());
  }, []);

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

  // Fetch wishlist if authenticated
  useEffect(() => {
    if (isAuthenticatedUser) {
      fetchWishlist();
    }
  }, [fetchWishlist, isAuthenticatedUser]);

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
    if (!product?.id) return;
    setIsProcessing(true);
    try {
      await addToCart(product.id, quantity);
      setQuantity(1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Wishlist toggle handler
  const handleWishlistToggle = async () => {
    if (!product?.id || isProcessing) return;
    setIsProcessing(true);
    try {
      if (isWishlisted) {
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
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    }
  };

  // Loading state
  if (loadingProducts) {
    return (
      <main className="my-32 w-[90%] mx-auto">
        <div className="w-full h-screen flex flex-col gap-y-12 items-center justify-center">
          <div className="relative">
            <Loader size={100} className="animate-spin" />
          </div>
          <p className="text-lg text-secondary">Loading Products...</p>
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

  return (
    <main className="my-32 w-[90%] mx-auto">
      <div className="w-full mx-auto h-auto flex flex-col gap-y-8">
        {/* Breadcrumb Navigation */}
        <ProductBreadcrumb product={product} />

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <ProductGallery
            productImage={productImage}
            productName={product?.name}
            isWishlisted={isWishlisted}
            isProcessing={isProcessing}
            isAuthenticated={isAuthenticatedUser}
            onWishlistToggle={handleWishlistToggle}
          />

          {/* Product Information */}
          <div className="flex flex-col gap-y-6">
            <ProductInfo
              product={product}
              sizes={sizes}
              selectedSize={selectedSize}
              onSizeSelect={setSelectedSize}
            />

            <ProductActions
              product={product}
              quantity={quantity}
              isProcessing={isProcessing}
              isWishlisted={isWishlisted}
              isAuthenticated={isAuthenticatedUser}
              onIncrement={incrementQuantity}
              onDecrement={decrementQuantity}
              onAddToCart={handleAddToCart}
              onWishlistToggle={handleWishlistToggle}
              onShare={handleShare}
            />

            <ProductFeatures />
          </div>
        </div>

        {/* Additional Product Details */}
        {(product?.barcode || product?.sizes) && (
          <ProductDetails product={product} />
        )}

        {/* Reviews Section - Only for authenticated users */}
        {isAuthenticatedUser && <ProductReviews productId={product?.id} />}
      </div>
    </main>
  );
};

export default ProductPage;
