// stores/useNotificationStore.js (corrected)
import { create } from "zustand";
import { toast } from "react-toastify";
import axiosInstance from "../../lib/axiosInstance";

// Helper to build query string from params object
const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    // Include the value if it's not undefined, null, or empty string
    if (value !== undefined && value !== null && value !== "") {
      // For booleans, only include if true (since false is the default)
      if (typeof value === "boolean" && !value) {
        return;
      }
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

export const useNotificationStore = create((set, get) => ({
  // ─── State ──────────────────────────────────────────────────
  notifications: [],
  currentNotification: null,
  totalCount: 0,
  unreadCount: 0,
  loading: false,
  error: null,

  // Pagination state
  pagination: {
    page: 1,
    perPage: 50,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  // ─── User Actions ──────────────────────────────────────────

  fetchNotification: async (notificationId, userId) => {
    set({ loading: true, error: null });
    try {
      const queryString = buildQueryString({ user_id: userId });
      const response = await axiosInstance.get(
        `/notifications/${notificationId}${queryString}`,
      );
      set({ currentNotification: response.data, loading: false });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.detail || "Failed to fetch notification";
      set({ error: message, loading: false });
      toast.error(message);
      throw error;
    }
  },

  fetchUserNotifications: async (userId, params = {}) => {
    const {
      notification_type,
      unread_only = false,
      page = 1,
      perPage = 50,
    } = params;

    set({ loading: true, error: null });
    try {
      const skip = (page - 1) * perPage;

      const queryString = buildQueryString({
        user_id: userId,
        notification_type,
        unread_only: unread_only || undefined,
        skip,
        limit: perPage,
      });

      const response = await axiosInstance.get(`/notifications/${queryString}`);

      const { notifications, total } = response.data;
      const totalPages = Math.ceil(total / perPage);

      set((state) => ({
        notifications:
          page === 1
            ? notifications
            : [...state.notifications, ...notifications],
        totalCount: total,
        pagination: {
          page,
          perPage,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
        loading: false,
      }));

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.detail || "Failed to fetch notifications";
      set({ error: message, loading: false });
      toast.error(message);
      throw error;
    }
  },

  markAsRead: async (notificationId, userId) => {
    set({ loading: true, error: null });
    try {
      const queryString = buildQueryString({ user_id: userId });
      const response = await axiosInstance.patch(
        `/notifications/${notificationId}/read${queryString}`,
      );

      const { notifications, unreadCount } = get();
      const updatedNotifications = notifications.map((notif) =>
        notif.id === notificationId ? response.data : notif,
      );

      set({
        notifications: updatedNotifications,
        currentNotification: response.data,
        unreadCount: Math.max(0, unreadCount - 1),
        loading: false,
      });

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.detail || "Failed to mark notification as read";
      set({ error: message, loading: false });
      toast.error(message);
      throw error;
    }
  },

  markAllAsRead: async (userId) => {
    set({ loading: true, error: null });
    try {
      const queryString = buildQueryString({ user_id: userId });
      const response = await axiosInstance.patch(
        `/notifications/read-all${queryString}`,
      );

      const { notifications } = get();
      const updatedNotifications = notifications.map((notif) => ({
        ...notif,
        is_read: true,
        read_at: new Date().toISOString(),
      }));

      set({
        notifications: updatedNotifications,
        unreadCount: 0,
        loading: false,
      });

      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Failed to mark all notifications as read";
      set({ error: message, loading: false });
      toast.error(message);
      throw error;
    }
  },

  deleteNotification: async (notificationId, userId) => {
    set({ loading: true, error: null });
    try {
      const queryString = buildQueryString({ user_id: userId });
      const response = await axiosInstance.delete(
        `/notifications/${notificationId}${queryString}`,
      );

      const { notifications, unreadCount } = get();
      const deletedNotification = notifications.find(
        (n) => n.id === notificationId,
      );
      const updatedNotifications = notifications.filter(
        (notif) => notif.id !== notificationId,
      );

      set({
        notifications: updatedNotifications,
        totalCount: get().totalCount - 1,
        unreadCount: deletedNotification?.is_read
          ? unreadCount
          : Math.max(0, unreadCount - 1),
        currentNotification:
          get().currentNotification?.id === notificationId
            ? null
            : get().currentNotification,
        loading: false,
      });

      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.detail || "Failed to delete notification";
      set({ error: message, loading: false });
      toast.error(message);
      throw error;
    }
  },

  fetchUnreadCount: async (userId) => {
    try {
      const queryString = buildQueryString({ user_id: userId });
      const response = await axiosInstance.get(
        `/notifications/unread-count${queryString}`,
      );
      set({ unreadCount: response.data.unread_count });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.detail || "Failed to fetch unread count";
      toast.error(message);
      throw error;
    }
  },

  // ─── Admin Actions ─────────────────────────────────────────

  fetchAllNotifications: async (params = {}) => {
    const {
      user_id,
      notification_type,
      unread_only = false,
      page = 1,
      perPage = 100,
    } = params;

    set({ loading: true, error: null });
    try {
      const skip = (page - 1) * perPage;

      const queryString = buildQueryString({
        user_id,
        notification_type,
        unread_only: unread_only || undefined,
        skip,
        limit: perPage,
      });

      const response = await axiosInstance.get(
        `/admin/notifications/${queryString}`,
      );

      const { notifications, total } = response.data;
      const totalPages = Math.ceil(total / perPage);

      set((state) => ({
        notifications:
          page === 1
            ? notifications
            : [...state.notifications, ...notifications],
        totalCount: total,
        pagination: {
          page,
          perPage,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
        loading: false,
      }));

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.detail || "Failed to fetch notifications";
      set({ error: message, loading: false });
      toast.error(message);
      throw error;
    }
  },

  adminDeleteNotification: async (notificationId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.delete(
        `/admin/notifications/${notificationId}`,
      );

      const { notifications } = get();
      const updatedNotifications = notifications.filter(
        (notif) => notif.id !== notificationId,
      );

      set({
        notifications: updatedNotifications,
        totalCount: get().totalCount - 1,
        loading: false,
      });

      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.detail || "Failed to delete notification";
      set({ error: message, loading: false });
      toast.error(message);
      throw error;
    }
  },

  adminDeleteUserNotifications: async (userId, notificationType = null) => {
    set({ loading: true, error: null });
    try {
      const queryString = buildQueryString({
        notification_type: notificationType,
      });

      const response = await axiosInstance.delete(
        `/admin/notifications/user/${userId}${queryString}`,
      );

      toast.success(response.data.message);
      set({ loading: false });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.detail || "Failed to delete user notifications";
      set({ error: message, loading: false });
      toast.error(message);
      throw error;
    }
  },

  // ─── Utility Actions ───────────────────────────────────────

  clearCurrentNotification: () => {
    set({ currentNotification: null });
  },

  resetStore: () => {
    set({
      notifications: [],
      currentNotification: null,
      totalCount: 0,
      unreadCount: 0,
      loading: false,
      error: null,
      pagination: {
        page: 1,
        perPage: 50,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  },
}));
