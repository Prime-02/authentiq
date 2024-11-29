"use client";
import { useGlobalState } from "@/app/GlobalStateProvider";
import { CheckBoxList } from "@/components/inputs/CheckBox";
import { FileInput } from "@/components/inputs/FIleInput";
import {
  TextArea,
  Textinput,
} from "@/components/inputs/Textinput";
import Modal from "@/components/Modal/Modal";
import { Button } from "@/components/reusables/buttons/Buttons";
import Link from "next/link";
import React, { useState } from "react";

const Layout = ({ children }) => {
  const {formData, setFormData} = useGlobalState()
  const [products, setProducts] = useState([]);
  const [prodModal, setProdModal] = useState(false);
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState('');
  const [prodDesc, setProdDesc] = useState("");
  const [prodImg, setProdImg] = useState(null);
  const [prodQuantity, setProdQuantity] = useState('')
  const [prodVariants, setProdVariants] = useState([
    { id: "sm", label: "S", value: "small", checked: false },
    { id: "md", label: "M", value: "medium", checked: false },
    { id: "lg", label: "L", value: "large", checked: false },
    { id: "xl", label: "XL", value: "extra-large", checked: false },
    { id: "xxl", label: "XXL", value: "extra-extra-large", checked: false },
  ]);
  const routeId = formData.adminFirstName.replace(/\s+/g, "_");

  // Handle checkbox state toggle
  const handleCheckboxChange = (item) => {
    setProdVariants((prev) =>
      prev.map((variant) =>
        variant.id === item.id
          ? { ...variant, checked: !variant.checked }
          : variant
      )
    );
  };

  // Toggle Modal
  const ToggleModal = () => {
    setProdModal(!prodModal);
  };

  // Add Product
  const addProduct = (e) => {
    e.preventDefault();

    // Create new product object
    const newProduct = {
      name: prodName,
      price: prodPrice,
      description: prodDesc,
      image: prodImg,
      variants: prodVariants.filter((variant) => variant.checked), // Only include checked variants
    };

    // Update products array and reset form
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    console.log("New Product Added:", newProduct);

    // Reset state
    setProdName("");
    setProdPrice("");
    setProdDesc("");
    setProdImg(null);
    setProdVariants((prev) =>
      prev.map((variant) => ({ ...variant, checked: false }))
    );

    ToggleModal();
  };

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
                type={`text`}
                label={`Name`}
                value={prodName}
                changed={(e) => setProdName(e.target.value)}
                className={`border-b border-blue-600`}
              />
            </span>
            <span>
              <FileInput
                changed={(e) => setProdImg(e.target.files[0])} // Use `files` for file input
                type={`file`}
                accept={`image/*`}
              />
            </span>
          </section>
          <section className="flex items-center justify-between ">
            <span>
              <Textinput
                label={`Price ($)`}
                type={`text`}
                value={prodPrice}
                changed={(e) => setProdPrice(e.target.value)}
                className={`border-b border-blue-600`}
              />
            </span>
            <div className="col-span-2 sm:col-span-1">
              <select
                id="category"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              >
                <option defaultValue="">Select category</option>
                <option value="tees">Tees</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </section>
          <section className="flex items-center justify-between ">
            <span>
              <Textinput
                label={`Quantity`}
                type={`text`}
                value={prodPrice}
                changed={(e) => setProdPrice(e.target.value)}
                className={`border-b border-blue-600`}
              />
            </span>
            <div className="col-span-2 sm:col-span-1">
              <select
                id="category"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              >
                <option defaultValue="">Select Barcode</option>
                <option value="tees">Tees</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </section>
          <section>
            <TextArea
              label={`Description`}
              value={prodDesc}
              changed={(e) => setProdDesc(e.target.value)}
              className={`border-b border-blue-600`}
            />
          </section>
          <section>
            <div className="px-5">
              <CheckBoxList
                items={prodVariants}
                onChange={handleCheckboxChange}
              />
            </div>
          </section>
        </div>
      </Modal>
    </>
  );
};

export default Layout;