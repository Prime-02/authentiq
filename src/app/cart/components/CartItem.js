// components/CartItem.jsx
import React, { useState } from "react";
import Link from "next/link";
import { Trash2, AlertTriangle, AlertCircle, Package } from "lucide-react";
import { toast } from "react-toastify";
import { useCartStore } from "@/stores";
import QuantityControl from "./QuantityControl";
import Modal from "@/components/Modal/Modal";

const CartItem = ({ item }) => {
  const { updateCartItemQuantity, removeCartItem, loadingMutation } =
    useCartStore();
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const product = item.product || {};
  const productId = product.id || item.product_id;
  const productName = product.name || item.name || "Product";
  const productImage = product.image_url || product.image || "/placeholder.jpg";
  const productPrice = product.price || item.price || 0;
  const stockQuantity = product.stock_quantity ?? 0;
  const quantity = item.quantity || 0;
  const itemTotal = productPrice * quantity;

  // Check if current quantity exceeds available stock
  const isOverStock = stockQuantity > 0 && quantity > stockQuantity;
  // Check if at max stock
  const isAtMaxStock = stockQuantity > 0 && quantity >= stockQuantity;
  // Check if out of stock
  const isOutOfStock = stockQuantity === 0;
  // Check if low stock
  const isLowStock = stockQuantity > 0 && stockQuantity <= 5 && !isOverStock;

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }
    if (stockQuantity > 0 && newQuantity > stockQuantity) {
      toast.error(`Only ${stockQuantity} items available in stock`);
      return;
    }
    await updateCartItemQuantity(item.id, newQuantity);
  };

  const handleRemoveItem = async () => {
    setIsRemoving(true);
    try {
      await removeCartItem(item.id);
      setConfirmRemove(false);
      toast.success(`"${productName}" removed from cart`);
    } catch (error) {
      toast.error("Failed to remove item. Please try again.");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:grid md:grid-cols-12 gap-4">
        {/* Product Info */}
        <div className="md:col-span-6 flex gap-4">
          <Link href={`/product/${productId}`} className="flex-shrink-0 relative">
            <img
              src={productImage}
              alt={productName}
              className={`w-24 h-24 object-cover rounded-xl ${
                isOutOfStock ? "opacity-50" : ""
              }`}
              onError={(e) => {
                e.target.src = "/placeholder.jpg";
              }}
            />
            {/* Low stock indicator */}
            {isLowStock && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                {stockQuantity} left
              </span>
            )}
          </Link>
          <div className="flex-1">
            <Link
              href={`/shop/${productId}`}
              className={`font-semibold text-lg hover:text-primary-600 transition-colors ${
                isOutOfStock ? "text-muted" : ""
              }`}
            >
              {productName}
            </Link>
            {product.brand && (
              <p className="text-sm text-muted mt-1">{product.brand}</p>
            )}

            {/* Stock status messages */}
            {isOutOfStock && (
              <div className="flex items-center gap-1 text-red-500 text-sm mt-2">
                <AlertCircle size={14} />
                <span>Out of stock</span>
              </div>
            )}
            {isOverStock && (
              <div className="flex items-center gap-1 text-red-500 text-sm mt-2">
                <AlertCircle size={14} />
                <span>Exceeds available stock ({stockQuantity} available)</span>
              </div>
            )}
            {isLowStock && (
              <div className="flex items-center gap-1 text-orange-500 text-sm mt-2">
                <Package size={14} />
                <span>Only {stockQuantity} left in stock</span>
              </div>
            )}
            {!isOutOfStock &&
              !isOverStock &&
              !isLowStock &&
              stockQuantity > 0 && (
                <div className="flex items-center gap-1 text-green-600 text-sm mt-2">
                  <Package size={14} />
                  <span>In stock</span>
                </div>
              )}

            <button
              onClick={() => setConfirmRemove(true)}
              disabled={loadingMutation}
              className="flex items-center gap-1 text-red-500 text-sm mt-2 hover:text-red-700 transition-colors disabled:opacity-50"
            >
              <Trash2 size={14} />
              Remove
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="md:col-span-2">
          <div className="text-center">
            <span className="md:hidden font-semibold text-sm block mb-1 text-muted">
              Price:
            </span>
            <span
              className={`font-semibold ${isOutOfStock ? "text-muted" : ""}`}
            >
              ${productPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Quantity */}
        <div className="md:col-span-2">
          <QuantityControl
            quantity={quantity}
            onIncrease={() => handleQuantityChange(quantity + 1)}
            onDecrease={() => handleQuantityChange(quantity - 1)}
            disabled={loadingMutation || isOutOfStock}
            maxQuantity={stockQuantity}
            isAtMax={isAtMaxStock}
            isOutOfStock={isOutOfStock}
          />
        </div>

        {/* Total */}
        <div className="md:col-span-2">
          <div className="text-right">
            <span className="md:hidden font-semibold text-sm block mb-1 text-muted">
              Total:
            </span>
            <span
              className={`font-bold text-lg ${
                isOverStock || isOutOfStock
                  ? "text-red-500"
                  : "text-primary-600"
              }`}
            >
              ${itemTotal.toFixed(2)}
            </span>
            {isOverStock && (
              <p className="text-xs text-red-500 mt-1">Adjust quantity</p>
            )}
            {isOutOfStock && (
              <p className="text-xs text-red-500 mt-1">Item unavailable</p>
            )}
          </div>
        </div>
      </div>

      {/* Remove Confirmation Modal */}
      <Modal
        isOpen={confirmRemove}
        onClose={() => !isRemoving && setConfirmRemove(false)}
        title="Remove Item"
      >
        <div className="space-y-4">
          {/* Warning Icon */}
          <div className="flex justify-center">
            <div className="p-3 bg-red-50 rounded-full">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
          </div>

          {/* Modal Content */}
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">Remove this item?</p>
            <p className="text-secondary">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-primary">
                "{productName}"
              </span>{" "}
              from your cart?
            </p>
            <p className="text-sm text-muted">This action cannot be undone.</p>
          </div>

          {/* Product Preview in Modal */}
          <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
            <img
              src={productImage}
              alt={productName}
              className="w-16 h-16 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = "/placeholder.jpg";
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{productName}</p>
              <p className="text-sm text-muted">
                Qty: {quantity} × ${productPrice.toFixed(2)}
              </p>
            </div>
            <div className="font-semibold text-primary-600">
              ${itemTotal.toFixed(2)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setConfirmRemove(false)}
              disabled={isRemoving}
              className="flex-1 px-4 py-2.5 border-2 border-border rounded-lg hover:bg-secondary transition-colors font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleRemoveItem}
              disabled={isRemoving || loadingMutation}
              className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isRemoving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Removing...</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>Remove Item</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CartItem;
