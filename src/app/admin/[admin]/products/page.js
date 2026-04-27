"use client";
import React, { useEffect, useState, useCallback } from "react";
import ProductFilters from "./components/ProductFilters";
import ProductList from "./components/ProductList";
import ProductFormModal from "./components/ProductFormModal";
import ProductStockModal from "./components/ProductStockModal";
import ProductStatusModal from "./components/ProductStatusModal";
import ProductDeleteModal from "./components/ProductDeleteModal";
import PageHeader from "./components/PageHeader";
import { Loader } from "@/components/Loader/Loader";
import {
  useAuthStore,
  useBarcodeStore,
  useCategoryStore,
  useProductStore,
} from "@/stores";

const INITIAL_FILTERS = {
  search: "",
  category_id: "",
  barcode: "",
  sizes: "",
  is_active: undefined,
  min_price: "",
  max_price: "",
  min_stock: "",
  max_stock: "",
  skip: 0,
  limit: 100,
};

const ProductTable = () => {
  const { isAdmin } = useAuthStore();
  const { fetchAdminCategories, loadingProducts } = useCategoryStore();
  const { fetchBarcodes } = useBarcodeStore();
  const { fetchAdminProducts, products } = useProductStore();

  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // Modal states
  const [modals, setModals] = useState({
    form: false, // Combined create/edit modal
    stock: false,
    status: false,
    delete: false,
  });
  const [activeProduct, setActiveProduct] = useState(null);
  const [formMode, setFormMode] = useState("create"); // 'create' or 'edit'

  // Bootstrap
  useEffect(() => {
    fetchAdminProducts(INITIAL_FILTERS);
    fetchAdminCategories?.();
    fetchBarcodes();
  }, []);

  // Debounced auto-fetch on quick filters
  useEffect(() => {
    const id = setTimeout(() => fetchAdminProducts(filters), 300);
    return () => clearTimeout(id);
  }, [filters.search, filters.category_id, filters.is_active]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, skip: 0 }));
  }, []);

  const handleApplyFilters = () => fetchAdminProducts(filters);

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
    fetchAdminProducts(INITIAL_FILTERS);
  };

  const handlePageChange = (newSkip) => {
    const updated = { ...filters, skip: newSkip };
    setFilters(updated);
    fetchAdminProducts(updated);
  };

  const openModal = (name, product = null) => {
    setActiveProduct(product);
    setModals((m) => ({ ...m, [name]: true }));
  };

  const closeModal = (name) => {
    setModals((m) => ({ ...m, [name]: false }));
    setActiveProduct(null);
    if (name === "form") {
      setFormMode("create");
    }
  };

  const handleSuccess = (modalName) => {
    closeModal(modalName);
    fetchAdminProducts(filters);
  };

  // Open form in create mode
  const handleAddProduct = () => {
    setFormMode("create");
    setActiveProduct(null);
    openModal("form");
  };

  // Open form in edit mode
  const handleEditProduct = (product) => {
    setFormMode("edit");
    openModal("form", product);
  };

  if (loadingProducts && !products?.length) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4 min-h-screen overflow-auto">
      <PageHeader
        productCount={products?.length || 0}
        onAddProduct={handleAddProduct}
      />

      <ProductFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        isAdmin={isAdmin}
      />

      <ProductList
        products={products || []}
        loading={loadingProducts}
        onEdit={handleEditProduct}
        onAdjustStock={(p) => openModal("stock", p)}
        onToggleStatus={(p) => openModal("status", p)}
        onDelete={(p) => openModal("delete", p)}
        onPageChange={handlePageChange}
        currentSkip={filters.skip}
        limit={filters.limit}
        isAdmin={isAdmin}
      />

      {/* Combined Create/Edit Modal */}
      <ProductFormModal
        isOpen={modals.form}
        product={formMode === "edit" ? activeProduct : null}
        onClose={() => closeModal("form")}
        onSuccess={() => handleSuccess("form")}
      />

      <ProductStockModal
        isOpen={modals.stock}
        product={activeProduct}
        onClose={() => closeModal("stock")}
        onSuccess={() => handleSuccess("stock")}
      />

      <ProductStatusModal
        isOpen={modals.status}
        product={activeProduct}
        onClose={() => closeModal("status")}
        onSuccess={() => handleSuccess("status")}
      />

      <ProductDeleteModal
        isOpen={modals.delete}
        product={activeProduct}
        onClose={() => closeModal("delete")}
        onSuccess={() => handleSuccess("delete")}
      />
    </div>
  );
};

export default ProductTable;
