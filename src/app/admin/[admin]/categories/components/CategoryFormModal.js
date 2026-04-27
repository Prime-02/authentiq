"use client";
import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal/Modal";
import { TextArea, Textinput } from "@/components/inputs/Textinput";
import { FileInput } from "@/components/inputs/FIleInput";
import { toast } from "react-toastify";
import { useCategoryStore } from "@/stores";

const EMPTY_FORM = {
  id: null,
  name: "",
  description: "",
  img: null,
  imgPreview: null,
};

const CategoryFormModal = ({ isOpen, category, onClose, onSuccess }) => {
  const isEditMode = Boolean(category);
  const { createCategory, updateCategory, loadingMutation } =
    useCategoryStore();
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category && isOpen) {
      setForm({
        id: category.id || null,
        name: category.name || "",
        description: category.description || "",
        img: null,
        imgPreview: category.image_url || null,
      });
    } else if (!category && isOpen) {
      setForm(EMPTY_FORM);
    }
  }, [category, isOpen]);

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
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.warning("Category name is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await updateCategory(form.id, {
          name: form.name.trim(),
          description: form.description.trim() || undefined,
          image: form.img instanceof File ? form.img : undefined,
        });
      } else {
        await createCategory({
          name: form.name.trim(),
          description: form.description.trim() || undefined,
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        isEditMode ? `Edit: ${form.name || "Category"}` : "Add New Category"
      }
      onSubmit={handleSubmit}
      buttonValue={
        isProcessing
          ? isEditMode
            ? "Saving…"
            : "Creating…"
          : isEditMode
            ? "Save Changes"
            : "Create Category"
      }
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
            placeholder="Category name"
          />
        </section>

        {/* Description */}
        <TextArea
          label="Description"
          rows={3}
          value={form.description}
          changed={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          placeholder="Category description (optional)"
        />
      </div>
    </Modal>
  );
};

export default CategoryFormModal;
