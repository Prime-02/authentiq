import React from "react";

const StatCard = ({ label, value, color, sub, accent }) => (
  <div
    className="card rounded-xl p-4 relative overflow-hidden border"
    style={{ borderColor: "var(--border-light)" }}
  >
    <div
      className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${accent}`}
    />
    <p
      className="font-Montserrat text-[11px] font-semibold uppercase tracking-wide pl-2 mb-1"
      style={{ color: "var(--text-muted)" }}
    >
      {label}
    </p>
    <p className={`font-Montserrat text-2xl font-bold pl-2 ${color}`}>
      {value ?? "—"}
    </p>
    {sub && (
      <p
        className="text-[11px] pl-2 mt-1"
        style={{ color: "var(--text-muted)" }}
      >
        {sub}
      </p>
    )}
  </div>
);

export default StatCard;
