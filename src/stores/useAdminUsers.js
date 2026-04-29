// hooks/useAdminUsers.js
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores";
import { toast } from "react-toastify";

export function useAdminUsers() {
  const {
    adminUsers,
    loadingAdminUsers,
    fetchAdminUsers,
    adminUpdateUser,
    adminDeleteUser,
    adminResetUserPassword,
    adminRevokeUserSessions,
  } = useAuthStore();

  const [filters, setFilters] = useState({
    search: "",
    isActive: null,
    page: 1,
    limit: 10,
    sortBy: "date_joined",
    sortDir: "desc",
  });

  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setError(null);
      await fetchAdminUsers({
        skip: (filters.page - 1) * filters.limit,
        limit: filters.limit,
        isActive: filters.isActive,
        search: filters.search || undefined,
      });
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    }
  }, [filters, fetchAdminUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUser = async (userId, updates) => {
    setIsUpdating(true);
    try {
      const result = await adminUpdateUser(userId, updates);
      if (result) {
        await fetchUsers(); // Refresh the list
      }
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const result = await adminDeleteUser(userId);
      if (result) {
        await fetchUsers();
      }
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const toggleUserStatus = async (user) => {
    return await updateUser(user.id, { isActive: !user.is_active });
  };

  const toggleUserAdmin = async (user) => {
    return await updateUser(user.id, { isAdmin: !user.is_admin });
  };

  const resetUserPassword = async (userId, newPassword) => {
    try {
      const result = await adminResetUserPassword(userId, newPassword);
      if (result) {
        toast.success("Password reset successfully");
      }
      return result;
    } catch (err) {
      toast.error(err.message || "Failed to reset password");
      return false;
    }
  };

  const revokeUserSessions = async (userId) => {
    try {
      const result = await adminRevokeUserSessions(userId);
      return result;
    } catch (err) {
      toast.error(err.message || "Failed to revoke sessions");
      return false;
    }
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const setPage = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return {
    users: adminUsers,
    loading: loadingAdminUsers,
    error,
    filters,
    isUpdating,
    updateFilters,
    setPage,
    updateUser,
    deleteUser,
    toggleUserStatus,
    toggleUserAdmin,
    resetUserPassword,
    revokeUserSessions,
    refreshUsers: fetchUsers,
  };
}
