import { create } from "zustand";
import { toast } from "react-toastify";
import axiosInstance, {
  clearAuth,
  isAuthenticated,
  storeAuthTokens,
} from "../../lib/axiosInstance";
import { useCartStore } from "./useCartStore";
import { useWishlistStore } from "./useWishlistStore";

/**
 * useAuthStore
 * ----------------------
 * Owns: user identity, admin identity, session helpers, auth operations.
 *
 * Corresponds to:  GET /auth/me, POST /auth/login, POST /auth/register,
 *                  POST /auth/logout, POST /auth/logout-all,
 *                  POST /auth/refresh, PATCH /auth/me,
 *                  POST /auth/change-password,
 *                  POST /auth/forgot-password
 *                  GET  /admin/users, GET  /admin/users/stats,
 *                  GET  /admin/users/:id, PATCH /admin/users/:id,
 *                  DELETE /admin/users/:id,
 *                  POST /admin/users/:id/reset-password,
 *                  POST /admin/users/:id/revoke-sessions
 *
 * No dependency on other stores for core functionality,
 * but coordinates with cart/wishlist stores after auth.
 */
export const useAuthStore = create((set, get) => ({
  // ── User state ─────────────────────────────────────────────────────────────
  userId: "",
  userFirstName: "",
  userLastName: "",
  userEmail: "",
  userGender: "",
  userPhone: "",
  userLocation: "",
  userShippingAddress: "",
  userCountry: "",
  userStreetAddress: "",
  userCity: "",
  userState: "",
  userZipCode: "",
  userDateJoined: "",
  userLastLogin: "",
  userCreatedAt: "",
  userUpdatedAt: "",
  isActive: true,
  isAdmin: false,

  // ── Admin state ────────────────────────────────────────────────────────────
  adminId: "",
  adminFirstName: "",
  adminLastName: "",
  adminEmail: "",
  adminGender: "",
  adminPhone: "",
  adminLocation: "",
  adminShippingAddress: "",
  adminCountry: "",
  adminStreetAddress: "",
  adminCity: "",
  adminState: "",
  adminZipCode: "",

  // ── Admin user-management state ────────────────────────────────────────────
  adminUsers: [],
  adminUserStats: null,
  loadingAdminUsers: false,
  loadingAdminUserStats: false,

  // ── Loading ────────────────────────────────────────────────────────────────
  loadingUser: false,
  loadingAdmin: false,
  loadingAuth: false,

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Reset all in-memory user/admin state on sign-out so stale
   * data isn't visible if a different user logs in during the same session.
   */
  signOut: () => {
    clearAuth();
    set({
      userId: "",
      userFirstName: "",
      userLastName: "",
      userEmail: "",
      userGender: "",
      userPhone: "",
      userLocation: "",
      userShippingAddress: "",
      userCountry: "",
      userStreetAddress: "",
      userCity: "",
      userState: "",
      userZipCode: "",
      userDateJoined: "",
      userLastLogin: "",
      userCreatedAt: "",
      userUpdatedAt: "",
      isActive: true,
      isAdmin: false,
      adminId: "",
      adminFirstName: "",
      adminLastName: "",
      adminEmail: "",
      adminGender: "",
      adminPhone: "",
      adminLocation: "",
      adminShippingAddress: "",
      adminCountry: "",
      adminStreetAddress: "",
      adminCity: "",
      adminState: "",
      adminZipCode: "",
      adminUsers: [],
      adminUserStats: null,
    });
  },

  /**
   * Fetch the authenticated user's profile.
   * axiosInstance handles 401 refresh + redirect automatically;
   * any error reaching here is non-auth (network, 5xx, etc.).
   */
  fetchUserData: async () => {
    if (!isAuthenticated()) return;

    set({ loadingUser: true });
    try {
      const { data } = await axiosInstance.get("/auth/me");
      set({
        userId: data.id || "",
        userFirstName: data.firstname || "",
        userLastName: data.lastname || "",
        userEmail: data.email || "",
        userGender: data.gender || "",
        userPhone: data.phone_number || "",
        userLocation: data.location || "",
        userShippingAddress: data.shipping_address || "",
        userCountry: data.country || "",
        userStreetAddress: data.street_address || "",
        userCity: data.city || "",
        userState: data.state || "",
        userZipCode: data.zip_code || "",
        userDateJoined: data.date_joined || "",
        userLastLogin: data.last_login || "",
        userCreatedAt: data.created_at || "",
        userUpdatedAt: data.updated_at || "",
        isActive: data.is_active ?? true,
        isAdmin: data.is_admin ?? false,
      });
    } catch {
      // Non-auth errors silently ignored; axiosInstance handles 401
    } finally {
      set({ loadingUser: false });
    }
  },

  /**
   * Fetch admin profile fields.
   * Uses the same /auth/me endpoint but populates admin-specific state.
   */
  fetchAdminData: async () => {
    set({ loadingAdmin: true });
    try {
      const { data } = await axiosInstance.get("/auth/me");
      if (!data.is_admin) {
        toast.error("This account does not have admin privileges.");  
        return;
      }
      set({
        adminId: data.id || "",
        adminFirstName: data.firstname || "",
        adminLastName: data.lastname || "",
        adminEmail: data.email || "",
        adminGender: data.gender || "",
        adminPhone: data.phone_number || "",
        adminLocation: data.location || "",
        adminShippingAddress: data.shipping_address || "",
        adminCountry: data.country || "",
        adminStreetAddress: data.street_address || "",
        adminCity: data.city || "",
        adminState: data.state || "",
        adminZipCode: data.zip_code || "",
      });
    } catch {
      toast.error("Unable to load admin data. Please try again.");
    } finally {
      set({ loadingAdmin: false });
    }
  },

  // ── Auth Operations ────────────────────────────────────────────────────────

  /**
   * Login with email and password.
   * Returns success status so the caller can handle UI (close modals, etc.).
   */
  login: async (email, password) => {
    set({ loadingAuth: true });
    try {
      const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      storeAuthTokens(data.tokens);

      toast.success(
        `Welcome back${data.user?.firstname ? `, ${data.user.firstname}` : ""}!`,
      );

      await Promise.all([
        get().fetchUserData(),
        useCartStore.getState().fetchCart(),
        useWishlistStore.getState().fetchWishlist(),
      ]);

      return true;
    } catch (err) {
      const msg =
        err.response?.status === 401
          ? "Incorrect email or password."
          : err.response?.data?.detail ||
            err.response?.data?.message ||
            "Login failed. Please check your connection and try again.";
      toast.error(msg);
      return false;
    } finally {
      set({ loadingAuth: false });
    }
  },

  /**
   * Register a new user account.
   * Now includes phone_number and gender fields.
   * Returns success status so the caller can handle UI (close modals, etc.).
   */
  signUp: async (
    email,
    password,
    confirmPassword,
    firstname,
    lastname,
    phoneNumber = null,
    gender = null,
  ) => {
    // Client-side mirror of the backend's password_strength validator.
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter.");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain at least one lowercase letter.");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      toast.error("Password must contain at least one digit.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    set({ loadingAuth: true });
    try {
      const { data } = await axiosInstance.post("/auth/register", {
        email,
        password,
        firstname,
        lastname,
        phone_number: phoneNumber,
        gender: gender,
      });

      storeAuthTokens(data.tokens);

      toast.success("Account created! Welcome aboard.");

      await Promise.all([
        get().fetchUserData(),
        useCartStore.getState().fetchCart(),
        useWishlistStore.getState().fetchWishlist(),
      ]);

      return true;
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(msg);
      return false;
    } finally {
      set({ loadingAuth: false });
    }
  },

  /**
   * Logout the current session on the server, then clear local state.
   */
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // Best-effort — proceed with local cleanup regardless
    } finally {
      get().signOut();
    }
  },

  /**
   * Logout from ALL devices.
   */
  logoutAllDevices: async () => {
    set({ loadingAuth: true });
    try {
      const { data } = await axiosInstance.post("/auth/logout-all");
      toast.success(data.message || "Logged out from all devices.");
      get().signOut();
      return true;
    } catch {
      toast.error("Unable to log out from all devices. Please try again.");
      return false;
    } finally {
      set({ loadingAuth: false });
    }
  },

  /**
   * Refresh the session token using the stored refresh token.
   */
  refreshToken: async (refreshToken) => {
    try {
      const { data } = await axiosInstance.post("/auth/refresh", {
        refresh_token: refreshToken,
      });
      storeAuthTokens(data.tokens);
      return data.tokens;
    } catch {
      // Expired / invalid refresh token — force sign-out
      get().signOut();
      return null;
    }
  },

  /**
   * Update the current user's profile.
   * Now supports all fields: name, contact info, location, address.
   * Calls PATCH /auth/me — returns the updated UserResponse.
   */
  updateProfile: async ({
    firstname,
    lastname,
    phoneNumber,
    gender,
    location,
    country,
    shippingAddress,
    streetAddress,
    city,
    state,
    zipCode,
  }) => {
    set({ loadingUser: true });
    try {
      const payload = {};

      // Only include fields that are explicitly provided (not undefined)
      if (firstname !== undefined) payload.firstname = firstname;
      if (lastname !== undefined) payload.lastname = lastname;
      if (phoneNumber !== undefined) payload.phone_number = phoneNumber;
      if (gender !== undefined) payload.gender = gender;
      if (location !== undefined) payload.location = location;
      if (country !== undefined) payload.country = country;
      if (shippingAddress !== undefined)
        payload.shipping_address = shippingAddress;
      if (streetAddress !== undefined) payload.street_address = streetAddress;
      if (city !== undefined) payload.city = city;
      if (state !== undefined) payload.state = state;
      if (zipCode !== undefined) payload.zip_code = zipCode;

      const { data } = await axiosInstance.patch("/auth/me", payload);

      // Update all relevant store fields
      set({
        userFirstName: data.firstname || "",
        userLastName: data.lastname || "",
        userPhone: data.phone_number || "",
        userGender: data.gender || "",
        userLocation: data.location || "",
        userShippingAddress: data.shipping_address || "",
        userCountry: data.country || "",
        userStreetAddress: data.street_address || "",
        userCity: data.city || "",
        userState: data.state || "",
        userZipCode: data.zip_code || "",
      });

      toast.success("Profile updated successfully.");
      return true;
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Unable to update profile. Please try again.";
      toast.error(msg);
      return false;
    } finally {
      set({ loadingUser: false });
    }
  },

  /**
   * Change the current user's password.
   */
  changePassword: async (oldPassword, newPassword, confirmNewPassword) => {
    if (!/[A-Z]/.test(newPassword)) {
      toast.error("New password must contain at least one uppercase letter.");
      return false;
    }
    if (!/[a-z]/.test(newPassword)) {
      toast.error("New password must contain at least one lowercase letter.");
      return false;
    }
    if (!/[0-9]/.test(newPassword)) {
      toast.error("New password must contain at least one digit.");
      return false;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    set({ loadingAuth: true });
    try {
      const { data } = await axiosInstance.post("/auth/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      toast.success(
        data.message ||
          "Password changed. Please log in again on your other devices.",
      );
      return true;
    } catch (err) {
      return false;
    } finally {
      set({ loadingAuth: false });
    }
  },

  /**
   * Send password reset email.
   * NOTE: This endpoint (POST /auth/forgot-password) doesn't exist in the
   * current backend API. This is a placeholder for future implementation.
   */
  forgotPassword: async (email) => {
    set({ loadingAuth: true });
    try {
      // NOTE: Endpoint not yet implemented in backend
      // await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("If that email exists, a reset link has been sent.");
      return true;
    } catch {
      toast.error("Unable to send reset email. Please try again.");
      return false;
    } finally {
      set({ loadingAuth: false });
    }
  },

  /**
   * Admin login - verifies admin privileges and sets up admin session.
   */
  adminLogin: async (email, password) => {
    set({ loadingAuth: true });
    try {
      const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      if (!data.user?.is_admin) {
        toast.error("This account does not have admin privileges.");
        return false;
      }

      storeAuthTokens(data.tokens);
      toast.success("Welcome, Admin!");

      await Promise.all([get().fetchUserData(), get().fetchAdminData()]);

      return true;
    } catch (err) {
      const msg =
        err.response?.status === 401
          ? "Incorrect email or password."
          : err.response?.data?.detail ||
            err.response?.data?.message ||
            "Admin login failed. Please try again.";
      toast.error(msg);
      return false;
    } finally {
      set({ loadingAuth: false });
    }
  },

  // ── Admin — User Management ────────────────────────────────────────────────

  /**
   * Fetch aggregated user statistics.
   */
  fetchAdminUserStats: async () => {
    if (!get().assertAdmin()) return null;
    set({ loadingAdminUserStats: true });
    try {
      const { data } = await axiosInstance.get("/admin/users/stats");
      set({ adminUserStats: data });
      return data;
    } catch {
      toast.error("Unable to load user statistics. Please try again.");
      return null;
    } finally {
      set({ loadingAdminUserStats: false });
    }
  },

  /**
   * Fetch a paginated / filtered list of all users.
   *
   * @param {object} [params]
   * @param {number} [params.skip=0]
   * @param {number} [params.limit=100]
   * @param {boolean|null} [params.isActive]
   * @param {string} [params.search] - searches email, firstname, lastname, phone
   */
  fetchAdminUsers: async ({ skip = 0, limit = 100, isActive, search } = {}) => {
    if (!get().assertAdmin()) return null;
    set({ loadingAdminUsers: true });
    try {
      const params = { skip, limit };
      if (isActive !== undefined && isActive !== null)
        params.is_active = isActive;
      if (search) params.search = search;

      const { data } = await axiosInstance.get("/admin/users/", { params });
      set({ adminUsers: data });
      return data;
    } catch {
      toast.error("Unable to load users. Please try again.");
      return null;
    } finally {
      set({ loadingAdminUsers: false });
    }
  },

  /**
   * Fetch a single user by ID.
   */
  fetchAdminUserById: async (userId) => {
    if (!get().assertAdmin()) return null;
    try {
      const { data } = await axiosInstance.get(`/admin/users/${userId}`);
      return data;
    } catch (err) {
      const msg =
        err.response?.status === 404
          ? "User not found."
          : "Unable to load user. Please try again.";
      toast.error(msg);
      return null;
    }
  },

  /**
   * Update a user's details as admin.
   * Now supports all user fields including location/address.
   *
   * @param {string} userId
   * @param {object} updates - accepts all user fields
   */
  adminUpdateUser: async (userId, updates = {}) => {
    if (!get().assertAdmin()) return null;
    try {
      // Map camelCase fields to snake_case for the API
      const payload = {};
      if (updates.email !== undefined) payload.email = updates.email;
      if (updates.firstname !== undefined)
        payload.firstname = updates.firstname;
      if (updates.lastname !== undefined) payload.lastname = updates.lastname;
      if (updates.phoneNumber !== undefined)
        payload.phone_number = updates.phoneNumber;
      if (updates.gender !== undefined) payload.gender = updates.gender;
      if (updates.location !== undefined) payload.location = updates.location;
      if (updates.country !== undefined) payload.country = updates.country;
      if (updates.shippingAddress !== undefined)
        payload.shipping_address = updates.shippingAddress;
      if (updates.streetAddress !== undefined)
        payload.street_address = updates.streetAddress;
      if (updates.city !== undefined) payload.city = updates.city;
      if (updates.state !== undefined) payload.state = updates.state;
      if (updates.zipCode !== undefined) payload.zip_code = updates.zipCode;
      if (updates.isActive !== undefined) payload.is_active = updates.isActive;
      if (updates.isAdmin !== undefined) payload.is_admin = updates.isAdmin;

      const { data } = await axiosInstance.patch(
        `/admin/users/${userId}`,
        payload,
      );

      // Keep local adminUsers list in sync
      set((state) => ({
        adminUsers: state.adminUsers.map((u) => (u.id === userId ? data : u)),
      }));

      toast.success("User updated successfully.");
      return data;
    } catch (err) {
      const msg =
        err.response?.status === 404
          ? "User not found."
          : err.response?.status === 409
            ? "Email is already in use by another account."
            : err.response?.data?.detail ||
              err.response?.data?.message ||
              "Unable to update user. Please try again.";
      toast.error(msg);
      return null;
    }
  },

  /**
   * Reset a user's password as admin.
   */
  adminResetUserPassword: async (userId, newPassword) => {
    if (!get().assertAdmin()) return false;

    if (!/[A-Z]/.test(newPassword)) {
      toast.error("Password must contain at least one uppercase letter.");
      return false;
    }
    if (!/[a-z]/.test(newPassword)) {
      toast.error("Password must contain at least one lowercase letter.");
      return false;
    }
    if (!/[0-9]/.test(newPassword)) {
      toast.error("Password must contain at least one digit.");
      return false;
    }

    try {
      const { data } = await axiosInstance.post(
        `/admin/users/${userId}/reset-password`,
        { new_password: newPassword },
      );
      toast.success(data.message || "Password reset successfully.");
      return true;
    } catch (err) {
      const msg =
        err.response?.status === 404
          ? "User not found."
          : err.response?.data?.detail ||
            err.response?.data?.message ||
            "Unable to reset password. Please try again.";
      toast.error(msg);
      return false;
    }
  },

  /**
   * Revoke all active sessions for a user as admin.
   */
  adminRevokeUserSessions: async (userId) => {
    if (!get().assertAdmin()) return false;
    try {
      const { data } = await axiosInstance.post(
        `/admin/users/${userId}/revoke-sessions`,
      );
      toast.success(data.message || "All sessions revoked.");
      return true;
    } catch (err) {
      const msg =
        err.response?.status === 404
          ? "User not found."
          : "Unable to revoke sessions. Please try again.";
      toast.error(msg);
      return false;
    }
  },

  /**
   * Permanently delete a user as admin.
   */
  adminDeleteUser: async (userId) => {
    if (!get().assertAdmin()) return false;
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);

      set((state) => ({
        adminUsers: state.adminUsers.filter((u) => u.id !== userId),
      }));

      toast.success("User deleted successfully.");
      return true;
    } catch (err) {
      const msg =
        err.response?.status === 404
          ? "User not found."
          : "Unable to delete user. Please try again.";
      toast.error(msg);
      return false;
    }
  },

  // ── Guards ─────────────────────────────────────────────────────────────────

  /**
   * UX-layer admin guard — the server enforces auth independently.
   * Returns true if admin, shows a toast and returns false otherwise.
   */
  assertAdmin: () => {
    if (!get().isAdmin) {
      toast.error("You don't have permission to perform this action.");
      return false;
    }
    return true;
  },
}));
