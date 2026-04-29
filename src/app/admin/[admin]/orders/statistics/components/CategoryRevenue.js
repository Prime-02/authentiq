// components/CategoryRevenue.jsx
import React, { useMemo } from "react";
import { Tag, PieChart } from "lucide-react";

const CategoryRevenue = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-8 bg-[var(--bg-primary)] rounded-xl border border-dashed border-[var(--border-light)] text-center">
        <Tag size={32} className="mx-auto text-[var(--border-color)] mb-3" />
        <p className="text-sm text-[var(--text-muted)]">
          No category data available
        </p>
      </div>
    );
  }

  const totalRevenue = data.reduce(
    (sum, cat) => sum + (cat.total_revenue || 0),
    0,
  );
  const maxRevenue = Math.max(...data.map((c) => c.total_revenue || 0));

  // Simple pie chart using conic-gradient
  const pieSegments = useMemo(() => {
    const colors = [
      "var(--success-400)",
      "var(--info-400)",
      "var(--warning-400)",
      "var(--error-400)",
      "var(--primary-400)",
      "var(--success-300)",
      "var(--info-300)",
      "var(--warning-300)",
    ];
    let currentAngle = 0;
    return data.map((cat, index) => {
      const percentage =
        totalRevenue > 0 ? (cat.total_revenue / totalRevenue) * 100 : 0;
      const angle = (percentage / 100) * 360;
      const segment = {
        start: currentAngle,
        end: currentAngle + angle,
        color: colors[index % colors.length],
        percentage,
      };
      currentAngle += angle;
      return segment;
    });
  }, [data, totalRevenue]);

  const gradientString = pieSegments
    .map((seg) => `${seg.color} ${seg.start}deg ${seg.end}deg`)
    .join(", ");

  return (
    <div className="space-y-4">
      {/* Pie Chart */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)] p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div
            className="w-32 h-32 rounded-full flex-shrink-0"
            style={{
              background: `conic-gradient(${gradientString})`,
            }}
          />
          <div className="flex-1 space-y-2">
            {data.slice(0, 6).map((cat, index) => {
              const colors = [
                "bg-[var(--success-400)]",
                "bg-[var(--info-400)]",
                "bg-[var(--warning-400)]",
                "bg-[var(--error-400)]",
                "bg-[var(--primary-400)]",
                "bg-[var(--success-300)]",
              ];
              return (
                <div
                  key={cat.category_id || index}
                  className="flex items-center gap-2"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}
                  />
                  <span className="text-xs text-[var(--text-secondary)] flex-1 truncate">
                    {cat.category_name}
                  </span>
                  <span className="text-xs font-medium text-[var(--text-primary)]">
                    {cat.revenue_share_percent}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[var(--border-light)]">
                <th className="px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider text-right">
                  Revenue
                </th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider text-right">
                  Share
                </th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider text-right">
                  Units
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((category, index) => {
                const percentage =
                  maxRevenue > 0
                    ? ((category.total_revenue || 0) / maxRevenue) * 100
                    : 0;
                return (
                  <tr
                    key={category.category_id || index}
                    className="border-b border-[var(--border-light)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {category.category_name || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-[var(--text-primary)]">
                      ₦{(category.total_revenue || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--primary-400)] rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-[var(--text-secondary)]">
                          {category.revenue_share_percent || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--text-secondary)]">
                      {(category.units_sold || 0).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryRevenue;
