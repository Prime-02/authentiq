// stores/useReviewStore.js
import { create } from "zustand";
import { toast } from "react-toastify";
import axiosInstance from "../../lib/axiosInstance";

/**
 * useReviewStore  [10 / 11]
 * -------------------------
 * Owns: product reviews, review mutations, rating statistics.
 *
 * State shape:
 *   reviews:          ProductReview[]   — current page of reviews
 *   currentReview:    ProductReview|null — single review detail
 *   productStats:     Product|null      — admin product stats response
 *   productRating:    { average, count, distribution }|null — detailed rating summary
 *   averageRating:    number            — quick average for a product
 *   totalCount:       number            — total reviews matching current filter
 *   loading:          boolean           — any request in flight
 *   error:            string|null       — last request error message
 *   pagination:       { page, perPage, totalPages, hasNextPage, hasPreviousPage }
 *
 * Key behaviours:
 *   - submitReview performs an upsert; if the user already reviewed the product
 *     the store replaces the existing review rather than duplicating it.
 *   - Rating stats (average, summary) are fetched independently so components
 *     can grab a quick rating without pulling every review object.
 *   - Admin actions mirror public ones but operate without user‑ownership checks.
 *   - Pagination appends pages beyond page 1; calling with page = 1 replaces the list.
 *   - toast notifications surface every success / error automatically.
 *
 * No dependency on other stores.
 * Reviews are product‑scoped — components fetch per product_id as needed.
 * The store assumes the axiosInstance already has `/shop` (or `/v1/shop`) in its base URL.
 */

// Helper to build query string from params object
const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    // Include the value if it's not undefined, null, or empty string
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

