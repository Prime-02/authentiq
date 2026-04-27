"use client";
import React from "react";
import { Plus, Package, TrendingUp } from "lucide-react";
import { AddCategory } from "@/components/inputs/CategoryDropdown";

const PageHeader = ({ productCount, onAddProduct }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Package size={26} className="text-[var(--primary-600)]" />
          Product Catalogue
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-0.5 flex items-center gap-1">
          <TrendingUp size={14} />
          {productCount} product{productCount !== 1 ? "s" : ""} in catalogue
        </p>
      </div>
      <div className="flex items-center gap-2">
        <AddCategory />

        <button
          onClick={onAddProduct}
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--primary-600)] text-[var(--text-inverse)] rounded-lg
                     hover:bg-[var(--primary-700)] active:scale-95 transition-all font-medium shadow-sm"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>
    </div>
  );
};

export default PageHeader;
