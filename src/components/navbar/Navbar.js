"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Heart, Menu, ShoppingBag, User, X } from "lucide-react";
import { SearchTwo } from "../inputs/SearchInputs";
import Modal from "../Modal/Modal";
import { Textinput } from "../inputs/Textinput";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Dropdown from "../inputs/DynamicDropdown";
import {
  useAuthStore,
  useCartStore,
  useCategoryStore,
  useNotificationStore,
  useUIStore,
  useWishlistStore,
} from "@/stores";
import NotificationBell from "@/app/notifications/components/NotificationBell";

const Navbar = () => {
  const {
    userFirstName,
    userId,
    isAdmin, // ✅ Import isAdmin from store
    login,
    signUp,
    forgotPassword,
    adminLogin,
    loadingAuth,
  } = useAuthStore();
  const { userCart } = useCartStore();
  const {
    notifications,
    unreadCount,
    loading,
    totalCount,
    fetchUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchUnreadCount,
  } = useNotificationStore();
  const { categories } = useCategoryStore();
  const { userWishlist } = useWishlistStore();
  const { modalType, modal, openModal, closeModal } = useUIStore();
  const router = useRouter();

  // ── UI state ──────────────────────────────────────────────────────────────
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ── Modal form state ──────────────────────────────────────────────────────
  const [rememberMe, setRememberMe] = useState(false);

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign up
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Forgot password
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  // Admin
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // Search
  const [searchTwo, setSearchTwo] = useState("");

  // ✅ Fetch unread count when user logs in
  useEffect(() => {
    if (userId) {
      fetchUnreadCount(userId);
    }
  }, [userId, fetchUnreadCount]);

  // FIX: helper to close mobile menu on navigation
  const closeMobileMenu = () => setIsDropdownOpen(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // fetchProducts({ name: searchTwo });
  };

  const handleCategorySelect = (selected) => {
    router.push(`/category/${selected}`.replace(" ", "-").toLowerCase());
  };

  // ✅ Handle fetch notifications for the bell
  const handleFetchNotifications = useCallback(
    (page = 1, perPage = 10) => {
      if (userId) {
        fetchUserNotifications(userId, {
          page,
          perPage,
        });
      }
    },
    [userId, fetchUserNotifications],
  );

  // ✅ Handle mark as read
  const handleMarkAsRead = useCallback(
    (notificationId) => {
      if (userId) {
        markAsRead(notificationId, userId);
      }
    },
    [userId, markAsRead],
  );

  // ✅ Handle mark all as read
  const handleMarkAllAsRead = useCallback(() => {
    if (userId) {
      markAllAsRead(userId);
    }
  }, [userId, markAllAsRead]);

  // ✅ Handle delete notification
  const handleDeleteNotification = useCallback(
    (notificationId) => {
      if (userId) {
        deleteNotification(notificationId, userId);
      }
    },
    [userId, deleteNotification],
  );

  // ✅ Handle load more
  const handleLoadMore = useCallback(
    (page, perPage) => {
      if (userId) {
        fetchUserNotifications(userId, {
          page,
          perPage,
        });
      }
    },
    [userId, fetchUserNotifications],
  );

  // ── Auth handlers ─────────────────────────────────────────────────────────

  const loginForm = async (e) => {
    e.preventDefault();
    const result = await login(loginEmail, loginPassword);
    if (result) {
      setLoginEmail("");
      setLoginPassword("");
      closeModal();

      // ✅ Check if user is admin and show admin choice modal
      if (result.user?.is_admin) {
        openModal("adminChoice");
      }
    }
  };

  const signUpForm = async (e) => {
    e.preventDefault();
    const success = await signUp(
      signUpEmail,
      signUpPassword,
      confirmPassword,
      firstName,
      lastName,
    );
    if (success) {
      setFirstName("");
      setLastName("");
      setSignUpEmail("");
      setSignUpPassword("");
      setConfirmPassword("");
      closeModal();
    }
  };

  const forgotPasswordForm = async (e) => {
    e.preventDefault();
    const success = await forgotPassword(forgotPasswordEmail);
    if (success) {
      setForgotPasswordEmail("");
      closeModal();
    }
  };

  const adminForm = async (e) => {
    e.preventDefault();
    const result = await adminLogin(adminEmail, adminPassword);
    if (result) {
      setAdminEmail("");
      setAdminPassword("");
      closeModal();
      router.push(`/admin/${userFirstName}/customers`);
    }
  };

  // ✅ Admin choice handler
  const handleGoToAdmin = () => {
    closeModal();
    router.push(`/admin/${userFirstName}/customers`);
  };

  // ── Modal config helpers ──────────────────────────────────────────────────

  const getModalConfig = () => {
    switch (modalType) {
      case "login":
        return {
          title: "Login",
          submit: loginForm,
          buttonLabel: "Login",
          subChildren: (
            <span className="text-center gap-x-2 items-center justify-center flex text-sm">
              <p>Don&apos;t have an account?</p>
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => openModal("signup")}
              >
                Sign up
              </span>
            </span>
          ),
          children: (
            <>
              <Textinput
                id="loginEmail"
                label="Email"
                className="border-b"
                type="email"
                value={loginEmail}
                changed={(e) => setLoginEmail(e.target.value)}
              />
              <Textinput
                id="loginPassword"
                label="Password"
                className="border-b my-5"
                type="password"
                value={loginPassword}
                changed={(e) => setLoginPassword(e.target.value)}
              />
              <span className="w-full flex justify-between text-xs">
                <label className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe((r) => !r)}
                    className="accent-blue-600"
                  />
                  Remember Me
                </label>
                <span
                  onClick={() => openModal("forgotPassword")}
                  className="cursor-pointer text-blue-600"
                >
                  Forgot password?
                </span>
              </span>
            </>
          ),
        };

      case "signup":
        return {
          title: "Sign Up",
          submit: signUpForm,
          buttonLabel: "Sign Up",
          subChildren: (
            <span className="w-full justify-center items-center text-sm flex gap-x-2">
              <p>Already have an account?</p>
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => openModal("login")}
              >
                Log in
              </span>
            </span>
          ),
          children: (
            <>
              <Textinput
                id="firstName"
                label="First Name"
                className="border-b my-5"
                type="text"
                value={firstName}
                changed={(e) => setFirstName(e.target.value)}
              />
              <Textinput
                id="lastName"
                label="Last Name"
                className="border-b my-5"
                type="text"
                value={lastName}
                changed={(e) => setLastName(e.target.value)}
              />
              <Textinput
                id="signUpEmail"
                label="Email"
                className="border-b my-5"
                type="email"
                value={signUpEmail}
                changed={(e) => setSignUpEmail(e.target.value)}
              />
              <Textinput
                id="signUpPassword"
                label="Password"
                className="border-b my-5"
                type="password"
                value={signUpPassword}
                changed={(e) => setSignUpPassword(e.target.value)}
              />
              <Textinput
                id="confirmPassword"
                label="Confirm Password"
                className="border-b my-5"
                type="password"
                value={confirmPassword}
                changed={(e) => setConfirmPassword(e.target.value)}
              />
            </>
          ),
        };

      case "forgotPassword":
        return {
          title: "Forgot Password?",
          submit: forgotPasswordForm,
          buttonLabel: "Send Reset Link",
          subChildren: (
            <span className="w-full justify-center items-center text-sm flex gap-x-2">
              <p>Remember your password?</p>
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => openModal("login")}
              >
                Log in
              </span>
            </span>
          ),
          children: (
            <>
              <p className="text-sm mb-2">
                Enter the email linked to your account.
              </p>
              <Textinput
                id="forgotPasswordEmail"
                label="Email"
                className="border-b my-5"
                type="email"
                value={forgotPasswordEmail}
                changed={(e) => setForgotPasswordEmail(e.target.value)}
              />
            </>
          ),
        };

      case "admin":
        return {
          title: "Admin Login",
          submit: adminForm,
          buttonLabel: "Login",
          subChildren: null,
          children: (
            <>
              <Textinput
                id="adminEmail"
                label="Email"
                className="border-b"
                type="email"
                value={adminEmail}
                changed={(e) => setAdminEmail(e.target.value)}
              />
              <Textinput
                id="adminPassword"
                label="Password"
                className="border-b my-5"
                type="password"
                value={adminPassword}
                changed={(e) => setAdminPassword(e.target.value)}
              />
            </>
          ),
        };

      // ✅ New admin choice modal type
      case "adminChoice":
        return {
          title: "Admin Access",
          submit: handleGoToAdmin,
          buttonLabel: "Go to Admin Dashboard",
          subChildren: (
            <div className="w-full flex justify-center mt-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  closeModal();
                }}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Stay as User
              </button>
            </div>
          ),
          children: (
            <p className="text-gray-600">
              You have admin privileges. Would you like to go to the admin
              dashboard or continue as a regular user?
            </p>
          ),
        };

      default:
        return {
          title: "Login",
          submit: loginForm,
          buttonLabel: "Login",
          subChildren: null,
          children: null,
        };
    }
  };

  const modalConfig = getModalConfig();

  // ── Shared nav sections ───────────────────────────────────────────────────

  const CategoryDropdown = (
    <Dropdown
      options={categories}
      onSelect={handleCategorySelect}
      tag="category"
      placeholder="Categories"
      valueKey="name"
      displayKey="name"
      divClassName="border-b py-1 px-2 cursor-pointer"
      emptyMessage="No categories available"
    />
  );

  const UserAvatar = userFirstName ? (
    <Link href={`/profile/${userFirstName}`}>
      <strong>{userFirstName.charAt(0).toUpperCase()}</strong>
    </Link>
  ) : (
    <User
      size={25}
      className="translate-y-1 cursor-pointer"
      onClick={() => openModal("login")}
    />
  );

  const CartLink = (
    <Link
      href="/cart"
      className="cursor-pointer py-2 flex items-center relative gap-x-2"
    >
      <ShoppingBag size={25} />
      {userCart.length > 0 && (
        <span className="absolute bottom-0 -right-3 w-5 h-5 bg-[var(--error-500)] text-[var(--text-inverse)] text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[var(--bg-primary)]">
          {userCart.length > 9 ? "9+" : userCart.length}
        </span>
      )}
    </Link>
  );

  const WishlistLink = (
    <Link
      href="/wishlist"
      className="cursor-pointer relative py-2 flex items-center gap-x-2"
    >
      <Heart size={25} />
      {userWishlist.length > 0 && (
        <span className="absolute bottom-0 -right-3 w-5 h-5 bg-[var(--error-500)] text-[var(--text-inverse)] text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[var(--bg-primary)]">
          {userWishlist.length > 9 ? "9+" : userWishlist.length}
        </span>
      )}
    </Link>
  );

  // Admin button (only shown for admin users)
  const AdminButton = isAdmin ? (
    <button
      onClick={() => router.push(`/admin/${userFirstName}/customers`)}
      className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
    >
      Admin
    </button>
  ) : null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <nav className="fixed top-0 w-full py-5 flex items-center justify-center backdrop-blur-lg z-50">
        {/* Desktop */}
        <div className="w-[80%] mx-auto hidden md:flex flex-row items-center justify-between">
          <section className="flex flex-row justify-evenly items-center gap-x-5">
            <Link href="/" className="cursor-pointer font-bold text-xl">
              Logo
            </Link>
            <Link href="/" className="cursor-pointer">
              All
            </Link>
            {CategoryDropdown}
            {AdminButton} {/* ✅ Show admin button for admin users */}
          </section>

          <section className="flex flex-row justify-evenly items-center gap-x-5">
            {/* <SearchTwo
              searchTwo={searchTwo}
              onChange={(e) => setSearchTwo(e.target.value)}
              handleSubmit={handleSearchSubmit}
            /> */}
            <span className="rounded-full text-2xl h-10 w-10 flex items-center justify-center cursor-pointer">
              {UserAvatar}
            </span>
            {CartLink}
            {WishlistLink}
            {userId && (
              <NotificationBell
                notifications={notifications}
                unreadCount={unreadCount}
                loading={loading}
                totalCount={totalCount}
                onFetchNotifications={handleFetchNotifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onDelete={handleDeleteNotification}
                onLoadMore={handleLoadMore}
                userId={userId}
              />
            )}
          </section>
        </div>

        {/* Mobile toggle */}
        <div className="w-[80%] mx-auto flex md:hidden flex-row items-center justify-between relative">
          <Link href="/" className="cursor-pointer font-bold text-xl">
            Logo
          </Link>
          <span
            onClick={() => setIsDropdownOpen((o) => !o)}
            className="cursor-pointer"
          >
            {isDropdownOpen ? <X /> : <Menu />}
          </span>
        </div>

        {/* Mobile menu */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 w-full card border-t shadow-lg md:hidden h-auto">
            <div className="flex flex-col px-5 py-4">
              {/* <div className="flex items-end w-full gap-x-4">
                {CategoryDropdown}
                <SearchTwo
                  searchTwo={searchTwo}
                  onChange={(e) => setSearchTwo(e.target.value)}
                  handleSubmit={handleSearchSubmit}
                />
              </div> */}
              <span>
                {userFirstName ? (
                  <Link
                    href={`/profile/${userFirstName}`}
                    className="flex items-end"
                    onClick={closeMobileMenu}
                  >
                    <strong className="text-2xl">
                      {userFirstName.charAt(0).toUpperCase()}
                    </strong>
                    <p>{userFirstName.slice(1)}</p>
                  </Link>
                ) : (
                  <span
                    onClick={() => openModal("login")}
                    className="flex gap-x-2 cursor-pointer"
                  >
                    <User size={15} className="translate-y-1" />
                    <p>Profile</p>
                  </span>
                )}
              </span>
              <Link
                href="/cart"
                className="cursor-pointer py-2 flex items-center gap-x-2"
                onClick={closeMobileMenu}
              >
                <ShoppingBag size={15} /> Cart
                {userCart.length > 0 && (
                  <span>{userCart.length > 9 ? "9+" : userCart.length}</span>
                )}
              </Link>
              <Link
                href="/wishlist"
                className="cursor-pointer relative py-2 flex items-center gap-x-2"
                onClick={closeMobileMenu}
              >
                <Heart size={15} /> Wishlist
                {userWishlist.length > 0 && (
                  <span>
                    {userWishlist.length > 9 ? "9+" : userWishlist.length}
                  </span>
                )}
              </Link>
              {isAdmin && (
                <button
                  onClick={() => {
                    closeMobileMenu();
                    router.push(`/admin/${userFirstName}/customers`);
                  }}
                  className="cursor-pointer py-2 flex items-center gap-x-2 text-blue-600"
                >
                  Admin Dashboard
                </button>
              )}
              {userId && (
                <NotificationBell
                  notifications={notifications}
                  unreadCount={unreadCount}
                  loading={loading}
                  totalCount={totalCount}
                  onFetchNotifications={handleFetchNotifications}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onDelete={handleDeleteNotification}
                  onLoadMore={handleLoadMore}
                  userId={userId}
                />
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Unified Modal for all auth and admin choice flows */}
      <Modal
        Loading={loadingAuth}
        disabled={loadingAuth}
        title={modalConfig.title}
        isOpen={modal}
        onClose={closeModal}
        onSubmit={modalConfig.submit}
        buttonValue={modalConfig.buttonLabel}
        subChildren={modalConfig.subChildren}
      >
        {modalConfig.children}
      </Modal>
    </>
  );
};

export default Navbar;
