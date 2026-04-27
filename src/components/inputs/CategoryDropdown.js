"use client";
import React, { useState, useEffect } from "react";
import Dropdown from "./DynamicDropdown";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import { Textinput } from "./Textinput";
import { FileInput } from "./FIleInput";
import Modal from "../Modal/Modal";
import { useCategoryStore } from "@/stores";

// ============================================================================
// CATEGORY DROPDOWN COMPONENT
// ============================================================================

export const CategoryDropdown = ({
  onCategorySelect,
  initialValue,
  className = "",
  placeholder = "Select a category",
  showOnlyActive = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const {
    categories,
    fetchCategories,
    loadingCategories,
    fetchAdminCategories,
  } = useCategoryStore();

  // Fetch categories on mount if not available
  useEffect(() => {
    if (!categories || categories.length === 0) {
      if (!showOnlyActive) {
        fetchAdminCategories({ includeProducts: false }).then((data) => {
          // Admin categories are returned directly, not stored in state
          // We'll handle this in the dropdown options
        });
      } else {
        fetchCategories({ includeProducts: false });
      }
    }
  }, []);

  // Set initial value if provided
  useEffect(() => {
    if (initialValue) {
      setSelectedCategory(initialValue);
    }
  }, [initialValue]);

  // Handle category selection
  const handleSelect = (selectedItem) => {
    // The selected item could be the entire category object or just the ID/name
    const selectedValue =
      typeof selectedItem === "object"
        ? selectedItem.id || selectedItem.name || selectedItem
        : selectedItem;

    setSelectedCategory(selectedValue);

    // Notify the parent component of the selected category
    if (onCategorySelect) {
      if (typeof selectedItem === "object" && selectedItem.id) {
        onCategorySelect(selectedItem.id); // Send UUID to parent
      } else {
        onCategorySelect(selectedValue);
      }
    }
  };

  // Find the currently selected category object for display
  const getSelectedDisplayValue = () => {
    if (!selectedCategory) return null;

    const selected = categories.find(
      (cat) => cat.id === selectedCategory || cat.name === selectedCategory,
    );

    return selected ? { id: selected.id, name: selected.name } : null;
  };

  return (
    <div className={className}>
      <Dropdown
        options={categories}
        onSelect={handleSelect}
        tag="category"
        className="w-full"
        placeholder={placeholder}
        valueKey="id" // Use UUID as the value
        displayKey="name" // Display the name
        selectedValue={getSelectedDisplayValue()}
        emptyMessage={
          loadingCategories
            ? "Loading categories..."
            : "No categories available"
        }
        filterFn={(category) =>
          showOnlyActive ? category.is_active !== false : true
        }
      />
    </div>
  );
};

export const AddCategory = ({ onCategoryAdded }) => {
  const [newCategory, setNewCategory] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { createCategory, loadingMutation } = useCategoryStore();

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file.");
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB.");
        return;
      }

      setCategoryImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setCategoryImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

  // Handle adding a new category
  const handleAddCategory = async (e) => {
    e && e.preventDefault();

    // Validate input
    if (!newCategory.trim()) {
      toast.warning("Please enter a category name.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createCategory({
        name: newCategory.trim(),
        description: categoryDescription.trim() || undefined,
        image: categoryImage || undefined,
      });

      // Reset form
      setNewCategory("");
      setCategoryDescription("");
      setCategoryImage(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
      setShowForm(false);

      // Notify parent if callback exists
      if (onCategoryAdded) {
        onCategoryAdded();
      }
    } catch (error) {
      console.error("Error adding category:", error);
      // Error toast is handled by the store
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isSubmitting) {
      e.preventDefault();
      handleAddCategory();
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setNewCategory("");
    setCategoryDescription("");
    setCategoryImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

  const isProcessing = isSubmitting || loadingMutation;

  return (
    <div>
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors hover:bg-[var(--bg-hover)] text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          <Plus size={18} />
          <span>Add New Category</span>
        </button>
      )}

      <Modal
        isOpen={showForm}
        onClose={handleClose}
        onSubmit={handleAddCategory}
        loading={isProcessing}
        disabled={isProcessing}
        buttonValue={isProcessing ? "Creating..." : "Create Category"}
        title="Add New Category"
      >
        <div className="space-y-5 p-3">
          {/* Image Upload Section */}
          <section className="flex flex-col items-center gap-3">
            <div className="relative">
              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="w-24 h-24 object-cover rounded-lg border border-[var(--border-color)]"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 bg-[var(--bg-tertiary)] rounded-lg border-2 border-dashed border-[var(--border-color)] flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-8 w-8 text-[var(--text-muted)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      No image
                    </p>
                  </div>
                </div>
              )}
            </div>

            <FileInput
              type="file"
              accept="image/*"
              changed={handleImageChange}
              isLoading={isProcessing}
            />

            {imagePreview && (
              <p className="text-xs text-[var(--text-muted)]">
                Click the × to remove image
              </p>
            )}
          </section>

          {/* Category Name */}
          <div>
            <Textinput
              label="Category Name *"
              type="text"
              value={newCategory}
              changed={(e) => setNewCategory(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border-2 rounded-xl w-full"
              placeholder="Enter category name"
              disabled={isProcessing}
            />
          </div>

          {/* Description */}
          <div>
            <Textinput
              label="Description (Optional)"
              type="text"
              value={categoryDescription}
              changed={(e) => setCategoryDescription(e.target.value)}
              className="border-2 rounded-xl w-full text-sm"
              placeholder="Brief description of the category"
              disabled={isProcessing}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
