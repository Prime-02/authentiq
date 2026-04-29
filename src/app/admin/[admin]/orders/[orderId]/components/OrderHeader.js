// components/OrderHeader.jsx
import React from "react";
import {
  Calendar,
  Hash,
  DollarSign,
  Clock,
  ShoppingBag,
  MapPin,
  CheckCircle2,
} from "lucide-react";

const getStatusConfig = (status) => {
  const configs = {
    pending: {
      icon: Clock,
      label: "Pending",
      gradient: "from-amber-400 to-orange-500",
      heroGradient: "from-amber-500 via-orange-500 to-orange-600",
      lightBg: "bg-amber-50 dark:bg-amber-950",
      darkBg: "bg-amber-100 dark:bg-amber-900",
      paymentBg:
        "bg-amber-100/80 text-amber-700 border-amber-200 dark:bg-amber-900/80 dark:text-amber-300 dark:border-amber-800",
    },
    processing: {
      icon: ShoppingBag,
      label: "Processing",
      gradient: "from-blue-400 to-cyan-500",
      heroGradient: "from-blue-500 via-cyan-500 to-cyan-600",
      lightBg: "bg-blue-50 dark:bg-blue-950",
      darkBg: "bg-blue-100 dark:bg-blue-900",
      paymentBg:
        "bg-blue-100/80 text-blue-700 border-blue-200 dark:bg-blue-900/80 dark:text-blue-300 dark:border-blue-800",
    },
    shipped: {
      icon: MapPin,
      label: "Shipped",
      gradient: "from-purple-400 to-pink-500",
      heroGradient: "from-purple-500 via-pink-500 to-pink-600",
      lightBg: "bg-purple-50 dark:bg-purple-950",
      darkBg: "bg-purple-100 dark:bg-purple-900",
      paymentBg:
        "bg-purple-100/80 text-purple-700 border-purple-200 dark:bg-purple-900/80 dark:text-purple-300 dark:border-purple-800",
    },
    delivered: {
      icon: CheckCircle2,
      label: "Delivered",
      gradient: "from-emerald-400 to-green-500",
      heroGradient: "from-emerald-500 via-green-500 to-green-600",
      lightBg: "bg-emerald-50 dark:bg-emerald-950",
      darkBg: "bg-emerald-100 dark:bg-emerald-900",
      paymentBg:
        "bg-emerald-100/80 text-emerald-700 border-emerald-200 dark:bg-emerald-900/80 dark:text-emerald-300 dark:border-emerald-800",
    },
    cancelled: {
      icon: Clock,
      label: "Cancelled",
      gradient: "from-red-400 to-rose-500",
      heroGradient: "from-red-500 via-rose-500 to-rose-600",
      lightBg: "bg-red-50 dark:bg-red-950",
      darkBg: "bg-red-100 dark:bg-red-900",
      paymentBg:
        "bg-red-100/80 text-red-700 border-red-200 dark:bg-red-900/80 dark:text-red-300 dark:border-red-800",
    },
  };
  return configs[status?.toLowerCase()] || configs.pending;
};

const getPaymentStyles = (status) => {
  const styles = {
    paid: "bg-white/20 backdrop-blur-sm text-white border border-white/20",
    pending: "bg-white/20 backdrop-blur-sm text-white border border-white/20",
    failed: "bg-white/20 backdrop-blur-sm text-white border border-white/20",
    refunded: "bg-white/20 backdrop-blur-sm text-white border border-white/20",
  };
  return (
    styles[status?.toLowerCase()] ||
    "bg-white/20 backdrop-blur-sm text-white border border-white/20"
  );
};

const OrderHeader = ({ order }) => {
  const orderStatus = order.order_status;
  const paymentStatus = order.payment_status;
  const config = getStatusConfig(orderStatus);
  const StatusIcon = config.icon;

  return (
    <div
      className={`rounded-2xl p-6 bg-gradient-to-br ${config.heroGradient} shadow-lg`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold font-Montserrat text-white mb-2 truncate">
            Order #{order.id?.slice(0, 8)}
          </h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Calendar size={15} />
              <span>
                {new Date(
                  order.order_date || order.created_at,
                ).toLocaleDateString("en-NG", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Hash size={15} />
              <span className="font-mono text-xs truncate max-w-[200px]">
                {order.id}
              </span>
            </div>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold border border-white/20">
            <StatusIcon size={14} />
            {config.label}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${getPaymentStyles(paymentStatus)}`}
          >
            <DollarSign size={12} />
            {paymentStatus?.charAt(0).toUpperCase() + paymentStatus?.slice(1) ||
              "Pending"}
          </span>
        </div>
      </div>

      {/* Total amount strip */}
      <div className="mt-5 pt-5 border-t border-white/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-6 text-sm text-white/70">
          <span>
            Subtotal:{" "}
            <span className="font-medium text-white">
              ₦{order.subtotal?.toLocaleString()}
            </span>
          </span>
          <span>
            Shipping:{" "}
            <span className="font-medium text-white">
              ₦{order.shipping_cost?.toLocaleString()}
            </span>
          </span>
          {order.tax > 0 && (
            <span>
              Tax:{" "}
              <span className="font-medium text-white">
                ₦{order.tax?.toLocaleString()}
              </span>
            </span>
          )}
        </div>
        <div className="text-xl font-bold text-white">
          ₦{order.total_amount?.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;
