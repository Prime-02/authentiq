import React from "react";
import { DollarSign } from "lucide-react";

export default function PriceRangeChart({ data }) {
  const maxCount = Math.max(...data.map((d) => d.product_count), 1);

  return (
    <div
      className="card rounded-xl p-6 border"
      style={{ borderColor: "var(--border-color)" }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: "var(--primary-100)" }}
        >
          <DollarSign
            className="w-5 h-5"
            style={{ color: "var(--primary-600)" }}
          />
        </div>
        <div>
          <h3
            className="text-lg font-semibold font-Montserrat"
            style={{ color: "var(--text-primary)" }}
          >
            Price Range Distribution
          </h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {data.reduce((sum, d) => sum + d.product_count, 0)} products across{" "}
            {data.length} ranges
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((range, index) => {
          const percentage = ((range.product_count / maxCount) * 100).toFixed(
            0,
          );
          const heightClass = `h-${Math.max(2, Math.min(32, Math.round((range.product_count / maxCount) * 32)))}`;

          return (
            <div
              key={index}
              className="rounded-lg p-4 text-center transition-all duration-200 hover:shadow-md"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <p
                className="text-lg font-bold font-Montserrat"
                style={{ color: "var(--primary-600)" }}
              >
                {range.product_count}
              </p>
              <p
                className="text-sm font-medium font-Poppins mt-1"
                style={{ color: "var(--text-primary)" }}
              >
                {range.range}
              </p>
              <div
                className="w-full mt-3 h-2 rounded-full"
                style={{ backgroundColor: "var(--bg-tertiary)" }}
              >
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: "var(--primary-400)",
                  }}
                />
              </div>
              <p
                className="text-xs mt-2"
                style={{ color: "var(--text-muted)" }}
              >
                {percentage}% of products
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
