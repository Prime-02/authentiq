// components/NotificationPopup.jsx
import React, { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, X, Loader2 } from "lucide-react";
import NotificationItem from "./NotificationItem";
import Link from "next/link";

const NotificationPopup = ({
  notifications,
  unreadCount,
  loading,
  hasMore,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onLoadMore,
  onClose,
}) => {
  const popupRef = useRef(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    onLoadMore?.(nextPage, 10); // ✅ Pass both page and perPage
  };

  return (
    <div
      ref={popupRef}
      className="absolute right-0 top-full mt-2 w-96 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-xl overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-light)]">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell size={18} className="text-[var(--text-primary)]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[var(--error-500)] text-[var(--text-inverse)] text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold font-Montserrat text-[var(--text-primary)]">
            Notifications
          </h3>
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] transition-colors"
              title="Mark all as read"
            >
              <CheckCheck size={14} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[400px] overflow-y-auto">
        {loading && notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2
              size={24}
              className="text-[var(--primary-600)] animate-spin mb-2"
            />
            <p className="text-xs text-[var(--text-muted)]">Loading...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell
              size={32}
              className="text-[var(--border-color)] mx-auto mb-2"
            />
            <p className="text-sm text-[var(--text-muted)]">No notifications</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-[var(--border-light)]">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  onDelete={onDelete}
                  compact
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="p-3 text-center border-t border-[var(--border-light)]">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="text-xs font-medium text-[var(--primary-600)] hover:text-[var(--primary-700)] transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <Loader2 size={12} className="animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    "Load more"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[var(--border-light)] bg-[var(--bg-primary)]">
        <Link
          href={`/notifications`}
          className="block text-center text-sm font-medium text-[var(--primary-600)] hover:text-[var(--primary-700)] transition-colors py-1"
          onClick={onClose}
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
};

export default NotificationPopup;
