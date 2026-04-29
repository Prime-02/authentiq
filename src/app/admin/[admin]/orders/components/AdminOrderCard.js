// components/AdminOrderCard.jsx
import React, { useState } from "react";
import {
  Package,
  MapPin,
  Calendar,
  User,
  CreditCard,
  ChevronRight,
  Check,
  X,
  Truck,
  Loader2,
  Mail,
  Phone,
  ShoppingBag,
  Clock,
} from "lucide-react";

const AdminOrderCard = ({
  order,
  onViewOrder,
  onStatusUpdate,
  loadingMutation,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        badge:
          "bg-[var(--warning-100)] text-[var(--warning-700)] border-[var(--warning-200)]",
        icon: "text-[var(--warning-600)]",
        bg: "bg-[var(--warning-50)]",
        label: "Pending",
      },
      processing: {
        badge:
          "bg-[var(--info-100)] text-[var(--info-700)] border-[var(--info-200)]",
        icon: "text-[var(--info-600)]",
        bg: "bg-[var(--info-50)]",
        label: "Processing",
      },
      shipped: {
        badge:
          "bg-[var(--primary-100)] text-[var(--primary-700)] border-[var(--primary-200)]",
        icon: "text-[var(--primary-600)]",
        bg: "bg-[var(--primary-50)]",
        label: "Shipped",
      },
      delivered: {
        badge:
          "bg-[var(--success-100)] text-[var(--success-700)] border-[var(--success-200)]",
        icon: "text-[var(--success-600)]",
        bg: "bg-[var(--success-50)]",
        label: "Delivered",
      },
      cancelled: {
        badge:
          "bg-[var(--error-100)] text-[var(--error-700)] border-[var(--error-200)]",
        icon: "text-[var(--error-600)]",
        bg: "bg-[var(--error-50)]",
        label: "Cancelled",
      },
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  const getPaymentConfig = (status) => {
    const configs = {
      paid: {
        badge: "bg-[var(--success-100)] text-[var(--success-700)]",
        dot: "bg-[var(--success-500)]",
      },
      pending: {
        badge: "bg-[var(--warning-100)] text-[var(--warning-700)]",
        dot: "bg-[var(--warning-500)]",
      },
      failed: {
        badge: "bg-[var(--error-100)] text-[var(--error-700)]",
        dot: "bg-[var(--error-500)]",
      },
      refunded: {
        badge: "bg-[var(--info-100)] text-[var(--info-700)]",
        dot: "bg-[var(--info-500)]",
      },
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  const statusConfig = getStatusConfig(order.status);
  const paymentConfig = getPaymentConfig(order.payment_status);

  const canTransition = (currentStatus, newStatus) => {
    const transitions = {
      pending: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered"],
    };
    return transitions[currentStatus]?.includes(newStatus) || false;
  };

  const quickActions = [
    {
      status: "processing",
      icon: Package,
      label: "Process",
      color: "text-[var(--info-600)] hover:bg-[var(--info-50)]",
    },
    {
      status: "shipped",
      icon: Truck,
      label: "Ship",
      color: "text-[var(--primary-600)] hover:bg-[var(--primary-50)]",
    },
    {
      status: "delivered",
      icon: Check,
      label: "Deliver",
      color: "text-[var(--success-600)] hover:bg-[var(--success-50)]",
    },
    {
      status: "cancelled",
      icon: X,
      label: "Cancel",
      color: "text-[var(--error-600)] hover:bg-[var(--error-50)]",
    },
  ].filter((action) => canTransition(order.status, action.status));

  const orderDate = new Date(order.order_date || order.created_at);
  const timeAgo = (() => {
    const now = new Date();
    const diff = Math.abs(now - orderDate);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days}d ago`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  })();

  // Get user details safely
  const userName = order.user
    ? `${order.user.firstname || ""} ${order.user.lastname || ""}`.trim() ||
      "Unknown User"
    : order.user_id
      ? `User ${order.user_id.slice(0, 8)}...`
      : "Unknown User";

  const userEmail = order.user?.email;
  const userPhone = order.user?.phone_number;
  const userInitials = order.user
    ? `${order.user.firstname?.[0] || ""}${order.user.lastname?.[0] || ""}`.toUpperCase() ||
      "U"
    : "U";

  return (
    <div
      className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)] hover:border-[var(--border-hover)] transition-all duration-200 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowUserDetails(false);
      }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Order Info */}
          <div className="flex-1 min-w-0">
            {/* Top Row: ID + Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="font-mono text-sm font-bold text-[var(--text-primary)]">
                #{order.id?.slice(0, 8)}...
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.badge}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot || "bg-current"}`}
                />
                {order.status}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${paymentConfig.badge}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${paymentConfig.dot}`}
                />
                {order.payment_status || "pending"}
              </span>
              {order.delivery_company && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                  <Truck size={10} />
                  {order.delivery_company.name}
                </span>
              )}
            </div>

            {/* Middle Row: Customer + Date + Address */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm mb-3">
              {/* User Info - Enhanced with hover details */}
              <div
                className="relative"
                onMouseEnter={() => setShowUserDetails(true)}
                onMouseLeave={() => setShowUserDetails(false)}
              >
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <div
                    className="w-7 h-7 rounded-full bg-[var(--primary-100)] border-2 border-[var(--primary-200)] flex items-center justify-center flex-shrink-0"
                    style={{
                      background: order.user
                        ? "var(--primary-50)"
                        : "var(--bg-tertiary)",
                    }}
                  >
                    <span
                      className={`text-xs font-bold ${order.user ? "text-[var(--primary-600)]" : "text-[var(--text-muted)]"}`}
                    >
                      {userInitials}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[var(--text-primary)] text-sm">
                      {userName}
                    </p>
                    {userEmail && (
                      <p className="text-xs text-[var(--text-muted)] truncate mt-0.5 flex items-center gap-1">
                        <Mail size={10} />
                        {userEmail}
                      </p>
                    )}
                  </div>

                  {/* User Info Dropdown */}
                  {showUserDetails && order.user && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-light)] shadow-lg p-3 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-[var(--border-light)]">
                        <div className="w-10 h-10 rounded-full bg-[var(--primary-100)] border-2 border-[var(--primary-300)] flex items-center justify-center">
                          <span className="text-sm font-bold text-[var(--primary-600)]">
                            {userInitials}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[var(--text-primary)] text-sm truncate">
                            {userName}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] truncate">
                            {userEmail || "No email"}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {userEmail && (
                          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                            <Mail
                              size={12}
                              className="text-[var(--text-muted)] flex-shrink-0"
                            />
                            <span className="truncate">{userEmail}</span>
                          </div>
                        )}
                        {userPhone && (
                          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                            <Phone
                              size={12}
                              className="text-[var(--text-muted)] flex-shrink-0"
                            />
                            <span>{userPhone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                          <Clock
                            size={12}
                            className="text-[var(--text-muted)] flex-shrink-0"
                          />
                          <span>
                            Customer since:{" "}
                            {order.user.created_at
                              ? new Date(
                                  order.user.created_at,
                                ).toLocaleDateString("en-NG")
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                          <ShoppingBag
                            size={12}
                            className="text-[var(--text-muted)] flex-shrink-0"
                          />
                          <span>Order #{order.id?.slice(0, 8)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <Calendar size={14} className="flex-shrink-0" />
                <span>{orderDate.toLocaleDateString("en-NG")}</span>
                <span className="text-xs text-[var(--text-muted)]">·</span>
                <span className="text-xs text-[var(--text-muted)]">
                  {timeAgo}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <MapPin size={14} className="flex-shrink-0" />
                <span className="truncate">
                  {order.shipping_address?.slice(0, 30) || "No address"}
                </span>
              </div>
            </div>

            {/* Tracking Info if available */}
            {order.tracking_number && (
              <div className="mt-2 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <Truck size={12} className="text-[var(--primary-500)]" />
                <span className="font-mono text-[var(--primary-600)]">
                  {order.tracking_number}
                </span>
              </div>
            )}
          </div>

          {/* Right: Price + Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <p className="font-bold text-[var(--text-primary)] text-lg">
                ₦{order.total_amount?.toLocaleString()}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {order.order_items?.length || 0} items
              </p>
              {order.payment_status === "paid" && (
                <p className="text-xs text-[var(--success-600)] flex items-center justify-end gap-1 mt-0.5">
                  <CreditCard size={10} />
                  Paid
                </p>
              )}
            </div>

            {/* Quick Actions - visible on hover or mobile */}
            <div
              className={`flex items-center gap-1 transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0 md:opacity-0"}`}
            >
              {quickActions.map((action) => (
                <button
                  key={action.status}
                  onClick={() => onStatusUpdate(order.id, action.status)}
                  disabled={loadingMutation}
                  className={`p-2 rounded-lg transition-colors ${action.color} disabled:opacity-50`}
                  title={action.label}
                >
                  {loadingMutation ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <action.icon size={14} />
                  )}
                </button>
              ))}
            </div>

            {/* View Button */}
            <button
              onClick={() => onViewOrder(order.id)}
              className="p-2.5 bg-[var(--primary-50)] text-[var(--primary-600)] rounded-lg hover:bg-[var(--primary-100)] transition-colors"
              title="View Details"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderCard;
