// components/NotificationItem.jsx
import React from "react";
import { Check, Trash2, Clock } from "lucide-react";
import NotificationIcon from "./NotificationIcon";

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
  isAdmin = false,
  compact = false,
}) => {
  const timeAgo = (date) => {
    const now = new Date();
    const diff = Math.abs(now - new Date(date));
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString("en-NG");
  };

  const fullName = notification.user
    ? `${notification.user.firstname} ${notification.user.lastname}`
    : "Unknown User";
  const userEmail = notification.user?.email;

  if (compact) {
    return (
      <div
        className={`flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer ${
          notification.is_read
            ? "bg-transparent hover:bg-[var(--bg-hover)]"
            : "bg-[var(--primary-50)] hover:bg-[var(--primary-100)]"
        }`}
        onClick={() => !notification.is_read && onMarkAsRead?.(notification.id)}
      >
        <NotificationIcon type={notification.notification_type} size={16} />
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium truncate ${
              notification.is_read
                ? "text-[var(--text-secondary)]"
                : "text-[var(--text-primary)]"
            }`}
          >
            {notification.title}
          </p>
          <p className="text-xs text-[var(--text-muted)] truncate">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {/* Added user info in compact mode */}
            {isAdmin && userEmail && (
              <p className="text-[10px] text-[var(--text-muted)] truncate font-medium">
                {userEmail}
              </p>
            )}
            <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
              <Clock size={10} />
              {timeAgo(notification.created_at)}
            </p>
          </div>
        </div>
        {!notification.is_read && (
          <div className="w-2 h-2 rounded-full bg-[var(--primary-500)] flex-shrink-0 mt-1.5" />
        )}
      </div>
    );
  }

  return (
    <div
      className={`group flex items-start gap-4 p-4 bg-[var(--bg-secondary)] rounded-xl border transition-all duration-200 ${
        notification.is_read
          ? "border-[var(--border-light)] opacity-75"
          : "border-[var(--primary-200)] shadow-sm"
      } hover:border-[var(--border-hover)]`}
    >
      <NotificationIcon type={notification.notification_type} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4
              className={`text-sm font-semibold ${
                notification.is_read
                  ? "text-[var(--text-secondary)]"
                  : "text-[var(--text-primary)]"
              }`}
            >
              {notification.title}
            </h4>
            <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">
              {notification.message}
            </p>
            {/* Added user details section */}
            {isAdmin && notification.user && (
              <div className="flex items-center gap-2 mt-2">
                <div className="px-2 py-0.5 rounded-md bg-[var(--primary-50)] text-[var(--primary-700)]">
                  <p className="text-xs font-medium">{fullName}</p>
                </div>
                <p className="text-xs text-[var(--text-muted)]">{userEmail}</p>
              </div>
            )}
          </div>
          <span className="text-xs text-[var(--text-muted)] flex-shrink-0 flex items-center gap-1">
            <Clock size={10} />
            {timeAgo(notification.created_at)}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          {!notification.is_read && (
            <button
              onClick={() => onMarkAsRead?.(notification.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--success-50)] text-[var(--success-600)] hover:bg-[var(--success-100)] transition-colors"
            >
              <Check size={12} />
              Mark as read
            </button>
          )}
          <button
            onClick={() => onDelete?.(notification.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--error-600)] hover:bg-[var(--error-50)] transition-colors"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      </div>

      {!notification.is_read && (
        <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary-500)] flex-shrink-0 mt-2" />
      )}
    </div>
  );
};

export default NotificationItem;
