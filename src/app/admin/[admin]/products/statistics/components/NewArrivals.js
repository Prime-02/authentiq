import React from "react";
import { Clock, Sparkles } from "lucide-react";

export default function NewArrivals({ data, onProductClick }) {
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
          <Sparkles
            className="w-5 h-5"
            style={{ color: "var(--success-600)" }}
          />
        </div>
        <div>
          <h3
            className="text-lg font-semibold font-Montserrat"
            style={{ color: "var(--text-primary)" }}
          >
            New Arrivals
          </h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Last {data.days} days • {data.count} new products
          </p>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {data.products.slice(0, 8).map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
            style={{ backgroundColor: "var(--bg-secondary)" }}
            onClick={() => onProductClick(product.id)}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--success-100)" }}
            >
              <Clock
                className="w-4 h-4"
                style={{ color: "var(--success-600)" }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate font-Poppins"
                style={{ color: "var(--text-primary)" }}
              >
                {product.name}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {product.category?.name || "Uncategorized"}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p
                className="text-sm font-bold font-Montserrat"
                style={{ color: "var(--primary-700)" }}
              >
                ${product.price.toFixed(2)}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Stock: {product.stock_quantity}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
