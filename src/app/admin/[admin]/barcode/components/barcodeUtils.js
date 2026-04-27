// ─── Constants ────────────────────────────────────────────────────────────────
export const LIMIT_OPTIONS = [25, 50, 100];
export const VALID_STATUSES = ["active", "used", "expired"];
export const EXPIRY_SOON_DAYS = 30;

export const STATUS_CONFIG = {
  active: {
    badge: "bg-green-50 text-green-800 border-green-200",
    dot: "bg-green-500",
  },
  used: {
    badge: "bg-blue-50  text-blue-800  border-blue-200",
    dot: "bg-blue-500",
  },
  expired: {
    badge: "bg-red-50   text-red-800   border-red-200",
    dot: "bg-red-500",
  },
  disabled: {
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

export const getDaysUntilExpiry = (dateStr) => {
  if (!dateStr) return null;
  return (new Date(dateStr) - Date.now()) / 864e5;
};

export const expiryDisplay = (dateStr, status) => {
  if (!dateStr) return { label: "—", cls: "" };
  const days = getDaysUntilExpiry(dateStr);
  if (status === "active" && days !== null) {
    if (days < 0)
      return { label: fmt(dateStr), cls: "text-red-600 font-semibold" };
    if (days <= EXPIRY_SOON_DAYS)
      return { label: fmt(dateStr), cls: "text-amber-600 font-semibold" };
  }
  return { label: fmt(dateStr), cls: "" };
};

export const statPercent = (part, total) =>
  total ? `${((part / total) * 100).toFixed(1)}% of total` : "";
