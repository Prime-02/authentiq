"use client";
import { useBarcodeStore } from "@/stores/useBarcodeStore"; // Changed import
import { ButtonTwo } from "@/components/reusables/buttons/Buttons";
import React, { useState } from "react";
import { toast } from "react-toastify";

const BarcodeGeneratorControls = () => {
  const { createBarcode, createBarcodesBatch } = useBarcodeStore(); // Use store methods
  const [barcodeCount, setBarcodeCount] = useState(10);
  const [expiryDate, setExpiryDate] = useState("");
  const [expiryOption, setExpiryOption] = useState("5years");
  const [loading, setLoading] = useState(false);

  const generateBarcodesBatch = async () => {
    if (barcodeCount < 1 || barcodeCount > 1000) {
      toast.error("Number of barcodes must be between 1 and 1000");
      return;
    }
    setLoading(true);
    try {
      const payload = { quantity: barcodeCount };
      if (expiryOption === "custom" && expiryDate) {
        payload.expiresAt = new Date(expiryDate).toISOString();
      } else if (expiryOption === "none") {
        payload.expiresAt = null;
      }

      await createBarcodesBatch(payload);
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "An error occurred while generating barcodes.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-row w-full justify-between items-center flex-wrap gap-4 px-4 mb-6">
      {/* ── Inputs ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Quantity */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="barcodeCount"
            className="text-sm font-semibold font-Montserrat"
            style={{ color: "var(--text-secondary)" }}
          >
            Quantity
          </label>
          <input
            id="barcodeCount"
            type="number"
            value={barcodeCount}
            onChange={(e) =>
              setBarcodeCount(
                Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)),
              )
            }
            className="card px-3 py-2 rounded-lg w-24 text-sm border font-Poppins outline-none focus:border-indigo-400 transition-colors"
            style={{ borderColor: "var(--border-color)" }}
            min="1"
            max="1000"
            step="1"
          />
        </div>

        {/* Expiry selector */}
        <div className="flex items-center gap-2">
          <label
            className="text-sm font-semibold font-Montserrat"
            style={{ color: "var(--text-secondary)" }}
          >
            Expiry
          </label>
          <select
            value={expiryOption}
            onChange={(e) => setExpiryOption(e.target.value)}
            className="card px-3 py-2 rounded-lg text-sm border font-Poppins outline-none focus:border-indigo-400 transition-colors"
            style={{ borderColor: "var(--border-color)" }}
          >
            <option value="5years">5 years (default)</option>
            <option value="custom">Custom date</option>
            <option value="none">No expiry</option>
          </select>
        </div>

        {/* Custom date picker */}
        {expiryOption === "custom" && (
          <div className="flex items-center gap-2">
            <label
              htmlFor="expiryDate"
              className="text-sm font-semibold font-Montserrat"
              style={{ color: "var(--text-secondary)" }}
            >
              Date
            </label>
            <input
              id="expiryDate"
              type="datetime-local"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="card px-3 py-2 rounded-lg text-sm border font-Poppins outline-none focus:border-indigo-400 transition-colors"
              style={{ borderColor: "var(--border-color)" }}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        )}
      </div>

      {/* ── Action buttons ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <ButtonTwo
          Clicked={generateBarcodesBatch}
          disabled={loading}
          buttonValue={
            loading
              ? "Generating…"
              : `Generate ${barcodeCount} Barcode${barcodeCount > 1 ? "s" : ""}`
          }
          className="rounded-lg px-6 py-2"
        />
      </div>
    </div>
  );
};

export default BarcodeGeneratorControls;
