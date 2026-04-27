// ProductDeleteModal.js - Updated to use useProductStore
"use client";
import React, { useState } from "react";
import Modal from "@/components/Modal/Modal";
import { toast } from "react-toastify";
import { useProductStore } from "@/stores";
import { Trash2, AlertTriangle } from "lucide-react";

const ProductDeleteModal = ({ isOpen, product, onClose, onSuccess }) => {
  const { deleteProduct, loadingMutation } = useProductStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  if (!product) return null;

  const isConfirmed = confirmText.trim().toLowerCase() === "delete";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConfirmed) {
      toast.warning('Type "delete" to confirm.');
      return;
    }
    setIsSubmitting(true);
    try {
      await deleteProduct(product.id);
      setConfirmText("");
      onSuccess();
    } catch (err) {
      toast.error("Failed to delete product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete Product"
      onSubmit={handleSubmit}
      buttonValue={
        isSubmitting || loadingMutation ? "Deleting…" : "Delete Product"
      }
      disabled={!isConfirmed || isSubmitting || loadingMutation}
      loading={isSubmitting || loadingMutation}
    >
      <div className="space-y-4">
        {/* Warning banner */}
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-700">
              This action cannot be undone
            </p>
            <p className="text-sm text-red-600 mt-0.5">
              Deleting this product will permanently remove it and all
              associated data.
            </p>
          </div>
        </div>

        {/* Product info */}
        <div className="flex items-center gap-3 p-3 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-light)]">
          <Trash2 size={18} className="text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {product.name}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              ${parseFloat(product.price).toFixed(2)} · Stock:{" "}
              {product.stock_quantity || 0}
            </p>
          </div>
        </div>

        {/* Confirmation input */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1.5">
            Type{" "}
            <span className="font-mono font-bold text-red-600">delete</span> to
            confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="delete"
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)]
                       text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ProductDeleteModal;
