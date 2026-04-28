// components/OrderPagination.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const OrderPagination = ({ pagination, onPageChange }) => {
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

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-muted">
        Showing {startItem}-{endItem} of {totalItems} orders
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPreviousPage}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              return p === 1 || p === totalPages || Math.abs(p - page) <= 2;
            })
            .map((p, index, array) => (
              <React.Fragment key={p}>
                {index > 0 && array[index - 1] !== p - 1 && (
                  <span className="px-2 text-muted">...</span>
                )}
                <button
                  onClick={() => onPageChange(p)}
                  className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
                    p === page
                      ? "bg-primary-600 text-white"
                      : "border border-border hover:bg-secondary"
                  }`}
                >
                  {p}
                </button>
              </React.Fragment>
            ))}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default OrderPagination;
