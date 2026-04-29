// components/AdminOrderFilters.jsx
import React, { useState } from "react";
import { Filter, X, Search, SlidersHorizontal } from "lucide-react";

const AdminOrderFilters = ({ currentFilters, onFilterChange, onReset }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    status: currentFilters.status || "",
    paymentStatus: currentFilters.paymentStatus || "",
    search: currentFilters.search || "",
    dateFrom: currentFilters.dateFrom || "",
    dateTo: currentFilters.dateTo || "",
  });

  const activeFilterCount = [
    currentFilters.status,
    currentFilters.paymentStatus,
    currentFilters.search,
    currentFilters.dateFrom,
    currentFilters.dateTo,
  ].filter(Boolean).length;

  const handleApply = () => {
    onFilterChange({
      status: localFilters.status || null,
      paymentStatus: localFilters.paymentStatus || null,
      search: localFilters.search || null,
      dateFrom: localFilters.dateFrom || null,
      dateTo: localFilters.dateTo || null,
    });
    setShowFilters(false);
  };

  const handleReset = () => {
    setLocalFilters({
      status: "",
      paymentStatus: "",
      search: "",
      dateFrom: "",
      dateTo: "",
    });
    onReset();
    setShowFilters(false);
  };

  return (
    <div>
      <div className="flex items-center gap-3 flex-wrap">
        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 font-medium text-sm ${
            activeFilterCount > 0
              ? "border-[var(--primary-400)] bg-[var(--primary-50)] text-[var(--primary-700)]"
              : "border-[var(--border-light)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] bg-[var(--bg-secondary)]"
          }`}
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 w-5 h-5 bg-[var(--primary-600)] text-[var(--text-inverse)] rounded-full text-xs flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Active Filter Pills */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {currentFilters.status && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--info-50)] text-[var(--info-700)] border border-[var(--info-200)]">
                Status: {currentFilters.status}
                <button
                  onClick={() => onFilterChange({ status: null })}
                  className="hover:text-[var(--info-900)]"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {currentFilters.paymentStatus && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--success-50)] text-[var(--success-700)] border border-[var(--success-200)]">
                Payment: {currentFilters.paymentStatus}
                <button
                  onClick={() => onFilterChange({ paymentStatus: null })}
                  className="hover:text-[var(--success-900)]"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {currentFilters.search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--primary-50)] text-[var(--primary-700)] border border-[var(--primary-200)]">
                "{currentFilters.search}"
                <button
                  onClick={() => onFilterChange({ search: null })}
                  className="hover:text-[var(--primary-900)]"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            <button
              onClick={handleReset}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--error-600)] transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Sort Select */}
        <select
          value={`${currentFilters.sortBy}-${currentFilters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split("-");
            onFilterChange({ sortBy, sortOrder });
          }}
          className="px-4 py-2.5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-500)] ml-auto"
        >
          <option value="order_date-desc">Newest First</option>
          <option value="order_date-asc">Oldest First</option>
          <option value="total_amount-desc">Highest Amount</option>
          <option value="total_amount-asc">Lowest Amount</option>
        </select>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mt-4 p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] space-y-4 shadow-sm">
          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              value={localFilters.search}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder="Search by order ID or tracking number..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-500)]/10 transition-all"
            />
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Status
              </label>
              <select
                value={localFilters.status}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-500)]"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Payment
              </label>
              <select
                value={localFilters.paymentStatus}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    paymentStatus: e.target.value,
                  }))
                }
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-500)]"
              >
                <option value="">All Payments</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                From Date
              </label>
              <input
                type="date"
                value={localFilters.dateFrom}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    dateFrom: e.target.value,
                  }))
                }
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-500)]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                To Date
              </label>
              <input
                type="date"
                value={localFilters.dateTo}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    dateTo: e.target.value,
                  }))
                }
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-500)]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-light)]">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 border-2 border-[var(--border-light)] rounded-xl hover:bg-[var(--bg-tertiary)] font-medium text-sm text-[var(--text-secondary)] transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2.5 bg-[var(--primary-600)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--primary-700)] font-medium text-sm transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderFilters;
