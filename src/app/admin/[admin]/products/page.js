"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { TextArea, Textinput } from "@/components/inputs/Textinput";
import { CheckBoxList } from "@/components/inputs/CheckBox";
import Modal from "@/components/Modal/Modal";
import { FileInput } from "@/components/inputs/FIleInput";
import { toast } from "react-toastify";
import {
  AddCategory,
  CategoryDropdown,
} from "@/components/inputs/CategoryDropdown";
import { useGlobalState } from "@/app/GlobalStateProvider";
import BarcodeDropdown from "@/components/inputs/BarcodeDropdown";
import DynamicImage from "@/components/reusables/DynamicImage/DynamicImage";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { formData } = useGlobalState();

  // Modal state and product data for editing
  const [prodModal, setProdModal] = useState(false);
  const [prodName, setProdName] = useState("");
  const [prodImg, setProdImg] = useState(null);
  const [prodPrice, setProdPrice] = useState(0);
  const [prodDesc, setProdDesc] = useState("");
  const [prodCategory, setProdCategory] = useState("");
  const [prodVariants, setProdVariants] = useState([]);
  const [prodQuantity, setProdQuantity] = useState(0);
  const [prodId, setProdId] = useState(null); // State to store productId
  const [prodImgPreview, setProdImgPreview] = useState(null);
  const [selectedBarcode, setSelectedBarcode] = useState(null);
  const Barcodes = formData?.barcodes || [];
  const handleBarcodeSelect = (barcode) => {
    setSelectedBarcode(barcode);
  };

  // Available sizes for checkboxes
  const sizeOptions = ["S", "M", "FS", "L"];

  // Fetch products from the API
  const fetchProducts = () => {
    axios
      .get("https://isans.pythonanywhere.com/shop/get-products/")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load products" + error);
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  // Handle edit button click
  const handleEdit = (product) => {
    setProdId(product.id); // Store productId when editing
    setProdName(product.name);
    setProdImg(`https://isans.pythonanywhere.com${product.image}`);
    setProdPrice(product.price);
    setProdDesc(product.description);
    setProdCategory(product.category);
    setProdQuantity(product.quantity);

    // Create initial variant checkboxes, default to 'FS' if no size exists
    const initialVariants = sizeOptions.map((size) => ({
      size,
      checked: product.variants?.includes(size) || size === "FS", // Default to FS if no sizes are provided
    }));

    setProdVariants(initialVariants);
    setProdModal(true);
  };

  // Handle form submission (e.g., updating the product)
  const editProduct = (e) => {
    e.preventDefault();

    // Ensure all required fields are provided
    if (
      !prodName ||
      !prodPrice ||
      !prodDesc ||
      // !prodCategory ||
      !prodQuantity
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Check if prodId exists
    if (!prodId) {
      toast.error("Product ID is missing");
      return;
    }

    // Check if user is logged in
    const token =
      localStorage.getItem("adminAuthToken") ||
      sessionStorage.getItem("adminAuthToken");

    if (!token) {
      toast.warning("You must be logged in to edit products.");
      return;
    }

    // Get the selected size (either first checked size or default 'FS')
    const selectedSize =
      prodVariants.find((variant) => variant.checked)?.size || "FS";

    const updatedProduct = {
      name: prodName,
      price: prodPrice,
      description: prodDesc,
      // category: prodCategory,
      size: selectedSize, // Use a single size value instead of an array
      quantity: prodQuantity,
      // code: validBarcode, // Use barcode as the string primary key
    };

    // Create FormData object and append fields
    const formData = new FormData();
    formData.append("name", prodName);
    formData.append("price", prodPrice);
    formData.append("description", prodDesc);
    formData.append("category", prodCategory);
    formData.append("size", selectedSize); // Append the single selected size
    formData.append("quantity", prodQuantity);

    if (prodImg && prodImg instanceof File) {
      formData.append("image", prodImg); // Append image file
    } else if (prodImgPreview && typeof prodImgPreview === "string") {
      // If the preview is used, it means no new image is selected, so don't append it
      toast.error("Please upload a valid image file.");
      return;
    }

    // Make the API request to update the product
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
      .then((response) => {
        console.log("Response from API:", response);
        toast.success("Product updated successfully!");
        setProdModal(false); // Close the modal
        fetchProducts();
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        toast.error("Failed to update product");
      });
  };

  const handleCheckboxChange = (updatedVariant) => {
    setProdVariants((prevVariants) =>
      prevVariants.map(
        (variant) =>
          variant.size === updatedVariant.size
            ? { ...variant, checked: true } // Select this size
            : { ...variant, checked: false } // Uncheck others
      )
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProdImg(file); // Store the actual file for uploading
      setProdImgPreview(imageUrl); // Store the preview URL
    }
  };
  const validateFileSize = (file, maxSizeMB = 2) => {
    if (!file) return false; // No file provided
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  };

  const handleModalImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!validateFileSize(file)) {
        toast.error("File size exceeds 2MB. Please choose a smaller file.");
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setProdImg(file); // Store the actual file for uploading
      setProdImgPreview(imageUrl); // Store the preview URL
    }
  };

  return (
    <div className="container mx-auto  p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Product List</h1>
      <div className="overflow-x-auto card pt-6  rounded-lg">
        <span className="">
          <AddCategory />
        </span>
        <table className="min-w-full table-auto border-collapse card shadow-md rounded-lg">
          <thead className="">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Sizes</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Barcode ID</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-4 py-2">{product.id}</td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">
                  <DynamicImage
                    className={`w-20 h-20 object-cover rounded`}
                    width={500}
                    height={500}
                    prop={product.image}
                    prod={product.name}
                  />
                </td>
                <td className="px-4 py-2">${product.price}</td>
                <td className="px-4 py-2 max-w-xs h-16 overflow-hidden text-ellipsis ">
                  {product.description}
                </td>
                <td className="px-4 py-2">{product.category}</td>
                <td className="px-4 py-2">
                  {Array.isArray(product.sizes) && product.sizes.length > 0
                    ? product.sizes.join(", ")
                    : "N/A"}
                </td>

                <td className="px-4 py-2">{product.quantity}</td>
                <td className="px-4 py-2">
                  {product.barcode ? product.barcode : `Not Set`}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Editing Product */}
      <Modal
        isOpen={prodModal}
        onClose={() => setProdModal(false)}
        title={`Edit Product: ${prodName}.`}
        onSubmit={editProduct}
        buttonValue={`Save Changes`}
      >
        <div className="flex flex-col space-y-5">
          <section className="flex items-center gap-x-3 justify-between">
            <span>
              <Textinput
                type={`text`}
                label={`Name`}
                value={prodName}
                changed={(e) => setProdName(e.target.value)}
                className={`border-b border-blue-600`}
              />
            </span>
            <span>
              <div>
                {prodImgPreview ? (
                  <img
                    src={prodImgPreview}
                    alt="Current product"
                    className="w-20 h-20 object-cover rounded"
                  />
                ) : (
                  <p>No image selected</p>
                )}
              </div>
              {/* Allow the user to select a new image */}
              <FileInput
                changed={handleModalImageChange} // Ensure validation is applied here
                type="file"
                accept="image/*"
              />
            </span>
          </section>
          <section className="flex items-center justify-between">
            <span>
              <Textinput
                type={`number`}
                label={`Price`}
                value={prodPrice}
                changed={(e) => setProdPrice(e.target.value)}
                className={`border-b border-blue-600`}
              />
            </span>
            <span>
              <Textinput
                type={`number`}
                label={`Quantity`}
                value={prodQuantity}
                changed={(e) => setProdQuantity(e.target.value)}
                className={`border-b border-blue-600`}
              />
            </span>
          </section>

          <section>
            <TextArea
              label={`Description`}
              rows={3}
              value={prodDesc}
              changed={(e) => setProdDesc(e.target.value)}
              className={`border-b border-blue-600`}
            />
          </section>

          {/* <section>
            <CategoryDropdown onCategorySelect={setProdCategory} />
            <BarcodeDropdown
              products={Barcodes} // Pass the product list with barcode codes
              onSelectBarcode={handleBarcodeSelect} // Handler to update the selected barcode
            />
          </section> */}

          <section>
            <CheckBoxList
              items={prodVariants}
              onChange={handleCheckboxChange}
            />
          </section>
        </div>
      </Modal>
    </div>
  );
};

export default ProductTable;
