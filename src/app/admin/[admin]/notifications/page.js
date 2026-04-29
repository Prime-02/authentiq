// app/admin/[admin]/notifications/page.jsx (updated with pagination)
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/stores";
import NotificationFilters from "@/app/notifications/components/NotificationFilters";
import NotificationSkeleton from "@/app/notifications/components/NotificationSkeleton";
import NotificationItem from "@/app/notifications/components/NotificationItem";
import { useNotificationStore } from "@/stores/useNotificationStore";
import NotificationPagination from "@/app/notifications/components/NotificationPagination";
import {
  Bell,
  Trash2,
  Loader2,
  Inbox,
  AlertTriangle,
  Users,
} from "lucide-react";

const AdminNotificationsPage = () => {
  const {
    notifications,
    totalCount,
    loading,
    pagination,
    fetchAllNotifications,
    adminDeleteNotification,
    resetStore,
  } = useNotificationStore();

  const { isAdmin } = useAuthStore();
  const [filters, setFilters] = useState({
    notification_type: null,
    unread_only: false,
    user_id: null,
  });
  const [page, setPage] = useState(1);
  const perPage = 50;

  const loadNotifications = useCallback(
    async (targetPage = page, reset = false) => {
      if (reset) setPage(1);
      await fetchAllNotifications({
        ...filters,
        page: reset ? 1 : targetPage,
        perPage,
      });
    },
    [filters, page, fetchAllNotifications],
  );

  useEffect(() => {
    if (isAdmin) {
      loadNotifications(1, true);
    }
    return () => resetStore();
  }, [isAdmin]);

  useEffect(() => {
    setPage(1);
    loadNotifications(1, true);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleReset = () => {
    setFilters({ notification_type: null, unread_only: false, user_id: null });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    loadNotifications(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    await adminDeleteNotification(id);
  };

  if (!isAdmin) {
    return (
      <main className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center">
        <AlertTriangle size={48} className="text-[var(--error-500)] mb-4" />
        <h1 className="text-2xl font-bold font-Montserrat text-[var(--text-primary)] mb-2">
          Access Denied
        </h1>
        <p className="text-[var(--text-secondary)]">Admin access required.</p>
      </main>
    );
  }

  return (
    <main className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-Montserrat text-[var(--text-primary)]">
            All Notifications
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Manage system-wide notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--info-50)] text-[var(--info-700)] border border-[var(--info-200)]">
            <Users size={12} />
            {totalCount} total
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <NotificationFilters
          currentFilters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />
      </div>

      {/* Content */}
      {loading && notifications.length === 0 ? (
        <NotificationSkeleton count={5} />
      ) : notifications.length === 0 ? (
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mx-auto mb-4">
            <Inbox size={32} className="text-[var(--text-muted)]" />
          </div>
          <h2 className="text-xl font-bold font-Montserrat text-[var(--text-primary)] mb-2">
            No Notifications
          </h2>
          <p className="text-[var(--text-secondary)]">
            No notifications in the system.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="group relative">
                <NotificationItem
                  notification={notification}
                  onDelete={handleDelete}
                  isAdmin
                />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-2 py-1 rounded-md">
                    User: {notification.user_id?.slice(0, 8)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6">
            <NotificationPagination
              page={page}
              perPage={perPage}
              totalItems={totalCount}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </div>
        </>
      )}
    </main>
  );
};

export default AdminNotificationsPage;
