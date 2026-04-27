import { create } from "zustand";
import { toast } from "react-toastify";
import axiosInstance from "../../lib/axiosInstance";

/**
 * useReviewStore  [10 / 11]
 * -------------------------
 * Owns: product reviews, review mutations.
 *
 * Corresponds to:
 *   GET    /shop/reviews/products/:id
 *   GET    /shop/reviews/products/:id/rating
 *   POST   /shop/reviews/products/:id
 *   DELETE /shop/reviews/:id
 *   GET    /shop/admin/reviews
 *   GET    /shop/admin/reviews/users/:user_id
 *   PATCH  /shop/admin/reviews/:id
 *   DELETE /shop/admin/reviews/:id
 *
 * No dependency on other stores.
 * Reviews are product-scoped — components fetch per product_id as needed.
 */
export const useReviewStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  // Keyed by product_id so multiple product pages can coexist in memory
  reviewsByProduct: {}, // { [productId]: Review[] }

  loadingReviews: false,
  loadingMutation: false,

  // ── Fetch ──────────────────────────────────────────────────────────────────

  /** GET /shop/reviews/products/:id */
  fetchProductReviews: async (productId) => {
    set({ loadingReviews: true });
    try {
      const { data } = await axiosInstance.get(
        `/shop/reviews/products/${productId}`,
      );
      set((state) => ({
        reviewsByProduct: {
          ...state.reviewsByProduct,
          [productId]: data || [],
        },
      }));
      return data || [];
    } catch {
      // silently ignored — reviews are non-critical
      return [];
    } finally {
      set({ loadingReviews: false });
    }
  },

  /** GET /shop/reviews/products/:id/rating */
  fetchAverageRating: async (productId) => {
    try {
      const { data } = await axiosInstance.get(
        `/shop/reviews/products/${productId}/rating`,
      );
      return data; // { product_id, average_rating }
    } catch {
      return { product_id: productId, average_rating: 0 };
    }
  },

  /**
   * GET /shop/admin/reviews — paginated.
   * Returns the list directly (not stored globally).
   */
  fetchAllReviews: async ({ skip = 0, limit = 100 } = {}) => {
    set({ loadingReviews: true });
    try {
      const { data } = await axiosInstance.get(
        `/shop/admin/reviews?skip=${skip}&limit=${limit}`,
      );
      return data || [];
    } catch {
      toast.error("Failed to load reviews.");
      return [];
    } finally {
      set({ loadingReviews: false });
    }
  },

  /** GET /shop/admin/reviews/users/:user_id */
  fetchUserReviews: async (userId) => {
    set({ loadingReviews: true });
    try {
      const { data } = await axiosInstance.get(
        `/shop/admin/reviews/users/${userId}`,
      );
      return data || [];
    } catch {
      toast.error("Failed to load user reviews.");
      return [];
    } finally {
      set({ loadingReviews: false });
    }
  },

  // ── Mutations ──────────────────────────────────────────────────────────────

  /**
   * POST /shop/reviews/products/:id
   * Upserts — if the user already reviewed this product the server updates it.
   */
  submitReview: async (productId, { rating, comment } = {}) => {
    set({ loadingMutation: true });
    try {
      const params = new URLSearchParams({ rating });
      if (comment) params.append("comment", comment);

      const { data } = await axiosInstance.post(
        `/shop/reviews/products/${productId}?${params}`,
      );
      toast.success("Review submitted. Thank you!");
      await get().fetchProductReviews(productId);
      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to submit review.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** DELETE /shop/reviews/:id — current user deletes their own review */
  deleteReview: async (reviewId, productId) => {
    set({ loadingMutation: true });
    try {
      await axiosInstance.delete(`/shop/reviews/${reviewId}`);
      toast.success("Review deleted.");
      if (productId) await get().fetchProductReviews(productId);
    } catch (err) {
      const msg =
        err.response?.status === 404
          ? "Review not found."
          : err.response?.data?.detail || "Failed to delete review.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** PATCH /shop/admin/reviews/:id */
  adminUpdateReview: async (reviewId, { rating, comment } = {}) => {
    set({ loadingMutation: true });
    try {
      const params = new URLSearchParams();
      if (rating != null) params.append("rating", rating);
      if (comment != null) params.append("comment", comment);

      const { data } = await axiosInstance.patch(
        `/shop/admin/reviews/${reviewId}?${params}`,
      );
      toast.success("Review updated.");
      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to update review.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** DELETE /shop/admin/reviews/:id */
  adminDeleteReview: async (reviewId) => {
    set({ loadingMutation: true });
    try {
      await axiosInstance.delete(`/shop/admin/reviews/${reviewId}`);
      toast.success("Review deleted by admin.");
    } catch (err) {
      const msg =
        err.response?.status === 404
          ? "Review not found."
          : err.response?.data?.detail || "Failed to delete review.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },
}));
