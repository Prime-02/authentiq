// components/OrderFilters.jsx
import React, { useState } from "react";
import { Filter, X } from "lucide-react";

const OrderFilters = ({ currentFilters, onFilterChange, onReset }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localStatus, setLocalStatus] = useState(currentFilters.status || "");

  const handleApply = () => {
    onFilterChange({ status: localStatus || null });
    setShowFilters(false);
  };

  const handleReset = () => {
    setLocalStatus("");
    onReset();
    setShowFilters(false);
  };

  const hasActiveFilters = !!currentFilters.status;

  const statusOptions = [
    { value: "", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors font-medium text-sm ${
            hasActiveFilters
              ? "border-primary-400 bg-primary-50 text-primary-600"
              : "border-border hover:border-primary-200"
          }`}
        >
          <Filter size={16} />
          Filters
          {hasActiveFilters && (
            <span className="w-5 h-5 bg-primary-600 text-white rounded-full text-xs flex items-center justify-center">
              1
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-sm text-muted hover:text-primary-600 transition-colors"
          >
            <X size={14} />
            Clear Filters
          </button>
        )}

        {/* Sort */}
        <select
          value={`${currentFilters.sortBy}-${currentFilters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split("-");
            onFilterChange({ sortBy, sortOrder });
          }}
          className="px-4 py-2 rounded-lg border border-border bg-transparent text-sm focus:outline-none focus:border-primary-400 transition-colors ml-auto"
        >
          <option value="order_date-desc">Newest First</option>
          <option value="order_date-asc">Oldest First</option>
          <option value="total_amount-desc">Highest Amount</option>
          <option value="total_amount-asc">Lowest Amount</option>
        </select>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mt-3 p-4 card rounded-xl border border-border">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Order Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setLocalStatus(option.value)}
                  className={`px-3 py-1.5 text-sm rounded-lg border-2 transition-colors ${
                    localStatus === option.value
                      ? "border-primary-400 bg-primary-50 text-primary-600"
                      : "border-border hover:border-primary-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm border-2 border-border rounded-lg hover:bg-secondary transition-colors font-medium"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFilters;
