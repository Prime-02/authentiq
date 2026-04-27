import { create } from "zustand";
import { toast } from "react-toastify";
import axiosInstance from "../../lib/axiosInstance";
import { useUIStore } from "./useUIStore";

/**
 * useCartStore  [6 / 11]
 * ----------------------
 * Owns: cart items, cart item count, cart mutations.
 *
 * Corresponds to:
 *   GET    /shop/cart
 *   POST   /shop/cart/items
 *   PATCH  /shop/cart/items/:id/quantity
 *   DELETE /shop/cart/items/:id
 *   DELETE /shop/cart/clear
 *   GET    /shop/admin/carts
 *   DELETE /shop/admin/carts/:user_id
 *
 * Depends on: useUIStore (opens login modal on 401)
 */
export const useCartStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  userCart: [],
  userCartNo: 0,

  loadingCart: false,
  loadingMutation: false,

  // ── Fetch ──────────────────────────────────────────────────────────────────

  /** GET /shop/cart */
  fetchCart: async () => {
    set({ loadingCart: true });
    try {
      const { data } = await axiosInstance.get("/shop/cart");
      const items = data.cart_items || data.items || [];
      set({
        userCart: items,
        userCartNo: data.total_items || items.length || 0,
      });
    } catch (err) {
      if (err.response?.status === 404) {
        set({ userCart: [], userCartNo: 0 });
      }
      // Other errors silently ignored — cart is non-critical on load
    } finally {
      set({ loadingCart: false });
    }
  },

  // ── Mutations ──────────────────────────────────────────────────────────────

  /**
   * POST /shop/cart/items
   * Opens login modal on 401 (unauthenticated user).
   */
  addToCart: async (productId, quantity = 1) => {
    if (!productId) {
      toast.error("Invalid product ID. Please try again.");
      return;
    }
    set({ loadingMutation: true });
    try {
      await axiosInstance.post(
        `/shop/cart/items?product_id=${productId}&quantity=${quantity || 1}`,
      );
      toast.success("Product successfully added to cart!");
      await get().fetchCart();
    } catch (err) {
      if (err.response?.status === 401) {
        useUIStore.getState().openModal("login");
      } else {
        const msg =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to add product to cart. Please try again.";
        toast.error(msg);
      }
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** PATCH /shop/cart/items/:id/quantity */
  updateCartItemQuantity: async (itemId, quantity) => {
    set({ loadingMutation: true });
    try {
      const { data } = await axiosInstance.patch(
        `/shop/cart/items/${itemId}/quantity?quantity=${quantity}`,
      );
      await get().fetchCart();
      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to update quantity.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** DELETE /shop/cart/items/:id */
  removeCartItem: async (itemId) => {
    if (!itemId) {
      toast.error("Invalid cart item ID. Please try again.");
      return;
    }
    set({ loadingMutation: true });
    try {
      await axiosInstance.delete(`/shop/cart/items/${itemId}`);
      toast.success("Cart item successfully deleted.");
      await get().fetchCart();
    } catch (err) {
      const msg =
        err.response?.status === 404
          ? "Cart item not found."
          : err.response?.data?.detail ||
            err.response?.data?.message ||
            "Unable to delete the cart item.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  /** DELETE /shop/cart/clear */
  clearCart: async () => {
    set({ loadingMutation: true });
    try {
      await axiosInstance.delete("/shop/cart/clear");
      set({ userCart: [], userCartNo: 0 });
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to clear cart.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },

  // ── Admin actions ──────────────────────────────────────────────────────────

  /** GET /shop/admin/carts */
  fetchAllCarts: async () => {
    set({ loadingCart: true });
    try {
      const { data } = await axiosInstance.get("/shop/admin/carts");
      return data || [];
    } catch {
      toast.error("Failed to load all carts.");
      return [];
    } finally {
      set({ loadingCart: false });
    }
  },

  /** DELETE /shop/admin/carts/:user_id */
  adminDeleteCart: async (userId) => {
    set({ loadingMutation: true });
    try {
      await axiosInstance.delete(`/shop/admin/carts/${userId}`);
      toast.success("User cart deleted.");
    } catch (err) {
      const msg =
        err.response?.status === 404
          ? "Cart not found."
          : err.response?.data?.detail || "Failed to delete cart.";
      toast.error(msg);
    } finally {
      set({ loadingMutation: false });
    }
  },
}));
