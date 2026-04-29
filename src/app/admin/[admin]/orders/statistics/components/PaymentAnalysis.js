// components/PaymentAnalysis.jsx
import React, { useMemo } from "react";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BarChart3,
} from "lucide-react";
import MiniStat from "./MiniStat";

const PaymentAnalysis = ({ data }) => {
  if (!data) {
    return (
      <div className="p-8 bg-[var(--bg-primary)] rounded-xl border border-dashed border-[var(--border-light)] text-center">
        <CreditCard
          size={32}
          className="mx-auto text-[var(--border-color)] mb-3"
        />
        <p className="text-sm text-[var(--text-muted)]">
          No payment data available
        </p>
      </div>
    );
  }

  const stats = [
    {
      label: "Success Rate",
      value: `${data.success_rate_percent || 0}%`,
      icon: CheckCircle2,
      color: {
        bg: "bg-[var(--success-100)]",
        icon: "text-[var(--success-600)]",
      },
    },
    {
      label: "Failed",
      value: data.failed_payments || 0,
      icon: XCircle,
      color: { bg: "bg-[var(--error-100)]", icon: "text-[var(--error-600)]" },
    },
    {
      label: "Refunded",
      value: data.refunded_payments || 0,
      icon: RotateCcw,
      color: { bg: "bg-[var(--info-100)]", icon: "text-[var(--info-600)]" },
    },
    {
      label: "Total Analyzed",
      value: data.total_orders_analyzed || 0,
      icon: BarChart3,
      color: {
        bg: "bg-[var(--primary-100)]",
        icon: "text-[var(--primary-600)]",
      },
    },
  ];

  const statusData = useMemo(() => {
    if (!data.payment_status_distribution) return [];
    return Object.entries(data.payment_status_distribution).map(
      ([status, info]) => ({
        status,
        count: info.count || 0,
        amount: info.total_amount || 0,
        percentage:
          data.total_orders_analyzed > 0
            ? ((info.count || 0) / data.total_orders_analyzed) * 100
            : 0,
      }),
    );
  }, [data]);

  const getStatusColor = (status) => {
    const colors = {
      paid: "bg-[var(--success-400)]",
      pending: "bg-[var(--warning-400)]",
      failed: "bg-[var(--error-400)]",
      refunded: "bg-[var(--info-400)]",
    };
    return colors[status] || "bg-[var(--border-color)]";
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <MiniStat key={stat.label} {...stat} />
        ))}
      </div>

      {/* Status Distribution Chart */}
      {statusData.length > 0 && (
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)] p-4">
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
            Payment Status Distribution
          </h4>
          <div className="space-y-3">
            {statusData.map((item) => (
              <div key={item.status}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[var(--text-secondary)]">
                    {getStatusLabel(item.status)}
                  </span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {item.count} ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStatusColor(item.status)} rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  ₦{item.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Methods */}
      {data.payment_method_distribution &&
        Object.keys(data.payment_method_distribution).length > 0 && (
          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border-light)]">
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                Payment Methods
              </h4>
            </div>
            <div className="divide-y divide-[var(--border-light)]">
              {Object.entries(data.payment_method_distribution).map(
                ([method, info]) => (
                  <div
                    key={method}
                    className="px-4 py-3 flex items-center justify-between"
                  >
                    <span className="text-sm text-[var(--text-secondary)]">
                      {method}
                    </span>
                    <div className="text-right">
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {info.count} orders
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        ₦{(info.total_amount || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default PaymentAnalysis;
