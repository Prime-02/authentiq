// components/CheckoutFeatures.jsx
import React from "react";
import { Truck, Shield, RotateCcw, CreditCard, Lock } from "lucide-react";

const CheckoutFeatures = () => {
  return (
    <div className="mt-6 pt-6 border-t border-border">
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Shield size={18} className="text-muted" />
          <span className="text-secondary">
            Secure checkout powered by Paystack
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Truck size={18} className="text-muted" />
          <span className="text-secondary">
            Free shipping on orders over $50
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <RotateCcw size={18} className="text-muted" />
          <span className="text-secondary">30-day easy returns</span>
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-4 pt-4 border-t border-border">
        <span className="text-2xl"><CreditCard/></span>
        <span className="text-2xl"><Lock/></span>
        <span className="text-2xl"><Shield/></span>
      </div>
    </div>
  );
};

export default CheckoutFeatures;
