// components/StatCard.jsx
import React from "react";

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
  bgColor,
  trend,
  trendUp,
}) => (
  <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-light)] hover:border-[var(--border-hover)] transition-all duration-200">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0`}
        >
          <Icon size={20} className={color} />
        </div>
        <div>
          <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
            {label}
          </p>
          <p className="text-xl font-bold text-[var(--text-primary)] mt-0.5">
            {value}
          </p>
        </div>
      </div>
      {trend && (
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? "bg-[var(--success-50)] text-[var(--success-600)]" : "bg-[var(--error-50)] text-[var(--error-600)]"}`}
        >
          {trendUp ? "+" : ""}
          {trend}
        </span>
      )}
    </div>
  </div>
);

export default StatCard;
