// components/RevenueChart.jsx
import React, { useMemo } from "react";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";

const RevenueChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    return data.filter((point) => point && typeof point === "object");
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="p-8 bg-[var(--bg-primary)] rounded-xl border border-dashed border-[var(--border-light)] text-center">
        <BarChart3
          size={32}
          className="mx-auto text-[var(--border-color)] mb-3"
        />
        <p className="text-sm text-[var(--text-muted)]">
          No revenue data available
        </p>
      </div>
    );
  }

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue || 0));
  const totalRevenue = chartData.reduce((sum, d) => sum + (d.revenue || 0), 0);
  const totalOrders = chartData.reduce(
    (sum, d) => sum + (d.order_count || 0),
    0,
  );
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate trend (compare last 7 days vs previous 7 days)
  const midPoint = Math.floor(chartData.length / 2);
  const recentRevenue = chartData
    .slice(midPoint)
    .reduce((sum, d) => sum + (d.revenue || 0), 0);
  const previousRevenue = chartData
    .slice(0, midPoint)
    .reduce((sum, d) => sum + (d.revenue || 0), 0);
  const revenueTrend =
    previousRevenue > 0
      ? (((recentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1)
      : 0;
  const isTrendUp = revenueTrend >= 0;

  return (
    <div className="space-y-4">
      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-light)]">
          <p className="text-xs text-[var(--text-muted)] mb-1">Total Revenue</p>
          <p className="text-sm font-bold text-[var(--text-primary)]">
            ₦{totalRevenue.toLocaleString("en-NG")}
          </p>
        </div>
        <div className="p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-light)]">
          <p className="text-xs text-[var(--text-muted)] mb-1">Total Orders</p>
          <p className="text-sm font-bold text-[var(--text-primary)]">
            {totalOrders.toLocaleString()}
          </p>
        </div>
        <div className="p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-light)]">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[var(--text-muted)] mb-1">Trend</p>
            {isTrendUp ? (
              <TrendingUp size={14} className="text-[var(--success-500)]" />
            ) : (
              <TrendingDown size={14} className="text-[var(--error-500)]" />
            )}
          </div>
          <p
            className={`text-sm font-bold ${isTrendUp ? "text-[var(--success-600)]" : "text-[var(--error-600)]"}`}
          >
            {isTrendUp ? "+" : ""}
            {revenueTrend}%
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)] p-4">
        <div className="flex items-end justify-between gap-1 h-48">
          {chartData.map((point, index) => {
            const height =
              maxRevenue > 0 ? (point.revenue / maxRevenue) * 100 : 0;
            const isHigh = height > 70;
            const isMedium = height > 30 && height <= 70;

            return (
              <div
                key={point.period || index}
                className="flex-1 flex flex-col items-center gap-1 group relative"
              >
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                    <p className="text-xs font-semibold text-[var(--text-primary)]">
                      {point.period?.slice(0, 10)}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      ₦{(point.revenue || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {point.order_count || 0} orders
                    </p>
                  </div>
                </div>

                {/* Bar */}
                <div
                  className={`w-full max-w-[24px] rounded-t-md transition-all duration-300 ${
                    isHigh
                      ? "bg-[var(--success-400)]"
                      : isMedium
                        ? "bg-[var(--info-400)]"
                        : "bg-[var(--info-200)]"
                  } group-hover:brightness-110`}
                  style={{ height: `${Math.max(height, 4)}%` }}
                />

                {/* Label */}
                <span className="text-[10px] text-[var(--text-muted)] rotate-0 truncate max-w-full">
                  {point.period?.slice(5, 10)?.replace("-", "/")}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[var(--border-light)]">
                <th className="px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider text-right">
                  Orders
                </th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider text-right">
                  Revenue
                </th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider text-right">
                  Avg Value
                </th>
              </tr>
            </thead>
            <tbody>
              {[...chartData]
                .reverse()
                .slice(0, 10)
                .map((point, index) => (
                  <tr
                    key={point.period || index}
                    className="border-b border-[var(--border-light)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <td className="px-4 py-2.5 text-[var(--text-primary)]">
                      {point.period?.slice(0, 10) || "N/A"}
                    </td>
                    <td className="px-4 py-2.5 text-right text-[var(--text-secondary)]">
                      {point.order_count || 0}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-[var(--text-primary)]">
                      ₦{(point.revenue || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-right text-[var(--text-secondary)]">
                      ₦{(point.average_order_value || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
