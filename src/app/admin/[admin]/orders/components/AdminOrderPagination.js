// components/AdminOrderPagination.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AdminOrderPagination = ({ pagination, onPageChange }) => {
  const {
    page,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    totalItems,
    perPage,
  } = pagination;

  const startItem = (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return {
      pages,
      showStartEllipsis: start > 1,
      showEndEllipsis: end < totalPages,
    };
  };

  const { pages, showStartEllipsis, showEndEllipsis } = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)] p-4">
      <p className="text-sm text-[var(--text-muted)]">
        Showing{" "}
        <span className="font-medium text-[var(--text-primary)]">
          {startItem}
        </span>
        –
        <span className="font-medium text-[var(--text-primary)]">
          {endItem}
        </span>{" "}
        of{" "}
        <span className="font-medium text-[var(--text-primary)]">
          {totalItems.toLocaleString()}
        </span>{" "}
        orders
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPreviousPage}
          className="flex items-center gap-1 px-3 py-2 rounded-lg border border-[var(--border-light)] hover:bg-[var(--bg-tertiary)] disabled:opacity-40 disabled:cursor-not-allowed text-sm text-[var(--text-secondary)] transition-colors"
        >
          <ChevronLeft size={16} />
          Prev
        </button>

        {showStartEllipsis && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-9 h-9 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              1
            </button>
            <span className="px-1 text-[var(--text-muted)]">...</span>
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
              p === page
                ? "bg-[var(--primary-600)] text-[var(--text-inverse)] shadow-sm"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
            }`}
          >
            {p}
          </button>
        ))}

        {showEndEllipsis && (
          <>
            <span className="px-1 text-[var(--text-muted)]">...</span>
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-9 h-9 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="flex items-center gap-1 px-3 py-2 rounded-lg border border-[var(--border-light)] hover:bg-[var(--bg-tertiary)] disabled:opacity-40 disabled:cursor-not-allowed text-sm text-[var(--text-secondary)] transition-colors"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default AdminOrderPagination;
