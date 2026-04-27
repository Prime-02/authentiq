"use client";
import React, { useState } from "react";
import Modal from "@/components/Modal/Modal";
import { toast } from "react-toastify";
import axiosInstance from "../../../../../../lib/axiosInstance";
import { ToggleLeft, ToggleRight, AlertCircle } from "lucide-react";

const ProductStatusModal = ({ isOpen, product, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) return null;

  const isCurrentlyActive = product.is_active !== false;
  const targetState = !isCurrentlyActive;
  const action = targetState ? "Activate" : "Deactivate";
  const Icon = targetState ? ToggleRight : ToggleLeft;
  const iconColor = targetState ? "text-green-500" : "text-amber-500";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axiosInstance.patch(
        `/shop/admin/products/${product.id}/set-active?is_active=${targetState}`,
      );
      toast.success(`Product ${action.toLowerCase()}d successfully.`);
      onSuccess();
    } catch (err) {
      toast.error(
        err.response?.data?.detail ||
          `Failed to ${action.toLowerCase()} product.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${action} Product`}
      onSubmit={handleSubmit}
      buttonValue={isSubmitting ? "Saving…" : `${action} Product`}
      disabled={isSubmitting}
      loading={isSubmitting}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-light)]">
          <Icon size={24} className={`${iconColor} shrink-0 mt-0.5`} />
          <div>
            <p className="font-semibold text-[var(--text-primary)]">
              {product.name}
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              Currently:{" "}
              <span
                className={
                  isCurrentlyActive
                    ? "text-green-600 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {isCurrentlyActive ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
        </div>

        <div
          className={`flex items-start gap-2 p-3 rounded-lg text-sm
          ${targetState ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}
        >
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p>
            {targetState
              ? "Activating will make this product visible and purchasable by customers."
              : "Deactivating will hide this product from customers. Existing orders will not be affected."}
          </p>
        </div>

        <p className="text-sm text-[var(--text-secondary)]">
          Are you sure you want to <strong>{action.toLowerCase()}</strong> this
          product?
        </p>
      </div>
    </Modal>
  );
};

export default ProductStatusModal;
