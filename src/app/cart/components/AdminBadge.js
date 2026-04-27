// components/AdminBadge.jsx
import { useAuthStore } from "@/stores";
import React from "react";

const AdminBadge = () => {
  const { isAdmin } = useAuthStore();

  if (!isAdmin) return null;

  return (
    <div className="mt-4 pt-4 border-t border-border text-center">
      <p className="text-xs text-muted">Admin mode active</p>
    </div>
  );
};

export default AdminBadge;
