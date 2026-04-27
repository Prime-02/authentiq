// components/PromoCodeInput.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";

const PromoCodeInput = () => {
  const [promoCode, setPromoCode] = useState("");

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.warning("Please enter a promo code");
      return;
    }
    // Add promo code logic here
    toast.info("Promo code feature coming soon!");
  };

  return (
    <div className="card rounded-2xl p-6 mt-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-border bg-transparent focus:outline-none focus:border-primary-400 transition-colors"
        />
        <button
          onClick={handleApplyPromo}
          className="px-4 py-2 bg-secondary text-primary-600 rounded-lg hover:bg-tertiary transition-colors font-semibold"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default PromoCodeInput;
