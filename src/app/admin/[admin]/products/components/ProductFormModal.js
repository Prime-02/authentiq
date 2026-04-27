"use client";
import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal/Modal";
import { TextArea, Textinput } from "@/components/inputs/Textinput";
import { FileInput } from "@/components/inputs/FIleInput";
import { CategoryDropdown } from "@/components/inputs/CategoryDropdown";
import Dropdown from "@/components/inputs/DynamicDropdown";
import { toast } from "react-toastify";
import { useBarcodeStore, useProductStore, useCategoryStore } from "@/stores";
import SizeSelector, { DEFAULT_SIZES } from "@/components/inputs/SizeSelector";
import { FolderTree } from "lucide-react";
import BarcodeSelect from "../../barcode/components/BarcodeSelect";

const EMPTY_FORM = {
  id: null,
  name: "",
  price: "",
  description: "",
  category: "",
  quantity: "",
  barcode: null, // Stores the barcode code (string)
  img: null,
  imgPreview: null,
  variants: DEFAULT_SIZES,
};

const ProductFormModal = ({
  isOpen,
  product,
  onClose,
  onSuccess,
  categoryId,
}) => {
  const isEditMode = Boolean(product);
  const { createProduct, updateProduct, loadingMutation } = useProductStore();
  const { fetchCategoryById } = useCategoryStore();
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [loadingCategory, setLoadingCategory] = useState(false);

  // Initialize form when product changes or categoryId is provided
  useEffect(() => {
    if (product && isOpen) {
      initializeForm(product);
    } else if (!product && isOpen) {
      initializeNewForm();
    }
  }, [product, isOpen, categoryId]);

  const initializeNewForm = async () => {
    const newForm = { ...EMPTY_FORM };

    if (categoryId) {
      newForm.category = categoryId;
      setForm(newForm);

      setLoadingCategory(true);
      try {
        const categoryData = await fetchCategoryById(categoryId, {
          includeProducts: false,
        });
        if (categoryData) {
          setCategoryName(categoryData.name);
        }
      } catch (error) {
        console.error("Failed to fetch category name:", error);
      } finally {
        setLoadingCategory(false);
      }
    } else {
      setForm(newForm);
      setCategoryName("");
    }
  };

  const initializeForm = (p) => {
    const variants = DEFAULT_SIZES.map((defaultVariant) => ({
      ...defaultVariant,
      checked: Array.isArray(p.sizes)
        ? p.sizes.includes(defaultVariant.size)
        : false,
    }));

    let category = "";
    if (typeof p.category === "object" && p.category?.id) {
      category = p.category.id;
      setCategoryName(p.category.name || "");
    } else if (p.category_id) {
      category = p.category_id;
      if (typeof p.category === "object" && p.category?.name) {
        setCategoryName(p.category.name);
      }
    } else if (p.category) {
      category = p.category;
    }

    // Extract barcode code
    let barcodeValue = null;
    if (p.barcode) {
      barcodeValue = typeof p.barcode === "object" ? p.barcode.code : p.barcode;
    }

    setForm({
      id: p.id || null,
      name: p.name || "",
      price: p.price?.toString() || "",
      description: p.description || "",
      category: category,
      quantity: p.stock_quantity?.toString() || "0",
      barcode: barcodeValue, // Store the barcode code string
      img: null,
      imgPreview: p.image_url || null,
      variants: variants,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    setForm((p) => ({
      ...p,
      img: file,
      imgPreview: URL.createObjectURL(file),
    }));
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setCategoryName("");
    onClose();
  };

  // Handle barcode selection - send the code, not the ID
  const handleBarcodeChange = (barcode) => {
    setForm((prev) => ({
      ...prev,
      barcode: barcode?.code || null, // Store the barcode code string
    }));
  };

  const validateForm = () => {
    const missing = [];
    if (!form.name.trim()) missing.push("Name");
    if (!form.price || parseFloat(form.price) <= 0) missing.push("Valid Price");
    if (!form.description.trim()) missing.push("Description");
    if (!form.quantity && form.quantity !== "0") missing.push("Quantity");
    if (parseInt(form.quantity) < 0) missing.push("Valid Quantity");
    if (!form.category && !isEditMode) missing.push("Category");

    if (missing.length) {
      toast.warning(`Please fill in: ${missing.join(", ")}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const sizes = form.variants
      .filter((v) => v.checked)
      .map((v) => v.size)
      .join(",");

    try {
      if (isEditMode) {
        await updateProduct(form.id, {
          name: form.name.trim(),
          price: parseFloat(form.price).toString(),
          categoryId: form.category || undefined,
          description: form.description.trim(),
          stockQuantity: parseInt(form.quantity).toString(),
          barcode: form.barcode || undefined, // Sends barcode code string
          sizes: sizes || undefined,
          image: form.img instanceof File ? form.img : undefined,
        });
      } else {
        await createProduct({
          name: form.name.trim(),
          price: parseFloat(form.price).toString(),
          categoryId: form.category || categoryId,
          description: form.description.trim(),
          stockQuantity: parseInt(form.quantity).toString(),
          barcode: form.barcode, // Sends barcode code string
          sizes: sizes || undefined,
          image: form.img instanceof File ? form.img : undefined,
        });
      }

      handleClose();
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isProcessing = isSubmitting || loadingMutation;

  const modalTitle = isEditMode
    ? `Edit: ${form.name || "Product"}`
    : categoryId
      ? `Add Product to ${categoryName || "Category"}`
      : "Add New Product";

  const submitButtonText = isProcessing
    ? isEditMode
      ? "Saving…"
      : "Creating…"
    : isEditMode
      ? "Save Changes"
      : "Create Product";

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={modalTitle}
      onSubmit={handleSubmit}
      buttonValue={submitButtonText}
      disabled={isProcessing}
      loading={isProcessing}
    >
      <div className="flex flex-col space-y-5">
        {/* Image Upload */}
        <section className="flex flex-col items-center gap-2">
          {form.imgPreview ? (
            <img
              src={form.imgPreview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg border"
            />
          ) : (
            <div className="w-24 h-24 bg-[var(--bg-tertiary)] rounded-lg border border-dashed border-[var(--border-color)] flex items-center justify-center">
              <p className="text-xs text-[var(--text-muted)] text-center leading-tight">
                No
                <br />
                image
              </p>
            </div>
          )}
          <FileInput
            isLoading={isProcessing}
            changed={handleImageChange}
            type="file"
            accept="image/*"
          />
        </section>

        {/* Name */}
        <section>
          <Textinput
            className="border-2 rounded-xl"
            type="text"
            label="Name *"
            value={form.name}
            changed={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Product name"
          />
        </section>

        {/* Price + Quantity */}
        <section className="flex gap-4">
          <span className="flex-1">
            <Textinput
              className="border-2 rounded-xl"
              type="number"
              label="Price ($) *"
              value={form.price}
              changed={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              min="0.01"
              step="0.01"
              placeholder="0.00"
            />
          </span>
          <span className="flex-1">
            <Textinput
              className="border-2 rounded-xl"
              type="number"
              label="Quantity *"
              value={form.quantity}
              changed={(e) =>
                setForm((p) => ({ ...p, quantity: e.target.value }))
              }
              min="0"
              placeholder="0"
            />
          </span>
        </section>

        {/* Category + Barcode */}
        <section className="flex gap-4">
          <span className="flex-1">
            {categoryId ? (
              // Read-only category when categoryId is provided
              <>
                <label className="text-sm text-[var(--text-secondary)] font-medium mb-1 block">
                  Category
                </label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] min-h-[42px]">
                  <FolderTree
                    size={16}
                    className="text-[var(--primary-600)] shrink-0"
                  />
                  <span className="text-sm text-[var(--text-primary)] font-medium truncate">
                    {loadingCategory ? (
                      <span className="text-[var(--text-muted)]">
                        Loading...
                      </span>
                    ) : (
                      categoryName || "Selected Category"
                    )}
                  </span>
                  {!isEditMode && (
                    <span className="text-xs text-[var(--primary-600)] bg-[var(--primary-50)] px-2 py-0.5 rounded-full font-medium shrink-0 ml-auto">
                      Auto-assigned
                    </span>
                  )}
                </div>
              </>
            ) : (
              // Editable category dropdown
              <>
                <label className="text-sm text-[var(--text-secondary)] font-medium mb-1 block">
                  Category {!isEditMode && "*"}
                </label>
                <div className="min-h-[42px]">
                  <CategoryDropdown
                    onCategorySelect={(id) =>
                      setForm((p) => ({ ...p, category: id || "" }))
                    }
                    initialValue={form.category}
                  />
                </div>
              </>
            )}
          </span>
        </section>

        {/* Barcode Select - Sends code, not ID */}
        <section>
          <label className="text-sm text-[var(--text-secondary)] font-medium mb-1 block">
            Barcode
          </label>
          <BarcodeSelect
            value={form.barcode} // Pass barcode code string
            onChange={handleBarcodeChange} // Handler that extracts the code
            statusFilter="active" // Only show active barcodes
            placeholder="Select a barcode (optional)..."
          />
          {form.barcode && (
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Selected: <span className="font-mono">{form.barcode}</span>
            </p>
          )}
        </section>

        {/* Description */}
        <TextArea
          label="Description *"
          rows={3}
          value={form.description}
          changed={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          placeholder="Enter product description…"
        />

        {/* Size Selector */}
        <SizeSelector
          sizes={form.variants}
          onChange={(updatedSizes) =>
            setForm((prev) => ({ ...prev, variants: updatedSizes }))
          }
          layout="grid"
        />
      </div>
    </Modal>
  );
};

export default ProductFormModal;
