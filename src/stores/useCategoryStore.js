import { create } from "zustand";
import { toast } from "react-toastify";
import axiosInstance from "../../lib/axiosInstance";

/**
 * useCategoryStore  [4 / 11]
 * --------------------------
 * Owns: category list (public), admin category operations.
 *
 * Corresponds to:
 *   GET    /shop/categories
 *   GET    /shop/categories/:id
 *   GET    /shop/admin/categories
 *   POST   /shop/admin/categories        (multipart/form-data)
 *   PATCH  /shop/admin/categories/:id
 *   PATCH  /shop/admin/categories/:id/set-active
 *   DELETE /shop/admin/categories/:id
 *
 * No dependency on other stores.
 */
export const useCategoryStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  categories: [], // active only (public view)

  loadingCategories: false,
  loadingMutation: false,

  // ── Fetch ──────────────────────────────────────────────────────────────────

  /**
   * GET /shop/categories — public, active only
   * @param {Object} options - { includeProducts?, maxProducts? }
   */
  fetchCategories: async (options = {}) => {
    const { includeProducts = false, maxProducts } = options;
    set({ loadingCategories: true });
    try {
      const params = new URLSearchParams();
      params.append("include_products", includeProducts);
      if (maxProducts) params.append("max_products", maxProducts);

      const { data } = await axiosInstance.get(
        `/shop/categories?${params.toString()}`,
      );
      set({ categories: data || [] });
    } catch {
      // silently ignored — categories are non-critical on failure
    } finally {
      set({ loadingCategories: false });
    }
  },

  /**
   * GET /shop/categories/:id — single category by ID
   * @param {string} categoryId
   * @param {Object} options - { includeProducts?, maxProducts? }
   */
  fetchCategoryById: async (categoryId, options = {}) => {
    const { includeProducts = true, maxProducts } = options;
    set({ loadingCategories: true });
    try {
      const params = new URLSearchParams();
      params.append("include_products", includeProducts);
      if (maxProducts) params.append("max_products", maxProducts);

      const { data } = await axiosInstance.get(
        `/shop/categories/${categoryId}?${params.toString()}`,
      );
      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to fetch category.";
      toast.error(msg);
      return null;
    } finally {
      set({ loadingCategories: false });
    }
  },

  /**
   * GET /shop/admin/categories — all including inactive.
   * Returns the list directly so admin pages can hold it in local state
   * without polluting the shared public list.
   * @param {Object} options - { includeProducts?, maxProducts? }
   */
  fetchAdminCategories: async (options = {}) => {
    const { includeProducts = true, maxProducts } = options;
    set({ loadingCategories: true });
    try {
      const params = new URLSearchParams();
      params.append("include_products", includeProducts);
      if (maxProducts) params.append("max_products", maxProducts);

      const { data } = await axiosInstance.get(
        `/shop/admin/categories?${params.toString()}`,
      );
      console.log("Admin categories fetched:", JSON.stringify(data));
      return data || [];
    } catch {
      toast.error("Failed to load all categories.");
      return [];
    } finally {
      set({ loadingCategories: false });
    }
  },

  // ── Mutations ──────────────────────────────────────────────────────────────

  /**
   * POST /shop/admin/categories
   * @param {Object} payload - { name, description?, image? (File) }
   */
  createCategory: async ({ name, description, image } = {}) => {
    set({ loadingMutation: true });
    try {
      const form = new FormData();
      form.append("name", name);
      if (description) form.append("description", description);
      if (image) form.append("image", image);

      const { data } = await axiosInstance.post("/shop/admin/categories", form);
      toast.success("Category created successfully.");
      await get().fetchCategories();
      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to create category.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /**
   * PATCH /shop/admin/categories/:id
   * @param {string} categoryId
   * @param {Object} payload - { name?, description?, image? (File) }
   */
  updateCategory: async (categoryId, { name, description, image } = {}) => {
    set({ loadingMutation: true });
    try {
      const form = new FormData();
      if (name) form.append("name", name);
      if (description) form.append("description", description);
      if (image) form.append("image", image);

      const { data } = await axiosInstance.patch(
        `/shop/admin/categories/${categoryId}`,
        form,
      );
      toast.success("Category updated.");
      await get().fetchCategories();
      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to update category.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** PATCH /shop/admin/categories/:id/set-active */
  setCategoryActive: async (categoryId, isActive) => {
    set({ loadingMutation: true });
    try {
      const { data } = await axiosInstance.patch(
        `/shop/admin/categories/${categoryId}/set-active?is_active=${isActive}`,
      );
      toast.success(`Category ${isActive ? "activated" : "deactivated"}.`);
      await get().fetchCategories();
      return data;
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failed to update category status.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** DELETE /shop/admin/categories/:id */
  deleteCategory: async (categoryId) => {
    set({ loadingMutation: true });
    try {
      await axiosInstance.delete(`/shop/admin/categories/${categoryId}`);
      toast.success("Category deleted.");
      await get().fetchCategories();
    } catch (err) {
      const msg =
        err.response?.status === 404
          ? "Category not found."
          : err.response?.data?.detail || "Failed to delete category.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },
}));
