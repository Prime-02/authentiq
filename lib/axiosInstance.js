import axios from "axios";
import { toast } from "react-toastify";

const ENV = process.env.NEXT_PUBLIC_ENVIRONMENT || "production";
const BASE_URL =
  ENV === "development"
    ? process.env.NEXT_PUBLIC_BASE_URL_LOCAL
    : process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// ─── Public route definitions ────────────────────────────────────────────────
// Each entry is either a plain string (exact match) or a RegExp (pattern match).
// These map to the FastAPI /shop router — all paths include the /shop prefix.
const PUBLIC_ROUTES = [
  // Auth
  "/auth/login",
  "/auth/signup",
  "/auth/register",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",

  // Shop — exact
  // "/shop/products",
  // "/shop/categories",

  // Shop — dynamic (regex)
  /^\/shop\/products\/[^/]+$/, // GET /shop/products/:id
  /^\/shop\/categories\/[^/]+$/, // GET /shop/categories/:id

  // Reviews (public read)
  /^\/shop\/reviews\/products\/[^/]+$/, // GET reviews for a product
  /^\/shop\/reviews\/products\/[^/]+\/rating$/, // GET average rating

  // Misc
  "/health",
];

const isPublicRoute = (url) => {
  if (!url) return false;
  const path = url.split("?")[0]; // strip query string
  return PUBLIC_ROUTES.some((rule) =>
    rule instanceof RegExp ? rule.test(path) : rule === path,
  );
};

const isAuthRoute = (url) =>
  Boolean(url) &&
  [
    "/auth/login",
    "/auth/signup",
    "/auth/register",
    "/auth/refresh",
    "/auth/logout",
  ].some((r) => url.includes(r));

// ─── Axios instance ──────────────────────────────────────────────────────────

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  headers: { "X-Api-Key": API_KEY },
});

// ─── Token helpers ───────────────────────────────────────────────────────────

const KEYS = {
  SESSION: "session_token",
  REFRESH: "refresh_token",
  EXPIRES: "token_expires_at",
};

const setTokens = ({ session_token, refresh_token, expires_at } = {}) => {
  if (session_token) localStorage.setItem(KEYS.SESSION, session_token);
  if (refresh_token) localStorage.setItem(KEYS.REFRESH, refresh_token);
  if (expires_at) localStorage.setItem(KEYS.EXPIRES, expires_at);
};
const getSession = () => localStorage.getItem(KEYS.SESSION);
const getRefresh = () => localStorage.getItem(KEYS.REFRESH);
const clearTokens = () =>
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));

const isTokenExpired = () => {
  const exp = localStorage.getItem(KEYS.EXPIRES);
  if (!exp) return true;
  return new Date(exp).getTime() - 5 * 60 * 1000 <= Date.now();
};

// ─── Token refresh (singleton promise) ──────────────────────────────────────

let refreshPromise = null;

const refreshSession = async () => {
  const refresh_token = getRefresh();
  if (!refresh_token) throw new Error("No refresh token");

  const { data } = await axios.post(
    `${BASE_URL}/auth/refresh`,
    { refresh_token },
    { headers: { "Content-Type": "application/json" } },
  );

  if (!data?.tokens) throw new Error("Invalid refresh response");
  setTokens(data.tokens);
  return data.tokens.session_token;
};

