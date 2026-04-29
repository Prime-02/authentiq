// components/NotificationFilters.jsx
import React, { useState } from "react";
import { Filter, SlidersHorizontal, X } from "lucide-react";

const NotificationFilters = ({ currentFilters, onFilterChange, onReset }) => {
  const [showFilters, setShowFilters] = useState(false);

  const activeCount = [
    currentFilters.notification_type,
    currentFilters.unread_only,
  ].filter(Boolean).length;

  const types = [
    { value: "", label: "All Types" },
    { value: "order", label: "Orders" },
    { value: "shipping", label: "Shipping" },
    { value: "payment", label: "Payments" },
    { value: "alert", label: "Alerts" },
    { value: "info", label: "Info" },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all font-medium text-sm ${
            activeCount > 0
              ? "border-[var(--primary-400)] bg-[var(--primary-50)] text-[var(--primary-700)]"
              : "border-[var(--border-light)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] bg-[var(--bg-secondary)]"
          }`}
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeCount > 0 && (
            <span className="w-5 h-5 bg-[var(--primary-600)] text-[var(--text-inverse)] rounded-full text-xs flex items-center justify-center font-bold">
              {activeCount}
            </span>
          )}
        </button>

        {currentFilters.unread_only && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--primary-50)] text-[var(--primary-700)] border border-[var(--primary-200)]">
            Unread only
            <button
              onClick={() => onFilterChange({ unread_only: false })}
              className="hover:text-[var(--primary-900)]"
            >
              <X size={12} />
            </button>
          </span>
        )}

        {currentFilters.notification_type && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--info-50)] text-[var(--info-700)] border border-[var(--info-200)]">
            Type: {currentFilters.notification_type}
            <button
              onClick={() => onFilterChange({ notification_type: null })}
              className="hover:text-[var(--info-900)]"
            >
              <X size={12} />
            </button>
          </span>
        )}

        <label className="inline-flex items-center gap-2 ml-auto cursor-pointer">
          <input
            type="checkbox"
            checked={currentFilters.unread_only}
            onChange={(e) => onFilterChange({ unread_only: e.target.checked })}
            className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--primary-600)] focus:ring-[var(--primary-500)]"
          />
          <span className="text-sm text-[var(--text-secondary)]">
            Unread only
          </span>
        </label>
      </div>

      {showFilters && (
        <div className="mt-4 p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Notification Type
            </label>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type.value}
                  onClick={() =>
                    onFilterChange({ notification_type: type.value || null })
                  }
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentFilters.notification_type === type.value
                      ? "bg-[var(--primary-600)] text-[var(--text-inverse)]"
                      : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-light)] hover:border-[var(--border-hover)]"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-light)]">
            <button
              onClick={onReset}
              className="px-5 py-2.5 border-2 border-[var(--border-light)] rounded-xl hover:bg-[var(--bg-tertiary)] font-medium text-sm text-[var(--text-secondary)]"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationFilters;
