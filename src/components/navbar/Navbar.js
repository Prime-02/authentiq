"use client";

import React, { useState } from "react";
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
  useUIStore,
  useWishlistStore,
} from "@/stores";

// FIX: removed unused imports — Search, Settings, toast

const Navbar = () => {
  const {
    userFirstName,
    signOut,
    login,
    signUp,
    forgotPassword,
    adminLogin,
    loadingAuth,
  } = useAuthStore();
  const { userCart } = useCartStore();
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

  // FIX: helper to close mobile menu on navigation
  const closeMobileMenu = () => setIsDropdownOpen(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // fetchProducts({ name: searchTwo });
  };

  const handleCategorySelect = (selected) => {
    // fetchProducts({ category: selected });
  };

  const handleShowAll = () => {
    // fetchProducts({});
  };

  // ── Auth handlers ─────────────────────────────────────────────────────────

  const loginForm = async (e) => {
    e.preventDefault();
    const success = await login(loginEmail, loginPassword);
    if (success) {
      setLoginEmail("");
      setLoginPassword("");
      closeModal();
    }
  };

  const signUpForm = async (e) => {
    e.preventDefault();
    // FIX: pass confirmPassword as 3rd arg to match the updated store signature:
    // signUp(email, password, confirmPassword, firstname, lastname)
    // FIX: removed the duplicate password-match check — the store owns that logic
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
    const success = await adminLogin(adminEmail, adminPassword);
    if (success) {
      setAdminEmail("");
      setAdminPassword("");
      closeModal();
      router.push("/admin/dashboard");
    }
  };

  // ── Modal config helpers ──────────────────────────────────────────────────

  const modalTitle =
    {
      login: "Login",
      signup: "Sign Up",
      forgotPassword: "Forgot Password?",
      admin: "Admin Login",
    }[modalType] ?? "Login";

  const modalSubmit =
    {
      login: loginForm,
      signup: signUpForm,
      forgotPassword: forgotPasswordForm,
      admin: adminForm,
    }[modalType] ?? loginForm;

  const modalButtonLabel =
    {
      login: "Login",
      signup: "Sign Up",
      forgotPassword: "Send Reset Link",
      admin: "Login",
    }[modalType] ?? "Submit";

  const modalSubChildren =
    {
      login: (
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
      signup: (
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
      forgotPassword: (
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
      admin: null,
    }[modalType] ?? null;

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
        <span className="absolute bottom-2 right-0 text-[10px] bg-blue-600 text-white flex items-center justify-center w-3 h-3 rounded-full">
          {userCart.length > 100 ? "100+" : userCart.length}
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
        <span className="absolute bottom-2 right-0 text-[10px] bg-blue-600 text-white flex items-center justify-center w-3 h-3 rounded-full">
          {userWishlist.length > 100 ? "100+" : userWishlist.length}
        </span>
      )}
    </Link>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <nav className="fixed top-0 w-full py-5 flex items-center justify-center backdrop-blur-lg z-50">
        {/* Desktop */}
        <div className="w-[80%] mx-auto hidden md:flex flex-row items-center justify-between">
          <section className="flex flex-row justify-evenly items-center gap-x-5">
            <span onClick={() => openModal("admin")} className="cursor-pointer">
              Logo
            </span>
            <span onClick={handleShowAll} className="cursor-pointer">
              All
            </span>
            {CategoryDropdown}
          </section>

          <section className="flex flex-row justify-evenly items-center gap-x-5">
            <SearchTwo
              searchTwo={searchTwo}
              onChange={(e) => setSearchTwo(e.target.value)}
              handleSubmit={handleSearchSubmit}
            />
            <span className="rounded-full text-2xl h-10 w-10 flex items-center justify-center cursor-pointer">
              {UserAvatar}
            </span>
            {CartLink}
            {WishlistLink}
          </section>
        </div>

        {/* Mobile toggle */}
        <div className="w-[80%] mx-auto flex md:hidden flex-row items-center justify-between relative">
          <span onClick={() => openModal("admin")} className="cursor-pointer">
            Logo
          </span>
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
              <div className="flex items-end w-full gap-x-4">
                {CategoryDropdown}
                <SearchTwo
                  searchTwo={searchTwo}
                  onChange={(e) => setSearchTwo(e.target.value)}
                  handleSubmit={handleSearchSubmit}
                />
              </div>
              <hr className="my-2" />
              <span>
                {userFirstName ? (
                  // FIX: close mobile menu on navigation
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
              {/* FIX: close mobile menu on navigation */}
              <Link
                href="/cart"
                className="cursor-pointer py-2 flex items-center gap-x-2"
                onClick={closeMobileMenu}
              >
                <ShoppingBag size={15} /> Cart
                {userCart.length > 0 && (
                  <span>
                    {userCart.length > 100 ? "100+" : userCart.length}
                  </span>
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
                    {userWishlist.length > 100 ? "100+" : userWishlist.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      <Modal
        Loading={loadingAuth}
        disabled={loadingAuth}
        title={modalTitle}
        isOpen={modal}
        onClose={closeModal}
        onSubmit={modalSubmit}
        buttonValue={modalButtonLabel}
        subChildren={modalSubChildren}
      >
        {modalType === "login" && (
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
        )}

        {modalType === "signup" && (
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
        )}

        {modalType === "forgotPassword" && (
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
        )}

        {modalType === "admin" && (
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
        )}
      </Modal>
    </>
  );
};

export default Navbar;
