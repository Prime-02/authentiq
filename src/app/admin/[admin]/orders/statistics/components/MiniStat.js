// components/MiniStat.jsx
import React from "react";

const MiniStat = ({ label, value, icon: Icon, color }) => (
  <div className="p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)] text-center hover:border-[var(--border-hover)] transition-colors">
    {Icon && (
      <div
        className={`w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center ${color ? color.bg : "bg-[var(--bg-tertiary)]"}`}
      >
        <Icon
          size={16}
          className={color ? color.icon : "text-[var(--text-muted)]"}
        />
      </div>
    )}
    <p className="text-xs text-[var(--text-muted)] mb-1">{label}</p>
    <p className="text-lg font-bold text-[var(--text-primary)]">{value}</p>
  </div>
);

export default MiniStat;
