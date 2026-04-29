// components/NotificationBell.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Bell } from "lucide-react";
import NotificationPopup from "./NotificationPopup";

const NotificationBell = ({
  notifications,
  unreadCount,
  loading,
  totalCount,
  onFetchNotifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onLoadMore,
  userId, // ✅ Changed from userFirstName to userId
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Fetch notifications when bell is opened
  useEffect(() => {
    if (isOpen && userId) {
      onFetchNotifications?.(1, 10); // Fetch first page with 10 items
    }
  }, [isOpen, userId, onFetchNotifications]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl pt-3 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={25} />
        {unreadCount > 0 && (
          <span className="absolute -bottom-1.5 -right-3 w-5 h-5 bg-[var(--error-500)] text-[var(--text-inverse)] text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[var(--bg-primary)]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationPopup
          notifications={notifications}
          unreadCount={unreadCount}
          loading={loading}
          hasMore={notifications.length < totalCount}
          onMarkAsRead={onMarkAsRead}
          onMarkAllAsRead={onMarkAllAsRead}
          onDelete={onDelete}
          onLoadMore={onLoadMore}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
