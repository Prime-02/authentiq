import { create } from "zustand";
import { toast } from "react-toastify";
import axiosInstance from "../../lib/axiosInstance";

/**
 * useOrderStore
 * -------------
 * Owns: user order history, admin order list, all order mutations,
 *       and order statistics.
 *
 * Order Routes:
 *   GET    /orders                  (paginated: ?page=&per_page=&status=&sort_by=&sort_order=)
 *   GET    /orders/:id
 *   POST   /orders
 *   PATCH  /orders/:id/cancel
 *   GET    /admin/orders            (paginated: ?page=&per_page=&status=&payment_status=&user_id=&search=&date_from=&date_to=&sort_by=&sort_order=)
 *   GET    /admin/orders/quick-stats
 *   PATCH  /admin/orders/:id/status
 *   PATCH  /admin/orders/:id/tracking
 *   PATCH  /admin/orders/:id/payment
 *   PATCH  /admin/orders/:id/delivery-company
 *   DELETE /admin/orders/:id/delivery-company
 *   DELETE /admin/orders/:id
 *
 * Order Statistics Routes:
 *   GET    /stats/orders/summary
 *   GET    /stats/orders/my-summary
 *   GET    /stats/orders/revenue-trend
 *   GET    /stats/orders/top-customers
 *   GET    /stats/orders/popular-products
 *   GET    /stats/orders/fulfillment-metrics
 *   GET    /stats/orders/hourly-distribution
 *   GET    /stats/orders/daily-distribution
 *   GET    /stats/orders/category-revenue
 *   GET    /stats/orders/shipping-analysis
 *   GET    /stats/orders/payment-analysis
 *   GET    /stats/orders/dashboard
 */
