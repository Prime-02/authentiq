import React from "react";

const StatCard = ({ label, value, color, sub, accent }) => (
  <div
    className="rounded-xl p-4 relative overflow-hidden border"
    style={{ borderColor: "var(--border-light)" }}
  >
    <div
      className={`absolute left-0 top-0 right-0 h-1 rounded-t-xl ${accent}`}
    />
    <p
      className="font-Montserrat text-[11px] font-semibold uppercase tracking-wide mb-1"
      style={{ color: "var(--text-muted)" }}
    >
      {label}
    </p>
    <p className={`font-Montserrat text-2xl font-bold ${color}`}>
      {value ?? "—"}
    </p>
    {sub && (
      <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
        {sub}
      </p>
    )}
  </div>
);

export default StatCard;
