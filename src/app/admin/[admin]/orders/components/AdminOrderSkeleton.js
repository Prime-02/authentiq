// components/AdminOrderSkeleton.jsx
import React from "react";

const AdminOrderSkeleton = () => (
  <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)] p-4 animate-pulse">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 bg-[var(--bg-tertiary)] rounded" />
          <div className="h-5 w-20 bg-[var(--bg-tertiary)] rounded-full" />
          <div className="h-5 w-20 bg-[var(--bg-tertiary)] rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-3 w-full bg-[var(--bg-tertiary)] rounded" />
          <div className="h-3 w-full bg-[var(--bg-tertiary)] rounded" />
          <div className="h-3 w-full bg-[var(--bg-tertiary)] rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-5 w-20 bg-[var(--bg-tertiary)] rounded" />
        <div className="h-3 w-12 bg-[var(--bg-tertiary)] rounded ml-auto" />
      </div>
    </div>
  </div>
);

export const AdminOrderSkeletonList = ({ count = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <AdminOrderSkeleton key={i} />
    ))}
  </div>
);

export default AdminOrderSkeleton;
