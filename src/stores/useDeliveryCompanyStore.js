import { create } from "zustand";
import { toast } from "react-toastify";
import axiosInstance from "../../lib/axiosInstance";

/**
 * useDeliveryCompanyStore  [9 / 11]
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

  loadingCompanies: false,
  loadingMutation: false,

  // ── Fetch ──────────────────────────────────────────────────────────────────

  /** GET /shop/delivery-companies — active only, optional state filter */
  fetchDeliveryCompanies: async (state) => {
    set({ loadingCompanies: true });
    try {
      const params = state ? `?state=${encodeURIComponent(state)}` : "";
      const { data } = await axiosInstance.get(
        `/shop/delivery-companies${params}`,
      );
      set({ deliveryCompanies: data || [] });
    } catch {
      // silently ignored — delivery companies are non-critical on load
    } finally {
      set({ loadingCompanies: false });
    }
  },

  /**
   * GET /shop/admin/delivery-companies — all including inactive.
   * Returns the list directly so admin pages can hold their own local copy.
   */
  fetchAllDeliveryCompanies: async () => {
    set({ loadingCompanies: true });
    try {
      const { data } = await axiosInstance.get(
        "/shop/admin/delivery-companies",
      );
      return data || [];
    } catch {
      toast.error("Failed to load all delivery companies.");
      return [];
    } finally {
      set({ loadingCompanies: false });
    }
  },

  /** GET /shop/admin/delivery-companies/:id/orders */
  fetchCompanyOrders: async (companyId) => {
    set({ loadingCompanies: true });
    try {
      const { data } = await axiosInstance.get(
        `/shop/admin/delivery-companies/${companyId}/orders`,
      );
      return data || [];
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failed to load company orders.";
      toast.error(msg);
      return [];
    } finally {
      set({ loadingCompanies: false });
    }
  },

  // ── Mutations ──────────────────────────────────────────────────────────────

  /**
   * POST /shop/admin/delivery-companies
   * @param {Object} payload - { name, contactNumber, address, branch, state, website? }
   */
  createDeliveryCompany: async ({
    name,
    contactNumber,
    address,
    branch,
    state,
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
      });
      if (website) params.append("website", website);

      const { data } = await axiosInstance.post(
        `/shop/admin/delivery-companies?${params}`,
      );
      toast.success("Delivery company created.");
      await get().fetchDeliveryCompanies();
      return data;
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failed to create delivery company.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /**
   * PATCH /shop/admin/delivery-companies/:id
   * Only sends fields that are provided.
   */
  updateDeliveryCompany: async (companyId, fields = {}) => {
    set({ loadingMutation: true });
    try {
      // Map camelCase → snake_case and strip undefined values
      const keyMap = {
        name: "name",
        contactNumber: "contact_number",
        address: "address",
        branch: "branch",
        state: "state",
        website: "website",
      };
      const params = new URLSearchParams();
      for (const [jsKey, apiKey] of Object.entries(keyMap)) {
        if (fields[jsKey] != null) params.append(apiKey, fields[jsKey]);
      }

      const { data } = await axiosInstance.patch(
        `/shop/admin/delivery-companies/${companyId}?${params}`,
      );
      toast.success("Delivery company updated.");
      await get().fetchDeliveryCompanies();
      return data;
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failed to update delivery company.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** PATCH /shop/admin/delivery-companies/:id/set-active */
  setDeliveryCompanyActive: async (companyId, isActive) => {
    set({ loadingMutation: true });
    try {
      const { data } = await axiosInstance.patch(
        `/shop/admin/delivery-companies/${companyId}/set-active?is_active=${isActive}`,
      );
      toast.success(
        `Delivery company ${isActive ? "activated" : "deactivated"}.`,
      );
      await get().fetchDeliveryCompanies();
      return data;
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failed to update company status.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /**
   * PATCH /shop/admin/delivery-companies/:id/reassign-orders
   * Bulk-reassigns all orders from one company to another.
   */
  reassignCompanyOrders: async (fromCompanyId, toCompanyId) => {
    set({ loadingMutation: true });
    try {
      const { data } = await axiosInstance.patch(
        `/shop/admin/delivery-companies/${fromCompanyId}/reassign-orders?to_company_id=${toCompanyId}`,
      );
      toast.success(`Reassigned ${data.reassigned} order(s).`);
      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to reassign orders.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** DELETE /shop/admin/delivery-companies/:id */
  deleteDeliveryCompany: async (companyId) => {
    set({ loadingMutation: true });
    try {
      await axiosInstance.delete(`/shop/admin/delivery-companies/${companyId}`);
      toast.success("Delivery company deleted.");
      await get().fetchDeliveryCompanies();
    } catch (err) {
      const msg =
        err.response?.status === 404
          ? "Delivery company not found."
          : err.response?.data?.detail || "Failed to delete delivery company.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },
}));
