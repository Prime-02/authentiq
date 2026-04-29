// components/TabButton.jsx
import React from "react";

const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
      active
        ? "bg-[var(--primary-100)] text-[var(--primary-700)] border border-[var(--primary-200)]"
        : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
    }`}
  >
    {Icon && <Icon size={16} />}
    {label}
    {count !== undefined && (
      <span
        className={`ml-1 px-1.5 py-0.5 rounded-md text-xs ${active ? "bg-[var(--primary-200)] text-[var(--primary-800)]" : "bg-[var(--bg-tertiary)] text-[var(--text-muted)]"}`}
      >
        {count}
      </span>
    )}
  </button>
);

export default TabButton;
