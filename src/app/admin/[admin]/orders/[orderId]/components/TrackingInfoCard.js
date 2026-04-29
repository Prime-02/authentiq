// components/TrackingInfoCard.jsx
import React, { useState } from "react";
import {
  Hash,
  Truck,
  Edit3,
  X,
  Loader2,
  Package,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";

const TrackingInfoCard = ({
  order,
  showForm,
  onToggleForm,
  trackingNumber,
  onTrackingNumberChange,
  shippingMethod,
  onShippingMethodChange,
  onSave,
  loading,
}) => {
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = async (text, field) => {
    if (!text || text === "Not set" || text === "N/A") return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const displayData = [
    {
      id: "tracking",
      icon: Hash,
      label: "Tracking Number",
      value: order?.tracking_number,
      placeholder: "Not set",
      copyable: true,
    },
    {
      id: "method",
      icon: Package,
      label: "Shipping Method",
      value: order?.shipping_method,
      placeholder: "N/A",
      copyable: false,
    },
  ];

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--info-100)] border border-[var(--info-200)] flex items-center justify-center">
              <Truck size={20} className="text-[var(--info-600)]" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-Montserrat text-[var(--text-primary)]">
                Tracking Information
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                {order?.tracking_number ? "Active shipment" : "Not configured"}
              </p>
            </div>
          </div>
          {!showForm && (
            <button
              onClick={onToggleForm}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--primary-600)] hover:bg-[var(--primary-50)] transition-colors"
            >
              <Edit3 size={14} />
              {order?.tracking_number ? "Update" : "Add"}
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
                Tracking Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => onTrackingNumberChange(e.target.value)}
                placeholder="Enter tracking number"
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--info-500)] focus:ring-2 focus:ring-[var(--info-500)]/10 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Shipping Method
              </label>
              <input
                type="text"
                value={shippingMethod}
                onChange={(e) => onShippingMethodChange(e.target.value)}
                placeholder="e.g., Express, Standard"
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--info-500)] focus:ring-2 focus:ring-[var(--info-500)]/10 transition-all duration-200"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={onSave}
                disabled={loading || !trackingNumber}
                className="btn btn-primary btn-sm flex-1 justify-center"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                Save Tracking
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
            {displayData.map((item) => {
              const isCopied = copiedField === item.id;
              const hasValue = item.value && item.value !== item.placeholder;

              return (
                <div
                  key={item.id}
                  className="group flex items-start gap-3 p-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)] hover:border-[var(--border-hover)] transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon size={16} className="text-[var(--text-muted)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-0.5">
                      {item.label}
                    </p>
                    <p
                      className={`text-sm font-medium ${hasValue ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}`}
                    >
                      {item.value || item.placeholder}
                    </p>
                  </div>
                  {item.copyable && hasValue && (
                    <button
                      onClick={() => handleCopy(item.value, item.id)}
                      className={`flex-shrink-0 p-1.5 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 ${
                        isCopied
                          ? "bg-[var(--success-100)] text-[var(--success-600)]"
                          : "hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                      }`}
                    >
                      {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  )}
                  {item.id === "tracking" && hasValue && (
                    <a
                      href={`https://track.example.com/${item.value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--info-600)] transition-colors opacity-0 group-hover:opacity-100"
                      title="Track shipment"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingInfoCard;
