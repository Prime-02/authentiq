import React from "react";
import { TrendingUp, DollarSign, Package } from "lucide-react";

export default function BestSellingProducts({ data, days, onProductClick }) {
  const maxSold = Math.max(
    ...(data.products?.map((p) => p.units_sold) || [1]),
    1,
  );

  return (
    <div
      className="card rounded-xl p-6 border"
      style={{ borderColor: "var(--border-color)" }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: "var(--success-100)" }}
        >
          <TrendingUp
            className="w-5 h-5"
            style={{ color: "var(--success-600)" }}
          />
        </div>
        <div>
          <h3
            className="text-lg font-semibold font-Montserrat"
            style={{ color: "var(--text-primary)" }}
          >
            Best Selling Products
          </h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {days ? `Last ${days} days` : "All time"} • {data.count || 0}{" "}
            products
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {data.products?.map((product, index) => {
          const barWidth = ((product.units_sold / maxSold) * 100).toFixed(0);
          return (
            <div
              key={product.product_id}
              className="cursor-pointer group"
              onClick={() => onProductClick(product.product_id)}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-sm font-medium truncate flex-1 group-hover:underline font-Poppins"
                  style={{ color: "var(--text-primary)" }}
                >
                  {index + 1}. {product.name}
                </span>
                <span
                  className="text-sm font-bold ml-2 font-Montserrat"
                  style={{ color: "var(--success-600)" }}
                >
                  {product.units_sold} sold
                </span>
              </div>
              <div
                className="w-full h-3 rounded-full relative"
                style={{ backgroundColor: "var(--bg-tertiary)" }}
              >
                <div
                  className="h-3 rounded-full transition-all duration-700 relative"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: "var(--success-400)",
                    opacity: 0.7,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <div className="flex items-center gap-1">
                  <DollarSign
                    className="w-3 h-3"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    ${(product.total_revenue || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Package
                    className="w-3 h-3"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Stock: {product.current_stock}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
