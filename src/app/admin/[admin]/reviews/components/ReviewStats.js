// pages/admin/reviews/components/ReviewStats.js
import { Star, MessageSquare, TrendingUp, Package } from "lucide-react";

export default function ReviewStats({ stats }) {
  const statCards = [
    {
      label: "Total Reviews",
      value: stats.totalReviews,
      icon: MessageSquare,
      color: "var(--info-500)",
      bgColor: "var(--info-50)",
    },
    {
      label: "Average Rating",
      value: `${stats.averageRating} / 5.0`,
      icon: Star,
      color: "var(--warning-500)",
      bgColor: "var(--warning-50)",
    },
    {
      label: "5-Star Reviews",
      value: stats.fiveStarCount,
      icon: TrendingUp,
      color: "var(--success-500)",
      bgColor: "var(--success-50)",
    },
    {
      label: "Products Reviewed",
      value: stats.totalProducts,
      icon: Package,
      color: "var(--primary-500)",
      bgColor: "var(--primary-50)",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="card rounded-lg p-5 border transition-all duration-200 hover:shadow-lg"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-light)",
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {stat.label}
                </p>
                <p
                  className="text-2xl font-bold font-Montserrat"
                  style={{ color: "var(--text-primary)" }}
                >
                  {stat.value}
                </p>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: stat.bgColor }}
              >
                <Icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
