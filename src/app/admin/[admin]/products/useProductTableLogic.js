"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const useProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [prodModal, setProdModal] = useState(false);
  const [prodName, setProdName] = useState("");
  const [prodImg, setProdImg] = useState(null);
  const [prodPrice, setProdPrice] = useState(0);
  const [prodDesc, setProdDesc] = useState("");
  const [prodCategory, setProdCategory] = useState("");
  const [prodVariants, setProdVariants] = useState([]);
  const [prodQuantity, setProdQuantity] = useState(0);
  const [prodId, setProdId] = useState(null);
  const [prodImgPreview, setProdImgPreview] = useState(null);

  const sizeOptions = ["S", "M", "FS", "L"];

  useEffect(() => {
    axios
      .get("https://isans.pythonanywhere.com/shop/get-products/")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load products");
        setLoading(false);
      });
  }, []);

  const handleEdit = (product) => {
    setProdId(product.id);
    setProdName(product.name);
    setProdImg(`https://isans.pythonanywhere.com${product.image}`);
    setProdPrice(product.price);
    setProdDesc(product.description);
    setProdCategory(product.category);
    setProdQuantity(product.quantity);

    const initialVariants = sizeOptions.map((size) => ({
      size,
      checked: product.variants?.includes(size) || size === "FS",
    }));

    setProdVariants(initialVariants);
    setProdModal(true);
  };

  const editProduct = (e) => {
    e.preventDefault();

    if (
      !prodName ||
      !prodPrice ||
      !prodDesc ||
      !prodCategory ||
      !prodQuantity
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!prodId) {
      toast.error("Product ID is missing");
      return;
    }

    const token =
      localStorage.getItem("adminAuthToken") ||
      sessionStorage.getItem("adminAuthToken");

    if (!token) {
      toast.warning("You must be logged in to edit products.");
      return;
    }

    const selectedSize =
      prodVariants.find((variant) => variant.checked)?.size || "FS";

    const formData = new FormData();
    formData.append("name", prodName);
    formData.append("price", prodPrice);
    formData.append("description", prodDesc);
    formData.append("category", prodCategory);
    formData.append("size", selectedSize);
    formData.append("quantity", prodQuantity);

    if (prodImg && prodImg instanceof File) {
      formData.append("image", prodImg);
    } else if (prodImgPreview && typeof prodImgPreview === "string") {
      toast.error("Please upload a valid image file.");
      return;
    }

    axios
      .put(
        `https://isans.pythonanywhere.com/shop/products/${prodId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        toast.success("Product updated successfully!");
        setProdModal(false);
      })
      .catch(() => {
        toast.error("Failed to update product");
      });
  };

  const handleCheckboxChange = (updatedVariant) => {
    setProdVariants((prevVariants) =>
      prevVariants.map((variant) =>
        variant.size === updatedVariant.size
          ? { ...variant, checked: true }
          : { ...variant, checked: false }
      )
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProdImg(file);
      setProdImgPreview(imageUrl);
    }
  };

  return {
    products,
    loading,
    error,
    prodModal,
    prodName,
    prodImg,
    prodPrice,
    prodDesc,
    prodCategory,
    prodVariants,
    prodQuantity,
    prodImgPreview,
    handleEdit,
    editProduct,
    handleCheckboxChange,
    handleImageChange,
    setProdModal,
    setProdName,
    setProdPrice,
    setProdQuantity,
    setProdDesc,
    setProdCategory,
  };
};
