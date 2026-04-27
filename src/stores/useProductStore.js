import { create } from "zustand";
import { toast } from "react-toastify";
import axiosInstance from "../../lib/axiosInstance";

/**
 * useProductStore
 * --------------
 * Owns: product list (public + admin), product statistics, product CRUD.
 *
 * Corresponds to:
 *   GET    /products
 *   GET    /products/:id
 *   GET    /products/barcode/:barcode
 *   GET    /admin/products
 *   POST   /admin/products              (multipart/form-data)
 *   PATCH  /admin/products/:id
 *   PATCH  /admin/products/:id/set-active
 *   PATCH  /admin/products/:id/adjust-stock
 *   DELETE /admin/products/:id
 *
 * Statistics:
 *   GET    /admin/products/stats/summary
 *   GET    /admin/products/stats/low-stock
 *   GET    /admin/products/stats/out-of-stock
 *   GET    /admin/products/stats/category-distribution
 *   GET    /admin/products/stats/top-rated
 *   GET    /admin/products/stats/without-barcodes
 *   GET    /admin/products/stats/price-distribution
 *   GET    /admin/products/stats/new
 *   GET    /admin/products/stats/performance/:product_id
 *   GET    /admin/products/stats/best-selling
 */
export const useProductStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  products: [],
  loadingProducts: false,
  loadingMutation: false,

  // ── Helpers ────────────────────────────────────────────────────────────────

  _buildQuery: (filter = {}) => {
    const params = new URLSearchParams();
    params.append("skip", filter.skip ?? 0);
    params.append("limit", filter.limit || 100);

    const add = (key, val) => {
      if (val !== undefined && val !== null && val !== "") {
        params.append(key, val);
      }
    };

    add("category_id", filter.category_id);
    add("search", filter.search);
    add("barcode", filter.barcode);
    add("sizes", filter.sizes);
    add("min_price", filter.min_price);
    add("max_price", filter.max_price);
    add("min_stock", filter.min_stock);
    add("max_stock", filter.max_stock);

    // Boolean needs explicit check so `false` is included
    if (filter.is_active === true || filter.is_active === false) {
      params.append("is_active", filter.is_active);
    }

    return params.toString();
  },

  // ── Public Product Endpoints ───────────────────────────────────────────────

  /** GET /products */
  fetchProducts: async (filter = {}) => {
    set({ loadingProducts: true });
    try {
      const qs = get()._buildQuery(filter);
      const url = `/shop/products${qs ? `?${qs}` : ""}`;
      const { data } = await axiosInstance.get(url);
      set({ products: data || [] });
    } catch {
      toast.error("Unable to load products. Please try again.");
    } finally {
      set({ loadingProducts: false });
    }
  },

  /** GET /products/:id */
  fetchProduct: async (productId) => {
    set({ loadingProducts: true });
    try {
      const { data } = await axiosInstance.get(`/shop/products/${productId}`);
      return data;
    } catch {
      toast.error("Unable to load product details.");
      return null;
    } finally {
      set({ loadingProducts: false });
    }
  },

  /** GET /products/barcode/:barcode */
  fetchProductByBarcode: async (barcode) => {
    set({ loadingProducts: true });
    try {
      const { data } = await axiosInstance.get(`/shop/products/barcode/${barcode}`);
      return data;
    } catch {
      toast.error("Product not found for this barcode.");
      return null;
    } finally {
      set({ loadingProducts: false });
    }
  },

  // ── Admin Product Endpoints ────────────────────────────────────────────────

  /** GET /admin/products */
  fetchAdminProducts: async (filter = {}) => {
    set({ loadingProducts: true });
    try {
      const qs = get()._buildQuery(filter);
      const url = `/shop/admin/products${qs ? `?${qs}` : ""}`;
      const { data } = await axiosInstance.get(url);
      set({ products: data || [] });
      return data || [];
    } catch {
      toast.error("Unable to load products. Please try again.");
      return [];
    } finally {
      set({ loadingProducts: false });
    }
  },

  // ── Product Statistics Endpoints ───────────────────────────────────────────

  /** GET /admin/products/stats/summary */
  fetchProductsSummary: async (categoryId) => {
    try {
      const params = categoryId ? `?category_id=${categoryId}` : "";
      const { data } = await axiosInstance.get(
        `/shop/admin/products/stats/summary${params}`,
      );
      return data;
    } catch {
      toast.error("Failed to load product summary.");
      return null;
    }
  },

  /** GET /admin/products/stats/low-stock — returns { count, threshold, products } */
  fetchLowStockProducts: async ({
    threshold = 10,
    includeInactive = false,
    limit = 50,
  } = {}) => {
    try {
      const params = new URLSearchParams({
        threshold: String(threshold),
        include_inactive: String(includeInactive),
        limit: String(limit),
      });
      const { data } = await axiosInstance.get(
        `/shop/admin/products/stats/low-stock?${params}`,
      );
      return data;
    } catch {
      toast.error("Failed to load low-stock products.");
      return null;
    }
  },

  /** GET /admin/products/stats/out-of-stock — returns { count, products } */
  fetchOutOfStockProducts: async (includeInactive = false) => {
    try {
      const { data } = await axiosInstance.get(
        `/shop/admin/products/stats/out-of-stock?include_inactive=${includeInactive}`,
      );
      return data;
    } catch {
      toast.error("Failed to load out-of-stock products.");
      return null;
    }
  },

  /** GET /admin/products/stats/category-distribution — returns array */
  fetchCategoryDistribution: async (includeInactive = false) => {
    try {
      const { data } = await axiosInstance.get(
        `/shop/admin/products/stats/category-distribution?include_inactive=${includeInactive}`,
      );
      return data;
    } catch {
      toast.error("Failed to load category distribution.");
      return [];
    }
  },

  /** GET /admin/products/stats/top-rated — returns { limit, min_reviews, products } */
  fetchTopRatedProducts: async ({ limit = 10, minReviews = 1 } = {}) => {
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        min_reviews: String(minReviews),
      });
      const { data } = await axiosInstance.get(
        `/shop/admin/products/stats/top-rated?${params}`,
      );
      return data;
    } catch {
      toast.error("Failed to load top-rated products.");
      return null;
    }
  },

  /** GET /admin/products/stats/without-barcodes — returns { count, products } */
  fetchProductsWithoutBarcodes: async (limit = 100) => {
    try {
      const { data } = await axiosInstance.get(
        `/shop/admin/products/stats/without-barcodes?limit=${limit}`,
      );
      return data;
    } catch {
      toast.error("Failed to load products without barcodes.");
      return null;
    }
  },

  /** GET /admin/products/stats/price-distribution — returns array */
  fetchPriceRangeDistribution: async (includeInactive = false) => {
    try {
      const { data } = await axiosInstance.get(
        `/shop/admin/products/stats/price-distribution?include_inactive=${includeInactive}`,
      );
      return data;
    } catch {
      toast.error("Failed to load price distribution.");
      return [];
    }
  },

  /** GET /admin/products/stats/new — returns { days, count, products } */
  fetchNewProducts: async ({ days = 30, limit = 50 } = {}) => {
    try {
      const params = new URLSearchParams({
        days: String(days),
        limit: String(limit),
      });
      const { data } = await axiosInstance.get(
        `/shop/admin/products/stats/new?${params}`,
      );
      return data;
    } catch {
      toast.error("Failed to load new products.");
      return null;
    }
  },

  /** GET /admin/products/stats/performance/:product_id */
  fetchProductPerformance: async (productId) => {
    try {
      const { data } = await axiosInstance.get(
        `/shop/admin/products/stats/performance/${productId}`,
      );
      return data;
    } catch {
      toast.error("Failed to load product performance metrics.");
      return null;
    }
  },

  /** GET /admin/products/stats/best-selling — returns { limit, days, category_id, count, products } */
  fetchBestSellingProducts: async ({ limit = 10, days, categoryId } = {}) => {
    try {
      const params = new URLSearchParams({ limit: String(limit) });
      if (days) params.append("days", String(days));
      if (categoryId) params.append("category_id", categoryId);
      const { data } = await axiosInstance.get(
        `/shop/admin/products/stats/best-selling?${params}`,
      );
      return data;
    } catch {
      toast.error("Failed to load best-selling products.");
      return null;
    }
  },

  // ── Mutations ──────────────────────────────────────────────────────────────

  /** POST /admin/products */
  createProduct: async ({
    name,
    price,
    categoryId,
    description,
    stockQuantity = 0,
    barcode,
    sizes,
    image,
  } = {}) => {
    set({ loadingMutation: true });
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("price", price);
      form.append("category_id", categoryId);
      form.append("stock_quantity", stockQuantity);
      if (description) form.append("description", description);
      if (barcode) form.append("barcode", barcode);
      if (sizes) form.append("sizes", sizes);
      if (image) form.append("image", image);
      
      const { data } = await axiosInstance.post("/shop/admin/products", form);
      toast.success("Product created successfully.");
      await get().fetchProducts();
      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to create product.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** PATCH /admin/products/:id */
  updateProduct: async (
    productId,
    {
      name,
      price,
      categoryId,
      description,
      stockQuantity,
      barcode,
      sizes,
      image,
    } = {},
  ) => {
    set({ loadingMutation: true });
    try {
      const form = new FormData();
      if (name != null) form.append("name", name);
      if (price != null) form.append("price", price);
      if (categoryId != null) form.append("category_id", categoryId);
      if (description != null) form.append("description", description);
      if (stockQuantity != null) form.append("stock_quantity", stockQuantity);
      if (barcode != null) form.append("barcode", barcode);
      if (sizes != null) form.append("sizes", sizes);
      if (image) form.append("image", image);

      const { data } = await axiosInstance.patch(
        `/shop/admin/products/${productId}`,
        form,
      );
      toast.success("Product updated.");
      await get().fetchProducts();
      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to update product.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** PATCH /admin/products/:id/set-active */
  setProductActive: async (productId, isActive) => {
    set({ loadingMutation: true });
    try {
      const { data } = await axiosInstance.patch(
        `/shop/admin/products/${productId}/set-active`,
        null,
        { params: { is_active: isActive } },
      );
      toast.success(`Product ${isActive ? "activated" : "deactivated"}.`);
      await get().fetchProducts();
      return data;
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failed to update product status.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** PATCH /admin/products/:id/adjust-stock */
  adjustStock: async (productId, delta) => {
    set({ loadingMutation: true });
    try {
      const { data } = await axiosInstance.patch(
        `/shop/admin/products/${productId}/adjust-stock`,
        null,
        { params: { delta } },
      );
      toast.success("Stock adjusted.");
      await get().fetchProducts();
      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to adjust stock.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** DELETE /admin/products/:id */
  deleteProduct: async (productId) => {
    set({ loadingMutation: true });
    try {
      await axiosInstance.delete(`/shop/admin/products/${productId}`);
      toast.success("Product deleted.");
      await get().fetchProducts();
    } catch (err) {
      const msg =
        err.response?.status === 403
          ? "You don't have permission to delete products."
          : err.response?.status === 404
            ? "Product not found. It may have already been deleted."
            : err.response?.data?.detail || "Unable to delete the product.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },
}));
