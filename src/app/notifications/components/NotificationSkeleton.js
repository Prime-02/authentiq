// components/NotificationSkeleton.jsx
import React from "react";

const NotificationSkeleton = ({ count = 5 }) => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="flex items-start gap-4 p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)]"
      >
        <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 bg-[var(--bg-tertiary)] rounded" />
          <div className="h-3 w-3/4 bg-[var(--bg-tertiary)] rounded" />
          <div className="h-3 w-1/4 bg-[var(--bg-tertiary)] rounded" />
        </div>
      </div>
    ))}
  </div>
);

export default NotificationSkeleton;
