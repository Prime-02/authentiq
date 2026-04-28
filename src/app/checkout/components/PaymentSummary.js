// components/PaymentSummary.jsx
import React from "react";
import { CreditCard, Loader2, Shield, Tag } from "lucide-react";

const PaymentSummary = ({
  subtotal,
  tax,
  shipping,
  total,
  itemsCount,
  onPayNow,
  isProcessing,
  disabled,
}) => {
  return (
    <div className="card rounded-2xl p-6">
      <h2 className="text-xl font-bold font-Montserrat mb-4">
        Payment Summary
      </h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-secondary">Subtotal ({itemsCount} items)</span>
          <span className="font-medium">₦{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-secondary">Tax (10%)</span>
          <span className="font-medium">₦{tax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-secondary">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              `₦${shipping.toLocaleString()}`
            )}
          </span>
        </div>

        {shipping > 0 && subtotal < 50 && (
          <div className="flex items-center gap-2 text-xs text-muted py-1">
            <Tag size={12} />
            <span>
              Add ₦{(50 - subtotal).toLocaleString()} more for free shipping
            </span>
          </div>
        )}

        <div className="border-t-2 border-border pt-3 mt-3">
          <div className="flex justify-between">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold text-primary-600">
              ₦{total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onPayNow}
        disabled={disabled || isProcessing}
        className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <CreditCard size={20} />
            <span>Pay Now</span>
          </>
        )}
      </button>

      <div className="mt-4 pt-4 border-t border-border space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Shield size={12} />
          <span>Your payment is secured by Paystack</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <CreditCard size={12} />
          <span>Pay with Card, Bank Transfer, USSD, or QR</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
