// pages/admin/reviews/components/EmptyState.js
import { MessageSquare, SearchX } from "lucide-react";

export default function EmptyState({ onClearFilters }) {
  return (
    <div
      className="card rounded-lg border p-12 text-center"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border-light)",
      }}
    >
      <div className="max-w-md mx-auto">
        <div
          className="inline-flex p-4 rounded-full mb-4"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        >
          <SearchX className="w-8 h-8" style={{ color: "var(--text-muted)" }} />
        </div>

        <h3
          className="text-lg font-semibold mb-2 font-Montserrat"
          style={{ color: "var(--text-primary)" }}
        >
          No Reviews Found
        </h3>

        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          No reviews match your current filters. Try adjusting your search
          criteria or clear all filters.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button onClick={onClearFilters} className="btn btn-primary btn-sm">
            <MessageSquare className="w-4 h-4" />
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
