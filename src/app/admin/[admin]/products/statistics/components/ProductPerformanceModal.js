import React, { useState, useEffect } from "react";
import {
  X,
  TrendingUp,
  DollarSign,
  Star,
  Package,
  ShoppingCart,
  Loader2,
} from "lucide-react";

export default function ProductPerformanceModal({
  productId,
  onClose,
  fetchPerformance,
}) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMetrics = async () => {
      setLoading(true);
      try {
        const data = await fetchPerformance(productId);
        if (data?.error) {
          setError(data.error);
        } else {
          setMetrics(data);
        }
      } catch {
        setError("Failed to load performance metrics");
      } finally {
        setLoading(false);
      }
    };
    loadMetrics();
  }, [productId, fetchPerformance]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: "var(--border-color)" }}
        >
          <h2
            className="text-xl font-semibold font-Montserrat"
            style={{ color: "var(--text-primary)" }}
          >
            {loading
              ? "Loading..."
              : metrics?.product_name || "Product Performance"}
          </h2>
          <button
            onClick={onClose}
            className="btn btn-icon btn-sm"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2
                className="w-8 h-8 animate-spin"
                style={{ color: "var(--primary-500)" }}
              />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-lg" style={{ color: "var(--error-500)" }}>
                {error}
              </p>
            </div>
          ) : metrics ? (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: metrics.is_active
                      ? "var(--success-100)"
                      : "var(--error-100)",
                    color: metrics.is_active
                      ? "var(--success-700)"
                      : "var(--error-700)",
                  }}
                >
                  {metrics.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart
                      className="w-4 h-4"
                      style={{ color: "var(--info-500)" }}
                    />
                    <span
                      className="text-sm font-Poppins"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Total Sold
                    </span>
                  </div>
                  <p
                    className="text-2xl font-bold font-Montserrat"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {metrics.total_units_sold}
                  </p>
                </div>

                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign
                      className="w-4 h-4"
                      style={{ color: "var(--success-500)" }}
                    />
                    <span
                      className="text-sm font-Poppins"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Revenue
                    </span>
                  </div>
                  <p
                    className="text-2xl font-bold font-Montserrat"
                    style={{ color: "var(--text-primary)" }}
                  >
                    ${(metrics.total_revenue || 0).toLocaleString()}
                  </p>
                </div>

                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Star
                      className="w-4 h-4"
                      style={{ color: "var(--warning-500)" }}
                    />
                    <span
                      className="text-sm font-Poppins"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Rating
                    </span>
                  </div>
                  <p
                    className="text-2xl font-bold font-Montserrat"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {metrics.average_rating.toFixed(1)} / 5.0
                  </p>
                </div>

                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Package
                      className="w-4 h-4"
                      style={{ color: "var(--warning-500)" }}
                    />
                    <span
                      className="text-sm font-Poppins"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Current Stock
                    </span>
                  </div>
                  <p
                    className="text-2xl font-bold font-Montserrat"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {metrics.current_stock}
                  </p>
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="p-4 rounded-lg border"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Orders Including Product
                  </p>
                  <p
                    className="text-lg font-semibold font-Montserrat mt-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {metrics.order_count}
                  </p>
                </div>
                <div
                  className="p-4 rounded-lg border"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Monthly Sales (30 days)
                  </p>
                  <p
                    className="text-lg font-semibold font-Montserrat mt-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {metrics.monthly_sales} units
                  </p>
                </div>
                <div
                  className="p-4 rounded-lg border"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Total Reviews
                  </p>
                  <p
                    className="text-lg font-semibold font-Montserrat mt-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {metrics.review_count}
                  </p>
                </div>
                <div
                  className="p-4 rounded-lg border"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Revenue Per Order
                  </p>
                  <p
                    className="text-lg font-semibold font-Montserrat mt-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    $
                    {metrics.order_count > 0
                      ? (metrics.total_revenue / metrics.order_count).toFixed(2)
                      : "0.00"}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div
          className="p-6 border-t flex justify-end"
          style={{ borderColor: "var(--border-color)" }}
        >
          <button onClick={onClose} className="btn btn-secondary btn-md">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
