"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Heart,
  icons,
  Menu,
  Settings,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { ButtonOne, ButtonTwo } from "../reusables/buttons/Buttons";
import { Search, SearchTwo } from "../inputs/SearchInputs";
import Modal from "../Modal/Modal";
import { Textinput } from "../inputs/Textinput";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGlobalState } from "@/app/GlobalStateProvider";
import { FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import Dropdown from "../inputs/DynamicDropdown";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [auth, setAuth] = useState(true);
  const [searchTwo, setSearchTwo] = useState("");
  const [Loading, setLoading] = useState(false);
  const {
    formData,
    getToken,
    Clear,
    SignOut,
    modal,
    setModal,
    modalType,
    setModalType,
    openModal,
    fetchProducts,
  } = useGlobalState(); // Access global state
  const userFirstName = formData.userFirstName ? formData.userFirstName : "";
  const wishlistItems = formData.wishlist || [];
  const cartItems = formData.cart || [];
  const category = formData.category;

  const profileNav = {
    profileName: `${userFirstName} ${formData.userLastName}.`,
    navigations: [
      { nav: "Profile", href: "/profile/profile", icon: <User size={15} /> },
      {
        nav: "Wish List",
        href: "/profile/wish-list",
        icon: <Heart size={15} />,
      },
      {
        nav: "Setting",
        href: "/profile/settings",
        icon: <Settings size={15} />,
      },
    ],
  };

  const nav = useRouter();
  const [cat] = useState(["All Categories", "Tees", "Accessories"]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeModal = () => {
    setModal(false); // Close modal
    setModalType(null); // Reset modal type
  };

  const loginForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://isans.pythonanywhere.com/users/login/",
        {
          email: loginEmail,
          password: loginPassword,
        }
      );

      if (response.status === 200 || response.status === 201) {
        const token = response.data.access;

        // Save token in local or session storage based on "Remember Me" selection
        if (rememberMe) {
          localStorage.setItem("userAuthToken", token);
        } else {
          sessionStorage.setItem("userAuthToken", token);
        }

        toast.success("Welcome!", { position: "top-right", autoClose: 5000 });
        setLoginEmail("");
        setLoginPassword("");
        window.location.reload();
      } else {
        toast.error("Login failed. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (err) {
      const errorMsg = err.response
        ? err.response.status === 401
          ? "Incorrect password. Please try again."
          : `An error occurred. ${
              err.response.data.email ||
              err.response.data.password ||
              "Please check your Internet and try again."
            }`
        : "An error occurred. Please check your Internet and try again.";
      toast.error(errorMsg, { position: "top-right", autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const SignUpForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (signUpPassword !== confirmPassword) {
      toast.error("Passwords do not match.", {
        position: "top-right",
        autoClose: 5000,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://isans.pythonanywhere.com/users/register/",
        {
          email: signUpEmail,
          password: signUpPassword,
          first_name: firstName,
          last_name: lastName,
          location: "not set",
        }
      );

      // Log the API response
      console.log("API Response:", response);

      if (response.status === 201 || response.status === 200) {
        sessionStorage.setItem("userAuthToken", response.data.token);
        toast.success("Welcome aboard! Now login.", {
          position: "top-right",
          autoClose: 5000,
        });

        // Reset form fields
        setFirstName("");
        setLastName("");
        setSignUpEmail("");
        setSignUpPassword("");
        setConfirmPassword("");

        setModalType("login");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.email ||
        err.response?.data?.password ||
        "An unexpected error occurred. Please try again.";
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const ForgottenPasswordForm = async (e) => {
    e.preventDefault();
  };
  const AdminForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Log the email and password before sending the request

    try {
      // Start of the request
      console.log("Sending request to server...");

      const response = await axios.post(
        "https://isans.pythonanywhere.com/users/admin/login/",
        {
          email: adminEmail,
          password: adminPassword,
        }
      );

      // Log the response when received
      console.log("Response received:", response);

      if (response.status === 200 || response.status === 201) {
        const token = response.data.access;

        // Save token in local or session storage based on "Remember Me" selection
        if (rememberMe) {
          localStorage.setItem("adminAuthToken", token);
        } else {
          sessionStorage.setItem("adminAuthToken", token);
        }

        toast.success("Welcome!", { position: "top-right", autoClose: 5000 });
        setLoginEmail("");
        setLoginPassword("");
        nav.push(`/admin/${adminEmail ? adminEmail : "admin"}/dashboard`);
      } else {
        console.log("Login failed with status:", response.status);
        toast.error("Login failed. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (err) {
      // Log the error if something goes wrong
      console.error("Error occurred during login:", err);
      const errorMsg = err.response
        ? err.response.status === 401
          ? "Incorrect password. Please try again."
          : `An error occurred. ${
              err.response.data.email ||
              err.response.data.password ||
              "Please check your Internet and try again."
            }`
        : "An error occurred. Please check your Internet and try again.";

      toast.error(errorMsg, { position: "top-right", autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if 'userAuthToken' exists in localStorage
    const token = getToken(`user`);

    if (token && token !== "") {
      setAuth(true); // Set auth to true if token is found
    } else {
      setAuth(false); // Set auth to false if token is not found
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // setSearchTwo(e.target.value);
    fetchProducts({ name: searchTwo });
  };

  const fiterAll = () => {
    fetchProducts({ name: "", category: "" });
  };

  // Handle category selection
  const handleCategorySelect = (selectedCategory) => {
    // Call fetchProducts with the selected category
    fetchProducts({ category: selectedCategory });
  };

  return (
    <>
      <nav className="fixed top-0 w-full py-5 flex items-center justify-center backdrop-blur-lg z-50">
        <div className="w-[80%] mx-auto hidden md:flex flex-row items-center justify-between">
          <section className="flex flex-row justify-evenly items-center gap-x-5">
            <span onClick={() => openModal("admin")} className="cursor-pointer">
              Logo
            </span>
            <span onClick={fiterAll}>All</span>
            <Dropdown
              options={category} // Replace this with your actual category data
              onSelect={handleCategorySelect}
              tag="category"
              placeholder="Categories"
              valueKey="name" // Assuming categories have an `id` property
              displayKey="name" // Assuming categories have a `name` property
              className=""
              emptyMessage="No categories available"
            />
          </section>
          <section className="flex flex-row justify-evenly items-center gap-x-5">
            <span>
              <SearchTwo
                searchTwo={searchTwo}
                onChange={(e) => setSearchTwo(e.target.value)}
                handleSubmit={handleSubmit}
              />
            </span>
            <span className="text- rounded-full text-2xl h-10 w-10 flex items-center justify-center cursor-pointer">
              <div>
                {userFirstName ? (
                  <Link
                    href={`/profile/${userFirstName ? userFirstName : "user"}`}
                  >
                    <strong>{userFirstName.charAt(0).toUpperCase()}</strong>
                  </Link>
                ) : (
                  <User
                    size={25}
                    className="translate-y-1"
                    onClick={() => openModal(`login`)}
                  />
                )}
              </div>
            </span>
            <Link
              href={`/cart`}
              className="cursor-pointer py-2 flex items-center relative gap-x-2"
            >
              <ShoppingBag size={25} />
              {cartItems.length > 0 && (
                <span className="absolute bottom-2 right-0 text-[10px] bg-blue-600 text-white flex items-center justify-center w-3 h-3 rounded-full">
                  {cartItems.length > 100 ? "100+" : cartItems.length}
                </span>
              )}
            </Link>
            <Link
              href={`/wishlist`}
              className="cursor-pointer relative py-2 flex items-center gap-x-2"
            >
              <Heart size={25} />
              {wishlistItems.length > 0 && (
                <span className="absolute bottom-2 right-0 text-[10px] bg-blue-600 text-white flex items-center justify-center w-3 h-3 rounded-full">
                  <h2 className="text">
                    {wishlistItems.length > 100 ? `100+` : wishlistItems.length}
                  </h2>
                </span>
              )}
            </Link>
          </section>
        </div>
        <div className="w-[80%] mx-auto flex md:hidden flex-row items-center justify-between relative">
          <span onClick={() => openModal("admin")} className="cursor-pointer">
            Logo
          </span>
          <span onClick={toggleDropdown} className="cursor-pointer">
            {isDropdownOpen ? <X /> : <Menu />}
          </span>
        </div>
        {isDropdownOpen && (
          <div className="absolute top-full left-0 w-full card border-t shadow-lg md:hidden h-auto">
            <div className="flex flex-col px-5 py-4">
              <div className="flex items-center w-full">
                <span className="cursor-pointer py-2">
                  <Dropdown
                    options={category} // Replace this with your actual category data
                    onSelect={handleCategorySelect}
                    tag="category"
                    placeholder="Categories"
                    valueKey="name" // Assuming categories have an `id` property
                    displayKey="name" // Assuming categories have a `name` property
                    className=""
                    emptyMessage="No categories available"
                  />
                </span>
                <span>
                  <SearchTwo
                    searchTwo={searchTwo}
                    onChange={(e) => setSearchTwo(e.target.value)}
                    handleSubmit={handleSubmit}
                  />
                </span>
              </div>
              <hr className="my-2" />
              <span
                onClick={() => setProfile(!profile)}
                className="text-2xl rounded-full px-5 cursor-pointer h-10 w-10 flex items-center justify-center gap-x-2 ml-4"
              >
                {userFirstName ? (
                  <strong>{userFirstName.charAt(0).toUpperCase()}</strong>
                ) : (
                  <User />
                )}
                <p className="font-normal text-base ">Profile</p>
              </span>
              {profile && auth ? (
                <div className="flex flex-col gap-y-3 mt-2">
                  {profileNav.navigations.map((nav, ind) => (
                    <Link
                      href={nav.href}
                      key={ind}
                      className="flex gap-x-2 items-center"
                    >
                      <span>{nav.icon}</span>
                      <span>{nav.nav}</span>
                    </Link>
                  ))}

                  <ButtonTwo
                    buttonValue={`Sign Out`}
                    iconValue={<FaSignOutAlt size={15} />}
                    Clicked={SignOut}
                    className={`w-32`}
                  />
                </div>
              ) : (
                profile && (
                  <span className="flex flex-col gap-y-3">
                    <span className="flex gap-x-3">
                      <span>
                        <ButtonOne
                          buttonValue={`Login`}
                          Clicked={() => openModal("login")}
                        />
                      </span>
                      <span>
                        <ButtonTwo
                          buttonValue={`Sign up`}
                          Clicked={() => openModal("signup")}
                        />
                      </span>
                    </span>
                  </span>
                )
              )}
              <Link
                href={`/cart`}
                className="cursor-pointer py-2 flex items-center gap-x-2"
              >
                <ShoppingBag size={15} /> Cart
                {cartItems.length > 0 && (
                  <h2>{cartItems.length > 100 ? "100+" : cartItems.length}</h2>
                )}
              </Link>
              <Link
                href={`/wishlist`}
                className="cursor-pointer relative py-2 flex items-center gap-x-2"
              >
                <Heart size={15} /> Wishlist
                <span>
                  {wishlistItems.length > 0 && (
                    <h2 className="text">
                      {wishlistItems.length > 100
                        ? `100+`
                        : wishlistItems.length}
                    </h2>
                  )}
                </span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Single Modal for Login, SignUp, and Forgot Password */}
      <Modal
        clickedTitle={Clear}
        Loading={Loading}
        disabled={Loading}
        title={
          modalType === "login"
            ? "Login"
            : modalType === "signup"
            ? "Sign Up"
            : modalType === "forgotPassword"
            ? "Forgot Password?"
            : "admin Login"
        }
        isOpen={modal}
        onClose={closeModal}
        onSubmit={
          modalType === "login"
            ? loginForm
            : modalType === "signup"
            ? SignUpForm
            : modalType === "forgotPassword"
            ? ForgottenPasswordForm
            : AdminForm
        }
        buttonValue={
          modalType === "login"
            ? "Login"
            : modalType === "signup"
            ? "Sign Up"
            : "Submit"
        }
        subChildren={
          modalType === "login" ? (
            <span className="text-center gap-x-2 items-center justify-center flex text-sm">
              <p>Don't have an account?</p>
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => openModal("signup")}
              >
                Sign up
              </span>
            </span>
          ) : modalType === "signup" ? (
            <span className="w-full justify-center items-center text-sm flex gap-x-2">
              <p>Already have an account?</p>
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => openModal("login")}
              >
                Log in
              </span>
            </span>
          ) : modalType === "admin" ? (
            ""
          ) : (
            <span className="w-full justify-center items-center text-sm flex gap-x-2">
              <p>Remember your password?</p>
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => openModal("login")}
              >
                Log in
              </span>
            </span>
          )
        }
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
            <span className="w-full flex justify-between  text-xs">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="accent-blue-600"
                />
                <label htmlFor="rememberMe" className="ml-2 ">
                  Remember Me
                </label>
              </div>
              <span
                onClick={() => openModal("forgotPassword")}
                className="cursor-pointer text-blue-600"
              >
                Forgot password?
              </span>
            </span>
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
              label="Password"
              className="border-b my-5"
              type="password"
              id="adminPassword"
              value={adminPassword}
              changed={(e) => setAdminPassword(e.target.value)}
            />
            <span className="w-full flex justify-between text-blue-600 text-xs">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="accent-blue-600"
                />
                <label htmlFor="rememberMe" className="ml-2 text-black">
                  Remember Me
                </label>
              </div>
            </span>
          </>
        )}

        {modalType === "signup" && (
          <>
            <Textinput
              label="First Name"
              className="border-b my-5"
              type="text"
              id="firstName"
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
              label="Email"
              id="signUpEmail"
              className="border-b my-5"
              type="email"
              value={signUpEmail}
              changed={(e) => setSignUpEmail(e.target.value)}
            />
            <Textinput
              label="Password"
              id="signUpPassword"
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
            <p>Please enter your email</p>
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
      </Modal>
    </>
  );
};

export default Navbar;
