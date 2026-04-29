import React from "react";
import {
  Package,
  CheckCircle2,
  XCircle,
  DollarSign,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function SummaryCards({ summary }) {
  if (!summary) return null;

  const totalProducts = summary.total_products || 0;
  const activeProducts = summary.active_products || 0;
  const inactiveProducts = summary.inactive_products || 0;
  const totalStock = summary.stock_statistics?.total_stock || 0;
  const averagePrice = summary.price_statistics?.average_price || 0;
  const inventoryValue = summary.total_inventory_value || 0;

  // Calculate percentages for context
  const getPercentage = (count) =>
    totalProducts > 0 ? ((count / totalProducts) * 100).toFixed(1) : 0;

  // Stock health indicator
  const getStockHealth = () => {
    const avgStockPerProduct =
      totalProducts > 0 ? totalStock / totalProducts : 0;
    if (avgStockPerProduct > 100)
      return {
        label: "Well Stocked",
        icon: ArrowUpRight,
        color: "text-[var(--success-600)]",
      };
    if (avgStockPerProduct > 30)
      return {
        label: "Moderate",
        icon: null,
        color: "text-[var(--warning-600)]",
      };
    return {
      label: "Low Stock",
      icon: ArrowDownRight,
      color: "text-[var(--error-600)]",
    };
  };

  const stockHealth = getStockHealth();

  const statCards = [
    {
      id: "total",
      icon: Package,
      label: "Total Products",
      value: totalProducts.toLocaleString(),
      subtext: `${activeProducts.toLocaleString()} active • ${inactiveProducts.toLocaleString()} inactive`,
      color: "text-[var(--primary-600)]",
      bg: "bg-[var(--primary-50)]",
      border: "border-[var(--primary-200)]",
      accent: "bg-[var(--primary-500)]",
      size: "large",
    },
    {
      id: "active",
      icon: CheckCircle2,
      label: "Active Products",
      value: activeProducts.toLocaleString(),
      subtext: `${getPercentage(activeProducts)}% of total`,
      percentage: parseFloat(getPercentage(activeProducts)),
      color: "text-[var(--success-600)]",
      bg: "bg-[var(--success-50)]",
      border: "border-[var(--success-200)]",
      accent: "bg-[var(--success-500)]",
      size: "small",
      trend: "up",
    },
    {
      id: "inactive",
      icon: XCircle,
      label: "Inactive",
      value: inactiveProducts.toLocaleString(),
      subtext: `${getPercentage(inactiveProducts)}% of total`,
      percentage: parseFloat(getPercentage(inactiveProducts)),
      color: "text-[var(--error-600)]",
      bg: "bg-[var(--error-50)]",
      border: "border-[var(--error-200)]",
      accent: "bg-[var(--error-500)]",
      size: "small",
      trend: "down",
    },
    {
      id: "stock",
      icon: BarChart3,
      label: "Total Stock",
      value: totalStock.toLocaleString(),
      subtext: `Avg ${(totalProducts > 0 ? totalStock / totalProducts : 0).toFixed(0)} units/product`,
      percentage: null,
      color: "text-[var(--warning-600)]",
      bg: "bg-[var(--warning-50)]",
      border: "border-[var(--warning-200)]",
      accent: "bg-[var(--warning-500)]",
      size: "small",
      health: stockHealth,
    },
    {
      id: "price",
      icon: DollarSign,
      label: "Average Price",
      value: `₦${averagePrice.toFixed(2)}`,
      subtext:
        inventoryValue > 0
          ? `Range: ₦${(averagePrice * 0.7).toFixed(2)} - ₦${(averagePrice * 1.3).toFixed(2)}`
          : "No pricing data",
      percentage: null,
      color: "text-[var(--primary-600)]",
      bg: "bg-[var(--primary-50)]",
      border: "border-[var(--primary-200)]",
      accent: "bg-[var(--primary-500)]",
      size: "small",
    },
    {
      id: "inventory_value",
      icon: TrendingUp,
      label: "Inventory Value",
      value: `₦${inventoryValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      subtext: `${totalStock.toLocaleString()} items valued`,
      percentage: null,
      color: "text-[var(--success-600)]",
      bg: "bg-[var(--success-50)]",
      border: "border-[var(--success-200)]",
      accent: "bg-[var(--success-500)]",
      size: "fill", // New size option to fill remaining space
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-min">
      {statCards.map((card) => {
        const isLarge = card.size === "large";
        const isFill = card.size === "fill";
        const isWide = card.size === "wide";

        return (
          <div
            key={card.id}
            className={`
              bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] 
              hover:border-[var(--border-hover)] hover:shadow-sm transition-all duration-200 
              overflow-hidden group relative cursor-pointer
              ${isLarge ? "col-span-2 row-span-2 md:row-span-1 lg:row-span-2" : ""}
              ${isWide ? "col-span-2" : ""}
              ${isFill ? "col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-4" : ""}
            `}
          >
            {/* Top accent bar that appears on hover */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${card.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
            />

            {/* Glow effect on hover */}
            <div
              className={`absolute inset-0 ${card.bg} opacity-0 group-hover:opacity-10 transition-opacity duration-200`}
            />

            <div
              className={`relative p-5 h-full flex flex-col ${isLarge || isFill ? "justify-between" : ""} ${isFill ? "flex-row items-center gap-6" : ""}`}
            >
              {/* Icon and label section */}
              <div
                className={`${isFill ? "flex items-center gap-4 min-w-fit" : ""}`}
              >
                <div
                  className={`${card.bg} border ${card.border} rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isLarge || isFill ? "w-14 h-14" : "w-11 h-11"
                  } ${isFill ? "" : "mb-3"}`}
                >
                  <card.icon
                    size={isLarge || isFill ? 24 : 18}
                    className={card.color}
                  />
                </div>

                {/* Percentage badge - moved for fill card */}
                {!isFill &&
                  card.percentage !== null &&
                  card.percentage !== undefined && (
                    <div
                      className={`flex items-center gap-0.5 text-xs font-medium bg-[var(--bg-tertiary)] px-2 py-1 rounded-full absolute top-5 right-5 ${
                        card.trend === "up"
                          ? "text-[var(--success-600)]"
                          : "text-[var(--error-600)]"
                      }`}
                    >
                      {card.trend === "up" ? (
                        <ArrowUpRight size={12} />
                      ) : (
                        <ArrowDownRight size={12} />
                      )}
                      {card.percentage}%
                    </div>
                  )}

                {/* Stock health badge - moved for fill card */}
                {!isFill && card.health && (
                  <div
                    className={`flex items-center gap-1 text-xs font-medium bg-[var(--bg-tertiary)] px-2 py-1 rounded-full absolute top-5 right-5 ${card.health.color}`}
                  >
                    {card.health.icon && <card.health.icon size={12} />}
                    {card.health.label}
                  </div>
                )}
              </div>

              {/* Content section */}
              <div
                className={`${isFill ? "flex-1 flex items-center justify-between gap-8" : isLarge ? "mt-auto" : ""}`}
              >
                <div className={isFill ? "" : ""}>
                  <p
                    className={`text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1 ${isLarge || isFill ? "text-sm" : ""}`}
                  >
                    {card.label}
                  </p>
                  <p
                    className={`font-bold text-[var(--text-primary)] leading-tight ${isLarge || isFill ? "text-3xl md:text-4xl" : "text-xl"}`}
                  >
                    {card.value}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1.5">
                    {card.subtext}
                  </p>
                </div>

                {/* Additional details for fill card */}
                {isFill && (
                  <div className="hidden md:flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-xs text-[var(--text-muted)] mb-1">
                        Items in Stock
                      </p>
                      <p className="text-lg font-bold text-[var(--text-primary)]">
                        {totalStock.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-px h-12 bg-[var(--border-light)]" />
                    <div className="text-center">
                      <p className="text-xs text-[var(--text-muted)] mb-1">
                        Avg per Product
                      </p>
                      <p className="text-lg font-bold text-[var(--text-primary)]">
                        {totalProducts > 0
                          ? (totalStock / totalProducts).toFixed(0)
                          : 0}
                      </p>
                    </div>
                    <div className="w-px h-12 bg-[var(--border-light)]" />
                    <div className="text-center">
                      <p className="text-xs text-[var(--text-muted)] mb-1">
                        Value per Item
                      </p>
                      <p className="text-lg font-bold text-[var(--text-primary)]">
                        $
                        {totalStock > 0
                          ? (inventoryValue / totalStock).toFixed(2)
                          : "0.00"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress bar for percentage cards */}
              {!isFill &&
                card.percentage !== null &&
                card.percentage !== undefined &&
                !isLarge && (
                  <div className="mt-3">
                    <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${card.accent} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(card.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

              {/* Sparkline visualization for large card */}
              {isLarge && (
                <div className="mt-4 flex items-end gap-1 h-12 opacity-60 group-hover:opacity-100 transition-opacity">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const height = 20 + Math.random() * 80;
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-[var(--primary-300)] dark:bg-[var(--primary-500)] rounded-t-sm"
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Progress bar for fill card */}
              {isFill && (
                <div className="hidden md:block w-48">
                  <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                    <span>Stock Value</span>
                    <span>100%</span>
                  </div>
                  <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--success-500)] rounded-full transition-all duration-500"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              )}

              {/* Badges for fill card */}
              {isFill && card.health && (
                <div className="hidden sm:flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1 text-xs font-medium ${stockHealth.color} bg-[var(--bg-tertiary)] px-3 py-1.5 rounded-full`}
                  >
                    {stockHealth.icon && <stockHealth.icon size={12} />}
                    {stockHealth.label}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
