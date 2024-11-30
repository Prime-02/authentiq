"use client";

import React, { useEffect, useRef, useState } from "react";
import { IoMdCart } from "react-icons/io";
import { Menu, Settings, ShoppingBag, User, X } from "lucide-react";
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

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState(null); // Determines which modal to show
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
  const [loading, setLoading] = useState(false);
  const { formData } = useGlobalState(); // Access global state
  const userFirstName = formData.userFirstName ? formData.userFirstName : "";

  const nav = useRouter();
  const [cat] = useState(["All Categories", "Tees", "Accessories"]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const Clear = () => {
    localStorage.removeItem("userAuthToken");
    sessionStorage.removeItem("userAuthToken");
    alert(`cleared`);
  };
  console.log(localStorage.getItem(`userAuthToken`));
  console.log(localStorage.getItem(`adminAuthToken`));

  const openModal = (type) => {
    setModalType(type); // Set the type of modal to display
    setModal(true); // Open modal
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
    console.log("Sending login data:", {
      email: adminEmail,
      password: adminPassword,
    });

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

  const profileRef = useRef(null);
  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setProfile(false);
    }
  };

  useEffect(() => {
    if (profile) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profile]);

  useEffect(() => {
    // Check if 'userAuthToken' exists in localStorage
    const token = localStorage.getItem("userAuthToken");

    if (token && token !== "") {
      setAuth(true); // Set auth to true if token is found
    } else {
      setAuth(false); // Set auth to false if token is not found
    }
  }, []);

  return (
    <>
      <nav className="fixed top-0 w-full py-5 flex items-center justify-center backdrop-blur-lg z-50">
        <div className="w-[80%] mx-auto hidden md:flex flex-row items-center justify-between">
          <section className="flex flex-row justify-evenly gap-x-5">
            <span onClick={() => openModal("admin")} className="cursor-pointer">
              Logo
            </span>
            <span>All</span>
            <span>Tees</span>
            <span>Accessories</span>
          </section>
          <section className="flex flex-row justify-evenly items-center gap-x-5">
            <span>
              <SearchTwo />
            </span>
            <span
              className="text- rounded-full text-2xl h-10 w-10 flex items-center justify-center cursor-pointer"
              onClick={() => setProfile(!profile)}
            >
              {userFirstName ? (
                <strong>{userFirstName.charAt(0).toUpperCase()}</strong>
              ) : (
                <User />
              )}
              <span
                ref={profileRef}
                className={`absolute  right-0 top-2 bg-white  px-2 min-w-32 h-auto py-2 w-auto  rounded-lg flex flex-col items-end justify-center gap-y-1 transition duration-300 ${
                  !profile ? "translate-x-full" : "translate-x-0"
                }`}
              >
                {auth ? (
                  <span className="text-base flex items-center gap-x-2">
                    <p>Settings</p>
                    <p>
                      <Settings size={20} />
                    </p>
                  </span>
                ) : (
                  ""
                )}
                {!auth ? (
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
                ) : (
                  <ButtonTwo
                    buttonValue={`Sign Out`}
                    iconValue={
                      <FaSignOutAlt
                        size={15}
                      />
                    }
                  />
                )}
              </span>
            </span>
            <Link
              href={`/cart`}
              className="cursor-pointer py-2 flex items-center gap-x-2"
            >
              <ShoppingBag />
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
          <div className="absolute top-full left-0 w-full bg-white text-customGray border-t shadow-lg md:hidden">
            <div className="flex flex-col px-5 py-4">
              <span className="cursor-pointer py-2">
                <Search category={cat} />
              </span>
              <hr className="my-2" />
              <span
                onClick={() => openModal(`login`)}
                className="text-2xl rounded-full px-5 cursor-pointer h-10 w-10 flex items-center justify-center"
              >
                {userFirstName ? (
                  <span className="flex items-center gap-x-2 ml-10">
                    <strong>{userFirstName.charAt(0).toUpperCase()}</strong>
                    <p className="font-normal text-base ">Profile</p>
                  </span>
                ) : (
                  <span className="flex ml-8">
                    <User />
                    <p className="font-normal text-base ">Profile</p>
                  </span>
                )}
              </span>
              <Link
                href={`/cart`}
                className="cursor-pointer py-2 flex items-center gap-x-2"
              >
                <ShoppingBag /> Cart
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Single Modal for Login, SignUp, and Forgot Password */}
      <Modal
        clickedTitle={Clear}
        loading={loading}
        disabled={loading}
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
              label="Email"
              className="border-b"
              type="email"
              value={loginEmail}
              changed={(e) => setLoginEmail(e.target.value)}
            />
            <Textinput
              label="Password"
              className="border-b my-5"
              type="password"
              value={loginPassword}
              changed={(e) => setLoginPassword(e.target.value)}
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
              <span
                onClick={() => openModal("forgotPassword")}
                className="cursor-pointer"
              >
                Forgot password?
              </span>
            </span>
          </>
        )}

        {modalType === "admin" && (
          <>
            <Textinput
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
              value={firstName}
              changed={(e) => setFirstName(e.target.value)}
            />
            <Textinput
              label="Last Name"
              className="border-b my-5"
              type="text"
              value={lastName}
              changed={(e) => setLastName(e.target.value)}
            />
            <Textinput
              label="Email"
              className="border-b my-5"
              type="email"
              value={signUpEmail}
              changed={(e) => setSignUpEmail(e.target.value)}
            />
            <Textinput
              label="Password"
              className="border-b my-5"
              type="password"
              value={signUpPassword}
              changed={(e) => setSignUpPassword(e.target.value)}
            />
            <Textinput
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
