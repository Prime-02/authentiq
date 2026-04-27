import React from "react";

const Pagination = ({
  skip,
  limit,
  barcodeCount,
  canPrev,
  canNext,
  onPrev,
  onNext,
  total,
  currentPage,
  totalPages,
}) => (
  <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
    <div className="space-y-1.5">
      <div className="flex gap-4">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-amber-600">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> Expiring within
          30 days
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-red-600">
          <span className="w-2 h-2 rounded-full bg-red-500" /> Past expiry date
        </span>
      </div>
      <p
        className="text-xs font-Poppins"
        style={{ color: "var(--text-muted)" }}
      >
        Showing {skip + 1}–
        {Math.min(skip + barcodeCount, total || skip + barcodeCount)} of{" "}
        {total || "?"}
      </p>
    </div>

    <div className="flex gap-1.5 items-center">
      <button
        onClick={onPrev}
        disabled={!canPrev}
        className="card text-xs px-3 py-2 rounded-lg border font-Poppins disabled:opacity-40 transition-colors"
        style={{ borderColor: "var(--border-color)" }}
      >
        ← Prev
      </button>
      <span
        className="text-xs px-2 font-Poppins"
        style={{ color: "var(--text-muted)" }}
      >
        Page {currentPage || Math.floor(skip / limit) + 1} of{" "}
        {totalPages || "?"}
      </span>
      <button
        onClick={onNext}
        disabled={!canNext}
        className="card text-xs px-3 py-2 rounded-lg border font-Poppins disabled:opacity-40 transition-colors"
        style={{ borderColor: "var(--border-color)" }}
      >
        Next →
      </button>
    </div>
  </div>
);

export default Pagination;
