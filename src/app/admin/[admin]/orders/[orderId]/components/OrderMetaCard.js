// components/OrderMetaCard.jsx
import React, { useState } from "react";
import {
  Calendar,
  Hash,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Package,
  Copy,
  Check,
  ChevronRight,
} from "lucide-react";

const OrderMetaCard = ({ order }) => {
  const [copiedId, setCopiedId] = useState(false);

  const orderDate = new Date(order?.order_date || order?.created_at);
  const now = new Date();
  const diffTime = Math.abs(now - orderDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  const timeAgo =
    diffDays > 0
      ? `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
      : diffHours > 0
        ? `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
        : "Just now";

  const handleCopyId = async () => {
    if (!order?.id) return;
    try {
      await navigator.clipboard.writeText(order.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return null;
    const date = new Date(dateValue);
    return date.toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const timelineEvents = [
    {
      id: "placed",
      icon: Package,
      label: "Order Placed",
      date: orderDate,
      time: formatDateTime(order?.order_date || order?.created_at),
      description: timeAgo,
      status: "completed",
      alwaysShow: true,
    },
    {
      id: "shipped",
      icon: Truck,
      label: "Shipped",
      date: order?.shipping_date ? new Date(order.shipping_date) : null,
      time: formatDateTime(order?.shipping_date),
      status: order?.shipping_date ? "completed" : "pending",
      alwaysShow: false,
    },
    {
      id: "delivered",
      icon: CheckCircle2,
      label: "Delivered",
      date: order?.delivery_date ? new Date(order.delivery_date) : null,
      time: formatDateTime(order?.delivery_date),
      status: order?.delivery_date ? "completed" : "pending",
      alwaysShow: false,
    },
    {
      id: "cancelled",
      icon: XCircle,
      label: "Cancelled",
      date: order?.cancelled_at ? new Date(order.cancelled_at) : null,
      time: formatDateTime(order?.cancelled_at),
      status: order?.cancelled_at ? "completed" : "hidden",
      alwaysShow: false,
      isError: true,
    },
  ].filter((event) => event.alwaysShow || event.date);

  const getStatusStyles = (event) => {
    if (event.isError) {
      return {
        dot: "bg-[var(--error-500)]",
        line: "bg-[var(--error-200)]",
        icon: "text-[var(--error-600)]",
        bg: "bg-[var(--error-50)]",
        ring: "ring-[var(--error-100)]",
      };
    }
    if (event.status === "completed") {
      return {
        dot: "bg-[var(--success-500)]",
        line: "bg-[var(--success-200)]",
        icon: "text-[var(--success-600)]",
        bg: "bg-[var(--success-50)]",
        ring: "ring-[var(--success-100)]",
      };
    }
    return {
      dot: "bg-[var(--border-color)]",
      line: "bg-[var(--border-light)]",
      icon: "text-[var(--text-muted)]",
      bg: "bg-[var(--bg-tertiary)]",
      ring: "ring-[var(--bg-primary)]",
    };
  };

  if (!order) {
    return (
      <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-light)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
            <Clock size={20} className="text-[var(--text-muted)]" />
          </div>
          <h3 className="text-lg font-bold font-Montserrat text-[var(--text-primary)]">
            Order Timeline
          </h3>
        </div>
        <div className="p-8 bg-[var(--bg-primary)] rounded-xl border border-dashed border-[var(--border-light)] text-center">
          <Package
            size={32}
            className="mx-auto text-[var(--border-color)] mb-3"
          />
          <p className="text-sm text-[var(--text-muted)]">
            Order information not available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--info-100)] border border-[var(--info-200)] flex items-center justify-center">
              <Clock size={20} className="text-[var(--info-600)]" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-Montserrat text-[var(--text-primary)]">
                Order Timeline
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                {timelineEvents.filter((e) => e.status === "completed").length}{" "}
                of {timelineEvents.length} milestones completed
              </p>
            </div>
          </div>
        </div>

        {/* Order ID Badge */}
        <div className="flex items-center gap-2 p-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)]">
          <Hash size={16} className="text-[var(--text-muted)] flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">
              Order ID
            </p>
            <p className="font-mono text-sm font-semibold text-[var(--text-primary)] break-all">
              {order.id}
            </p>
          </div>
          <button
            onClick={handleCopyId}
            className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${
              copiedId
                ? "bg-[var(--success-100)] text-[var(--success-600)]"
                : "hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
            }`}
            title={copiedId ? "Copied!" : "Copy order ID"}
          >
            {copiedId ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[var(--border-light)] mx-6" />

      {/* Timeline */}
      <div className="p-6 pt-5">
        <div className="relative">
          {timelineEvents.map((event, index) => {
            const styles = getStatusStyles(event);
            const isLast = index === timelineEvents.length - 1;

            return (
              <div
                key={event.id}
                className="relative flex gap-4 pb-6 last:pb-0"
              >
                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={`absolute left-[18px] top-8 w-0.5 h-[calc(100%-16px)] ${styles.line}`}
                  />
                )}

                {/* Icon */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`w-9 h-9 rounded-full ${styles.bg} flex items-center justify-center ring-4 ring-[var(--bg-secondary)]`}
                  >
                    <event.icon size={16} className={styles.icon} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {event.label}
                      </p>
                      {event.description && (
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                          {event.description}
                        </p>
                      )}
                    </div>
                    {event.time && (
                      <span className="flex-shrink-0 text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-2 py-1 rounded-md">
                        {event.time}
                      </span>
                    )}
                  </div>
                  {event.date && (
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {event.date.toLocaleDateString("en-NG", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Summary */}
      <div className="px-6 pb-6">
        <div className="p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[var(--text-muted)]" />
              <span className="text-xs text-[var(--text-muted)]">
                Order placed {timeAgo}
              </span>
            </div>
            <ChevronRight size={14} className="text-[var(--border-color)]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderMetaCard;
