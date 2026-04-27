// components/QuantityControl.jsx
import React from "react";
import { Minus, Plus, AlertCircle } from "lucide-react";

const QuantityControl = ({
  quantity,
  onIncrease,
  onDecrease,
  disabled,
  maxQuantity,
  isAtMax,
  isOutOfStock = false,
}) => {
  const isMinusDisabled = disabled || quantity <= 1;
  const isPlusDisabled = disabled || isAtMax || isOutOfStock;

  // If out of stock, show a message instead of controls
  if (isOutOfStock) {
    return (
      <div className="text-center">
        <span className="md:hidden font-semibold text-sm block mb-1 text-muted">
          Quantity:
        </span>
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={true}
            className="p-1 rounded-lg border-2 border-border opacity-50 cursor-not-allowed"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center font-medium text-muted">
            {quantity}
          </span>
          <button
            disabled={true}
            className="p-1 rounded-lg border-2 border-border opacity-50 cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>
        <p className="text-xs text-red-500 mt-1 flex items-center justify-center gap-1">
          <AlertCircle size={12} />
          <span>Out of stock</span>
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <span className="md:hidden font-semibold text-sm block mb-1 text-muted">
        Quantity:
      </span>
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={onDecrease}
          disabled={isMinusDisabled}
          className="p-1 rounded-lg border-2 border-border hover:border-primary-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border"
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>
        <span
          className={`w-12 text-center font-medium ${
            isAtMax ? "text-orange-500" : ""
          }`}
        >
          {quantity}
        </span>
        <button
          onClick={onIncrease}
          disabled={isPlusDisabled}
          className="p-1 rounded-lg border-2 border-border hover:border-primary-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border"
          aria-label="Increase quantity"
          title={
            isAtMax
              ? `Maximum available: ${maxQuantity}`
              : isOutOfStock
                ? "Out of stock"
                : ""
          }
        >
          <Plus size={16} />
        </button>
      </div>
      {isAtMax && !isOutOfStock && (
        <p className="text-xs text-orange-500 mt-1">
          Max available: {maxQuantity}
        </p>
      )}
    </div>
  );
};

export default QuantityControl;
