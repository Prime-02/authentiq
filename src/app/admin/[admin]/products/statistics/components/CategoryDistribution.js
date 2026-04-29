import React from "react";
import { PieChart as PieChartIcon } from "lucide-react";

export default function CategoryDistribution({ data, compact = false }) {
  const maxProducts = Math.max(...data.map((c) => c.product_count), 1);

  return (
    <div
      className="card rounded-xl p-6 border"
      style={{ borderColor: "var(--border-color)" }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: "var(--info-100)" }}
        >
          <PieChartIcon
            className="w-5 h-5"
            style={{ color: "var(--info-600)" }}
          />
        </div>
        <div>
          <h3
            className="text-lg font-semibold font-Montserrat"
            style={{ color: "var(--text-primary)" }}
          >
            Category Distribution
          </h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {data.length} categories
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {data.slice(0, compact ? 5 : 10).map((category, index) => {
          const percentage = (
            (category.product_count / maxProducts) *
            100
          ).toFixed(0);
          const colors = [
            "var(--primary-500)",
            "var(--info-500)",
            "var(--success-500)",
            "var(--warning-500)",
            "var(--error-500)",
            "var(--primary-400)",
            "var(--info-400)",
            "var(--success-400)",
            "var(--warning-400)",
            "var(--error-400)",
          ];

          return (
            <div key={category.category_id || index}>
              <div className="flex justify-between mb-1">
                <span
                  className="text-sm font-medium truncate font-Poppins"
                  style={{ color: "var(--text-primary)" }}
                >
                  {category.category_name}
                </span>
                <span
                  className="text-sm font-semibold ml-2 font-Montserrat"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {category.product_count}
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full"
                style={{ backgroundColor: "var(--bg-tertiary)" }}
              >
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: colors[index % colors.length],
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  Stock: {category.total_stock}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  Avg: ${(category.average_price || 0).toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
