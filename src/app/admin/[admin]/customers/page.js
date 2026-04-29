// app/admin/users/page.js
"use client";
import { useState, useCallback, useMemo } from "react";
import { useAdminUsers } from "@/stores/useAdminUsers";
import {
  Table2,
  LayoutGrid,
  Download,
  UserPlus,
  AlertTriangle,
} from "lucide-react";
import {
  ConfirmModal,
  UserDetailDrawer,
  UserFilters,
  UsersTable,
  UserStats,
} from "./components";
import { UsersGrid } from "./components/UsersGrid";

export default function AdminUsersPage() {
  const {
    users,
    loading,
    error,
    filters,
    isUpdating,
    updateFilters,
    setPage,
    updateUser,
    toggleUserStatus,
    toggleUserAdmin,
    resetUserPassword,
    revokeUserSessions,
    refreshUsers,
    deleteUser,
    exportUsers,
    batchAction,
  } = useAdminUsers();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modal, setModal] = useState({ open: false });
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'

  // Memoized filtered users for stats
  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.is_active).length,
      inactive: users.filter((u) => !u.is_active).length,
      admins: users.filter((u) => u.is_admin).length,
      newThisMonth: users.filter((u) => {
        const d = new Date(u.date_joined);
        const now = new Date();
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }).length,
    }),
    [users],
  );

  const openDrawer = useCallback((user) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  }, []);

  const showModal = useCallback((config) => {
    setModal({ open: true, ...config });
  }, []);

  const handleToggleStatus = useCallback(
    (user) => {
      showModal({
        title: user.is_active ? "Deactivate Account" : "Activate Account",
        message: `Are you sure you want to ${user.is_active ? "deactivate" : "activate"} ${user.firstname || user.email}'s account?`,
        confirmLabel: user.is_active ? "Deactivate" : "Activate",
        variant: user.is_active ? "warning" : "success",
        onConfirm: async () => {
          setModal({ open: false });
          await toggleUserStatus(user);
        },
      });
    },
    [showModal, toggleUserStatus],
  );

  const handleToggleAdmin = useCallback(
    (user) => {
      showModal({
        title: user.is_admin ? "Remove Admin Role" : "Grant Admin Role",
        message: `Are you sure you want to ${user.is_admin ? "remove admin role from" : "grant admin role to"} ${user.firstname || user.email}?`,
        confirmLabel: user.is_admin ? "Remove Role" : "Grant Role",
        variant: user.is_admin ? "danger" : "info",
        onConfirm: async () => {
          setModal({ open: false });
          await toggleUserAdmin(user);
        },
      });
    },
    [showModal, toggleUserAdmin],
  );

  const handleRevokeSessions = useCallback(
    (user) => {
      showModal({
        title: "Revoke All Sessions",
        message: `This will log out ${user.firstname || user.email} from all devices. Continue?`,
        confirmLabel: "Revoke Sessions",
        variant: "danger",
        onConfirm: async () => {
          setModal({ open: false });
          await revokeUserSessions(user.id);
        },
      });
    },
    [showModal, revokeUserSessions],
  );

  const handleDeleteUser = useCallback(
    (user) => {
      showModal({
        title: "Delete User",
        message: `Are you sure you want to permanently delete ${user.firstname || user.email}? This action cannot be undone.`,
        confirmLabel: "Delete",
        variant: "danger",
        onConfirm: async () => {
          setModal({ open: false });
          await deleteUser(user.id);
        },
      });
    },
    [showModal, deleteUser],
  );

  const handleBatchAction = useCallback(
    (action) => {
      const usersArray = Array.from(selectedUsers);
      showModal({
        title: `Batch ${action}`,
        message: `Apply ${action} to ${usersArray.length} selected users?`,
        confirmLabel: `Apply ${action}`,
        variant: action === "delete" ? "danger" : "info",
        onConfirm: async () => {
          setModal({ open: false });
          await batchAction(action, usersArray);
          setSelectedUsers(new Set());
        },
      });
    },
    [showModal, selectedUsers, batchAction],
  );

  const handleSort = useCallback(
    (col) => {
      if (filters.sortBy === col) {
        updateFilters({ sortDir: filters.sortDir === "asc" ? "desc" : "asc" });
      } else {
        updateFilters({ sortBy: col, sortDir: "asc" });
      }
    },
    [filters, updateFilters],
  );

  const handleSelectAll = useCallback(
    (e) => {
      if (e.target.checked) {
        setSelectedUsers(new Set(users.map((u) => u.id)));
      } else {
        setSelectedUsers(new Set());
      }
    },
    [users],
  );

  const handleSelectUser = useCallback(
    (userId, checked) => {
      const newSelected = new Set(selectedUsers);
      if (checked) {
        newSelected.add(userId);
      } else {
        newSelected.delete(userId);
      }
      setSelectedUsers(newSelected);
    },
    [selectedUsers],
  );

  return (
    <div
      className="p-8 max-w-[1400px] mx-auto min-h-screen"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8 gap-4 max-md:flex-col">
        <div>
          <h1
            className="m-0 text-3xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Users Management
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            Manage user accounts, roles, and access permissions
          </p>
        </div>
        <div className="flex gap-3 items-center max-md:w-full max-md:justify-between">
          <div
            className="flex rounded-lg p-0.5"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <button
              className={`inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === "table" ? "shadow-sm" : ""
              }`}
              style={{
                backgroundColor:
                  viewMode === "table" ? "var(--bg-primary)" : "transparent",
                color:
                  viewMode === "table"
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                if (viewMode !== "table") {
                  e.target.style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== "table") {
                  e.target.style.color = "var(--text-secondary)";
                }
              }}
              onClick={() => setViewMode("table")}
            >
              <Table2 className="w-4 h-4 mr-1.5" />
              Table
            </button>
            <button
              className={`inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === "grid" ? "shadow-sm" : ""
              }`}
              style={{
                backgroundColor:
                  viewMode === "grid" ? "var(--bg-primary)" : "transparent",
                color:
                  viewMode === "grid"
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                if (viewMode !== "grid") {
                  e.target.style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== "grid") {
                  e.target.style.color = "var(--text-secondary)";
                }
              }}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-4 h-4 mr-1.5" />
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          className="flex items-center gap-4 p-4 border rounded-xl mb-6"
          style={{
            backgroundColor: "var(--error-50)",
            borderColor: "var(--error-200)",
            color: "var(--error-700)",
          }}
          role="alert"
        >
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <div className="flex-1">
            <strong className="block mb-1">Error loading users</strong>
            <p className="m-0 text-sm">{error}</p>
          </div>
          <button
            onClick={refreshUsers}
            className="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
            style={{
              backgroundColor: "var(--error-100)",
              color: "var(--error-700)",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "var(--error-200)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "var(--error-100)";
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <UserStats stats={stats} loading={loading} />

      {/* Filters and Search */}
      <UserFilters
        filters={filters}
        onFiltersChange={updateFilters}
        onRefresh={refreshUsers}
        selectedCount={selectedUsers.size}
        onBatchAction={handleBatchAction}
      />

      {/* Main Content */}
      {viewMode === "table" ? (
        <UsersTable
          users={users}
          loading={loading}
          filters={filters}
          selectedUsers={selectedUsers}
          onSort={handleSort}
          onSelectAll={handleSelectAll}
          onSelectUser={handleSelectUser}
          onViewUser={openDrawer}
          onToggleStatus={handleToggleStatus}
          onToggleAdmin={handleToggleAdmin}
          onDeleteUser={handleDeleteUser}
        />
      ) : (
        <UsersGrid
          users={users}
          loading={loading}
          selectedUsers={selectedUsers}
          onSelectUser={handleSelectUser}
          onViewUser={openDrawer}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Pagination */}
      {!loading && users.length > 0 && (
        <div
          className="flex justify-between items-center mt-6 p-4 rounded-xl border max-md:flex-col max-md:gap-4"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="text-sm" style={{ color: "var(--text-muted)" }}>
            Showing {(filters.page - 1) * filters.limit + 1} -{" "}
            {Math.min(filters.page * filters.limit, users.length)} of{" "}
            {users.length} users
          </div>
          <div className="flex gap-3 items-center">
            <select
              className="select select-sm"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
              value={filters.limit}
              onChange={(e) =>
                updateFilters({ limit: Number(e.target.value), page: 1 })
              }
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
            <button
              className="btn btn-secondary btn-sm"
              disabled={filters.page === 1}
              onClick={() => setPage(Math.max(1, filters.page - 1))}
            >
              ← Previous
            </button>
            <span
              className="text-sm font-medium min-w-[60px] text-center"
              style={{ color: "var(--text-primary)" }}
            >
              Page {filters.page}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              disabled={users.length < filters.limit}
              onClick={() => setPage(filters.page + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* User Detail Drawer */}
      <UserDetailDrawer
        user={selectedUser}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onToggleStatus={(user) => {
          setDrawerOpen(false);
          handleToggleStatus(user);
        }}
        onToggleAdmin={(user) => {
          setDrawerOpen(false);
          handleToggleAdmin(user);
        }}
        onResetPassword={resetUserPassword}
        onRevokeSessions={handleRevokeSessions}
        onUpdateUser={updateUser}
        onDeleteUser={handleDeleteUser}
        isUpdating={isUpdating}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        confirmLabel={modal.confirmLabel}
        variant={modal.variant}
        onConfirm={modal.onConfirm}
        onCancel={() => setModal({ open: false })}
      />
    </div>
  );
}
