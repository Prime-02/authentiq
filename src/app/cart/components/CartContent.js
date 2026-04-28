// components/CartContent.jsx
import React, { useState } from "react";
import { useCartStore } from "@/stores";
import {
  Trash2,
  ArrowLeft,
  AlertTriangle,
  Package,
  ShoppingCart,
  X,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import CartHeader from "./CartHeader";
import CartItemsList from "./CartItemsList";
import CartSummary from "./CartSummary";
import Modal from "@/components/Modal/Modal";

const CartContent = () => {
  const { userCart, clearCart, loadingMutation } = useCartStore();
  const [confirmClearCart, setConfirmClearCart] = useState(false);
  const [isClearingCart, setIsClearingCart] = useState(false);

  const handleClearCart = async () => {
    setIsClearingCart(true);
    try {
      await clearCart();
      setConfirmClearCart(false);
      toast.success("Cart cleared successfully");
    } catch (error) {
      toast.error("Failed to clear cart. Please try again.");
    } finally {
      setIsClearingCart(false);
    }
  };

  // Check for items that exceed available stock or are out of stock
  const stockIssues = userCart.reduce(
    (issues, item) => {
      const stockQuantity = item.product?.stock_quantity ?? 0;
      const quantity = item.quantity || 0;

      if (stockQuantity === 0) {
        issues.outOfStock.push(item);
      } else if (quantity > stockQuantity) {
        issues.overStock.push(item);
      }
      return issues;
    },
    { outOfStock: [], overStock: [] },
  );

  const hasStockIssues =
    stockIssues.outOfStock.length > 0 || stockIssues.overStock.length > 0;
  const hasOutOfStockItems = stockIssues.outOfStock.length > 0;
  const hasOverStockItems = stockIssues.overStock.length > 0;

  // Calculate total items and total value
  const totalItems = userCart.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );
  const totalValue = userCart.reduce((sum, item) => {
    const price = item.product?.price || item.price || 0;
    const quantity = item.quantity || 0;
    return sum + price * quantity;
  }, 0);

  return (
    <main className="my-32 w-[90%] mx-auto">
      <div className="w-full mx-auto h-auto flex flex-col gap-y-8">
        <CartHeader />

        {/* Out of Stock Warning */}
        {hasOutOfStockItems && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertTriangle size={20} className="flex-shrink-0" />
            <div>
              <p className="font-semibold">Out of Stock Items</p>
              <p className="text-sm">
                {stockIssues.outOfStock.length} item(s) in your cart are
                currently out of stock. Please remove them before proceeding to
                checkout.
              </p>
            </div>
          </div>
        )}

        {/* Over Stock Warning */}
        {hasOverStockItems && !hasOutOfStockItems && (
          <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-700">
            <AlertTriangle size={20} className="flex-shrink-0" />
            <div>
              <p className="font-semibold">Stock Alert</p>
              <p className="text-sm">
                Some items in your cart exceed available stock. Please adjust
                quantities before proceeding to checkout.
              </p>
            </div>
          </div>
        )}

        {/* Low Stock Warning */}
        {!hasStockIssues &&
          userCart.some((item) => {
            const stockQuantity = item.product?.stock_quantity ?? 0;
            return stockQuantity > 0 && stockQuantity <= 5;
          }) && (
            <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
              <Package size={20} className="flex-shrink-0" />
              <div>
                <p className="font-semibold">Limited Stock</p>
                <p className="text-sm">
                  Some items in your cart have limited stock. Order soon to
                  avoid disappointment.
                </p>
              </div>
            </div>
          )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card rounded-2xl overflow-hidden">
              <CartItemsList />

              {/* Footer Actions */}
              <div className="p-4 bg-secondary border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3">
                <button
                  onClick={() => setConfirmClearCart(true)}
                  disabled={loadingMutation}
                  className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={18} />
                  Clear Cart
                </button>
                <Link
                  href="/"
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <ArrowRight size={18} />
                  Continue Shopping
                </Link>
                <Link
                  href="/cart/order_history"
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <ArrowLeft size={18} />
                  Order History
                </Link>
              </div>
            </div>
          </div>

          <CartSummary hasStockIssues={hasStockIssues} />
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      <Modal
        isOpen={confirmClearCart}
        onClose={() => !isClearingCart && setConfirmClearCart(false)}
        title="Clear Cart"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Clear Shopping Cart</h3>
            <button
              onClick={() => setConfirmClearCart(false)}
              disabled={isClearingCart}
              className="p-1 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Warning Icon */}
          <div className="flex justify-center">
            <div className="p-3 bg-red-50 rounded-full">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
          </div>

          {/* Modal Content */}
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">Remove all items?</p>
            <p className="text-secondary">
              Are you sure you want to clear your entire shopping cart? This
              action cannot be undone.
            </p>
          </div>

          {/* Cart Summary in Modal */}
          <div className="p-4 bg-secondary rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <ShoppingCart size={16} className="text-muted" />
              <span className="text-muted">Cart Summary</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Total Items</span>
                <span className="font-semibold">{totalItems}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Total Products</span>
                <span className="font-semibold">{userCart.length}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-border pt-2">
                <span className="text-secondary">Total Value</span>
                <span className="font-semibold text-primary-600">
                  ${totalValue.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Items Preview */}
            <div className="border-t border-border pt-2">
              <p className="text-xs text-muted mb-2">Items to be removed:</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {userCart.slice(0, 3).map((item) => {
                  const product = item.product || {};
                  const productName = product.name || item.name || "Product";
                  const productImage =
                    product.image_url || product.image || "/placeholder.jpg";
                  const productPrice = product.price || item.price || 0;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <img
                        src={productImage}
                        alt={productName}
                        className="w-8 h-8 object-cover rounded"
                        onError={(e) => {
                          e.target.src = "/placeholder.jpg";
                        }}
                      />
                      <span className="flex-1 truncate">{productName}</span>
                      <span className="text-muted">
                        Qty: {item.quantity || 0} × ${productPrice.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
                {userCart.length > 3 && (
                  <p className="text-xs text-muted text-center">
                    ...and {userCart.length - 3} more item(s)
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmClearCart(false)}
              disabled={isClearingCart}
              className="flex-1 px-4 py-2.5 border-2 border-border rounded-lg hover:bg-secondary transition-colors font-semibold disabled:opacity-50"
            >
              Keep Items
            </button>
            <button
              onClick={handleClearCart}
              disabled={isClearingCart || loadingMutation}
              className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isClearingCart ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Clearing...</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>Clear Cart</span>
                </>
              )}
            </button>
          </div>

          {/* Additional Warning */}
          <p className="text-xs text-muted text-center">
            This will permanently remove all items from your cart.
          </p>
        </div>
      </Modal>
    </main>
  );
};

export default CartContent;
