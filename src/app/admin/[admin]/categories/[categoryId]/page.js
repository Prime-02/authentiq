// app/admin/[adminId]/categories/[categoryId]/page.js
"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { useBarcodeStore, useCategoryStore, useProductStore } from "@/stores";
import { Loader } from "@/components/Loader/Loader";
import ProductFilters from "../../products/components/ProductFilters";
import ProductList from "../../products/components/ProductList";
import ProductFormModal from "../../products/components/ProductFormModal";
import ProductStockModal from "../../products/components/ProductStockModal";
import ProductStatusModal from "../../products/components/ProductStatusModal";
import ProductDeleteModal from "../../products/components/ProductDeleteModal";
import { useAuthStore } from "@/stores";
import CategoryHeader from "./components/CategoryHeader";
import ProductsSectionHeader from "./components/ProductsSectionHeader";

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

const CategoryProductsPage = () => {
  const params = useParams();
  const { isAdmin } = useAuthStore();

  // Get raw store methods - avoid destructuring to prevent re-renders
  const categoryStore = useCategoryStore();
  const productStore = useProductStore();
  const barcodeStore = useBarcodeStore();

  // Use refs to track if we've already loaded data
  const hasLoaded = useRef(false);
  const currentCategoryId = useRef(null);

  const [category, setCategory] = useState(null);
  const [filters, setFilters] = useState({
    ...INITIAL_FILTERS,
    category_id: params.categoryId,
  });

  // Modal states
  const [modals, setModals] = useState({
    form: false,
    stock: false,
    status: false,
    delete: false,
  });
  const [activeProduct, setActiveProduct] = useState(null);
  const [formMode, setFormMode] = useState("create");

  // Load data only once on mount and when categoryId actually changes
  useEffect(() => {
    const categoryId = params.categoryId;

    // Skip if we've already loaded this category
    if (currentCategoryId.current === categoryId && hasLoaded.current) {
      return;
    }

    currentCategoryId.current = categoryId;

    const loadData = async () => {
      try {
        // Load category
        const categoryData = await categoryStore.fetchCategoryById(categoryId, {
          includeProducts: false,
        });
        if (categoryData) setCategory(categoryData);

        // Load barcodes
        barcodeStore.fetchBarcodes();

        // Load products
        const initialFilters = {
          ...INITIAL_FILTERS,
          category_id: categoryId,
        };
        setFilters(initialFilters);
        await productStore.fetchAdminProducts(initialFilters);

        hasLoaded.current = true;
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    loadData();
  }, [params.categoryId]); // Only re-run if categoryId actually changes

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, skip: 0 }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    productStore.fetchAdminProducts({ ...filters, skip: 0 });
  }, [filters, productStore]);

  const handleClearFilters = useCallback(() => {
    const resetFilters = {
      ...INITIAL_FILTERS,
      category_id: params.categoryId,
      skip: 0,
    };
    setFilters(resetFilters);
    productStore.fetchAdminProducts(resetFilters);
  }, [params.categoryId, productStore]);

  const handlePageChange = useCallback(
    (newSkip) => {
      setFilters((prev) => {
        const updated = { ...prev, skip: newSkip };
        productStore.fetchAdminProducts(updated);
        return updated;
      });
    },
    [productStore],
  );

  const openModal = useCallback((name, product = null) => {
    setActiveProduct(product);
    setModals((m) => ({ ...m, [name]: true }));
  }, []);

  const closeModal = useCallback((name) => {
    setModals((m) => ({ ...m, [name]: false }));
    setActiveProduct(null);
    if (name === "form") setFormMode("create");
  }, []);

  const handleSuccess = useCallback(() => {
    closeModal("form");
    productStore.fetchAdminProducts({ ...filters, skip: 0 });
  }, [closeModal, filters, productStore]);

  const handleAddProduct = useCallback(() => {
    setFormMode("create");
    setActiveProduct(null);
    openModal("form");
  }, [openModal]);

  const handleEditProduct = useCallback(
    (product) => {
      setFormMode("edit");
      openModal("form", product);
    },
    [openModal],
  );

  if (categoryStore.loadingCategories && !hasLoaded.current) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Category Header with Breadcrumb */}
      <CategoryHeader
        category={category}
        productCount={productStore.products?.length || 0}
      />

      {/* Products Section */}
      <div className="space-y-4">
        <ProductsSectionHeader onAddProduct={handleAddProduct} />

        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          isAdmin={isAdmin}
          categoryPage={true}
        />

        <ProductList
          products={productStore.products || []}
          loading={productStore.loadingProducts}
          onEdit={handleEditProduct}
          onAdjustStock={(p) => openModal("stock", p)}
          onToggleStatus={(p) => openModal("status", p)}
          onDelete={(p) => openModal("delete", p)}
          onPageChange={handlePageChange}
          currentSkip={filters.skip}
          limit={filters.limit}
          isAdmin={isAdmin}
        />
      </div>

      {/* Modals */}
      <ProductFormModal
        isOpen={modals.form}
        product={formMode === "edit" ? activeProduct : null}
        onClose={() => closeModal("form")}
        onSuccess={handleSuccess}
        categoryId={params.categoryId}
      />

      <ProductStockModal
        isOpen={modals.stock}
        product={activeProduct}
        onClose={() => closeModal("stock")}
        onSuccess={() => {
          closeModal("stock");
          productStore.fetchAdminProducts({ ...filters, skip: 0 });
        }}
      />

      <ProductStatusModal
        isOpen={modals.status}
        product={activeProduct}
        onClose={() => closeModal("status")}
        onSuccess={() => {
          closeModal("status");
          productStore.fetchAdminProducts({ ...filters, skip: 0 });
        }}
      />

      <ProductDeleteModal
        isOpen={modals.delete}
        product={activeProduct}
        onClose={() => closeModal("delete")}
        onSuccess={() => {
          closeModal("delete");
          productStore.fetchAdminProducts({ ...filters, skip: 0 });
        }}
      />
    </div>
  );
};

export default CategoryProductsPage;
