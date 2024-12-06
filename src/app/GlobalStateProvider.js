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
import { useRouter } from "next/router";

const GlobalStateContext = createContext();


export const GlobalStateProvider = ({ children }) => {
  
  const [error, setError] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [loading, setLoading] = useState(null);
    const Clear = () => {
      localStorage.removeItem("userAuthToken");
      sessionStorage.removeItem("userAuthToken");
      alert(`cleared`);
    };
    const SignOut = () => {
      localStorage.removeItem("userAuthToken");
      sessionStorage.removeItem("userAuthToken");
      window.location.reload();

    };

    const getToken = (type) => {
      if (typeof window !== "undefined") {
        if (type === "user") {
          return (
            localStorage.getItem("userAuthToken") ||
            sessionStorage.getItem("userAuthToken")
          );
        } else if (type === "admin") {
          return (
            localStorage.getItem("adminAuthToken") ||
            sessionStorage.getItem("adminAuthToken")
          );
        }
      }
      return null; // Return null if the token is not found
    };


  const [formData, setFormData] = useState({
    userId: "",
    userFirstName: "",
    userLastName: "",
    userEmail: "",
    userGender: "",
    userPhone: "",
    userNotification: [],
    userLocation: "",
    userShippingAddress: "",
    userCountry: "",
    userStreetAddress: "",
    userCity: "",
    userState: "",
    userZipCode: "",
    userDateJoined: "",
    userCart: [],
    wishlist:[],
    wishlistNo: 0,
    userCartNo: 0,

    // Admin-specific fields
    adminId: '',
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    adminGender: "",
    adminPhone: '',
    adminNotification: [],
    products: [],
    barcodes: [], // Add barcodes field
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

 const addToEndpoint = async ({
   productId,
   endpoint,
   action,
   quantity,
 }) => {
   setLoading(`${action}${productId}`);

   if (!productId) {
     toast.error("Invalid product ID. Please try again.");
     setLoading(null); // Ensure loading state is reset
     return;
   }

   // Retrieve adminAuthToken from local or session storage
   const token = getToken(`user`);

   if (!token) {
     toast.warning("You need to logged in to perform this action.");
     setLoading(null); // Ensure loading state is reset
     return;
   }

   try {
     // API request payload
     const payload = {
       product_id: productId, // Dynamic key
       quantity: quantity || 1, // Default to 1 if quantity is not provided
     };

     // Send POST request to the API
     const response = await axios.post(endpoint, payload, {
       headers: {
         Authorization: `Bearer ${token}`,
         "Content-Type": "application/json",
       },
     });

     // Handle response
     if (response.status === 200 || response.status === 201) {
       toast.success(`Product successfully added to ${action}!`);
       fetchWishlist()
       fetchCart()
     } else {
       toast.warning(`Failed to add product to ${action}. Please try again.`);
     }
   } catch (error) {
     console.error(`Error adding to ${action}:`, error);
     const errorMessage =
       error.response?.data.error ||
       `Failed to add product to ${action}. Please try again.`;
     toast.error(errorMessage);
   } finally {
     setLoading(null); // Always reset loading state
   }
 };


  // Fetch user data
  const fetchUserData = useCallback(async () => {
    setLoading(`userData`)
    const token = getToken(`user`)
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
        userEmail: userData.email || "",
        userGender: userData.gender || "",
        userPhone: userData.phone_number || "",
        userLocation: userData.location || "",
        userShippingAddress: userData.shipping_address || "",
        userCountry: userData.country || "",
        userStreetAddress: userData.street_address || "",
        userCity: userData.city || "",
        userState: userData.state || "",
        userZipCode: userData.zip_code || "",
        userDateJoined: userData.date_joined || "",
      }));
    } catch (err) {
      setError("Failed to fetch user data.");
      toast.error("Unable to load user data. Please try again.");
    } finally {
      setLoading(null);
    }
  }, []);

  const fetchCart = useCallback(async () => {
    setLoading(`cart`)
    try {
      // Retrieve the user authentication token
      const userAuthToken = getToken(`user`);

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
      const errorMessage =
        error.response?.data?.message || "Unable to fetch cart data.";
      toast.error(errorMessage);
    } finally {
      setLoading(null);
    }
  }, []);
  const fetchWishlist = useCallback(async () => {
    setLoading(`wishlist`)
    try {
      // Retrieve the user authentication token
      const userAuthToken = getToken(`user`);

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
      const wishlist = response.data.wishlist_items ||[]; // Fallback to an empty array if 'wishlist' is undefined
      setFormData((prevState) => ({
        ...prevState,
        wishlist,
        wishlistNo: wishlist.length, // Optional: Update the wishlist count
      }));

      console.log("wishlist data retrieved:", wishlist);
    } catch (error) {
      console.error("Error fetching wishlist data:", error.message || error);
      const errorMessage =
        error.response?.data?.message || "Unable to fetch wishlist data.";
      toast.error(errorMessage);
    } finally {
      setLoading(null);
    }
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(`products`)
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
    } finally {
      setLoading(null);
    }
  }, []);

  // Fetch barcodes
  const fetchBarcodes = useCallback(async () => {
    setLoading(`barcode`)
    const token = getToken(`admin`)
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
        const barcodes = response.data || []; // Assuming response contains an array of barcode objects
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
    } finally {
      setLoading(null);
    }
  }, []);

 

  
  const deleteItem = async (Id, action) => {
    setLoading(`deleting_${action}_${Id}`);
    const token = getToken("user"); // Retrieve user token

    if (!Id) {
      toast.error(`Invalid ${action} ID. Please try again.`);
      return;
    }

    if (!token) {
      toast.warning("You must be logged in to perform this action.");
      return;
    }

    try {
      // Make the DELETE request
      const response = await axios.delete(
        `https://isans.pythonanywhere.com/shop/${action}/${Id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Handle success
      if (response.status === 200 || response.status === 204) {
        toast.success(
          `${
            action.charAt(0).toUpperCase() + action.slice(1)
          } item successfully deleted.`
        );
        if (action === "wishlist") {
          fetchWishlist(); // Refresh wishlist
        } else if (action === "cart") {
          fetchCart(); // Refresh cart
        }
      } else {
        toast.error(`Failed to delete the ${action} item. Please try again.`);
      }
    } catch (error) {
      console.error(`Error deleting ${action} item:`, error.message || error);
      const errorMessage =
        error.response?.data?.message || `Unable to delete the ${action} item.`;
      toast.error(errorMessage);
    } finally{
      setLoading(null)
    }
  };

  useEffect(() => {
    const userAuthToken =
     getToken(`user`)

    if (userAuthToken ) {
      fetchUserData();
      fetchWishlist()
    }
  }, []); // Dependency array is empty to ensure it runs only on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <ToastContainer />
      <GlobalStateContext.Provider
        value={{
          formData,
          loading,
          fetchProducts,
          userToken,
          adminToken,
          setFormData,
          formatBalance,
          addToEndpoint,
          fetchCart,
          fetchWishlist,
          fetchBarcodes, // Provide the function to access barcodes
          Clear,
          SignOut,
          getToken,
          fetchUserData,
          deleteItem,
        }}
      >
        {children}
      </GlobalStateContext.Provider>
    </>
  );
};
// Custom hook to use the GlobalStateContext
export const useGlobalState = () => useContext(GlobalStateContext);
