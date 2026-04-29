// components/UserAvatar.jsx
export function UserAvatar({ firstname, lastname, size = 36 }) {
  const initials =
    [firstname?.[0], lastname?.[0]].filter(Boolean).join("").toUpperCase() ||
    "?";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "var(--bg-tertiary)",
        color: "var(--text-secondary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: size * 0.38,
        flexShrink: 0,
        border: "1.5px solid var(--border-color)",
        letterSpacing: "0.04em",
      }}
    >
      {initials}
    </div>
  );
}
