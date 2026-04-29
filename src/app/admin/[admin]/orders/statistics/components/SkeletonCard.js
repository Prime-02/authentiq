// components/SkeletonCard.jsx
import React from "react";

const SkeletonCard = ({ className = "" }) => (
  <div
    className={`bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)] p-4 animate-pulse ${className}`}
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)]" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-20 bg-[var(--bg-tertiary)] rounded" />
        <div className="h-5 w-16 bg-[var(--bg-tertiary)] rounded" />
      </div>
    </div>
  </div>
);

export const SkeletonRow = ({ lines = 3 }) => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="h-12 bg-[var(--bg-tertiary)] rounded-xl" />
    ))}
  </div>
);

export const SkeletonChart = () => (
  <div className="animate-pulse space-y-4">
    <div className="flex gap-3">
      <div className="h-10 flex-1 bg-[var(--bg-tertiary)] rounded-lg" />
      <div className="h-10 flex-1 bg-[var(--bg-tertiary)] rounded-lg" />
      <div className="h-10 flex-1 bg-[var(--bg-tertiary)] rounded-lg" />
    </div>
    <div className="h-48 bg-[var(--bg-tertiary)] rounded-xl" />
    <div className="h-32 bg-[var(--bg-tertiary)] rounded-xl" />
  </div>
);

export default SkeletonCard;
