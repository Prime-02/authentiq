// app/admin/[adminId]/categories/[categoryId]/components/ProductsSectionHeader.js
"use client";
import React from "react";
import { TrendingUp, Plus } from "lucide-react";

const ProductsSectionHeader = ({ onAddProduct }) => {
  return (
    <div className="flex items-center flex-wrap gap-2 justify-between">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <TrendingUp size={22} className="text-[var(--primary-600)]" />
          Products in this Category
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onAddProduct}
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--primary-600)] text-white rounded-lg
                     hover:bg-[var(--primary-700)] active:scale-95 transition-all font-medium shadow-sm"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>
    </div>
  );
};

export default ProductsSectionHeader;
