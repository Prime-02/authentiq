import React from "react";
import { Filter, SlidersHorizontal } from "lucide-react";

export default function StatsFilterBar({ filters, onFiltersChange, loading }) {
  const handleChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div
      className="card rounded-xl p-4 border flex flex-wrap items-center gap-4"
      style={{ borderColor: "var(--border-color)" }}
    >
      <div
        className="flex items-center gap-2"
        style={{ color: "var(--text-muted)" }}
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="text-sm font-medium font-Poppins">Filters:</span>
      </div>

      {/* Days Range */}
      <div className="flex items-center gap-2">
        <label
          className="text-sm font-Poppins"
          style={{ color: "var(--text-secondary)" }}
        >
          Period:
        </label>
        <select
          value={filters.days}
          onChange={(e) => handleChange("days", Number(e.target.value))}
          disabled={loading}
          className="select-sm"
          style={{
            backgroundColor: "var(--bg-primary)",
            color: "var(--text-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last year</option>
        </select>
      </div>

      {/* Stock Threshold */}
      <div className="flex items-center gap-2">
        <label
          className="text-sm font-Poppins"
          style={{ color: "var(--text-secondary)" }}
        >
          Low Stock Below:
        </label>
        <input
          type="number"
          value={filters.threshold}
          onChange={(e) => handleChange("threshold", Number(e.target.value))}
          disabled={loading}
          min={1}
          max={100}
          className="w-20 px-3 py-1.5 rounded-md text-sm border"
          style={{
            backgroundColor: "var(--bg-primary)",
            color: "var(--text-primary)",
            borderColor: "var(--border-color)",
          }}
        />
      </div>

      {/* Min Reviews */}
      <div className="flex items-center gap-2">
        <label
          className="text-sm font-Poppins"
          style={{ color: "var(--text-secondary)" }}
        >
          Min Reviews:
        </label>
        <select
          value={filters.min_reviews}
          onChange={(e) => handleChange("min_reviews", Number(e.target.value))}
          disabled={loading}
          className="select-sm"
          style={{
            backgroundColor: "var(--bg-primary)",
            color: "var(--text-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <option value={0}>Any</option>
          <option value={1}>1+</option>
          <option value={5}>5+</option>
          <option value={10}>10+</option>
          <option value={25}>25+</option>
        </select>
      </div>

      {/* Include Inactive */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.include_inactive}
          onChange={(e) => handleChange("include_inactive", e.target.checked)}
          disabled={loading}
          className="w-4 h-4 rounded"
          style={{ accentColor: "var(--primary-600)" }}
        />
        <span
          className="text-sm font-Poppins"
          style={{ color: "var(--text-secondary)" }}
        >
          Include Inactive
        </span>
      </label>
    </div>
  );
}
