// components/BarcodeSelect.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, ChevronDown, Check, Loader2 } from "lucide-react";
import { useBarcodeStore } from "@/stores/useBarcodeStore";

const BarcodeSelect = ({
  value, // Currently selected barcode ID(s)
  onChange, // Setter function: (barcode | barcode[] | null) => void
  multiple = false,
  placeholder = "Select barcode...",
  statusFilter = "active", // Filter barcodes by status (active, used, expired, or null for all)
  productId = null, // Optional: filter by product
  className = "",
  disabled = false,
  error = false,
}) => {
  const { barcodes, pagination, fetchBarcodes, loadingBarcodes } =
    useBarcodeStore();

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedBarcodes, setSelectedBarcodes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allBarcodes, setAllBarcodes] = useState([]);

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);
  const observerRef = useRef(null);

  // Reset pagination when dropdown opens or filters change
  useEffect(() => {
    setCurrentPage(1);
    setAllBarcodes([]);
    setHasMore(true);
  }, [statusFilter, productId, isOpen]);

  // Initial fetch and search
  useEffect(() => {
    if (!isOpen) return;

    const delayDebounce = setTimeout(() => {
      setCurrentPage(1);
      setAllBarcodes([]);
      setHasMore(true);
      fetchBarcodesPage(1);
    }, 300); // Debounce search

    return () => clearTimeout(delayDebounce);
  }, [search, isOpen]);

  // Sync internal state with value prop
  useEffect(() => {
    if (multiple) {
      const selected = Array.isArray(value) ? value : value ? [value] : [];
      setSelectedBarcodes(selected.filter(Boolean));
    } else {
      setSelectedBarcodes(value ? [value] : []);
    }
  }, [value, multiple]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Fetch a specific page
  const fetchBarcodesPage = async (page) => {
    try {
      // fetchBarcodes returns { data, pagination }
      const result = await fetchBarcodes({
        page,
        pageSize: 20,
        statusFilter,
        productId,
        search: search || undefined,
      });

      const freshBarcodes = result?.data || [];

      setAllBarcodes((prev) => {
        if (page === 1) return freshBarcodes; // ✅ fresh data
        const existingIds = new Set(prev.map((b) => b.id));
        return [
          ...prev,
          ...freshBarcodes.filter((b) => !existingIds.has(b.id)),
        ];
      });

      setHasMore(page < (result?.pagination?.totalPages || 0));
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch barcodes:", error);
    }
  };

  // Load more barcodes for infinite scroll
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = currentPage + 1;
    await fetchBarcodesPage(nextPage);
    setLoadingMore(false);
  }, [currentPage, hasMore, loadingMore, search]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!isOpen) return;

    const options = {
      root: listRef.current,
      rootMargin: "50px",
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loadingBarcodes && !loadingMore) {
        loadMore();
      }
    }, options);

    // Observe the sentinel element
    const sentinel = document.getElementById("barcode-select-sentinel");
    if (sentinel && observerRef.current) {
      observerRef.current.observe(sentinel);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isOpen, hasMore, loadingBarcodes, loadingMore, loadMore]);

  // Get display text for selected barcode(s)
  const getDisplayText = () => {
    if (selectedBarcodes.length === 0) return placeholder;

    if (multiple) {
      if (selectedBarcodes.length === 1) {
        const barcode = allBarcodes.find((b) => b.id === selectedBarcodes[0]);
        return barcode?.code || "1 selected";
      }
      return `${selectedBarcodes.length} selected`;
    }

    const barcode = allBarcodes.find((b) => b.id === selectedBarcodes[0]);
    return barcode?.code || placeholder;
  };

  // Handle selection
  const handleSelect = (barcode) => {
    if (multiple) {
      const isSelected = selectedBarcodes.includes(barcode.id);
      const newSelected = isSelected
        ? selectedBarcodes.filter((id) => id !== barcode.id)
        : [...selectedBarcodes, barcode.id];

      setSelectedBarcodes(newSelected);
      onChange?.(newSelected.length > 0 ? newSelected : []);
    } else {
      setSelectedBarcodes([barcode.id]);
      onChange?.(barcode);
      setIsOpen(false);
      setSearch("");
    }
  };

  // Handle removal of selected barcode (multiple mode)
  const handleRemove = (e, barcodeId) => {
    e.stopPropagation();
    const newSelected = selectedBarcodes.filter((id) => id !== barcodeId);
    setSelectedBarcodes(newSelected);
    onChange?.(newSelected.length > 0 ? newSelected : []);
  };

  // Clear all selections
  const handleClearAll = (e) => {
    e.stopPropagation();
    setSelectedBarcodes([]);
    onChange?.(multiple ? [] : null);
  };

  // Get selected barcode objects for display
  const selectedBarcodeObjects = selectedBarcodes
    .map((id) => allBarcodes.find((b) => b.id === id))
    .filter(Boolean);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2 px-3 py-2 
          text-sm rounded-lg border font-Poppins transition-colors
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-indigo-400"}
          ${error ? "border-red-300 focus:border-red-500" : "focus:border-indigo-400"}
          ${isOpen ? "border-indigo-400 ring-1 ring-indigo-400" : ""}
          bg-white dark:bg-slate-800
        `}
        style={{
          borderColor: isOpen
            ? undefined
            : error
              ? undefined
              : "var(--border-color)",
          minHeight: "38px",
        }}
      >
        {/* Selected items display */}
        <div className="flex-1 flex items-center gap-1.5 flex-wrap min-w-0">
          {multiple && selectedBarcodeObjects.length > 0 ? (
            <>
              {selectedBarcodeObjects.slice(0, 2).map((barcode) => (
                <span
                  key={barcode.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono"
                  style={{
                    background: "var(--bg-secondary)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  {barcode.code}
                  <X
                    size={12}
                    className="cursor-pointer hover:text-red-500"
                    onClick={(e) => handleRemove(e, barcode.id)}
                  />
                </span>
              ))}
              {selectedBarcodeObjects.length > 2 && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-md"
                  style={{
                    background: "var(--bg-secondary)",
                    color: "var(--text-muted)",
                  }}
                >
                  +{selectedBarcodeObjects.length - 2}
                </span>
              )}
            </>
          ) : (
            <span
              className={`truncate ${
                selectedBarcodes.length === 0 ? "text-gray-400" : ""
              }`}
              style={{
                color:
                  selectedBarcodes.length === 0
                    ? "var(--text-muted)"
                    : "var(--text-secondary)",
              }}
            >
              {getDisplayText()}
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {selectedBarcodes.length > 0 && !disabled && (
            <X
              size={14}
              className="hover:text-red-500 transition-colors"
              style={{ color: "var(--text-muted)" }}
              onClick={handleClearAll}
            />
          )}
          <ChevronDown
            size={16}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            style={{ color: "var(--text-muted)" }}
          />
        </div>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute z-50 mt-1 w-full card rounded-xl border shadow-lg overflow-hidden"
          style={{ borderColor: "var(--border-color)" }}
        >
          {/* Search input */}
          <div
            className="relative p-2 border-b"
            style={{ borderColor: "var(--border-light)" }}
          >
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code..."
              className="w-full text-sm pl-8 pr-3 py-2 rounded-lg border font-Poppins outline-none focus:border-indigo-400 transition-colors"
              style={{ borderColor: "var(--border-color)" }}
            />
          </div>

          {/* Options list with infinite scroll */}
          <div ref={listRef} className="max-h-60 overflow-y-auto">
            {loadingBarcodes && currentPage === 1 ? (
              <div
                className="flex items-center justify-center gap-2 px-4 py-8 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <Loader2 size={16} className="animate-spin" />
                Loading...
              </div>
            ) : allBarcodes.length === 0 ? (
              <div
                className="px-4 py-8 text-center text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                {search ? "No barcodes found" : "No barcodes available"}
              </div>
            ) : (
              <>
                {allBarcodes.map((barcode) => {
                  const isSelected = selectedBarcodes.includes(barcode.id);

                  return (
                    <button
                      key={barcode.id}
                      onClick={() => handleSelect(barcode)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-slate-700"
                      style={{
                        background: isSelected
                          ? "rgba(99,102,241,0.06)"
                          : "transparent",
                      }}
                    >
                      {/* Checkbox/Radio indicator */}
                      <div
                        className={`flex-shrink-0 w-4 h-4 rounded border transition-colors flex items-center justify-center ${
                          isSelected
                            ? "bg-indigo-600 border-indigo-600"
                            : "border-gray-300"
                        }`}
                        style={{
                          borderColor: isSelected
                            ? undefined
                            : "var(--border-color)",
                        }}
                      >
                        {isSelected && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>

                      {/* Barcode code */}
                      <span
                        className="font-mono text-xs truncate flex-1 text-left"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {barcode.code}
                      </span>

                      {/* Status badge */}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-Montserrat font-semibold capitalize flex-shrink-0 ${
                          barcode.status === "active"
                            ? "bg-green-50 text-green-700"
                            : barcode.status === "used"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-red-50 text-red-700"
                        }`}
                      >
                        {barcode.status}
                      </span>
                    </button>
                  );
                })}

                {/* Sentinel element for infinite scroll */}
                <div id="barcode-select-sentinel" className="h-1" />

                {/* Loading more indicator */}
                {loadingMore && (
                  <div
                    className="flex items-center justify-center gap-2 px-4 py-3 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Loader2 size={14} className="animate-spin" />
                    Loading more...
                  </div>
                )}

                {/* End of list message */}
                {!hasMore && allBarcodes.length > 0 && (
                  <div
                    className="px-4 py-3 text-center text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {allBarcodes.length} barcode
                    {allBarcodes.length !== 1 ? "s" : ""} total
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div
            className="px-4 py-2 border-t text-xs font-Poppins flex items-center justify-between"
            style={{
              borderColor: "var(--border-light)",
              color: "var(--text-muted)",
            }}
          >
            <span>
              {allBarcodes.length} loaded
              {pagination.total > allBarcodes.length &&
                ` of ${pagination.total}`}
            </span>
            {multiple && selectedBarcodes.length > 0 && (
              <span className="text-indigo-600 font-semibold">
                {selectedBarcodes.length} selected
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeSelect;
