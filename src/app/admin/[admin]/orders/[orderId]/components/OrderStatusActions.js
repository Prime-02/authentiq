// components/OrderStatusActions.jsx
import React from "react";
import { Package, Truck, Check, X, Loader2 } from "lucide-react";

const statusTransitions = {
  pending: [
    {
      status: "processing",
      label: "Mark as Processing",
      icon: Package,
      color: "info",
    },
    { status: "cancelled", label: "Cancel Order", icon: X, color: "error" },
  ],
  processing: [
    {
      status: "shipped",
      label: "Mark as Shipped",
      icon: Truck,
      color: "primary",
    },
    { status: "cancelled", label: "Cancel Order", icon: X, color: "error" },
  ],
  shipped: [
    {
      status: "delivered",
      label: "Mark as Delivered",
      icon: Check,
      color: "success",
    },
  ],
};

const getButtonStyles = (color) => {
  const styles = {
    info: "bg-[var(--info-50)] text-[var(--info-700)] hover:bg-[var(--info-100)] border-[var(--info-200)]",
    error:
      "bg-[var(--error-50)] text-[var(--error-700)] hover:bg-[var(--error-100)] border-[var(--error-200)]",
    primary:
      "bg-[var(--primary-50)] text-[var(--primary-700)] hover:bg-[var(--primary-100)] border-[var(--primary-200)]",
    success:
      "bg-[var(--success-50)] text-[var(--success-700)] hover:bg-[var(--success-100)] border-[var(--success-200)]",
  };
  return styles[color] || "";
};

const OrderStatusActions = ({ order, onStatusUpdate, loading }) => {
  // ✅ Use order_status (not order.status)
  const availableTransitions = statusTransitions[order.order_status] || [];

  if (availableTransitions.length === 0) return null;

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-light)]">
      <h3 className="text-lg font-bold font-Montserrat text-[var(--text-primary)] mb-4">
        Update Order Status
      </h3>
      <div className="flex flex-wrap gap-3">
        {availableTransitions.map(({ status, label, icon: Icon, color }) => (
          <button
            key={status}
            onClick={() => onStatusUpdate(status)}
            disabled={loading}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm ${getButtonStyles(color)}`}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Icon size={18} />
            )}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusActions;
