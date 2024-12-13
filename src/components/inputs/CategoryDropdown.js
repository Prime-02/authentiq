"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export const CategoryDropdown = ({ onCategorySelect }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const { formData } = useGlobalState();
  const categories = formData.category; // Fetch categories from global state

  // Handle category selection
  const handleSelect = (selectedValue) => {
    setSelectedCategory(selectedValue);

    // Notify the parent component of the selected category
    if (onCategorySelect) {
      onCategorySelect(selectedValue);
    }
  };

  return (
    <div>
      <Dropdown
        options={categories} // Categories array from global state
        onSelect={handleSelect} // Handle selection
        tag="category"
        className="border border-gray-300 px-4 py-2 rounded-md"
        placeholder="Select a category"
        valueKey="name" // Use `name` as the value for options
        displayKey="name" // Use `name` as the display text for options
        emptyMessage="No categories available" // Message when no categories are present
      />
    </div>
  );
};

import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import { Textinput } from "./Textinput";
import { useGlobalState } from "@/app/GlobalStateProvider";
import Dropdown from "./DynamicDropdown";

export const AddCategory = ({ onCategoryAdded }) => {
  const [newCategory, setNewCategory] = useState("");

  // Get adminAuthToken from storage
  const getAuthToken = () => {
    return adminToken;
  };

  // Handle adding a new category
  const handleAddCategory = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        "https://isans.pythonanywhere.com/shop/category/",
        { name: newCategory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Log the response for debugging
      console.log("Response:", response);

      if (response.status === 201) {
        toast.success("Category added successfully!");
        setNewCategory("");
        if (onCategoryAdded) {
          onCategoryAdded(response.data); // Notify parent about the new category
        }
      }
    } catch (error) {
      // Log the error for debugging
      console.error("Error adding category:", error.response || error);
      if (error.response) {
        // Log detailed error response for debugging
        console.log("Error Response:", error.response);
      }
    }
  };

  return (
    <div className="w-1/2 md:w-1/4 flex items-center">
      <Textinput
        label={`Add New Category`}
        type="text"
        value={newCategory}
        changed={(e) => setNewCategory(e.target.value)}
        className={`border-b`}
      />
      <button onClick={handleAddCategory}>
        <Plus />
      </button>
    </div>
  );
};
