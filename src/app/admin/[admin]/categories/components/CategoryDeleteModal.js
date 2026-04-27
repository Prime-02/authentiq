"use client";
import React, { useState } from "react";
import Modal from "@/components/Modal/Modal";
import { toast } from "react-toastify";
import { useCategoryStore } from "@/stores";
import { AlertTriangle, Trash2 } from "lucide-react";

const CategoryDeleteModal = ({ isOpen, category, onClose, onSuccess }) => {
  const { deleteCategory, loadingMutation } = useCategoryStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteCategory(category.id);
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Category"
      onSubmit={handleDelete}
      buttonValue={isSubmitting ? "Deleting…" : "Delete Category"}
      disabled={isSubmitting || loadingMutation}
      loading={isSubmitting || loadingMutation}
      variant="danger"
    >
      <div className="flex flex-col items-center gap-4 py-4">
        <Trash2 size={48} className="text-red-500" />

        <div className="text-center space-y-2">
          <p className="text-[var(--text-primary)] font-medium">
            Are you sure you want to delete this category?
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            Category:{" "}
            <span className="font-semibold text-[var(--text-primary)]">
              {category?.name}
            </span>
          </p>

          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-2">
            <AlertTriangle size={16} className="text-red-600 shrink-0" />
            <p className="text-xs text-red-700">
              This action cannot be undone. Products in this category will need
              to be reassigned.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CategoryDeleteModal;