export const useReviewStore = create((set, get) => ({
  // ─── State ──────────────────────────────────────────────────
  reviews: [],
  currentReview: null,
  productStats: null, // Admin: product with reviews & rating stats
  productRating: null, // { average, count, distribution }
  averageRating: 0,
  totalCount: 0,
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

  // ─── Public Actions ─────────────────────────────────────────

  fetchProductAverageRating: async (productId) => {
    try {
      const response = await axiosInstance.get(
        `/shop/reviews/products/${productId}/rating`,
      );
      set({ averageRating: response.data.average_rating });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.detail || "Failed to fetch product rating";
      toast.error(message);
      throw error;
    }
  },

  fetchProductRatingSummary: async (productId) => {
    try {
      const response = await axiosInstance.get(
        `/shop/reviews/products/${productId}/rating-summary`,
      );
      set({ productRating: response.data });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.detail || "Failed to fetch rating summary";
      toast.error(message);
      throw error;
    }
  },

  fetchProductReviews: async (productId, params = {}) => {
    const { page = 1, perPage = 50 } = params;
    const skip = (page - 1) * perPage;

    set({ loading: true, error: null });
    try {
      const queryString = buildQueryString({ skip, limit: perPage });
      const response = await axiosInstance.get(
        `/shop/reviews/products/${productId}${queryString}`,
      );

      const reviews = response.data.reviews || [];
      const total = response.data.total || 0;
      const totalPages = Math.max(1, Math.ceil(total / perPage));

      set({
        reviews: reviews,
        totalCount: total,
        pagination: {
          page,
          perPage,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
        loading: false,
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || "Failed to fetch reviews";
      set({ error: message, loading: false });
      toast.error(message);
      throw error;
    }
  },

  fetchReview: async (reviewId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/shop/reviews/${reviewId}`);
      set({ currentReview: response.data, loading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || "Failed to fetch review";
      set({ error: message, loading: false });
      toast.error(message);
      throw error;
    }
  },

  submitReview: async (productId, data) => {
    const { rating, comment } = data;
    set({ loading: true, error: null });
    try {
      const queryString = buildQueryString({
        rating,
        comment: comment || undefined,
      });

      const response = await axiosInstance.post(
        `/shop/reviews/products/${productId}${queryString}`,
      );

      // Update reviews list if we're currently viewing that product's reviews
      const { reviews } = get();
      const existingIndex = reviews.findIndex(
        (r) =>
          r.user_id === response.data.user_id && r.product_id === productId,
      );

      let updatedReviews;
      if (existingIndex !== -1) {
        // Update existing review in the list
        updatedReviews = [...reviews];
        updatedReviews[existingIndex] = response.data;
      } else {
        // Add new review to the beginning
        updatedReviews = [response.data, ...reviews];
      }

      set({
        reviews: updatedReviews,
        currentReview: response.data,
        totalCount: get().totalCount + (existingIndex === -1 ? 1 : 0),
        loading: false,
      });

      toast.success("Review submitted successfully!");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || "Failed to submit review";
      set({ error: message, loading: false });
      toast.error(message);
      throw error;
    }
  },

  deleteMyReview: async (reviewId) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/shop/reviews/${reviewId}`);

      const { reviews, totalCount } = get();
      const updatedReviews = reviews.filter((r) => r.id !== reviewId);

      set({
        reviews: updatedReviews,
        totalCount: totalCount - 1,
        currentReview:
          get().currentReview?.id === reviewId ? null : get().currentReview,
        loading: false,
      });

      toast.success("Review deleted successfully");
      return true;
    } catch (error) {
      const message = error.response?.data?.detail || "Failed to delete review";
      set({ error: message, loading: false });
      toast.error(message);
      throw error;
    }
  },

  // ─── Admin Actions ─────────────────────────────────────────

  adminFetchAllReviews: async (params = {}) => {
    const { page = 1, perPage = 100 } = params;
    const skip = (page - 1) * perPage;

    set({ loading: true, error: null });
    try {
      const queryString = buildQueryString({ skip, limit: perPage });
      const response = await axiosInstance.get(
        `/shop/admin/reviews${queryString}`,
      );

      const reviews = response.data.reviews || [];
      const total = response.data.total || 0;
      const totalPages = Math.max(1, Math.ceil(total / perPage));

      set((state) => ({
        reviews: page === 1 ? reviews : [...state.reviews, ...reviews],
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
      const message = error.response?.data?.detail || "Failed to fetch reviews";
      set({ error: message, loading: false });
      toast.error(message);
      throw error;
    }
  },

  adminFetchProductReviews: async (productId, params = {}) => {
    const { page = 1, perPage = 100 } = params;
    const skip = (page - 1) * perPage;

    set({ loading: true, error: null });
    try {
      const queryString = buildQueryString({ skip, limit: perPage });
      const response = await axiosInstance.get(
        `/shop/admin/reviews/products/${productId}${queryString}`,
      );

      const reviews = response.data.reviews || [];
      const total = response.data.total || 0;
      const totalPages = Math.max(1, Math.ceil(total / perPage));

      set((state) => ({
        reviews: page === 1 ? reviews : [...state.reviews, ...reviews],
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
        error.response?.data?.detail || "Failed to fetch product reviews";
      set({ error: message, loading: false });
      toast.error(message);
      throw error;
    }
  },

  adminFetchProductReviewStats: async (productId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/shop/admin/reviews/products/${productId}/stats`,
      );
      // This endpoint returns a Product object with reviews, not a single review
      set({
        productStats: response.data, // Store in dedicated state
        loading: false,
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.detail || "Failed to fetch product review stats";
      set({ error: message, loading: false });
      toast.error(message);
      throw error;
    }
  },

  adminFetchUserReviews: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/shop/admin/reviews/users/${userId}`,
      );

      const reviews = Array.isArray(response.data)
        ? response.data
        : response.data.reviews || [];

      set({
        reviews,
        totalCount: reviews.length,
        loading: false,
      });

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.detail || "Failed to fetch user reviews";
      set({ error: message, loading: false });
      toast.error(message);
      throw error;
    }
  },

  adminFetchReview: async (reviewId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/shop/admin/reviews/${reviewId}`,
      );
      set({ currentReview: response.data, loading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || "Failed to fetch review";
      set({ error: message, loading: false });
      toast.error(message);
      throw error;
    }
  },

  adminUpdateReview: async (reviewId, data) => {
    const { rating, comment } = data;
    set({ loading: true, error: null });
    try {
      const queryString = buildQueryString({
        rating,
        comment: comment || undefined,
      });

      const response = await axiosInstance.patch(
        `/shop/admin/reviews/${reviewId}${queryString}`,
      );

      const { reviews } = get();
      const updatedReviews = reviews.map((review) =>
        review.id === reviewId ? response.data : review,
      );

      set({
        reviews: updatedReviews,
        currentReview: response.data,
        loading: false,
      });

      toast.success("Review updated successfully");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || "Failed to update review";
      set({ error: message, loading: false });
      toast.error(message);
      throw error;
    }
  },

  adminDeleteReview: async (reviewId) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/shop/admin/reviews/${reviewId}`);

      const { reviews, totalCount } = get();
      const updatedReviews = reviews.filter((r) => r.id !== reviewId);

      set({
        reviews: updatedReviews,
        totalCount: totalCount - 1,
        currentReview:
          get().currentReview?.id === reviewId ? null : get().currentReview,
        loading: false,
      });

      toast.success("Review deleted successfully");
      return true;
    } catch (error) {
      const message = error.response?.data?.detail || "Failed to delete review";
      set({ error: message, loading: false });
      toast.error(message);
      throw error;
    }
  },

  // ─── Utility Actions ───────────────────────────────────────

  clearCurrentReview: () => {
    set({ currentReview: null });
  },

  clearProductStats: () => {
    set({ productStats: null });
  },

  clearProductRating: () => {
    set({ productRating: null, averageRating: 0 });
  },

  resetStore: () => {
    set({
      reviews: [],
      currentReview: null,
      productStats: null,
      productRating: null,
      averageRating: 0,
      totalCount: 0,
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
