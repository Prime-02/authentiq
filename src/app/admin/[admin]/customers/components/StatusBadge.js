// components/StatusBadge.jsx
export function StatusBadge({ active }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        background: active ? "var(--success-100)" : "var(--error-100)",
        color: active ? "var(--success-700)" : "var(--error-700)",
        border: `1px solid ${active ? "var(--success-200)" : "var(--error-200)"}`,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: active ? "var(--success-500)" : "var(--error-500)",
          display: "inline-block",
        }}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}
