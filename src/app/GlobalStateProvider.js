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
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState(null); // Determines which modal to show
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
    wishlist: [],
    wishlistNo: 0,
    userCartNo: 0,
    userOrderHistory: [],
    category: [],

    // Admin-specific fields
    adminId: "",
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    adminGender: "",
    adminPhone: "",
    adminNotification: [],
    products: [],
    barcodes: [], // Add barcodes field
    orders: [],
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
    setLoading(`${action}${productId}`);

    if (!productId) {
      toast.error("Invalid product ID. Please try again.");
      setLoading(null); // Ensure loading state is reset
      return;
    }

    // Retrieve adminAuthToken from local or session storage
    const token = getToken(`user`);

    if (!token) {
      openModal(`login`); // Ensure loading state is reset
      setLoading(null);
      return;
    }

    try {
      // API request payload
      const payload = {
        product_id: productId, // Dynamic key
        quantity: quantity || 30, // Default to 1 if quantity is not provided
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
        fetchWishlist();
        fetchCart();
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
    setLoading(`userData`);
    const token = getToken(`user`);
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
    setLoading(`cart`);
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
      const cart = response.data.cart_items || []; // Fallback to an empty array if 'cart' is undefined
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
    setLoading(`wishlist`);
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
      const wishlist = response.data.wishlist_items || []; // Fallback to an empty array if 'wishlist' is undefined
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

  const fetchProducts = useCallback(
    async (filter = { name: "", category: "" }) => {
      setLoading(`products`);
      try {
        const response = await axios.get(
          "https://isans.pythonanywhere.com/shop/get-products/"
        );

        if (response.status === 200) {
          const products = response.data || [];

          // Apply filtering based on name or category
          const filteredProducts = products.filter((product) => {
            const matchesName = filter.name
              ? product.name?.toLowerCase().includes(filter.name.toLowerCase())
              : true; // Safe access with `?`
            const matchesCategory = filter.category
              ? product.category?.toLowerCase() ===
                filter.category.toLowerCase()
              : true;

            return matchesName && matchesCategory;
          });

          setFormData((prevState) => ({
            ...prevState,
            products: filteredProducts,
          }));
        } else {
          toast.error("Failed to fetch products. Please try again.");
        }
      } catch (err) {
        setError("Failed to fetch products.");
        toast.error("Unable to load products. Please try again."); // Uncommented this
      } finally {
        setLoading(null);
      }
    },
    [setFormData, setLoading, setError] // Added dependencies
  );

  // Fetch barcodes
  const fetchBarcodes = useCallback(async () => {
    setLoading(`barcode`);
    const token = getToken(`admin`);
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
      // toast.error("Unable to load barcodes. Please try again.");
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
      if (response.status === 200 || response.status === 201) {
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
    } finally {
      setLoading(null);
    }
  };

  const DeleteProduct = async (id) => {
    // Start loading state
    console.log(id);

    setLoading(`deleting_product`);

    const token = getToken(`admin`);
    if (!token) {
      toast.warning(`You need admin rights to perform this action.`);
      return; // Prevent further execution
    }

    try {
      const response = await axios.delete(
        `https://isans.pythonanywhere.com/shop/products/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check response status
      if (response.status === 200) {
        toast.success(`Item deleted successfully.`);
      } else {
        toast.error(`Something went wrong. Please try again.`);
      }
    } catch (error) {
      console.error(`Error deleting item:`, error.message || error);

      // Show detailed error message or fallback
      const errorMessage =
        error.response?.data?.message ||
        error.response?.statusText ||
        `Unable to delete the item.`;
      toast.error(errorMessage);
    } finally {
      // End loading state
      setLoading(null);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://isans.pythonanywhere.com/shop/getcategory/"
      );
      setFormData((prevState) => ({
        ...prevState,
        category: response.data,
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const openModal = (type) => {
    setModalType(type); // Set the type of modal to display
    setModal(true); // Open modal
  };

  const fetchOrderHistory = useCallback(async () => {
    setLoading(`cart`);
    try {
      // Retrieve the user authentication token
      const userAuthToken = getToken(`user`);

      // Make the API request to fetch the cart data
      const response = await axios.get(
        "https://isans.pythonanywhere.com/shop/order-history/",
        {
          headers: {
            Authorization: `Bearer ${userAuthToken}`,
          },
        }
      );

      // Validate and update the cart data
      const userOrderHistory = response.data || []; // Fallback to an empty array if 'orderHistory' is undefined
      setFormData((prevState) => ({
        ...prevState,
        userOrderHistory,
        orderHistoryNo: userOrderHistory.length, // Optional: Update the orderHistory count
      }));

      console.log("Order history retrieved:", userOrderHistory);
    } catch (error) {
      console.error(
        "Error fetching orderHistory data:",
        error.message || error
      );
      const errorMessage =
        error.response?.data?.message || "Unable to fetch orderHistory data.";
      toast.error(errorMessage);
    } finally {
      setLoading(null);
    }
  }, []);

  // Fetch orders from API with optional filtering
  const fetchOrders = async (filterString = "ups") => {
    const token = getToken(`admin`);
    setLoading(`admin_login`);
    try {
      const response = await axios.get(
        "https://isans.pythonanywhere.com/shop/admin-orders/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let orders = response.data;

      // If a filter string is provided, filter the orders
      if (filterString.trim() !== "") {
        const lowerCaseFilter = filterString.toLowerCase();
        orders = orders.filter(
          (order) =>
            order.user_details.first_name
              .toLowerCase()
              .includes(lowerCaseFilter) ||
            order.product_details.name
              .toLowerCase()
              .includes(lowerCaseFilter) ||
            order.delivery_company.toLowerCase().includes(lowerCaseFilter) 
        );
      }

      // Update the global state with filtered or unfiltered orders
      setFormData((prevState) => ({
        ...prevState,
        orders,
      }));
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = useCallback(async () => {
    const adminToken = getToken(`admin`);
    if (!adminToken) {
      toast.error("Admin token is missing. Please log in again.");
      return;
    }

    try {
      const response = await axios.get(
        "https://isans.pythonanywhere.com/users/profile/",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      // Check response status
      if (response.status === 200 || response.status === 201) {
        toast.success("Data fetched successfully!");

        const userData = response.data?.data || {};
        console.log("Fetched user data:", userData);

        // Dynamically map the user data to formData
        const updatedData = {
          adminId: userData.id || "",
          adminFirstName: userData.first_name || "",
          adminLastName: userData.last_name || "",
          adminEmail: userData.email || "",
          adminGender: userData.gender || "",
          adminPhone: userData.phone_number || "",
          adminLocation: userData.location || "",
          adminShippingAddress: userData.shipping_address || "",
          adminCountry: userData.country || "",
          adminStreetAddress: userData.street_address || "",
          adminCity: userData.city || "",
          adminState: userData.state || "",
          adminZipCode: userData.zip_code || "",
          adminDateJoined: userData.date_joined || "",
        };

        setFormData((prevState) => ({
          ...prevState,
          ...updatedData,
        }));
      } else {
        toast.error("Failed to fetch user data.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Unable to load user data. Please try again.");
    }
  }, [adminToken, setFormData]);

  useEffect(() => {
    const userAuthToken = getToken(`user`);

    if (userAuthToken) {
      fetchUserData();
      fetchWishlist();
      fetchCart();
      fetchOrderHistory();
    }
  }, []); // Dependency array is empty to ensure it runs only on mount
  useEffect(() => {
    const adminAuthToken = getToken(`admin`);
    if (adminAuthToken) {
      fetchAdminData();
    }
  }, []); // Dependency array is empty to ensure it runs only on mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);
  return (
    <>
      <ToastContainer
        position="top-center" // Choose your desired position
        autoClose={5000} // Optional: default timeout
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <GlobalStateContext.Provider
        value={{
          fetchCategories,
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
          DeleteProduct,
          modal,
          setModal,
          modalType,
          setModalType,
          openModal,
          fetchOrderHistory,
          fetchOrders,
          fetchAdminData,
        }}
      >
        {children}
      </GlobalStateContext.Provider>
    </>
  );
};
// Custom hook to use the GlobalStateContext
export const useGlobalState = () => useContext(GlobalStateContext);