const ensureFreshToken = () => {
  if (!refreshPromise) {
    refreshPromise = refreshSession().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

// ─── Request interceptor ─────────────────────────────────────────────────────

axiosInstance.interceptors.request.use(async (config) => {
  // Normalise URL — strip accidental base-URL prefix
  if (config.url?.startsWith(BASE_URL)) {
    config.url = config.url.slice(BASE_URL.length);
    if (!config.url.startsWith("/")) config.url = `/${config.url}`;
  }

  const { url } = config;

  // Public routes: no token needed, return immediately
  if (isPublicRoute(url)) return config;

  // Refresh endpoint itself: skip token logic
  if (url?.includes("/auth/refresh")) return config;

  // Proactively refresh if token is stale (skip on auth routes)
  const hasRefreshToken = Boolean(getRefresh());

  if (hasRefreshToken && isTokenExpired() && !isAuthRoute(url)) {
    try {
      await ensureFreshToken();
    } catch {
      clearTokens();
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = "/";
      }
      return Promise.reject(new Error("Session expired"));
    }
  }

  const token = getSession();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

// ─── Response interceptor ────────────────────────────────────────────────────

axiosInstance.interceptors.response.use(
  (response) => {
    const { url } = response.config;

    // Persist tokens on successful auth
    if (
      ["/auth/login", "/auth/signup", "/auth/register"].some((r) =>
        url?.includes(r),
      )
    ) {
      if (response.data?.tokens) setTokens(response.data.tokens);
    }

    // Clear tokens on logout
    if (url?.includes("/auth/logout")) clearTokens();

    return response;
  },

  async (error) => {
    const config = error.config || {};
    const url = config.url || "";
    const status = error.response?.status;
    const isPublic = isPublicRoute(url);

    // ── Logout: always clear and propagate ──────────────────────────────────
    if (url.includes("/auth/logout")) {
      clearTokens();
      return Promise.reject(error);
    }

    // ── 401 on a protected route: attempt one token refresh + retry ─────────
    if (
      status === 401 &&
      !isPublic &&
      !url.includes("/auth/refresh") &&
      !config._retried
    ) {
      config._retried = true;
      try {
        await ensureFreshToken();
        const token = getSession();
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(config);
      } catch {
        clearTokens();
        if (typeof window !== "undefined" && window.location.pathname !== "/") {
          window.location.href = "/";
        }
        return Promise.reject(error);
      }
    }

    // ── Toast notifications ─────────────────────────────────────────────────
    // Suppress toasts for public-route errors and silent status codes (401, 404)
    const silent = isPublic || status === 401 || status === 404;

    if (!silent) {
      const message = extractMessage(error);
      if (status === 429) {
        toast.error("Too many requests. Please try again later.");
      } else if (status === 403) {
        toast.error("You don't have permission to perform this action.");
      } else if (status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(message);
      }
    }

    return Promise.reject(error);
  },
);

// ─── Error message extraction ────────────────────────────────────────────────

function extractMessage(error) {
  if (!error.response) {
    return error.message?.includes("Network")
      ? "No response from server. Check your connection."
      : error.message || "An unexpected error occurred.";
  }

  const data = error.response.data;
  if (typeof data === "string") return data;
  if (data?.detail) return data.detail;
  if (data?.message) return data.message;

  // Flatten any nested string values (e.g. validation error dicts)
  const messages = [];
  const collect = (obj) => {
    if (!obj || typeof obj !== "object") return;
    Object.values(obj).forEach((v) => {
      if (typeof v === "string") messages.push(v);
      else if (Array.isArray(v))
        messages.push(...v.filter((i) => typeof i === "string"));
      else collect(v);
    });
  };
  collect(data);
  return messages.length
    ? messages.join(", ")
    : "An error occurred. Please contact support if this persists.";
}

// ─── Public exports ──────────────────────────────────────────────────────────

export const storeAuthTokens = setTokens;
export const clearAuth = clearTokens;
export const getAuthToken = getSession;
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  const token = getSession();
  if (!token) return false;
  return !isTokenExpired();
};

/** Dynamically add a route to the public bypass list. */
export const addPublicRoute = (route) => {
  if (!PUBLIC_ROUTES.includes(route)) PUBLIC_ROUTES.push(route);
};
export const removePublicRoute = (route) => {
  const i = PUBLIC_ROUTES.indexOf(route);
  if (i > -1) PUBLIC_ROUTES.splice(i, 1);
};

export default axiosInstance;
