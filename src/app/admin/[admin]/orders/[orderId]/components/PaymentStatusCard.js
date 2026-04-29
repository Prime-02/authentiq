// components/PaymentStatusCard.jsx
import React, { useState } from "react";
import {
  CreditCard,
  Hash,
  Edit3,
  X,
  Loader2,
  Check,
  Clock,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

const getPaymentStatusConfig = (status) => {
  const configs = {
    paid: {
      icon: Check,
      badgeClass:
        "bg-[var(--success-100)] text-[var(--success-700)] border-[var(--success-200)]",
      dotClass: "bg-[var(--success-500)]",
      description: "Payment completed successfully",
    },
    pending: {
      icon: Clock,
      badgeClass:
        "bg-[var(--warning-100)] text-[var(--warning-700)] border-[var(--warning-200)]",
      dotClass: "bg-[var(--warning-500)]",
      description: "Awaiting payment confirmation",
    },
    failed: {
      icon: AlertCircle,
      badgeClass:
        "bg-[var(--error-100)] text-[var(--error-700)] border-[var(--error-200)]",
      dotClass: "bg-[var(--error-500)]",
      description: "Payment was not successful",
    },
    refunded: {
      icon: RotateCcw,
      badgeClass:
        "bg-[var(--info-100)] text-[var(--info-700)] border-[var(--info-200)]",
      dotClass: "bg-[var(--info-500)]",
      description: "Payment has been refunded",
    },
  };
  return (
    configs[status?.toLowerCase()] || {
      icon: Clock,
      badgeClass:
        "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-light)]",
      dotClass: "bg-[var(--border-color)]",
      description: "Status unknown",
    }
  );
};

const PaymentStatusCard = ({
  order,
  showForm,
  onToggleForm,
  paymentStatus,
  onPaymentStatusChange,
  transactionId,
  onTransactionIdChange,
  onSave,
  loading,
}) => {
  const statusConfig = getPaymentStatusConfig(order?.payment_status);
  const StatusIcon = statusConfig.icon;

  const statusOptions = [
    { value: "pending", label: "Pending", color: "text-[var(--warning-600)]" },
    { value: "paid", label: "Paid", color: "text-[var(--success-600)]" },
    { value: "failed", label: "Failed", color: "text-[var(--error-600)]" },
    { value: "refunded", label: "Refunded", color: "text-[var(--info-600)]" },
  ];

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--success-100)] border border-[var(--success-200)] flex items-center justify-center">
              <CreditCard size={20} className="text-[var(--success-600)]" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-Montserrat text-[var(--text-primary)]">
                Payment Status
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                {statusConfig.description}
              </p>
            </div>
          </div>
          {!showForm && (
            <button
              onClick={onToggleForm}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--primary-600)] hover:bg-[var(--primary-50)] transition-colors"
            >
              <Edit3 size={14} />
              Update
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {showForm ? (
        <div className="px-6 pb-6">
          <div className="p-5 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)] space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Payment Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onPaymentStatusChange(option.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                      paymentStatus === option.value
                        ? "border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-700)]"
                        : "border-[var(--border-light)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${option.color.replace("text-", "bg-")}`}
                    />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Transaction ID{" "}
                <span className="text-[var(--text-muted)] normal-case">
                  (Optional)
                </span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => onTransactionIdChange(e.target.value)}
                placeholder="Enter transaction ID"
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--success-500)] focus:ring-2 focus:ring-[var(--success-500)]/10 transition-all duration-200"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={onSave}
                disabled={loading || !paymentStatus}
                className="btn btn-primary btn-sm flex-1 justify-center"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                Save Payment
              </button>
              <button onClick={onToggleForm} className="btn btn-ghost btn-sm">
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 pb-6">
          <div className="space-y-3">
            {/* Status Row */}
            <div className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)]">
              <div className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0">
                <StatusIcon size={16} className="text-[var(--text-muted)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  Status
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${statusConfig.badgeClass}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`}
                    />
                    {order?.payment_status?.charAt(0).toUpperCase() +
                      order?.payment_status?.slice(1) || "Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* Transaction ID */}
            {order?.transaction_id && (
              <div className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)]">
                <div className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0">
                  <Hash size={16} className="text-[var(--text-muted)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-0.5">
                    Transaction ID
                  </p>
                  <p className="font-mono text-sm font-medium text-[var(--text-primary)] break-all">
                    {order.transaction_id}
                  </p>
                </div>
              </div>
            )}

            {/* Amount (if available) */}
            {order?.total_amount && (
              <div className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)]">
                <div className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0">
                  <CreditCard size={16} className="text-[var(--text-muted)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-0.5">
                    Amount
                  </p>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    ₦{order.total_amount.toLocaleString("en-NG")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStatusCard;
