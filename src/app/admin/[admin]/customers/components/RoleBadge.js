// components/RoleBadge.jsx
export function RoleBadge({ isAdmin }) {
  return (
    <span
      style={{
        display: "inline-flex",
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        background: isAdmin ? "var(--info-100)" : "var(--primary-100)",
        color: isAdmin ? "var(--info-700)" : "var(--primary-600)",
        border: `1px solid ${isAdmin ? "var(--info-200)" : "var(--primary-300)"}`,
      }}
    >
      {isAdmin ? "Admin" : "Customer"}
    </span>
  );
}
