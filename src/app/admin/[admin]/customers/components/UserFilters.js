// components/UserFilters.jsx
export function UserFilters({ filters, onFiltersChange, onRefresh }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        marginBottom: "1rem",
        alignItems: "center",
      }}
    >
      {/* Search */}
      <div style={{ position: "relative", flex: "1 1 220px" }}>
        <span
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
            fontSize: 14,
            pointerEvents: "none",
          }}
        >
          🔍
        </span>
        <input
          type="text"
          placeholder="Search by name or email…"
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
          style={{
            width: "100%",
            padding: "8px 12px 8px 36px",
            border: "1px solid var(--border-color)",
            borderRadius: 8,
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      <select
        value={
          filters.isActive === null
            ? "all"
            : filters.isActive
              ? "active"
              : "inactive"
        }
        onChange={(e) => {
          const val = e.target.value;
          onFiltersChange({
            isActive: val === "all" ? null : val === "active",
          });
        }}
        className="select-sm"
        style={{ minWidth: 130 }}
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <button
        className="btn btn-ghost btn-sm"
        onClick={onRefresh}
        style={{ marginLeft: "auto" }}
      >
        ↺ Refresh
      </button>
    </div>
  );
}
