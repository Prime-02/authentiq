'use client';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    userId: "",
    userFirstName: "",
    userLastName: "",
    email: "",
    password: "",
    gender: "",
    phone: "",
    notification: [],
    location: "",
    shippingAddress: "",
    country: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    dateJoined: "",
    cart: [],
    cartNo: 0,

    // Admin-specific fields
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    adminPassword: "",
    adminDateJoined: "",
    adminGender: "",
    adminIP: "",
    adminLastLogin: "",
    adminReferralCode: "",
    adminReferredBy: "",
    adminNotification: [],
    products: [
      {
        name: "Product A",
        price: 29.99,
        barcode: "123456789012",
      },
      {
        name: "Product B",
        price: 49.99,
        barcode: "987654321098",
      },
      {
        name: "Product C",
        price: 19.99,
        barcode: "456789123456",
      },
      {
        name: "Product D",
        price: 99.99,
        barcode: "321654987654",
      },
      {
        name: "Product E",
        price: 5.99,
        barcode: "654321789012",
      },
    ],
  });

  // utils/format.js
  const formatBalance = (balance) => {
    if (balance !== null && !isNaN(Number(balance))) {
      return Number(balance).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return "0.00";
  };

  const fetchUserData = useCallback(async () => {
    const token =
      localStorage.getItem("userAuthToken") ||
      sessionStorage.getItem("userAuthToken");
    try {
      const response = await axios.get(
        "https://isans.pythonanywhere.com/users/profile/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = response.data.data;

      setFormData((prevState) => ({
        ...prevState,
        userId: userData.id || "",
        userFirstName: userData.first_name || "",
        userLastName: userData.last_name || "",
        email: userData.email || "",
        gender: userData.gender || "",
        phone: userData.phone_number || "",
        location: userData.location || "",
        shippingAddress: userData.shipping_address || "",
        country: userData.country || "",
        streetAddress: userData.street_address || "",
        city: userData.city || "",
        state: userData.state || "",
        zipCode: userData.zip_code || "",
        dateJoined: userData.date_joined || "",
      }));
    } catch (err) {
     
    }
  }, []);
  // Fetch user data on page load
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <>
      <ToastContainer />
      <GlobalStateContext.Provider
        value={{ formData, setFormData, formatBalance }}
      >
        {children}
      </GlobalStateContext.Provider>
    </>
  );
};

// Custom hook to use the GlobalStateContext
export const useGlobalState = () => useContext(GlobalStateContext);
