// pages/admin/reviews/components/Header.js
import { Star, RefreshCw, Settings } from "lucide-react";

export default function Header({ onRefresh }) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-bold font-Montserrat"
            style={{ color: "var(--text-primary)" }}
          >
            Review Management
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Manage and moderate all customer reviews
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="btn btn-outline btn-sm"
            title="Refresh reviews"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div
        className="mt-6 h-px w-full"
        style={{ backgroundColor: "var(--border-light)" }}
      />
    </div>
  );
}
