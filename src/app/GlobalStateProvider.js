"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    products: [],
    barcodes: [] // Add barcodes field
  });

  // Utils: Format balance
  const formatBalance = (balance) => {
    if (balance !== null && !isNaN(Number(balance))) {
      return Number(balance).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return "0.00";
  };


const addToEndpoint = async ({ productId, endpoint, action, quantity }) => {
  if (!productId) {
    toast.error("Invalid product ID. Please try again.");
    return;
  }

  // Retrieve adminAuthToken from local or session storage
  const token =
    localStorage.getItem("adminAuthToken") ||
    sessionStorage.getItem("adminAuthToken");

  if (!token) {
    toast.warning("You need to log in to perform this action.");
    return;
  }

  try {
    // API request payload
    const payload = {
      product_id: productId,
      quantity: quantity? quantity : 1, // Fixed quantity for cart; adjust as needed for other endpoints
    };

    // Send POST request to the API
    const response = await axios.post(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Show success message
    if (response.status === 200 || response.status === 201) {
      toast.success(`Product successfully added to ${action}!`);
    } else {
      toast.warning(`Failed to add product to ${action}. Please try again.`);
    }
  } catch (error) {
    console.error(`Error adding to ${action}:`, error);
    const errorMessage =
      error.response?.data?.message ||
      `Failed to add product to ${action}. Please try again.`;
    toast.error(errorMessage);
  }
};

  // Fetch user data
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
      setError("Failed to fetch user data.");
      toast.error("Unable to load user data. Please try again.");
    }
  }, []);

  const fetchCart = useCallback(
    async () => {
  try {
    // Retrieve the user authentication token
    const userAuthToken =
      localStorage.getItem("userAuthToken") ||
      sessionStorage.getItem("userAuthToken");

    if (!userAuthToken) {
      toast.warning("Authentication token is not available. Please log in.");
      return;
    }

    // Make the API request to fetch the cart data
    const response = await axios.get(
      "https://isans.pythonanywhere.com/shop/cart/",
      {
        headers: {
          Authorization: `Bearer ${userAuthToken}`,
        },
      }
    );

    // Validate and update the cart data
    const cart = response.data || []; // Fallback to an empty array if 'cart' is undefined
    setFormData((prevState) => ({
      ...prevState,
      cart,
      cartNo: cart.length, // Optional: Update the cart count
    }));

    console.log("Cart data retrieved:", cart);
  } catch (error) {
    console.error("Error fetching cart data:", error.message || error);
    const errorMessage = error.response?.data?.message || "Unable to fetch cart data.";
    toast.error(errorMessage);
  }
}, []
  )
  const fetchWishlist = useCallback(
    async () => {
  try {
    // Retrieve the user authentication token
    const userAuthToken =
      localStorage.getItem("userAuthToken") ||
      sessionStorage.getItem("userAuthToken");

    if (!userAuthToken) {
      toast.warning("Authentication token is not available. Please log in.");
      return;
    }

    // Make the API request to fetch the cart data
    const response = await axios.get(
      "https://isans.pythonanywhere.com/shop/wishlist/",
      {
        headers: {
          Authorization: `Bearer ${userAuthToken}`,
        },
      }
    );

    // Validate and update the cart data
    const wishlist = response.data.wishlist_items || []; // Fallback to an empty array if 'wishlist' is undefined
    setFormData((prevState) => ({
      ...prevState,
      wishlist,
      wishlistNo: wishlist.length, // Optional: Update the wishlist count
    }));

    console.log("Cart data retrieved:", wishlist);
  } catch (error) {
    console.error("Error fetching wishlist data:", error.message || error);
    const errorMessage = error.response?.data?.message || "Unable to fetch wishlist data.";
    toast.error(errorMessage);
  }
}, []
  )


  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://isans.pythonanywhere.com/shop/get-products/"
      );

      if (response.status === 200) {
        const products = response.data || [];
        setFormData((prevState) => ({
          ...prevState,
          products,
        }));
      } else {
        toast.error("Failed to fetch products. Please try again.");
      }
    } catch (err) {
      setError("Failed to fetch products.");
      toast.error("Unable to load products. Please try again.");
    }
  }, []);

  // Fetch barcodes
  const fetchBarcodes = useCallback(async () => {
    const token =
      localStorage.getItem("adminAuthToken") ||
      sessionStorage.getItem("adminAuthToken");
    try {
      const response = await axios.get(
        "https://isans.pythonanywhere.com/shop/barcode/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const barcodes = response.data || [];// Assuming response contains an array of barcode objects
        setFormData((prevState) => ({
          ...prevState,
          barcodes, // Store the barcodes in the state
        }));
      } else {
        toast.error("Failed to fetch barcodes. Please try again.");
      }
    } catch (err) {
      setError("Failed to fetch barcodes.");
      toast.error("Unable to load barcodes. Please try again.");
    }
  }, []);

  // Fetch data on page load
  useEffect(() => {
    fetchUserData();
    fetchProducts();
    fetchBarcodes(); // Fetch barcodes on page load
  }, [fetchUserData, fetchProducts, fetchBarcodes]);

   

  return (
    <>
      <ToastContainer />
      <GlobalStateContext.Provider
        value={{
          formData,
          setFormData,
          formatBalance,
         addToEndpoint,
         fetchCart,
         fetchWishlist,
          fetchBarcodes, // Provide the function to access barcodes
        }}
      >
        {children}
      </GlobalStateContext.Provider>
    </>
  );
};
// Custom hook to use the GlobalStateContext
export const useGlobalState = () => useContext(GlobalStateContext);
