// pages/admin/reviews/components/ReviewFilters.js
import { Search, X, Filter } from "lucide-react";
import { useState } from "react";

export default function ReviewFilters({
  filters,
  onFilterChange,
  onClearFilters,
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (key, value) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleClear = () => {
    setLocalFilters({
      productId: "",
      userId: "",
      rating: "",
      searchTerm: "",
    });
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div
      className="card rounded-lg p-4 mb-6 border"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border-light)",
      }}
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search reviews, users, or products..."
            value={localFilters.searchTerm}
            onChange={(e) => handleChange("searchTerm", e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          />
        </div>

        {/* Rating Filter */}
        <div className="w-full lg:w-48">
          <select
            value={localFilters.rating}
            onChange={(e) => handleChange("rating", e.target.value)}
            className="w-full"
          >
            <option value="">All Ratings</option>
            <option value="5">★★★★★ (5)</option>
            <option value="4">★★★★☆ (4)</option>
            <option value="3">★★★☆☆ (3)</option>
            <option value="2">★★☆☆☆ (2)</option>
            <option value="1">★☆☆☆☆ (1)</option>
          </select>
        </div>

        {/* Product ID Filter */}
        <div className="w-full lg:w-48">
          <input
            type="text"
            placeholder="Product ID"
            value={localFilters.productId}
            onChange={(e) => handleChange("productId", e.target.value)}
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          />
        </div>

        {/* User ID Filter */}
        <div className="w-full lg:w-48">
          <input
            type="text"
            placeholder="User ID"
            value={localFilters.userId}
            onChange={(e) => handleChange("userId", e.target.value)}
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="btn btn-outline btn-sm whitespace-nowrap"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <div className="mt-3 flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
            Filters active
          </span>
        </div>
      )}
    </div>
  );
}
