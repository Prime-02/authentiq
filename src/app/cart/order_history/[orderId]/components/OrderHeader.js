import React from "react";
import { Calendar, Clock, ShoppingBag, MapPin, CheckCircle2 } from "lucide-react";

const OrderHeader = ({ order, isHero = false }) => {
  const orderStatus = order.order_status || order.status;
  const paymentStatus = order.payment_status;

  const getStatusConfig = (status, type = "order") => {
    const configs = {
      order: {
        pending: {
          icon: Clock,
          label: "Pending",
          gradient: "from-amber-400 to-orange-500",
          heroGradient: "from-amber-500 via-orange-500 to-orange-600",
          lightBg: "bg-amber-50 dark:bg-amber-950",
          darkBg: "bg-amber-100 dark:bg-amber-900",
        },
        processing: {
          icon: ShoppingBag,
          label: "Processing",
          gradient: "from-blue-400 to-cyan-500",
          heroGradient: "from-blue-500 via-cyan-500 to-cyan-600",
          lightBg: "bg-blue-50 dark:bg-blue-950",
          darkBg: "bg-blue-100 dark:bg-blue-900",
        },
        shipped: {
          icon: MapPin,
          label: "Shipped",
          gradient: "from-purple-400 to-pink-500",
          heroGradient: "from-purple-500 via-pink-500 to-pink-600",
          lightBg: "bg-purple-50 dark:bg-purple-950",
          darkBg: "bg-purple-100 dark:bg-purple-900",
        },
        delivered: {
          icon: CheckCircle2,
          label: "Delivered",
          gradient: "from-emerald-400 to-green-500",
          heroGradient: "from-emerald-500 via-green-500 to-green-600",
          lightBg: "bg-emerald-50 dark:bg-emerald-950",
          darkBg: "bg-emerald-100 dark:bg-emerald-900",
        },
        cancelled: {
          icon: Clock,
          label: "Cancelled",
          gradient: "from-red-400 to-rose-500",
          heroGradient: "from-red-500 via-rose-500 to-rose-600",
          lightBg: "bg-red-50 dark:bg-red-950",
          darkBg: "bg-red-100 dark:bg-red-900",
        },
      },
      payment: {
        paid: {
          label: "Paid",
          className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-800",
        },
        pending: {
          label: "Payment Pending",
          className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900 dark:text-amber-300 dark:border-amber-800",
        },
        failed: {
          label: "Payment Failed",
          className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800",
        },
      },
    };

    return configs[type]?.[status?.toLowerCase()] || null;
  };

  const orderConfig = getStatusConfig(orderStatus, "order");
  const paymentConfig = paymentStatus ? getStatusConfig(paymentStatus, "payment") : null;
  const StatusIcon = orderConfig?.icon;
  const orderDate = order.order_date || order.created_at;

  if (isHero) {
    return (
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {orderConfig && (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-Poppins font-semibold border border-white/20">
              <StatusIcon size={16} />
              {orderConfig.label}
            </span>
          )}
          {paymentConfig && (
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-Poppins font-semibold border border-white/20">
              {paymentConfig.label}
            </span>
          )}
        </div>

        <h1 className="font-Montserrat font-bold text-3xl md:text-4xl text-white mb-2">
          Order #{order.id?.slice(0, 8)}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mt-4">
          <div className="flex items-center gap-2 text-white/80">
            <Calendar size={16} />
            <span className="font-Poppins text-sm">
              {new Date(orderDate).toLocaleDateString("en-NG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/40" />
          <div className="flex items-center gap-2 text-white/80">
            <Clock size={16} />
            <span className="font-Poppins text-sm">
              {new Date(orderDate).toLocaleTimeString("en-NG", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Default header for non-hero usage
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {orderConfig && (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-Poppins font-semibold bg-gradient-to-r ${orderConfig.gradient} text-white`}>
            <StatusIcon size={12} />
            {orderConfig.label}
          </span>
        )}
        {paymentConfig && (
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-Poppins font-semibold border ${paymentConfig.className}`}>
            {paymentConfig.label}
          </span>
        )}
      </div>
      <h2 className="font-Montserrat font-bold text-xl text-[var(--text-primary)]">
        Order #{order.id?.slice(0, 8)}
      </h2>
    </div>
  );
};

export default OrderHeader;