// app/notifications/page.jsx (fixed for users)
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useNotificationStore } from "@/stores";
import { useAuthStore } from "@/stores";
import NotificationItem from "./components/NotificationItem";
import NotificationFilters from "./components/NotificationFilters";
import NotificationSkeleton from "./components/NotificationSkeleton";
import NotificationPagination from "./components/NotificationPagination";
import { Bell, CheckCheck, Loader2, Inbox, AlertTriangle } from "lucide-react";

const NotificationsPage = () => {
  const {
    notifications,
    totalCount,
    unreadCount,
    loading,
    pagination,
    fetchUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchUnreadCount,
    resetStore,
  } = useNotificationStore();

  // ✅ Fix: Use userId directly instead of user.id
  const { userId, userFirstName } = useAuthStore();
  const [filters, setFilters] = useState({
    notification_type: null,
    unread_only: false,
  });
  const [page, setPage] = useState(1);
  const perPage = 20;

  // ✅ Load notifications with proper userId
  const loadNotifications = useCallback(
    async (targetPage = page, reset = false) => {
      if (!userId) return;

      if (reset) {
        setPage(1);
        targetPage = 1;
      }

      await fetchUserNotifications(userId, {
        notification_type: filters.notification_type || undefined,
        unread_only: filters.unread_only || false,
        page: targetPage,
        perPage,
      });
    },
    [userId, filters, fetchUserNotifications],
  );

  // ✅ Fetch unread count and initial notifications on mount
  useEffect(() => {
    if (userId) {
      fetchUnreadCount(userId);
      loadNotifications(1, true);
    }
    return () => resetStore();
  }, [userId]); // Only re-run when userId changes

  // ✅ Refetch when filters change
  useEffect(() => {
    if (userId) {
      loadNotifications(1, true);
    }
  }, [filters.notification_type, filters.unread_only]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleReset = () => {
    setFilters({ notification_type: null, unread_only: false });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    loadNotifications(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMarkAsRead = async (id) => {
    if (!userId) return;
    await markAsRead(id, userId);
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    await markAllAsRead(userId);
  };

  const handleDelete = async (id) => {
    if (!userId) return;
    await deleteNotification(id, userId);
  };

  // ✅ Show authentication required state
  if (!userId) {
    return (
      <main className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <AlertTriangle size={48} className="text-[var(--warning-500)] mb-4" />
        <h1 className="text-2xl font-bold font-Montserrat text-[var(--text-primary)] mb-2">
          Not Authenticated
        </h1>
        <p className="text-[var(--text-secondary)] max-w-md">
          Please log in to view your notifications.
        </p>
      </main>
    );
  }

  return (
    <main className="w-full max-w-4xl my-32 mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-Montserrat text-[var(--text-primary)]">
            Notifications
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            {loading && totalCount === 0
              ? "Loading notifications..."
              : unreadCount > 0
                ? `You have ${unreadCount} unread notification${
                    unreadCount !== 1 ? "s" : ""
                  }`
                : "You're all caught up!"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--success-50)] text-[var(--success-700)] border border-[var(--success-200)] rounded-xl hover:bg-[var(--success-100)] transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCheck size={16} />
              )}
              Mark all read
            </button>
          )}
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
            {filters.notification_type || filters.unread_only
              ? "No notifications match your current filters."
              : "You don't have any notifications yet."}
          </p>
        </div>
      ) : (
        <>
          {/* ✅ Notification List */}
          <div className="space-y-3">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* ✅ Pagination - only show if there are items and more than one page */}
          {totalCount > perPage && (
            <div className="mt-6">
              <NotificationPagination
                page={page}
                perPage={perPage}
                totalItems={totalCount}
                onPageChange={handlePageChange}
                loading={loading}
              />
            </div>
          )}

          {/* ✅ Loading indicator for pagination */}
          {loading && notifications.length > 0 && (
            <div className="flex justify-center py-4">
              <Loader2
                size={24}
                className="text-[var(--primary-600)] animate-spin"
              />
            </div>
          )}

          {/* ✅ Results summary */}
          <div className="mt-4 text-center text-sm text-[var(--text-muted)]">
            Showing {notifications.length} of {totalCount} notification
            {totalCount !== 1 ? "s" : ""}
          </div>
        </>
      )}
    </main>
  );
};

export default NotificationsPage;
