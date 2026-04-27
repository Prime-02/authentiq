"use client";
import React, { useState } from "react";
import Modal from "@/components/Modal/Modal";
import { toast } from "react-toastify";
import { useCategoryStore } from "@/stores";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const CategoryStatusModal = ({ isOpen, category, onClose, onSuccess }) => {
  const { setCategoryActive, loadingMutation } = useCategoryStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCurrentlyActive = category?.is_active !== false;
  const action = isCurrentlyActive ? "deactivate" : "activate";

  const handleToggle = async () => {
    setIsSubmitting(true);
    try {
      await setCategoryActive(category.id, !isCurrentlyActive);
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${action.charAt(0).toUpperCase() + action.slice(1)} Category`}
      onSubmit={handleToggle}
      buttonValue={
        isSubmitting
          ? "Processing…"
          : `Confirm ${action.charAt(0).toUpperCase() + action.slice(1)}`
      }
      disabled={isSubmitting || loadingMutation}
      loading={isSubmitting || loadingMutation}
      variant="warning"
    >
      <div className="flex flex-col items-center gap-4 py-4">
        {isCurrentlyActive ? (
          <XCircle size={48} className="text-amber-500" />
        ) : (
          <CheckCircle size={48} className="text-green-500" />
        )}

        <div className="text-center space-y-2">
          <p className="text-[var(--text-primary)] font-medium">
            Are you sure you want to {action} this category?
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            Category:{" "}
            <span className="font-semibold text-[var(--text-primary)]">
              {category?.name}
            </span>
          </p>
          {isCurrentlyActive && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mt-2">
              <AlertTriangle size={16} className="text-amber-600 shrink-0" />
              <p className="text-xs text-amber-700">
                Products in this category will remain, but the category won't be
                visible to customers.
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CategoryStatusModal;
