// components/FulfillmentMetrics.jsx
import React from "react";
import {
  Clock,
  Truck,
  XCircle,
  RotateCcw,
  Package,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import MiniStat from "./MiniStat";

const FulfillmentMetrics = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="p-8 bg-[var(--bg-primary)] rounded-xl border border-dashed border-[var(--border-light)] text-center">
        <Package
          size={32}
          className="mx-auto text-[var(--border-color)] mb-3"
        />
        <p className="text-sm text-[var(--text-muted)]">
          No fulfillment data available
        </p>
      </div>
    );
  }

  const statItems = [
    {
      label: "Avg Processing",
      value: `${metrics.average_processing_hours?.toFixed?.(1) || 0}h`,
      icon: Clock,
      color: { bg: "bg-[var(--info-100)]", icon: "text-[var(--info-600)]" },
    },
    {
      label: "Avg Delivery",
      value: `${metrics.average_delivery_hours?.toFixed?.(1) || 0}h`,
      icon: Truck,
      color: {
        bg: "bg-[var(--success-100)]",
        icon: "text-[var(--success-600)]",
      },
    },
    {
      label: "Cancellation Rate",
      value: `${metrics.cancellation_rate_percent || 0}%`,
      icon: XCircle,
      color: { bg: "bg-[var(--error-100)]", icon: "text-[var(--error-600)]" },
    },
    {
      label: "Refund Rate",
      value: `${metrics.refund_rate_percent || 0}%`,
      icon: RotateCcw,
      color: {
        bg: "bg-[var(--warning-100)]",
        icon: "text-[var(--warning-600)]",
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statItems.map((stat) => (
          <MiniStat key={stat.label} {...stat} />
        ))}
      </div>

      {/* Status Metrics */}
      {metrics.status_metrics && (
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)] p-4">
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
            Current Pipeline
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[var(--warning-50)] rounded-lg border border-[var(--warning-200)]">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} className="text-[var(--warning-600)]" />
                <span className="text-xs text-[var(--warning-700)] font-medium">
                  Processing
                </span>
              </div>
              <p className="text-lg font-bold text-[var(--warning-800)]">
                {metrics.status_metrics.currently_processing || 0}
              </p>
            </div>
            <div className="p-3 bg-[var(--info-50)] rounded-lg border border-[var(--info-200)]">
              <div className="flex items-center gap-2 mb-1">
                <Truck size={14} className="text-[var(--info-600)]" />
                <span className="text-xs text-[var(--info-700)] font-medium">
                  In Transit
                </span>
              </div>
              <p className="text-lg font-bold text-[var(--info-800)]">
                {metrics.status_metrics.currently_in_transit || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Performance */}
      {metrics.delivery_company_performance &&
        metrics.delivery_company_performance.length > 0 && (
          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border-light)]">
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                Delivery Company Performance
              </h4>
            </div>
            <div className="divide-y divide-[var(--border-light)]">
              {metrics.delivery_company_performance.map((company, index) => (
                <div
                  key={index}
                  className="px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {company.company_name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {company.orders_fulfilled} orders fulfilled
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {company.average_delivery_hours?.toFixed(1)}h
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      avg delivery
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default FulfillmentMetrics;
