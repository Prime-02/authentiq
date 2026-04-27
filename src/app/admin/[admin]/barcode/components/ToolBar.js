import React from "react";
import { Download, LayoutGrid, Table2 } from "lucide-react";

const Toolbar = ({
  productId,
  setProductId,
  expiryFilter,
  setExpiryFilter,
  search,
  setSearch,
  limit,
  setLimit,
  setSkip,
  products,
  viewMode,
  setViewMode,
}) => (
  <div className="flex flex-wrap gap-2 mb-4 items-center">
    {/* Product filter */}
    <select
      value={productId}
      onChange={(e) => setProductId(e.target.value)}
      className="card text-xs px-3 py-2 rounded-lg border font-Poppins h-9 outline-none focus:border-indigo-400 transition-colors"
      style={{ borderColor: "var(--border-color)" }}
    >
      <option value="">All products</option>
      {(products || []).map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>

    {/* Expiry filter */}
    <select
      value={expiryFilter}
      onChange={(e) => setExpiryFilter(e.target.value)}
      className="card text-xs px-3 py-2 rounded-lg border font-Poppins h-9 outline-none focus:border-indigo-400 transition-colors"
      style={{ borderColor: "var(--border-color)" }}
    >
      {[
        ["", "Expiry: any"],
        ["30d", "Expiring in 30 days"],
        ["90d", "Expiring in 90 days"],
        ["past", "Already expired"],
      ].map(([v, l]) => (
        <option key={v} value={v}>
          {l}
        </option>
      ))}
    </select>

    {/* Search */}
    <div className="relative flex-1 min-w-[160px]">
      <svg
        className="absolute left-2.5 top-1/2 -translate-y-1/2"
        style={{ color: "var(--text-muted)" }}
        width="13"
        height="13"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="7" cy="7" r="5" />
        <path d="M11 11l3 3" />
      </svg>
      <input
        type="text"
        placeholder="Search by code…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="card w-full text-xs pl-8 pr-3 py-2 rounded-lg border h-9 font-Poppins outline-none focus:border-indigo-400 transition-colors"
        style={{ borderColor: "var(--border-color)" }}
      />
    </div>
    {/* View toggle */}
    <div
      className="flex items-center rounded-lg border overflow-hidden"
      style={{ borderColor: "var(--border-color)" }}
    >
      <button
        onClick={() => setViewMode("table")}
        className="flex items-center justify-center w-9 h-9 transition-colors"
        title="Table view"
        style={{
          background:
            viewMode === "table" ? "var(--bg-hover)" : "var(--bg-secondary)",
          color:
            viewMode === "table" ? "var(--text-primary)" : "var(--text-muted)",
        }}
      >
        <Table2 size={14} />
      </button>
      <button
        onClick={() => setViewMode("card")}
        className="flex items-center justify-center w-9 h-9 transition-colors"
        title="Card view"
        style={{
          background:
            viewMode === "card" ? "var(--bg-hover)" : "var(--bg-secondary)",
          color:
            viewMode === "card" ? "var(--text-primary)" : "var(--text-muted)",
        }}
      >
        <LayoutGrid size={14} />
      </button>
    </div>
  </div>
);

export default Toolbar;
