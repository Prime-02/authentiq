"use client";
import React, { useState } from "react";
import Dropdown from "@/components/inputs/DynamicDropdown";
import {
  Search,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { useBarcodeStore } from "@/stores";
import { CategoryDropdown } from "@/components/inputs/CategoryDropdown";

const ACTIVE_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const ProductFilters = ({
  filters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  isAdmin,
  categoryPage = false,
}) => {
  const { barcodes } = useBarcodeStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasAdvancedFilters = () =>
    filters.barcode ||
    filters.sizes ||
    filters.is_active !== undefined ||
    filters.min_price ||
    filters.max_price ||
    filters.min_stock ||
    filters.max_stock;

  const hasAnyFilter = () =>
    filters.search || filters.category_id || hasAdvancedFilters();

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-sm overflow-hidden">
      {/* Primary filter bar */}
      <div className="p-4 flex flex-col md:flex-row gap-3 items-end">
        {/* Search */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by name or description…"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)]
                       text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm
                       focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition"
          />
        </div>
        {/* Status (admin) */}
        {isAdmin && (
          <div className="w-full md:w-44">
            <select
              value={
                filters.is_active !== undefined
                  ? filters.is_active.toString()
                  : ""
              }
              onChange={(e) => {
                const val =
                  e.target.value === "" ? undefined : e.target.value === "true";
                onFilterChange("is_active", val);
              }}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)]
                         text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]
                         focus:border-transparent transition"
            >
              {ACTIVE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 shrink-0">
          {isAdmin && (
            <button
              onClick={() => setShowAdvanced((s) => !s)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition
                ${
                  showAdvanced || hasAdvancedFilters()
                    ? "border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-700)]"
                    : "border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                }`}
            >
              <SlidersHorizontal size={15} />
              Filters
              {hasAdvancedFilters() && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-600)]" />
              )}
              <ChevronDown
                size={14}
                className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`}
              />
            </button>
          )}
          <button
            onClick={onApplyFilters}
            className="px-4 py-2 bg-[var(--primary-600)] text-[var(--text-inverse)] rounded-lg
                       hover:bg-[var(--primary-700)] text-sm font-medium transition"
          >
            Apply
          </button>
          {hasAnyFilter() && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1.5 px-3 py-2 border border-[var(--border-color)] bg-[var(--bg-primary)]
                         text-[var(--text-secondary)] rounded-lg hover:bg-[var(--bg-hover)] text-sm transition"
            >
              <RotateCcw size={14} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Advanced filters panel (admin) */}
      {isAdmin && showAdvanced && (
        <div className="border-t border-[var(--border-color)] bg-[var(--bg-tertiary)] px-4 py-4">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
            Advanced Filters
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="col-span-2 md:col-span-1">
              <Dropdown
                className="border border-[var(--border-color)] px-3 py-2 rounded-lg w-full text-sm bg-[var(--bg-primary)] text-[var(--text-primary)]"
                options={barcodes}
                tag="Barcode"
                onSelect={(b) => onFilterChange("barcode", b?.code || "")}
                placeholder="Barcode"
                valueKey="code"
                displayKey="code"
                emptyMessage="No barcodes"
                clearable={true}
                value={filters.barcode}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Sizes (S, M, L)"
                value={filters.sizes}
                onChange={(e) => onFilterChange("sizes", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)]
                           text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
              />
            </div>
            {[
              { key: "min_price", placeholder: "Min price" },
              { key: "max_price", placeholder: "Max price" },
              { key: "min_stock", placeholder: "Min stock" },
              { key: "max_stock", placeholder: "Max stock" },
            ].map(({ key, placeholder }) => (
              <div key={key}>
                <input
                  type="number"
                  placeholder={placeholder}
                  value={filters[key]}
                  onChange={(e) => onFilterChange(key, e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)]
                             text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
