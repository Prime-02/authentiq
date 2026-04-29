// components/PopularProductsList.jsx
import React from "react";
import { Package, TrendingUp } from "lucide-react";

const PopularProductsList = ({ products }) => {
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="p-8 bg-[var(--bg-primary)] rounded-xl border border-dashed border-[var(--border-light)] text-center">
        <Package
          size={32}
          className="mx-auto text-[var(--border-color)] mb-3"
        />
        <p className="text-sm text-[var(--text-muted)]">
          No product data available
        </p>
      </div>
    );
  }

  const maxQuantity = Math.max(
    ...products.map((p) => p.total_quantity_ordered || 0),
  );

  return (
    <div className="space-y-3">
      {products.slice(0, 10).map((product, index) => {
        const percentage =
          maxQuantity > 0
            ? ((product.total_quantity_ordered || 0) / maxQuantity) * 100
            : 0;

        return (
          <div
            key={product.product_id || index}
            className="p-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)] hover:border-[var(--border-hover)] transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[var(--success-100)] flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-[var(--success-700)]">
                    {index + 1}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                  {product.product_name || "Unknown Product"}
                </p>
              </div>
              <span className="text-sm font-bold text-[var(--primary-600)] flex-shrink-0">
                ₦{(product.total_revenue || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--success-400)] rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs text-[var(--text-muted)] flex-shrink-0">
                {product.total_quantity_ordered} units
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--text-muted)]">
              <span>{product.unique_orders} orders</span>
              <span>·</span>
              <span>
                Avg ₦{(product.average_unit_price || 0).toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PopularProductsList;
