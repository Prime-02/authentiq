// components/AdminOrderQuickStats.jsx
import React from "react";
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  DollarSign,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const AdminOrderQuickStats = ({ stats }) => {
  if (!stats?.statistics) return null;

  const totalOrders = Object.values(stats.statistics).reduce(
    (sum, s) => sum + (s.count || 0),
    0,
  );
  const totalRevenue = Object.values(stats.statistics).reduce(
    (sum, s) => sum + (s.total_amount || 0),
    0,
  );

  // Calculate percentages for context
  const getPercentage = (count) =>
    totalOrders > 0 ? ((count / totalOrders) * 100).toFixed(1) : 0;

  const statCards = [
    {
      id: "total",
      icon: Package,
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      subtext: "All time orders",
      percentage: null,
      color: "text-[var(--primary-600)]",
      bg: "bg-[var(--primary-50)]",
      border: "border-[var(--primary-200)]",
      accent: "bg-[var(--primary-500)]",
      size: "large", // spans 2 columns on md+
    },
    {
      id: "pending",
      icon: Clock,
      label: "Pending",
      value: (stats.statistics.pending?.count || 0).toLocaleString(),
      subtext: `${getPercentage(stats.statistics.pending?.count || 0)}% of total`,
      percentage: getPercentage(stats.statistics.pending?.count || 0),
      color: "text-[var(--warning-600)]",
      bg: "bg-[var(--warning-50)]",
      border: "border-[var(--warning-200)]",
      accent: "bg-[var(--warning-500)]",
      size: "small",
    },
    {
      id: "processing",
      icon: AlertCircle,
      label: "Processing",
      value: (stats.statistics.processing?.count || 0).toLocaleString(),
      subtext: `${getPercentage(stats.statistics.processing?.count || 0)}% of total`,
      percentage: getPercentage(stats.statistics.processing?.count || 0),
      color: "text-[var(--info-600)]",
      bg: "bg-[var(--info-50)]",
      border: "border-[var(--info-200)]",
      accent: "bg-[var(--info-500)]",
      size: "small",
    },
    {
      id: "shipped",
      icon: Truck,
      label: "Shipped",
      value: (stats.statistics.shipped?.count || 0).toLocaleString(),
      subtext: `${getPercentage(stats.statistics.shipped?.count || 0)}% of total`,
      percentage: getPercentage(stats.statistics.shipped?.count || 0),
      color: "text-[var(--primary-600)]",
      bg: "bg-[var(--primary-50)]",
      border: "border-[var(--primary-200)]",
      accent: "bg-[var(--primary-500)]",
      size: "small",
    },
    {
      id: "delivered",
      icon: CheckCircle2,
      label: "Delivered",
      value: (stats.statistics.delivered?.count || 0).toLocaleString(),
      subtext: `${getPercentage(stats.statistics.delivered?.count || 0)}% of total`,
      percentage: getPercentage(stats.statistics.delivered?.count || 0),
      color: "text-[var(--success-600)]",
      bg: "bg-[var(--success-50)]",
      border: "border-[var(--success-200)]",
      accent: "bg-[var(--success-500)]",
      size: "small",
    },
    {
      id: "cancelled",
      icon: XCircle,
      label: "Cancelled",
      value: (stats.statistics.cancelled?.count || 0).toLocaleString(),
      subtext: `${getPercentage(stats.statistics.cancelled?.count || 0)}% of total`,
      percentage: getPercentage(stats.statistics.cancelled?.count || 0),
      color: "text-[var(--error-600)]",
      bg: "bg-[var(--error-50)]",
      border: "border-[var(--error-200)]",
      accent: "bg-[var(--error-500)]",
      size: "small",
    },
    {
      id: "revenue",
      icon: DollarSign,
      label: "Total Revenue",
      value: `₦${totalRevenue.toLocaleString()}`,
      subtext: "Across all orders",
      percentage: null,
      color: "text-[var(--success-600)]",
      bg: "bg-[var(--success-50)]",
      border: "border-[var(--success-200)]",
      accent: "bg-[var(--success-500)]",
      size: "wide", // spans full width on mobile, 2 cols on md+
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-min">
      {statCards.map((card) => {
        const isLarge = card.size === "large";
        const isWide = card.size === "wide";

        return (
          <div
            key={card.id}
            className={`
              bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] 
              hover:border-[var(--border-hover)] hover:shadow-sm transition-all duration-200 
              overflow-hidden group relative
              ${isLarge ? "col-span-2 row-span-2 md:row-span-1 lg:row-span-2" : ""}
              ${isWide ? "col-span-2" : ""}
            `}
          >
            {/* Accent bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${card.accent} opacity-0 group-hover:opacity-100 transition-opacity`}
            />

            <div
              className={`p-5 h-full flex flex-col ${isLarge ? "justify-between" : ""}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`${card.bg} border ${card.border} rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isLarge ? "w-14 h-14" : "w-11 h-11"
                  }`}
                >
                  <card.icon size={isLarge ? 24 : 18} className={card.color} />
                </div>
                {card.percentage && (
                  <div className="flex items-center gap-0.5 text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-2 py-1 rounded-full">
                    {card.percentage}%
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={isLarge ? "mt-auto" : ""}>
                <p
                  className={`text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1 ${isLarge ? "text-sm" : ""}`}
                >
                  {card.label}
                </p>
                <p
                  className={`font-bold text-[var(--text-primary)] leading-tight ${isLarge ? "text-3xl" : "text-xl"}`}
                >
                  {card.value}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1.5">
                  {card.subtext}
                </p>
              </div>

              {/* Progress bar for small cards */}
              {card.percentage && !isLarge && (
                <div className="mt-3">
                  <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${card.accent} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(card.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Mini sparkline area for large card */}
              {isLarge && (
                <div className="mt-4 flex items-end gap-1 h-12">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const height = 20 + Math.random() * 80;
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-[var(--primary-200)] rounded-t-sm opacity-60 hover:opacity-100 transition-opacity"
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminOrderQuickStats;
