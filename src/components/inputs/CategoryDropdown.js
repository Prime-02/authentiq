import React, { useState, useEffect } from "react";
import axios from "axios";

export const CategoryDropdown = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Get adminAuthToken from storage
  const getAuthToken = () => {
    return (
      localStorage.getItem("adminAuthToken") ||
      sessionStorage.getItem("adminAuthToken")
    );
  };

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getAuthToken();
        const response = await axios.get(
          "https://isans.pythonanywhere.com/shop/category/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle category selection
  const handleSelect = (event) => {
    const selectedValue = event.target.value;
    setSelectedCategory(selectedValue);

    // Notify the parent component of the selected category
    if (onCategorySelect) {
      onCategorySelect(selectedValue);
    }
  };
  return (
    <div>
      <select value={selectedCategory} onChange={handleSelect}>
        <option value="" disabled>
          Select a category
        </option>
        {categories.map((category) => (
          <option key={category.name} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import { Textinput } from "./Textinput";

export const AddCategory = ({ onCategoryAdded }) => {
  const [newCategory, setNewCategory] = useState("");

  // Get adminAuthToken from storage
  const getAuthToken = () => {
    return (
      localStorage.getItem("adminAuthToken") ||
      sessionStorage.getItem("adminAuthToken")
    );
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
