"use client";
import React, { useState } from "react";
import Modal from "@/components/Modal/Modal";
import { toast } from "react-toastify";
import axiosInstance from "../../../../../../lib/axiosInstance";
import { Boxes, Plus, Minus } from "lucide-react";

const ProductStockModal = ({ isOpen, product, onClose, onSuccess }) => {
  const [delta, setDelta] = useState("");
  const [mode, setMode] = useState("add"); // "add" | "remove"
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) return null;

  const currentStock = product.stock_quantity || 0;
  const deltaNum = parseInt(delta) || 0;
  const previewStock =
    mode === "add" ? currentStock + deltaNum : currentStock - deltaNum;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!delta || deltaNum <= 0) {
      toast.warning("Please enter a valid quantity greater than 0.");
      return;
    }
    const adjustedDelta = mode === "add" ? deltaNum : -deltaNum;

    setIsSubmitting(true);
    try {
      await axiosInstance.patch(
        `/shop/admin/products/${product.id}/adjust-stock?delta=${adjustedDelta}`,
      );
      toast.success(
        `Stock ${mode === "add" ? "added" : "removed"} successfully. New stock: ${previewStock}`,
      );
      setDelta("");
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to adjust stock.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adjust Stock"
      onSubmit={handleSubmit}
      buttonValue={isSubmitting ? "Saving…" : "Apply Adjustment"}
      disabled={isSubmitting}
      loading={isSubmitting}
    >
      <div className="space-y-5">
        {/* Product info banner */}
        <div className="flex items-center gap-3 p-3 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-light)]">
          <Boxes size={20} className="text-indigo-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {product.name}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Current stock:{" "}
              <span className="font-bold text-[var(--text-primary)]">
                {currentStock}
              </span>{" "}
              units
            </p>
          </div>
        </div>

        {/* Mode toggle */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">
            Adjustment type
          </label>
          <div className="flex rounded-lg border border-[var(--border-color)] overflow-hidden">
            <button
              type="button"
              onClick={() => setMode("add")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors
                ${
                  mode === "add"
                    ? "bg-green-600 text-white"
                    : "bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                }`}
            >
              <Plus size={16} /> Add Stock
            </button>
            <button
              type="button"
              onClick={() => setMode("remove")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors
                ${
                  mode === "remove"
                    ? "bg-red-500 text-white"
                    : "bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                }`}
            >
              <Minus size={16} /> Remove Stock
            </button>
          </div>
        </div>

        {/* Delta input */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1.5">
            Quantity to {mode === "add" ? "add" : "remove"}
          </label>
          <input
            type="number"
            min="1"
            value={delta}
            onChange={(e) => setDelta(e.target.value)}
            placeholder="e.g. 50"
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)]
                       text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] transition"
          />
        </div>

        {/* Preview */}
        {deltaNum > 0 && (
          <div
            className={`p-3 rounded-lg border text-sm font-medium
            ${
              previewStock >= 0
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-600"
            }`}
          >
            {previewStock >= 0
              ? `New stock will be: ${previewStock} units`
              : `⚠️ Cannot reduce below 0 (would result in ${previewStock})`}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ProductStockModal;
