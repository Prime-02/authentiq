"use client";
import { useGlobalState } from "@/app/GlobalStateProvider";
import BarcodeDropdown from "@/components/inputs/DynamicDropdown";
import { CategoryDropdown } from "@/components/inputs/CategoryDropdown";
import { CheckBoxList } from "@/components/inputs/CheckBox";
import { FileInput } from "@/components/inputs/FIleInput";
import { TextArea, Textinput } from "@/components/inputs/Textinput";
import Modal from "@/components/Modal/Modal";
import { Button } from "@/components/reusables/buttons/Buttons";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Dropdown from "@/components/inputs/DynamicDropdown";

const Layout = ({ children }) => {
  const { formData, getToken, fetchProducts, fetchBarcodes, fetchCategories } =
    useGlobalState();
  const [products, setProducts] = useState([]);
  const [prodModal, setProdModal] = useState(false);
  const [prodCategory, setProdCategory] = useState("");
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodImg, setProdImg] = useState(null);
  const [convertedImg, setConvertedImg] = useState(null); // Store WebP image
  const [prodQuantity, setProdQuantity] = useState("");
  const [selectedBarcode, setSelectedBarcode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prodVariants, setProdVariants] = useState([
    { id: "xs", label: "XS", value: "extra-small", checked: false },
    { id: "sm", label: "S", value: "small", checked: false },
    { id: "md", label: "M", value: "medium", checked: false },
    { id: "fs", label: "FS", value: "free-size", checked: false },
    { id: "lg", label: "L", value: "large", checked: false },
    { id: "xl", label: "XL", value: "extra-large", checked: false },
  ]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const routeId = formData.adminFirstName.replace(/\s+/g, "_");
  const Barcodes = formData?.barcodes || [];

  const handleBarcodeSelect = (barcode) => {
    setSelectedBarcode(barcode);
  };

  // Convert the selected image to WebP format
  const convertToWebP = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const webpDataUrl = canvas.toDataURL("image/webp", 0.8);
          resolve(webpDataUrl);
        };
        img.src = e.target.result;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

 const handleFileChange = async (e) => {
   const file = e.target.files[0];

   if (file) {
     // Check if the file size is greater than 2MB (2MB = 2 * 1024 * 1024 bytes)
     if (file.size > 2 * 1024 * 1024) {
       // Show a toast warning
       toast.warning(
         "The file size exceeds the 2MB limit. Please upload a smaller file."
       );
       return; // Prevent setting the file
     }

     setProdImg(file); // Save the original file
     const webpImage = await convertToWebP(file); // Convert to WebP
     setConvertedImg(webpImage); // Save the converted WebP image
   }
 };


  // Toggle Modal
  const ToggleModal = () => {
    setProdModal(!prodModal);
  };

 const addProduct = async (e) => {
   setLoading(true);
   e.preventDefault();

   // Validate mandatory fields
   if (
     !prodName ||
     !prodPrice ||
     !prodDesc ||
     !prodQuantity ||
     !prodCategory ||
     !selectedBarcode
   ) {
     toast.warning("Please fill in all required fields.");
     setLoading(false);
     return;
   }

   try {
     // Create FormData object
     const formData = new FormData();
     formData.append("name", prodName);
     formData.append("price", prodPrice);
     formData.append("description", prodDesc);

     if (convertedImg) {
       // Append the WebP image instead of the original image
       const webpBlob = dataURLtoBlob(convertedImg); // Convert WebP data URL to Blob
       formData.append("image", webpBlob, "product-image.webp"); // Use WebP file name
     } else if (prodImg) {
       formData.append("image", prodImg); // Fallback to original image if WebP not available
     }

     formData.append("category", prodCategory);
     formData.append("quantity", prodQuantity);
     formData.append("barcode", selectedBarcode);

     // Filter and collect the selected sizes into an array
     const selectedSizes = prodVariants
       .filter((variant) => variant.checked) // Get the selected sizes
       .map((variant) => variant.label); // Collect only the label values (e.g., "S", "L", "M")

     if (selectedSizes.length > 0) {
       const sizesString = selectedSizes.join(",");
       formData.append("sizes", sizesString); // Append the sizes as a comma-separated string
     }

     const adminAuthToken = getToken(`admin`);

     const response = await axios.post(
       "https://isans.pythonanywhere.com/shop/products/",
       formData,
       {
         headers: {
           Authorization: `Bearer ${adminAuthToken}`,
           "Content-Type": "multipart/form-data",
         },
       }
     );

     toast.success("Product added successfully!");
     setProducts((prevProducts) => [...prevProducts, response.data]);

     // Reset form fields
     setProdName("");
     setProdPrice("");
     setProdDesc("");
     setProdQuantity("");
     setProdImg(null);
     setConvertedImg(null);
     setSelectedBarcode(null);
     setProdCategory("");
     setProdVariants((prev) =>
       prev.map((variant) => ({ ...variant, checked: false }))
     );

     ToggleModal();
   } catch (error) {
     console.error("Error adding product:", error);
     toast.error("Failed to add the product. Please try again.");
   } finally {
     setLoading(false);
     fetchProducts();
   }
 };

 // Helper function to convert data URL (base64 encoded) to Blob
 const dataURLtoBlob = (dataUrl) => {
   const byteString = atob(dataUrl.split(",")[1]);
   const arrayBuffer = new ArrayBuffer(byteString.length);
   const uintArray = new Uint8Array(arrayBuffer);

   for (let i = 0; i < byteString.length; i++) {
     uintArray[i] = byteString.charCodeAt(i);
   }

   return new Blob([arrayBuffer], { type: "image/webp" });
 };


  useEffect(() => {
    fetchProducts();
    fetchBarcodes();
  }, []);

  return (
    <>
      <div className="relative h-auto w-full">
        <nav className="w-full flex flex-wrap items-center justify-between pr-3">
          {/* Filters Section */}
          <div className="flex gap-4 flex-wrap text-xs sm:text-sm">
            <Link
              href={`/admin/${routeId}/products`}
              className="cursor-pointer hover:underline"
            >
              All
            </Link>
            <Link
              href={`/admin/${routeId}/products/available`}
              className="cursor-pointer hover:underline"
            >
              Available
            </Link>
            <Link
              href={`/admin/${routeId}/products/out-of-stock`}
              className="cursor-pointer hover:underline"
            >
              Out of stock
            </Link>
            <Link
              href={`/admin/${routeId}/products/pre-ordered`}
              className="cursor-pointer hover:underline"
            >
              Pre-ordered
            </Link>
          </div>

          {/* Add Product Section */}
          <Button clicked={ToggleModal} value={`Add New Product`} />
        </nav>
        {children}
      </div>
      <Modal
        loading={loading}
        disabled={loading}
        isOpen={prodModal}
        onClose={() => setProdModal(!prodModal)}
        title={`Add New Product`}
        onSubmit={addProduct}
        buttonValue={`Add New Product`}
      >
        <div className="flex flex-col space-y-5">
          <section className="flex items-center gap-x-3 justify-between">
            <span>
              <Textinput
                type="text"
                label="Name"
                value={prodName}
                changed={(e) => setProdName(e.target.value)}
                className="border-b border-blue-600"
              />
            </span>
            <span>
              <span>
                {convertedImg && (
                  <div className="mt-3">
                    <img
                      src={convertedImg}
                      alt="Product Preview"
                      className="w-24 h-w-24 mx-auto object-cover rounded-lg"
                    />
                  </div>
                )}
              </span>
              <span>
                <FileInput
                  changed={handleFileChange} // Handle file input change
                  type="file"
                  accept="image/*"
                />
              </span>
            </span>
          </section>
          <section className="flex items-center justify-between">
            <span>
              <Textinput
                label="Price ($)"
                type="text"
                value={prodPrice}
                changed={(e) => setProdPrice(e.target.value)}
                className="border-b border-blue-600"
              />
            </span>
            <div className="col-span-2 sm:col-span-1">
              <Dropdown
                className="border border-gray-300 px-4 py-2 rounded-md"
                options={Barcodes}
                tag={`Barcode`}
                onSelect={handleBarcodeSelect}
                placeholder="Select Barcode"
                filterFn={(product) => product.status === "unused"} // Only unused barcodes
                valueKey="id"
                displayKey="code"
                emptyMessage="No unused barcodes available"
              />
            </div>
          </section>
          <section className="flex items-center justify-between">
            <span>
              <Textinput
                label="Quantity"
                type="text"
                value={prodQuantity}
                changed={(e) => setProdQuantity(e.target.value)}
                className="border-b border-blue-600"
              />
            </span>
            <div className="col-span-2 sm:col-span-1">
              <CategoryDropdown onCategorySelect={setProdCategory} />
            </div>
          </section>
          <section>
            <TextArea
              label="Description"
              value={prodDesc}
              changed={(e) => setProdDesc(e.target.value)}
              className="border-b border-blue-600"
            />
          </section>
          <section>
            <div className="px-5">
              <CheckBoxList
                items={prodVariants}
                onChange={(item) =>
                  setProdVariants((prev) =>
                    prev.map((variant) =>
                      variant.id === item.id
                        ? { ...variant, checked: !variant.checked }
                        : variant
                    )
                  )
                }
              />
            </div>
          </section>
        </div>
      </Modal>
    </>
  );
};

export default Layout;
