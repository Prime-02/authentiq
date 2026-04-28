import { create } from "zustand";
import { toast } from "react-toastify";
import axiosInstance from "../../lib/axiosInstance";

/**
 * useDeliveryCompanyStore
 * ----------------------------------
 * Owns: delivery company list, all delivery company CRUD.
 *
 * Corresponds to:
 *   GET    /shop/delivery-companies
 *   GET    /shop/delivery-companies/:id
 *   GET    /shop/admin/delivery-companies
 *   GET    /shop/admin/delivery-companies/:id/orders
 *   POST   /shop/admin/delivery-companies
 *   PATCH  /shop/admin/delivery-companies/:id
 *   PATCH  /shop/admin/delivery-companies/:id/set-active
 *   PATCH  /shop/admin/delivery-companies/:id/reassign-orders
 *   DELETE /shop/admin/delivery-companies/:id
 *
 * No dependency on other stores.
 */
export const useDeliveryCompanyStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  deliveryCompanies: [], // active only (public view)
  pagination: {
    page: 1,
    per_page: 20,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false,
  },
  loadingCompanies: false,
  loadingMutation: false,

  // ── Fetch ──────────────────────────────────────────────────────────────────

  /**
   * GET /shop/delivery-companies — active only, with smart filtering and pagination
   * @param {Object} filters - { state?, serviceArea?, page?, perPage? }
   *
   * Smart filtering logic:
   * - If state is provided:
   *   - Returns worldwide companies (always available)
   *   - Returns nationwide companies (available everywhere)
   *   - Returns regional companies covering that state
   *   - Returns local companies in that specific state
   * - serviceArea filter can further narrow results
   */
  fetchDeliveryCompanies: async (filters = {}) => {
    set({ loadingCompanies: true });
    try {
      const params = new URLSearchParams();

      if (filters.state) {
        params.append("state", filters.state);
      }

      if (filters.serviceArea) {
        params.append("service_area", filters.serviceArea);
      }

      // Pagination
      if (filters.page) {
        params.append("page", String(filters.page));
      }

      if (filters.perPage) {
        params.append("per_page", String(filters.perPage));
      }

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const { data } = await axiosInstance.get(
        `/shop/delivery-companies${queryString}`,
      );

      // Handle paginated response
      if (data && data.items) {
        set({
          deliveryCompanies: data.items,
          pagination: data.pagination,
        });
        return data;
      }

      // Fallback for non-paginated response
      set({ deliveryCompanies: data || [] });
      return { items: data || [], pagination: null };
    } catch (error) {
      // silently ignored — delivery companies are non-critical on load
      console.error("Failed to fetch delivery companies:", error);
    } finally {
      set({ loadingCompanies: false });
    }
  },

  /**
   * GET /shop/admin/delivery-companies — all including inactive, with pagination
   * @param {Object} filters - { page?, perPage?, search?, serviceArea?, isActive? }
   * Returns the full paginated response so admin pages can manage their own state.
   */
  fetchAllDeliveryCompanies: async (filters = {}) => {
    set({ loadingCompanies: true });
    try {
      const params = new URLSearchParams();

      // Pagination
      if (filters.page) {
        params.append("page", String(filters.page));
      }

      if (filters.perPage) {
        params.append("per_page", String(filters.perPage));
      }

      // Search
      if (filters.search) {
        params.append("search", filters.search);
      }

      // Filters
      if (filters.serviceArea) {
        params.append("service_area", filters.serviceArea);
      }

      if (filters.isActive !== undefined && filters.isActive !== null) {
        params.append("is_active", String(filters.isActive));
      }

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const { data } = await axiosInstance.get(
        `/shop/admin/delivery-companies${queryString}`,
      );

      return (
        data || {
          items: [],
          pagination: { total: 0, page: 1, per_page: 20, total_pages: 0 },
        }
      );
    } catch (error) {
      toast.error("Failed to load all delivery companies.");
      return {
        items: [],
        pagination: { total: 0, page: 1, per_page: 20, total_pages: 0 },
      };
    } finally {
      set({ loadingCompanies: false });
    }
  },

  /**
   * GET /shop/admin/delivery-companies/:id/orders
   * @param {string} companyId
   * @param {Object} filters - { page?, perPage?, status? }
   */
  fetchCompanyOrders: async (companyId, filters = {}) => {
    set({ loadingCompanies: true });
    try {
      const params = new URLSearchParams();

      // Pagination
      if (filters.page) {
        params.append("page", String(filters.page));
      }

      if (filters.perPage) {
        params.append("per_page", String(filters.perPage));
      }

      // Status filter
      if (filters.status) {
        params.append("status", filters.status);
      }

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const { data } = await axiosInstance.get(
        `/shop/admin/delivery-companies/${companyId}/orders${queryString}`,
      );

      return data || { items: [], pagination: { total: 0 } };
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failed to load company orders.";
      toast.error(msg);
      return { items: [], pagination: { total: 0 } };
    } finally {
      set({ loadingCompanies: false });
    }
  },

  // ── Mutations ──────────────────────────────────────────────────────────────

  /**
   * POST /shop/admin/delivery-companies
   * @param {Object} payload
   * @param {string} payload.name
   * @param {string} payload.contactNumber
   * @param {string} payload.address
   * @param {string} payload.branch
   * @param {string} payload.state
   * @param {string} payload.serviceArea - "local" | "regional" | "nationwide" | "worldwide"
   * @param {string[]} payload.coverageStates - List of states for regional companies
   * @param {string} [payload.website]
   */
  createDeliveryCompany: async ({
    name,
    contactNumber,
    address,
    branch,
    state,
    serviceArea = "local",
    coverageStates = [],
    website,
  } = {}) => {
    set({ loadingMutation: true });
    try {
      const params = new URLSearchParams({
        name,
        contact_number: contactNumber,
        address,
        branch,
        state,
        service_area: serviceArea,
      });

      if (website) {
        params.append("website", website);
      }

      // For regional companies, include coverage states
      if (serviceArea === "regional" && coverageStates.length > 0) {
        params.append("coverage_states", coverageStates.join(","));
      }

      const { data } = await axiosInstance.post(
        `/shop/admin/delivery-companies?${params}`,
      );

      toast.success("Delivery company created successfully.");
      await get().fetchDeliveryCompanies();
      return data;
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failed to create delivery company.";
      toast.error(msg);
      throw err; // Re-throw for component-level handling
    } finally {
      set({ loadingMutation: false });
    }
  },

  /**
   * PATCH /shop/admin/delivery-companies/:id
   * Only sends fields that are provided.
   *
   * @param {string} companyId
   * @param {Object} fields - Partial company fields to update
   */
  updateDeliveryCompany: async (companyId, fields = {}) => {
    set({ loadingMutation: true });
    try {
      // Map camelCase → snake_case and strip undefined/null values
      const keyMap = {
        name: "name",
        contactNumber: "contact_number",
        address: "address",
        branch: "branch",
        state: "state",
        website: "website",
        serviceArea: "service_area",
        coverageStates: "coverage_states",
      };

      const params = new URLSearchParams();

      for (const [jsKey, apiKey] of Object.entries(keyMap)) {
        if (fields[jsKey] != null) {
          if (jsKey === "coverageStates" && Array.isArray(fields[jsKey])) {
            // Join array for comma-separated string
            params.append(apiKey, fields[jsKey].join(","));
          } else {
            params.append(apiKey, String(fields[jsKey]));
          }
        }
      }

      const { data } = await axiosInstance.patch(
        `/shop/admin/delivery-companies/${companyId}?${params}`,
      );

      toast.success("Delivery company updated successfully.");
      await get().fetchDeliveryCompanies();
      return data;
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failed to update delivery company.";
      toast.error(msg);
      throw err;
    } finally {
      set({ loadingMutation: false });
    }
  },

  /**
   * PATCH /shop/admin/delivery-companies/:id/set-active
   * @param {string} companyId
   * @param {boolean} isActive
   */
  setDeliveryCompanyActive: async (companyId, isActive) => {
    set({ loadingMutation: true });
    try {
      const { data } = await axiosInstance.patch(
        `/shop/admin/delivery-companies/${companyId}/set-active?is_active=${isActive}`,
      );

      toast.success(
        `Delivery company ${isActive ? "activated" : "deactivated"} successfully.`,
      );
      await get().fetchDeliveryCompanies();
      return data;
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failed to update company status.";
      toast.error(msg);
      throw err;
    } finally {
      set({ loadingMutation: false });
    }
  },

  /**
   * PATCH /shop/admin/delivery-companies/:id/reassign-orders
   * Bulk-reassigns all orders from one company to another.
   *
   * @param {string} fromCompanyId - Source company ID
   * @param {string} toCompanyId - Target company ID
   */
  reassignCompanyOrders: async (fromCompanyId, toCompanyId) => {
    set({ loadingMutation: true });
    try {
      const { data } = await axiosInstance.patch(
        `/shop/admin/delivery-companies/${fromCompanyId}/reassign-orders?to_company_id=${toCompanyId}`,
      );

      toast.success(`Successfully reassigned ${data.reassigned} order(s).`);
      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to reassign orders.";
      toast.error(msg);
      throw err;
    } finally {
      set({ loadingMutation: false });
    }
  },

  /**
   * DELETE /shop/admin/delivery-companies/:id
   * @param {string} companyId
   */
  deleteDeliveryCompany: async (companyId) => {
    set({ loadingMutation: true });
    try {
      await axiosInstance.delete(`/shop/admin/delivery-companies/${companyId}`);

      toast.success("Delivery company deleted successfully.");
      await get().fetchDeliveryCompanies();
      return true;
    } catch (err) {
      const msg =
        err.response?.status === 404
          ? "Delivery company not found."
          : err.response?.data?.detail || "Failed to delete delivery company.";
      toast.error(msg);
      throw err;
    } finally {
      set({ loadingMutation: false });
    }
  },

  // ── Utility ────────────────────────────────────────────────────────────────

  /**
   * Get a single delivery company by ID from the local state
   * @param {string} companyId
   */
  getCompanyById: (companyId) => {
    return get().deliveryCompanies.find((c) => c.id === companyId) || null;
  },
  // Add this method to useDeliveryCompanyStore

  /**
   * Append more delivery companies for infinite scroll
   */
  appendDeliveryCompanies: async (filters = {}) => {
    set({ loadingCompanies: true });
    try {
      const params = new URLSearchParams();

      if (filters.state) {
        params.append("state", filters.state);
      }

      if (filters.serviceArea) {
        params.append("service_area", filters.serviceArea);
      }

      if (filters.page) {
        params.append("page", String(filters.page));
      }

      if (filters.perPage) {
        params.append("per_page", String(filters.perPage));
      }

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const { data } = await axiosInstance.get(
        `/shop/delivery-companies${queryString}`,
      );

      if (data && data.items) {
        // Append new items to existing list
        const currentCompanies = get().deliveryCompanies;
        const existingIds = new Set(currentCompanies.map((c) => c.id));
        const newCompanies = data.items.filter((c) => !existingIds.has(c.id));

        set({
          deliveryCompanies: [...currentCompanies, ...newCompanies],
          pagination: data.pagination,
        });
        return data;
      }

      return { items: [], pagination: null };
    } catch (error) {
      console.error("Failed to fetch more delivery companies:", error);
    } finally {
      set({ loadingCompanies: false });
    }
  },


  

  /**
   * Reset the store to initial state
   */
  resetStore: () => {
    set({
      deliveryCompanies: [],
      pagination: {
        page: 1,
        per_page: 20,
        total: 0,
        total_pages: 0,
        has_next: false,
        has_prev: false,
      },
      loadingCompanies: false,
      loadingMutation: false,
    });
  },
}));
