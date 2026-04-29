import React from "react";
import { AlertTriangle, Package, XCircle } from "lucide-react";

export default function LowStockAlert({
  lowStock,
  outOfStock,
  threshold,
  onProductClick,
  detailed = false,
}) {
  return (
    <div
      className="card rounded-xl p-6 border"
      style={{ borderColor: "var(--border-color)" }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: "var(--warning-100)" }}
        >
          <AlertTriangle
            className="w-5 h-5"
            style={{ color: "var(--warning-600)" }}
          />
        </div>
        <div>
          <h3
            className="text-lg font-semibold font-Montserrat"
            style={{ color: "var(--text-primary)" }}
          >
            Stock Alerts
          </h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {lowStock.count} below threshold • {outOfStock?.count || 0} out of
            stock
          </p>
        </div>
      </div>

      {/* Out of Stock */}
      {outOfStock?.count > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle
              className="w-4 h-4"
              style={{ color: "var(--error-500)" }}
            />
            <span
              className="text-sm font-semibold font-Poppins"
              style={{ color: "var(--error-600)" }}
            >
              Completely Out of Stock
            </span>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {outOfStock.products.slice(0, detailed ? 10 : 3).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-2 rounded cursor-pointer hover:opacity-80"
                style={{ backgroundColor: "var(--error-50)" }}
                onClick={() => onProductClick(product.id)}
              >
                <span
                  className="text-sm truncate flex-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {product.name}
                </span>
                <span
                  className="text-xs font-semibold ml-2"
                  style={{ color: "var(--error-600)" }}
                >
                  0 left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Stock */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Package
            className="w-4 h-4"
            style={{ color: "var(--warning-500)" }}
          />
          <span
            className="text-sm font-semibold font-Poppins"
            style={{ color: "var(--warning-600)" }}
          >
            Below {threshold} in Stock
          </span>
        </div>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {lowStock.products.slice(0, detailed ? 20 : 5).map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-2 rounded cursor-pointer hover:opacity-80"
              style={{ backgroundColor: "var(--warning-50)" }}
              onClick={() => onProductClick(product.id)}
            >
              <span
                className="text-sm truncate flex-1"
                style={{ color: "var(--text-primary)" }}
              >
                {product.name}
              </span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full ml-2"
                style={{
                  backgroundColor: "var(--warning-200)",
                  color: "var(--warning-700)",
                }}
              >
                {product.stock_quantity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
