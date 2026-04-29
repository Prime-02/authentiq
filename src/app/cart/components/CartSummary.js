// components/CartSummary.jsx
import React, { useState } from "react";
import { useCartStore } from "@/stores";
import { useAuthStore } from "@/stores";
import { useUIStore } from "@/stores";
import { toast } from "react-toastify";
import {
  Truck,
  Shield,
  RotateCcw,
  CreditCard,
  Loader2,
  Tag,
  AlertTriangle,
} from "lucide-react";
import SummaryRow from "./SummaryRow";
import AdminBadge from "./AdminBadge";
import PromoCodeInput from "./PromoCodeInput";
import CheckoutFeatures from "./CheckoutFeature";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../../../lib/axiosInstance";

const CartSummary = ({ hasStockIssues = false }) => {
  const { userCart, loadingMutation } = useCartStore();
  const { openModal } = useUIStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
      const router = useRouter()


  const calculateSubtotal = () => {
    return userCart.reduce((total, item) => {
      const price = item.product?.price || item.price || 0;
      const quantity = item.quantity || 0;
      return total + price * quantity;
    }, 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.1; // 10% tax rate
  };

  const calculateShipping = (subtotal) => {
    return subtotal > 50 ? 0 : 5.99;
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + tax + shipping;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      openModal("login");
      return;
    }

    if (userCart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (hasStockIssues) {
      toast.error("Please resolve stock issues before checking out");
      return;
    }

    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      toast.success("Redirecting to checkout...");
      // Navigate to checkout page
      router.push('/checkout');
      setIsCheckingOut(false);
    }, 1000);
  };

  return (
    <div className="lg:col-span-1">
      <div className="card rounded-2xl p-6 sticky top-4">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

        {/* Stock Issues Warning in Summary */}
        {hasStockIssues && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertTriangle size={16} className="flex-shrink-0" />
            <p className="text-xs">
              Please resolve stock issues before checking out
            </p>
          </div>
        )}

        <div className="space-y-3 mb-4">
          <SummaryRow label="Subtotal" value={`₦${subtotal.toFixed(2)}`} />
          <SummaryRow
            label="Tax (10%)"
            value={`₦${tax.toFixed(2)}`}
            withBorder
          />
          <SummaryRow
            label="Shipping"
            value={shipping === 0 ? "Free" : `₦${shipping.toFixed(2)}`}
            withBorder
          />

          {shipping > 0 && subtotal < 50 && (
            <div className="flex items-center gap-2 text-sm text-muted py-2">
              <Tag size={14} />
              <span>
                Add ${(50 - subtotal).toFixed(2)} more for free shipping
              </span>
            </div>
          )}

          <div className="border-t-2 border-border pt-4 mt-2">
            <div className="flex justify-between">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-primary-600">
                ₦{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={
            loadingMutation ||
            isCheckingOut ||
            userCart.length === 0 ||
            hasStockIssues
          }
          className="w-full btn btn-secondary py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          title={
            hasStockIssues
              ? "Please resolve stock issues before checkout"
              : userCart.length === 0
                ? "Your cart is empty"
                : ""
          }
        >
          {isCheckingOut ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CreditCard size={20} />
              <span>Proceed to Checkout</span>
            </>
          )}
        </button>

        {hasStockIssues && (
          <p className="text-xs text-red-500 text-center mt-2">
            Please resolve stock issues before checking out
          </p>
        )}

        <CheckoutFeatures />
        <AdminBadge />
      </div>

      <PromoCodeInput />
    </div>
  );
};

export default CartSummary;
