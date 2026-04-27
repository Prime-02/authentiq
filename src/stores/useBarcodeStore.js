import { create } from "zustand";
import { toast } from "react-toastify";
import axiosInstance from "../../lib/axiosInstance";

/**
 * useBarcodeStore  [3 / 11]
 * -------------------------
 * Owns: barcode list, barcode statistics, all barcode CRUD.
 *
 * Corresponds to:
 *   GET    /shop/barcodes
 *   GET    /shop/barcodes/lookup
 *   GET    /shop/barcodes/:id
 *   POST   /shop/admin/barcodes
 *   POST   /shop/admin/barcodes/batch
 *   GET    /shop/admin/barcodes/expiring
 *   GET    /shop/admin/barcodes/statistics
 *   PATCH  /shop/admin/barcodes/expire
 *   PATCH  /shop/admin/barcodes/bulk/status
 *   PATCH  /shop/admin/barcodes/:id/status
 *   PATCH  /shop/admin/barcodes/:id/extend-expiry
 *   PATCH  /shop/admin/barcodes/:id/reassign
 *   DELETE /shop/admin/barcodes/:id
 *
 * No dependency on other stores.
 */
export const useBarcodeStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  barcodes: [],
  statistics: null, // { total, active, used, expired }

  // Pagination state
  pagination: {
    total: 0,
    page: 1,
    pageSize: 50,
    totalPages: 0,
  },

  loadingBarcodes: false,
  loadingStatistics: false,
  loadingMutation: false,

  // ── Fetch ──────────────────────────────────────────────────────────────────

  /**
   * Fetch barcodes with server-side pagination and filtering.
   * The API now returns: { data, total, page, page_size, total_pages }
   */
  fetchBarcodes: async ({
    page = 1,
    pageSize = 50,
    statusFilter = undefined,
    productId = undefined,
    search = undefined,
    expiryFilter = undefined,
  } = {}) => {
    set({ loadingBarcodes: true });
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("page_size", pageSize);
      if (statusFilter) params.append("barcode_status", statusFilter);
      if (productId) params.append("product_id", productId);

      const { data } = await axiosInstance.get(`/shop/barcodes?${params}`);
      // New API returns { data, total, page, page_size, total_pages }
      let responseData = data;
      let results = responseData.data || [];

      // Update pagination state
      set({
        pagination: {
          total: responseData.total || 0,
          page: responseData.page || page,
          pageSize: responseData.page_size || pageSize,
          totalPages: responseData.total_pages || 0,
        },
      });

      // ── Client-side search filter (if not supported by API) ────────────────
      if (search) {
        const q = search.toLowerCase();
        results = results.filter((b) => b.code.toLowerCase().includes(q));
      }

      // ── Client-side expiry filters (if not supported by API) ───────────────
      const now = Date.now();
      if (expiryFilter === "30d") {
        const cutoff = now + 30 * 864e5;
        results = results.filter(
          (b) =>
            b.expires_at &&
            new Date(b.expires_at).getTime() <= cutoff &&
            new Date(b.expires_at).getTime() > now,
        );
      } else if (expiryFilter === "90d") {
        const cutoff = now + 90 * 864e5;
        results = results.filter(
          (b) =>
            b.expires_at &&
            new Date(b.expires_at).getTime() <= cutoff &&
            new Date(b.expires_at).getTime() > now,
        );
      } else if (expiryFilter === "past") {
        results = results.filter(
          (b) => b.expires_at && new Date(b.expires_at).getTime() < now,
        );
      }

      set({ barcodes: results });
      return { data: results, pagination: get().pagination };
    } catch (error) {
      set({
        barcodes: [],
        pagination: { total: 0, page: 1, pageSize: 50, totalPages: 0 },
      });
      toast.error("Failed to load barcodes.");
    } finally {
      set({ loadingBarcodes: false });
    }
  },

  /** GET /shop/admin/barcodes/statistics */
  fetchStatistics: async () => {
    set({ loadingStatistics: true });
    try {
      const { data } = await axiosInstance.get(
        "/shop/admin/barcodes/statistics",
      );
      set({ statistics: data });
      return data;
    } catch {
      toast.error("Failed to load barcode statistics.");
    } finally {
      set({ loadingStatistics: false });
    }
  },

  /** GET /shop/admin/barcodes/expiring */
  fetchExpiringBarcodes: async (
    daysThreshold = 30,
    page = 1,
    pageSize = 50,
  ) => {
    set({ loadingBarcodes: true });
    try {
      const params = new URLSearchParams();
      params.append("days_threshold", daysThreshold);
      params.append("page", page);
      params.append("page_size", pageSize);

      const { data } = await axiosInstance.get(
        `/shop/admin/barcodes/expiring?${params}`,
      );

      // API returns { data, total, page, page_size, total_pages }
      set({
        barcodes: data.data || [],
        pagination: {
          total: data.total || 0,
          page: data.page || page,
          pageSize: data.page_size || pageSize,
          totalPages: data.total_pages || 0,
        },
      });

      return data;
    } catch {
      toast.error("Failed to load expiring barcodes.");
    } finally {
      set({ loadingBarcodes: false });
    }
  },

  /**
   * Lookup a single barcode by code
   * GET /shop/barcodes/lookup?code=XXX
   */
  lookupBarcode: async (code) => {
    try {
      const { data } = await axiosInstance.get(
        `/shop/barcodes/lookup?code=${code}`,
      );
      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || "Barcode not found.";
      toast.error(msg);
      return null;
    }
  },

  /**
   * Get single barcode by ID
   * GET /shop/barcodes/:id
   */
  getBarcodeById: async (barcodeId) => {
    try {
      const { data } = await axiosInstance.get(`/shop/barcodes/${barcodeId}`);
      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || "Barcode not found.";
      toast.error(msg);
      return null;
    }
  },

  // ── Mutations ──────────────────────────────────────────────────────────────

  /**
   * POST /shop/admin/barcodes
   * Pass { code } for a specific barcode, or { quantity } to auto-generate.
   * Now accepts JSON body instead of query params for cleaner API.
   */
  createBarcode: async ({ code, productId, quantity = 1, expiresAt } = {}) => {
    set({ loadingMutation: true });
    try {
      const payload = {};
      if (code) payload.code = code;
      if (productId) payload.product_id = productId;
      if (expiresAt) payload.expires_at = expiresAt;
      payload.quantity = quantity;

      const { data } = await axiosInstance.post(
        `/shop/admin/barcodes`,
        payload,
      );
      // Refresh the current page AND statistics
      const { page, pageSize } = get().pagination;
      await Promise.all([
        get().fetchBarcodes({ page, pageSize }),
        get().fetchStatistics(),
      ]);

      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to create barcode(s).";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /**
   * POST /shop/admin/barcodes/batch
   * Force-batch create `quantity` auto-generated barcodes.
   */
  createBarcodesBatch: async ({ productId, quantity, expiresAt } = {}) => {
    set({ loadingMutation: true });
    try {
      const params = new URLSearchParams();
      if (quantity) params.append("quantity", quantity);
      if (productId) params.append("product_id", productId);
      if (expiresAt) params.append("expires_at", expiresAt);
      const url = `/shop/admin/barcodes/batch?${params}`;

      console.log("Params: ", url);
      const { data } = await axiosInstance.post(
        `/shop/admin/barcodes/batch?${params}`,
      );
      toast.success(`Created ${quantity || 10} barcodes successfully.`);

      // Refresh the current page AND statistics
      const { page, pageSize } = get().pagination;
      await Promise.all([
        get().fetchBarcodes({ page, pageSize }),
        get().fetchStatistics(),
      ]);

      return data;
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failed to create batch barcodes.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** PATCH /shop/admin/barcodes/:id/status */
  updateBarcodeStatus: async (barcodeId, status) => {
    set({ loadingMutation: true });
    try {
      const { data } = await axiosInstance.patch(
        `/shop/admin/barcodes/${barcodeId}/status`,
        { status },
      );
      toast.success("Barcode status updated.");

      // Refresh the current page AND statistics
      const { page, pageSize } = get().pagination;
      await Promise.all([
        get().fetchBarcodes({ page, pageSize }),
        get().fetchStatistics(),
      ]);

      return data;
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failed to update barcode status.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** PATCH /shop/admin/barcodes/bulk/status */
  bulkUpdateBarcodeStatus: async (barcodeIds, status) => {
    set({ loadingMutation: true });
    try {
      const { data } = await axiosInstance.patch(
        `/shop/admin/barcodes/bulk/status`,
        { barcode_ids: barcodeIds, status },
      );
      toast.success(`Updated ${data.updated || barcodeIds.length} barcode(s).`);

      // Refresh the current page AND statistics
      const { page, pageSize } = get().pagination;
      await Promise.all([
        get().fetchBarcodes({ page, pageSize }),
        get().fetchStatistics(),
      ]);

      return data;
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failed to bulk-update barcodes.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** PATCH /shop/admin/barcodes/expire */
  expireBarcodes: async (productId) => {
    set({ loadingMutation: true });
    try {
      const payload = {};
      if (productId) payload.product_id = productId;

      const { data } = await axiosInstance.patch(
        `/shop/admin/barcodes/expire`,
        payload,
      );
      toast.success(`Expired ${data.expired || 0} barcode(s).`);

      // Refresh the current page AND statistics
      const { page, pageSize } = get().pagination;
      await Promise.all([
        get().fetchBarcodes({ page, pageSize }),
        get().fetchStatistics(),
      ]);

      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to expire barcodes.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** PATCH /shop/admin/barcodes/:id/extend-expiry */
  extendExpiry: async (barcodeId, additionalDays) => {
    set({ loadingMutation: true });
    try {
      const { data } = await axiosInstance.patch(
        `/shop/admin/barcodes/${barcodeId}/extend-expiry?additional_days=${additionalDays}`,
      );
      toast.success(`Expiry extended by ${additionalDays} days.`);

      // Refresh the current page AND statistics
      const { page, pageSize } = get().pagination;
      await Promise.all([
        get().fetchBarcodes({ page, pageSize }),
        get().fetchStatistics(),
      ]);

      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to extend expiry.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** PATCH /shop/admin/barcodes/:id/reassign */
  reassignBarcode: async (barcodeId, productId) => {
    set({ loadingMutation: true });
    try {
      const { data } = await axiosInstance.patch(
        `/shop/admin/barcodes/${barcodeId}/reassign`,
        { product_id: productId || null },
      );
      toast.success("Barcode reassigned.");

      // Refresh the current page AND statistics
      const { page, pageSize } = get().pagination;
      await Promise.all([
        get().fetchBarcodes({ page, pageSize }),
        get().fetchStatistics(),
      ]);

      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to reassign barcode.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** DELETE /shop/admin/barcodes/:id */
  deleteBarcode: async (barcodeId) => {
    set({ loadingMutation: true });
    try {
      await axiosInstance.delete(`/shop/admin/barcodes/${barcodeId}`);
      // Refresh the current page AND statistics
      const { page, pageSize } = get().pagination;
      await Promise.all([
        get().fetchBarcodes({ page, pageSize }),
        get().fetchStatistics(),
      ]);
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to delete barcode.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  // ── Utility actions ────────────────────────────────────────────────────────

  /** Reset pagination to page 1 */
  resetPagination: () => {
    set({
      pagination: {
        total: 0,
        page: 1,
        pageSize: 50,
        totalPages: 0,
      },
    });
  },

  /** Set page size */
  setPageSize: (pageSize) => {
    set((state) => ({
      pagination: { ...state.pagination, pageSize, page: 1 },
    }));
  },

  /** Go to specific page */
  setPage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, page },
    }));
  },
}));
