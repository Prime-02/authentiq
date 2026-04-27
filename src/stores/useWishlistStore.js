import { create } from "zustand";
import { toast } from "react-toastify";
import axiosInstance from "../../lib/axiosInstance";
import { useUIStore } from "./useUIStore";

/**
 * useWishlistStore  [7 / 11]
 * --------------------------
 * Owns: wishlist items, wishlist item count, wishlist mutations.
 *
 * Corresponds to:
 *   GET    /shop/wishlist
 *   POST   /shop/wishlist/items
 *   DELETE /shop/wishlist/items/:id
 *   GET    /shop/admin/wishlists
 *   DELETE /shop/admin/wishlists/:user_id
 *
 * Depends on: useUIStore (opens login modal on 401)
 */
export const useWishlistStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  userWishlist: [],
  wishlistNo: 0,

  loadingWishlist: false,
  loadingMutation: false,

  // ── Fetch ──────────────────────────────────────────────────────────────────

  /** GET /shop/wishlist */
  fetchWishlist: async () => {
    set({ loadingWishlist: true });
    try {
      const { data } = await axiosInstance.get("/shop/wishlist");
      const items = data.wishlist_items || data.items || [];
      set({
        userWishlist: items,
        wishlistNo: data.total_items || items.length || 0,
      });
    } catch (err) {
      if (err.response?.status === 404) {
        set({ userWishlist: [], wishlistNo: 0 });
      }
      // Other errors silently ignored — wishlist is non-critical on load
    } finally {
      set({ loadingWishlist: false });
    }
  },

  // ── Mutations ──────────────────────────────────────────────────────────────

  /**
   * POST /shop/wishlist/items
   * Opens login modal on 401 (unauthenticated user).
   */
  addToWishlist: async (productId) => {
    if (!productId) {
      toast.error("Invalid product ID. Please try again.");
      return;
    }
    set({ loadingMutation: true });
    try {
      await axiosInstance.post(`/shop/wishlist/items?product_id=${productId}`);
      toast.success("Product successfully added to wishlist!");
      await get().fetchWishlist();
    } catch (err) {
      if (err.response?.status === 401) {
        useUIStore.getState().openModal("login");
      } else {
        const msg =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to add product to wishlist. Please try again.";
        toast.error(msg);
      }
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** DELETE /shop/wishlist/items/:id */
  removeWishlistItem: async (itemId) => {
    if (!itemId) {
      toast.error("Invalid wishlist item ID. Please try again.");
      return;
    }
    set({ loadingMutation: true });
    try {
      await axiosInstance.delete(`/shop/wishlist/items/${itemId}`);
      toast.success("Wishlist item successfully deleted.");
      await get().fetchWishlist();
    } catch (err) {
      const msg =
        err.response?.status === 404
          ? "Wishlist item not found."
          : err.response?.data?.detail ||
            err.response?.data?.message ||
            "Unable to delete the wishlist item.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  // ── Admin actions ──────────────────────────────────────────────────────────

  /** GET /shop/admin/wishlists */
  fetchAllWishlists: async () => {
    set({ loadingWishlist: true });
    try {
      const { data } = await axiosInstance.get("/shop/admin/wishlists");
      return data || [];
    } catch {
      toast.error("Failed to load all wishlists.");
      return [];
    } finally {
      set({ loadingWishlist: false });
    }
  },

  /** DELETE /shop/admin/wishlists/:user_id */
  adminDeleteWishlist: async (userId) => {
    set({ loadingMutation: true });
    try {
      await axiosInstance.delete(`/shop/admin/wishlists/${userId}`);
      toast.success("User wishlist deleted.");
    } catch (err) {
      const msg =
        err.response?.status === 404
          ? "Wishlist not found."
          : err.response?.data?.detail || "Failed to delete wishlist.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },
}));