export const useOrderStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  userOrderHistory: [], // current user's orders
  orders: [], // admin: all orders (current page)

  // Pagination state
  userOrdersPagination: {
    page: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  adminOrdersPagination: {
    page: 1,
    perPage: 20,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  // Filters state (to persist current filters)
  userOrdersFilters: {
    status: null,
    sortBy: "order_date",
    sortOrder: "desc",
  },

  adminOrdersFilters: {
    status: null,
    paymentStatus: null,
    userId: null,
    search: null,
    dateFrom: null,
    dateTo: null,
    sortBy: "order_date",
    sortOrder: "desc",
  },

  loadingOrders: false,
  loadingMutation: false,
  loadingStats: false,

  // ── User fetchers ──────────────────────────────────────────────────────────

  /**
   * GET /orders — current user's order history (paginated)
   * @param {Object} params - { page?, perPage?, status?, sortBy?, sortOrder? }
   */
  fetchOrderHistory: async ({
    page = 1,
    perPage = 10,
    status,
    sortBy = "order_date",
    sortOrder = "desc",
  } = {}) => {
    set({ loadingOrders: true });
    try {
      const params = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      if (status) params.append("status", status);

      const { data } = await axiosInstance.get(`/orders?${params}`);

      set({
        userOrderHistory: data.data || [],
        userOrdersPagination: data.pagination || {
          page,
          perPage,
          totalItems: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        userOrdersFilters: {
          status: status || null,
          sortBy,
          sortOrder,
        },
      });
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Failed to load order history.",
      );
    } finally {
      set({ loadingOrders: false });
    }
  },

  /** GET /orders/:id — get a single order */
  fetchOrder: async (orderId) => {
    set({ loadingOrders: true });
    try {
      const { data } = await axiosInstance.get(`/orders/${orderId}`);
      return data;
    } catch (err) {
      toast.error(err.response?.data?.detail || "Order not found.");
      return null;
    } finally {
      set({ loadingOrders: false });
    }
  },

  // ── User mutations ─────────────────────────────────────────────────────────

  /**
   * POST /orders
   * Cart must be non-empty on the server; the server clears the cart after order.
   *
   * @param {Object} payload - { shippingAddress, shippingCost?, tax?, deliveryCompanyId? }
   * @returns {Object|undefined} Created order or undefined on failure
   */
  createOrder: async ({
    shippingAddress,
    shippingCost = 0.0,
    tax = 0.0,
    deliveryCompanyId,
  } = {}) => {
    set({ loadingMutation: true });
    try {
      const params = new URLSearchParams();
      params.append("shipping_address", shippingAddress);
      params.append("shipping_cost", String(shippingCost));
      params.append("tax", String(tax));
      if (deliveryCompanyId) {
        params.append("delivery_company_id", deliveryCompanyId);
      }

      const { data } = await axiosInstance.post(`/orders?${params}`);
      toast.success("Order placed successfully!");

      // Refresh order history to first page after creating order
      const { userOrdersFilters } = get();
      await get().fetchOrderHistory({
        page: 1,
        perPage: get().userOrdersPagination.perPage,
        ...userOrdersFilters,
      });

      return data;
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        "Failed to place order. Please try again.";
      toast.error(msg);
      throw err; // Re-throw for component error handling
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** PATCH /orders/:id/cancel */
  cancelOrder: async (orderId) => {
    set({ loadingMutation: true });
    try {
      const { data } = await axiosInstance.patch(`/orders/${orderId}/cancel`);
      toast.success("Order cancelled.");

      // Refresh current page of order history
      const { page, perPage } = get().userOrdersPagination;
      const { userOrdersFilters } = get();
      await get().fetchOrderHistory({ page, perPage, ...userOrdersFilters });

      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to cancel order.";
      toast.error(msg);
      throw err;
    } finally {
      set({ loadingMutation: false });
    }
  },

  // ── Admin fetchers ─────────────────────────────────────────────────────────

  /**
   * GET /admin/orders — all orders with pagination, filtering, and sorting
   * @param {Object} params - { page?, perPage?, status?, paymentStatus?, userId?, search?, dateFrom?, dateTo?, sortBy?, sortOrder? }
   */
  fetchOrders: async ({
    page = 1,
    perPage = 20,
    status,
    paymentStatus,
    userId,
    search,
    dateFrom,
    dateTo,
    sortBy = "order_date",
    sortOrder = "desc",
  } = {}) => {
    set({ loadingOrders: true });
    try {
      const params = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      if (status) params.append("status", status);
      if (paymentStatus) params.append("payment_status", paymentStatus);
      if (userId) params.append("user_id", userId);
      if (search) params.append("search", search);
      if (dateFrom) params.append("date_from", dateFrom);
      if (dateTo) params.append("date_to", dateTo);

      const { data } = await axiosInstance.get(`/admin/orders?${params}`);

      set({
        orders: data.data || [],
        adminOrdersPagination: data.pagination || {
          page,
          perPage,
          totalItems: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        adminOrdersFilters: {
          status: status || null,
          paymentStatus: paymentStatus || null,
          userId: userId || null,
          search: search || null,
          dateFrom: dateFrom || null,
          dateTo: dateTo || null,
          sortBy,
          sortOrder,
        },
      });
    } catch (err) {
      toast.error(
        err.response?.data?.detail ||
          "Failed to fetch orders. Please try again.",
      );
    } finally {
      set({ loadingOrders: false });
    }
  },

  /** GET /admin/orders/quick-stats — Quick dashboard statistics */
  fetchQuickStats: async (days = 30) => {
    set({ loadingStats: true });
    try {
      const { data } = await axiosInstance.get(
        `/admin/orders/quick-stats?days=${days}`,
      );
      return data;
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Failed to load quick statistics.",
      );
      return null;
    } finally {
      set({ loadingStats: false });
    }
  },

  // ── Admin mutations ────────────────────────────────────────────────────────

  /** PATCH /admin/orders/:id/status */
  updateOrderStatus: async (orderId, orderStatus) => {
    set({ loadingMutation: true });
    try {
      const { data } = await axiosInstance.patch(
        `/admin/orders/${orderId}/status`,
        null,
        { params: { order_status: orderStatus } },
      );
      toast.success("Order status updated.");

      // Refresh current admin page with current filters
      const { page, perPage } = get().adminOrdersPagination;
      const { adminOrdersFilters } = get();
      await get().fetchOrders({ page, perPage, ...adminOrdersFilters });

      return data;
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failed to update order status.";
      toast.error(msg);
      throw err;
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** PATCH /admin/orders/:id/tracking */
  updateTracking: async (orderId, trackingNumber, shippingMethod) => {
    set({ loadingMutation: true });
    try {
      const params = { tracking_number: trackingNumber };
      if (shippingMethod) params.shipping_method = shippingMethod;

      const { data } = await axiosInstance.patch(
        `/admin/orders/${orderId}/tracking`,
        null,
        { params },
      );
      toast.success("Tracking number updated.");

      // Refresh current admin page with current filters
      const { page, perPage } = get().adminOrdersPagination;
      const { adminOrdersFilters } = get();
      await get().fetchOrders({ page, perPage, ...adminOrdersFilters });

      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to update tracking.";
      toast.error(msg);
      throw err;
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** PATCH /admin/orders/:id/payment */
  updatePaymentStatus: async (orderId, paymentStatus, transactionId) => {
    set({ loadingMutation: true });
    try {
      const params = { payment_status: paymentStatus };
      if (transactionId) params.transaction_id = transactionId;

      const { data } = await axiosInstance.patch(
        `/admin/orders/${orderId}/payment`,
        null,
        { params },
      );
      toast.success("Payment status updated.");

      // Refresh current admin page with current filters
      const { page, perPage } = get().adminOrdersPagination;
      const { adminOrdersFilters } = get();
      await get().fetchOrders({ page, perPage, ...adminOrdersFilters });

      return data;
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failed to update payment status.";
      toast.error(msg);
      throw err;
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** PATCH /admin/orders/:id/delivery-company */
  assignDeliveryCompany: async (orderId, deliveryCompanyId) => {
    set({ loadingMutation: true });
    try {
      const { data } = await axiosInstance.patch(
        `/admin/orders/${orderId}/delivery-company`,
        null,
        { params: { delivery_company_id: deliveryCompanyId } },
      );
      toast.success("Delivery company assigned.");

      // Refresh current admin page with current filters
      const { page, perPage } = get().adminOrdersPagination;
      const { adminOrdersFilters } = get();
      await get().fetchOrders({ page, perPage, ...adminOrdersFilters });

      return data;
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failed to assign delivery company.";
      toast.error(msg);
      throw err;
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** DELETE /admin/orders/:id/delivery-company */
  unassignDeliveryCompany: async (orderId) => {
    set({ loadingMutation: true });
    try {
      await axiosInstance.delete(`/admin/orders/${orderId}/delivery-company`);
      toast.success("Delivery company removed from order.");

      // Refresh current admin page with current filters
      const { page, perPage } = get().adminOrdersPagination;
      const { adminOrdersFilters } = get();
      await get().fetchOrders({ page, perPage, ...adminOrdersFilters });
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failed to unassign delivery company.";
      toast.error(msg);
      throw err;
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** DELETE /admin/orders/:id */
  deleteOrder: async (orderId) => {
    set({ loadingMutation: true });
    try {
      await axiosInstance.delete(`/admin/orders/${orderId}`);
      toast.success("Order deleted.");

      // Refresh current admin page with current filters
      const { page, perPage } = get().adminOrdersPagination;
      const { adminOrdersFilters } = get();
      await get().fetchOrders({ page, perPage, ...adminOrdersFilters });
    } catch (err) {
      const msg =
        err.response?.status === 404
          ? "Order not found."
          : err.response?.data?.detail || "Failed to delete order.";
      toast.error(msg);
      throw err;
    } finally {
      set({ loadingMutation: false });
    }
  },

  // ── Pagination helpers ─────────────────────────────────────────────────────

  /** Set user orders page and fetch with current filters */
  setUserOrdersPage: (page) => {
    const { perPage } = get().userOrdersPagination;
    const { userOrdersFilters } = get();
    return get().fetchOrderHistory({ page, perPage, ...userOrdersFilters });
  },

  /** Set admin orders page and fetch with current filters */
  setAdminOrdersPage: (page) => {
    const { perPage } = get().adminOrdersPagination;
    const { adminOrdersFilters } = get();
    return get().fetchOrders({ page, perPage, ...adminOrdersFilters });
  },

  /** Change per page and reset to page 1 with current filters */
  setUserOrdersPerPage: (perPage) => {
    const { userOrdersFilters } = get();
    return get().fetchOrderHistory({ page: 1, perPage, ...userOrdersFilters });
  },

  /** Change per page and reset to page 1 with current filters */
  setAdminOrdersPerPage: (perPage) => {
    const { adminOrdersFilters } = get();
    return get().fetchOrders({ page: 1, perPage, ...adminOrdersFilters });
  },

  // ── Filter helpers ─────────────────────────────────────────────────────────

  /** Apply user order filters and reset to page 1 */
  applyUserFilters: (filters) => {
    const { perPage } = get().userOrdersPagination;
    return get().fetchOrderHistory({
      page: 1,
      perPage,
      ...get().userOrdersFilters,
      ...filters,
    });
  },

  /** Apply admin order filters and reset to page 1 */
  applyAdminFilters: (filters) => {
    const { perPage } = get().adminOrdersPagination;
    return get().fetchOrders({
      page: 1,
      perPage,
      ...get().adminOrdersFilters,
      ...filters,
    });
  },

  /** Reset all admin filters */
  resetAdminFilters: () => {
    const { perPage } = get().adminOrdersPagination;
    return get().fetchOrders({
      page: 1,
      perPage,
      sortBy: "order_date",
      sortOrder: "desc",
    });
  },

  /** Reset all user filters */
  resetUserFilters: () => {
    const { perPage } = get().userOrdersPagination;
    return get().fetchOrderHistory({
      page: 1,
      perPage,
      sortBy: "order_date",
      sortOrder: "desc",
    });
  },

  // ── Order Statistics ───────────────────────────────────────────────────────

  /** GET /stats/orders/summary */
  fetchOrdersSummary: async ({ days, userId } = {}) => {
    try {
      const params = new URLSearchParams();
      if (days) params.append("days", String(days));
      if (userId) params.append("user_id", userId);
      const queryString = params.toString();
      const { data } = await axiosInstance.get(
        `/stats/orders/summary${queryString ? `?${queryString}` : ""}`,
      );
      return data;
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Failed to load orders summary.",
      );
      return null;
    }
  },

  /** GET /stats/orders/my-summary */
  fetchMyOrdersSummary: async (days) => {
    try {
      const params = days ? `?days=${days}` : "";
      const { data } = await axiosInstance.get(
        `/stats/orders/my-summary${params}`,
      );
      return data;
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Failed to load your order summary.",
      );
      return null;
    }
  },

  /** GET /stats/orders/revenue-trend — returns { period, days, data_points, trend } */
  fetchRevenueTrend: async ({ period = "daily", days = 30, userId } = {}) => {
    try {
      const params = new URLSearchParams({
        period,
        days: String(days),
      });
      if (userId) params.append("user_id", userId);
      const { data } = await axiosInstance.get(
        `/stats/orders/revenue-trend?${params}`,
      );
      return data;
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Failed to load revenue trend.",
      );
      return null;
    }
  },

  /** GET /stats/orders/top-customers — returns { limit, days, count, customers } */
  fetchTopCustomers: async ({ limit = 10, days } = {}) => {
    try {
      const params = new URLSearchParams({ limit: String(limit) });
      if (days) params.append("days", String(days));
      const { data } = await axiosInstance.get(
        `/stats/orders/top-customers?${params}`,
      );
      return data;
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Failed to load top customers.",
      );
      return null;
    }
  },

  /** GET /stats/orders/popular-products — returns { limit, days, count, products } */
  fetchPopularProducts: async ({ limit = 10, days } = {}) => {
    try {
      const params = new URLSearchParams({ limit: String(limit) });
      if (days) params.append("days", String(days));
      const { data } = await axiosInstance.get(
        `/stats/orders/popular-products?${params}`,
      );
      return data;
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Failed to load popular products.",
      );
      return null;
    }
  },

  /** GET /stats/orders/fulfillment-metrics — returns { days, metrics } */
  fetchFulfillmentMetrics: async (days = 30) => {
    try {
      const { data } = await axiosInstance.get(
        `/stats/orders/fulfillment-metrics?days=${days}`,
      );
      return data;
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Failed to load fulfillment metrics.",
      );
      return null;
    }
  },

  /** GET /stats/orders/hourly-distribution — returns { days, total_hours_analyzed, distribution } */
  fetchHourlyDistribution: async (days = 30) => {
    try {
      const { data } = await axiosInstance.get(
        `/stats/orders/hourly-distribution?days=${days}`,
      );
      return data;
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Failed to load hourly distribution.",
      );
      return null;
    }
  },

  /** GET /stats/orders/daily-distribution — returns { days, days_analyzed, distribution } */
  fetchDailyDistribution: async (days = 30) => {
    try {
      const { data } = await axiosInstance.get(
        `/stats/orders/daily-distribution?days=${days}`,
      );
      return data;
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Failed to load daily distribution.",
      );
      return null;
    }
  },

  /** GET /stats/orders/category-revenue — returns { days, categories_count, revenue_share } */
  fetchCategoryRevenue: async ({ days, limit } = {}) => {
    try {
      const params = new URLSearchParams();
      if (days) params.append("days", String(days));
      if (limit) params.append("limit", String(limit));
      const queryString = params.toString();
      const { data } = await axiosInstance.get(
        `/stats/orders/category-revenue${queryString ? `?${queryString}` : ""}`,
      );
      return data;
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Failed to load category revenue data.",
      );
      return null;
    }
  },

  /** GET /stats/orders/shipping-analysis */
  fetchShippingAnalysis: async (days) => {
    try {
      const params = days ? `?days=${days}` : "";
      const { data } = await axiosInstance.get(
        `/stats/orders/shipping-analysis${params}`,
      );
      return data;
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Failed to load shipping analysis.",
      );
      return null;
    }
  },

  /** GET /stats/orders/payment-analysis */
  fetchPaymentAnalysis: async (days) => {
    try {
      const params = days ? `?days=${days}` : "";
      const { data } = await axiosInstance.get(
        `/stats/orders/payment-analysis${params}`,
      );
      return data;
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Failed to load payment analysis.",
      );
      return null;
    }
  },

  /** GET /stats/orders/dashboard — combined stats for admin dashboard */
  fetchDashboardStats: async (days = 30) => {
    set({ loadingStats: true });
    try {
      const { data } = await axiosInstance.get(
        `/stats/orders/dashboard?days=${days}`,
      );
      return data;
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Failed to load dashboard statistics.",
      );
      return null;
    } finally {
      set({ loadingStats: false });
    }
  },

  // ── State reset ────────────────────────────────────────────────────────────

  /** Reset entire store to initial state (useful on logout) */
  resetOrderStore: () => {
    set({
      userOrderHistory: [],
      orders: [],
      userOrdersPagination: {
        page: 1,
        perPage: 10,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      adminOrdersPagination: {
        page: 1,
        perPage: 20,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      userOrdersFilters: {
        status: null,
        sortBy: "order_date",
        sortOrder: "desc",
      },
      adminOrdersFilters: {
        status: null,
        paymentStatus: null,
        userId: null,
        search: null,
        dateFrom: null,
        dateTo: null,
        sortBy: "order_date",
        sortOrder: "desc",
      },
      loadingOrders: false,
      loadingMutation: false,
      loadingStats: false,
    });
  },
}));
