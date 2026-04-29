import React from "react";
import { Star, TrendingUp } from "lucide-react";

export default function TopRatedProducts({ data, minReviews, onProductClick }) {
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
          <Star className="w-5 h-5" style={{ color: "var(--warning-500)" }} />
        </div>
        <div>
          <h3
            className="text-lg font-semibold font-Montserrat"
            style={{ color: "var(--text-primary)" }}
          >
            Top Rated Products
          </h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Minimum {minReviews} reviews • {data.products?.length || 0} products
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {data.products?.map((product, index) => (
          <div
            key={product.product_id}
            className="flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:opacity-80 transition-all duration-200 hover:shadow-md"
            style={{ backgroundColor: "var(--bg-secondary)" }}
            onClick={() => onProductClick(product.product_id)}
          >
            {/* Rank */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-Montserrat shrink-0"
              style={{
                backgroundColor:
                  index < 3 ? "var(--warning-200)" : "var(--bg-tertiary)",
                color: index < 3 ? "var(--warning-800)" : "var(--text-muted)",
              }}
            >
              {index + 1}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold truncate font-Poppins"
                style={{ color: "var(--text-primary)" }}
              >
                {product.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-3 h-3"
                      style={{
                        fill:
                          star <= Math.round(product.average_rating)
                            ? "var(--warning-500)"
                            : "none",
                        color:
                          star <= Math.round(product.average_rating)
                            ? "var(--warning-500)"
                            : "var(--border-color)",
                      }}
                    />
                  ))}
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--warning-600)" }}
                >
                  {product.average_rating.toFixed(1)}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  ({product.review_count} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
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
