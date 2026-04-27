// app/admin/[adminId]/categories/page.js - Updated
"use client";
import React, { useEffect, useState, useCallback } from "react";
import CategoryList from "./components/CategoryList";
import CategoryFormModal from "./components/CategoryFormModal";
import CategoryStatusModal from "./components/CategoryStatusModal";
import CategoryDeleteModal from "./components/CategoryDeleteModal";
import { useCategoryStore } from "@/stores";
import { Plus } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

const INITIAL_FILTERS = {
  skip: 0,
  limit: 100,
};

const CategoryPage = () => {
  const router = useRouter();
  const params = useParams();
  const { fetchAdminCategories, loadingCategories } = useCategoryStore();
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // Modal states
  const [modals, setModals] = useState({
    form: false,
    status: false,
    delete: false,
  });
  const [activeCategory, setActiveCategory] = useState(null);
  const [formMode, setFormMode] = useState("create");

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await fetchAdminCategories({
      includeProducts: true,
      maxProducts: 5,
    });
    if (data) setCategories(data);
  };

  const openModal = (name, category = null) => {
    setActiveCategory(category);
    setModals((m) => ({ ...m, [name]: true }));
  };

  const closeModal = (name) => {
    setModals((m) => ({ ...m, [name]: false }));
    setActiveCategory(null);
    if (name === "form") setFormMode("create");
  };

  const handleSuccess = (modalName) => {
    closeModal(modalName);
    loadCategories();
  };

  const handleAddCategory = () => {
    setFormMode("create");
    setActiveCategory(null);
    openModal("form");
  };

  const handleEditCategory = (category) => {
    setFormMode("edit");
    openModal("form", category);
  };

  const handleViewProducts = (category) => {
    const adminId = params.adminId;
    router.push(`/admin/${adminId}/categories/${category.id}`);
  };

  const handlePageChange = (newSkip) => {
    setFilters((prev) => ({ ...prev, skip: newSkip }));
  };

  return (
    <div className="container mx-auto p-4 space-y-4 min-h-screen overflow-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Categories
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Manage product categories
          </p>
        </div>
        <button
          onClick={handleAddCategory}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-600)] text-white rounded-lg hover:bg-[var(--primary-700)] transition-colors font-medium text-sm"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Category List */}
      <CategoryList
        categories={categories}
        loading={loadingCategories}
        onEdit={handleEditCategory}
        onToggleStatus={(cat) => openModal("status", cat)}
        onDelete={(cat) => openModal("delete", cat)}
        onViewProducts={handleViewProducts}
        onPageChange={handlePageChange}
        currentSkip={filters.skip}
        limit={filters.limit}
      />

      {/* Modals */}
      <CategoryFormModal
        isOpen={modals.form}
        category={formMode === "edit" ? activeCategory : null}
        onClose={() => closeModal("form")}
        onSuccess={() => handleSuccess("form")}
      />

      <CategoryStatusModal
        isOpen={modals.status}
        category={activeCategory}
        onClose={() => closeModal("status")}
        onSuccess={() => handleSuccess("status")}
      />

      <CategoryDeleteModal
        isOpen={modals.delete}
        category={activeCategory}
        onClose={() => closeModal("delete")}
        onSuccess={() => handleSuccess("delete")}
      />
    </div>
  );
};

export default CategoryPage;
