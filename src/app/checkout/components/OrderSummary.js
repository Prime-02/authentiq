// components/OrderSummary.jsx
import React from "react";
import Link from "next/link";
import { Package } from "lucide-react";

const OrderSummary = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8">
        <Package size={48} className="text-muted mx-auto mb-3" />
        <p className="text-secondary">No items in your order</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {items.map((item) => {
        const product = item.product || {};
        const productName = product.name || item.name || "Product";
        const productImage =
          product.image_url || product.image || "/placeholder.jpg";
        const productPrice = product.price || item.price || 0;
        const quantity = item.quantity || 0;
        const itemTotal = productPrice * quantity;

        return (
          <div key={item.id} className="flex gap-4 py-4">
            <Link
              href={`/shop/${product.id || item.product_id}`}
              className="flex-shrink-0"
            >
              <img
                src={productImage}
                alt={productName}
                className="w-20 h-20 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "/placeholder.jpg";
                }}
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                href={`/shop/${product.id || item.product_id}`}
                className="font-medium hover:text-primary-600 transition-colors"
              >
                {productName}
              </Link>
              <p className="text-sm text-muted mt-1">
                Qty: {quantity} × ₦{productPrice.toFixed(2)}
              </p>
              {product.brand && (
                <p className="text-xs text-muted mt-1">{product.brand}</p>
              )}
            </div>
            <div className="font-semibold text-primary-600">
              ₦{itemTotal.toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderSummary;
