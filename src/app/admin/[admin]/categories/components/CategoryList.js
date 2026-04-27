// CategoryList.js - Updated with View Products action and preview
"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Pen,
  Trash2,
  LayoutGrid,
  List,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
  FolderTree,
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
} from "lucide-react";
import { Loader } from "@/components/Loader/Loader";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ActionMenu = ({
  category,
  onEdit,
  onToggleStatus,
  onDelete,
  onViewProducts,
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({});

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const menuWidth = 170;
      const menuHeight = 250;
      let top = rect.bottom + 4;
      let left = rect.right - menuWidth;
      if (left < 0) left = rect.left;
      if (top + menuHeight > window.innerHeight) {
        top = rect.top - menuHeight - 4;
      }
      if (left + menuWidth > window.innerWidth) {
        left = window.innerWidth - menuWidth - 8;
      }
      setMenuStyle({
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 9999,
      });
    }
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div
          ref={menuRef}
          style={menuStyle}
          className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl shadow-xl min-w-[170px] py-1 text-sm"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewProducts(category);
              setOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition-colors"
          >
            <Eye size={14} className="text-blue-500" />
            View Products
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(category);
              setOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition-colors"
          >
            <Pen size={14} className="text-[var(--primary-600)]" />
            Edit details
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(category);
              setOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition-colors"
          >
            {category.is_active !== false ? (
              <>
                <ToggleLeft size={14} className="text-amber-500" />
                Deactivate
              </>
            ) : (
              <>
                <ToggleRight size={14} className="text-green-500" />
                Activate
              </>
            )}
          </button>

          <hr className="my-1 border-[var(--border-light)]" />

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(category);
              setOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 transition-colors"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </>
  );
};

const StatusBadge = ({ isActive }) =>
  isActive !== false ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
      Inactive
    </span>
  );

const ProductPreviewCard = ({ product }) => (
  <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors group">
    <div className="w-8 h-8 rounded-md overflow-hidden bg-[var(--bg-tertiary)] shrink-0">
      {product.image_url ? (
        <Image
          src={product.image_url}
          alt={product.name}
          width={32}
          height={32}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Package size={14} className="text-[var(--text-muted)]" />
        </div>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-[var(--text-primary)] truncate">
        {product.name}
      </p>
      <p className="text-[10px] text-[var(--text-muted)]">
        ${parseFloat(product.price).toFixed(2)}
      </p>
    </div>
  </div>
);

const TABLE_HEADERS = [
  "#",
  "Image",
  "Name",
  "Description",
  "Products",
  "Status",
  "Actions",
];

const CategoryList = ({
  categories,
  loading,
  onEdit,
  onToggleStatus,
  onDelete,
  onViewProducts,
  onPageChange,
  currentSkip = 0,
  limit = 100,
}) => {
  const [viewMode, setViewMode] = useState("card");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const totalPages = Math.max(1, Math.ceil((categories?.length || 0) / limit));
  const currentPage = Math.floor(currentSkip / limit) + 1;

  const toggleExpand = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const EmptyState = ({ variant = "table" }) => (
    <>
      {variant === "table" ? (
        <tr>
          <td colSpan={TABLE_HEADERS.length} className="py-16 text-center">
            <div className="flex flex-col items-center gap-3 text-[var(--text-muted)]">
              <FolderTree size={40} strokeWidth={1.5} />
              <p className="text-base font-semibold text-[var(--text-primary)]">
                No categories found
              </p>
              <p className="text-sm">
                Create your first category to get started
              </p>
            </div>
          </td>
        </tr>
      ) : (
        <div className="flex flex-col items-center gap-3 py-16 text-[var(--text-muted)]">
          <FolderTree size={40} strokeWidth={1.5} />
          <p className="text-base font-semibold text-[var(--text-primary)]">
            No categories found
          </p>
          <p className="text-sm">Create your first category to get started</p>
        </div>
      )}
    </>
  );

  const renderTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-color)]">
            {TABLE_HEADERS.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-light)]">
          {loading ? (
            <tr>
              <td colSpan={TABLE_HEADERS.length} className="py-16 text-center">
                <Loader />
              </td>
            </tr>
          ) : categories.length > 0 ? (
            categories.map((cat, i) => (
              <React.Fragment key={cat.id}>
                <tr
                  className="hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                  onClick={() => onViewProducts(cat)}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      {currentSkip + i + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {cat.image_url ? (
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded-lg border border-[var(--border-light)]"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-light)] flex items-center justify-center">
                        <FolderTree
                          size={20}
                          className="text-[var(--text-muted)]"
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--text-primary)] hover:text-[var(--primary-600)] transition-colors">
                      {cat.name}
                    </p>
                  </td>
                  <td className="px-4 py-3 max-w-[300px]">
                    <p className="text-xs text-[var(--text-muted)] truncate">
                      {cat.description || "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[var(--text-secondary)]">
                        {cat.product_count || cat.products_count || 0}
                      </span>
                      {cat.products && cat.products.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(cat.id);
                          }}
                          className="text-xs text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium"
                        >
                          {expandedCategory === cat.id ? "Hide" : "Preview"}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge isActive={cat.is_active} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewProducts(cat);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Eye size={14} />
                        View
                      </button>
                      <ActionMenu
                        category={cat}
                        onEdit={onEdit}
                        onToggleStatus={onToggleStatus}
                        onDelete={onDelete}
                        onViewProducts={onViewProducts}
                      />
                    </div>
                  </td>
                </tr>
                {/* Product Preview Row */}
                {expandedCategory === cat.id && cat.products && (
                  <tr key={`${cat.id}-preview`}>
                    <td
                      colSpan={TABLE_HEADERS.length}
                      className="px-4 py-3 bg-[var(--bg-tertiary)]"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                            Products in this category
                          </p>
                          <button
                            onClick={() => onViewProducts(cat)}
                            className="text-xs text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium flex items-center gap-1"
                          >
                            View all <Eye size={12} />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {cat.products.slice(0, 5).map((product) => (
                            <ProductPreviewCard
                              key={product.id}
                              product={product}
                            />
                          ))}
                          {cat.products.length > 5 && (
                            <div className="flex items-center justify-center p-2 text-xs text-[var(--text-muted)]">
                              +{cat.products.length - 5} more products
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <EmptyState variant="table" />
          )}
        </tbody>
      </table>
    </div>
  );

  const renderCards = () => (
    <div className="p-4">
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader />
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl hover:shadow-md transition-shadow flex flex-col cursor-pointer"
              onClick={() => onViewProducts(cat)}
            >
              {/* Image */}
              <div className="relative h-40 bg-[var(--bg-tertiary)] rounded-t-xl overflow-hidden shrink-0">
                {cat.image_url ? (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderTree
                      size={48}
                      className="text-[var(--text-muted)]"
                    />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <StatusBadge isActive={cat.is_active} />
                </div>
                <div
                  className="absolute top-2 right-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ActionMenu
                    category={cat}
                    onEdit={onEdit}
                    onToggleStatus={onToggleStatus}
                    onDelete={onDelete}
                    onViewProducts={onViewProducts}
                  />
                </div>
              </div>

              {/* Body */}
              <div className="p-3.5 flex flex-col gap-2.5 flex-1">
                {/* Name */}
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-snug flex-1">
                    {cat.name}
                  </h3>
                </div>

                {/* Description */}
                {cat.description && (
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                )}

                {/* Detail rows */}
                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs mt-0.5">
                  <span className="text-[var(--text-muted)] font-medium">
                    Products
                  </span>
                  <span className="text-[var(--text-secondary)]">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--primary-100)] text-[var(--primary-700)] font-semibold text-xs">
                      {cat.product_count || cat.products_count || 0}
                    </span>
                  </span>

                  <span className="text-[var(--text-muted)] font-medium">
                    Status
                  </span>
                  <span>
                    <StatusBadge isActive={cat.is_active} />
                  </span>
                </div>

                {/* Product Previews */}
                {cat.products && cat.products.length > 0 && (
                  <div className="pt-2 border-t border-[var(--border-light)]">
                    <div className="space-y-1">
                      {cat.products.slice(0, 3).map((product) => (
                        <ProductPreviewCard
                          key={product.id}
                          product={product}
                        />
                      ))}
                      {cat.products.length > 3 && (
                        <p className="text-[10px] text-[var(--text-muted)] text-center">
                          +{cat.products.length - 3} more
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div
                  className="flex gap-2 pt-2 border-t border-[var(--border-light)] mt-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onViewProducts(cat)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium
                               bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    <Eye size={13} /> View Products
                  </button>
                  <button
                    onClick={() => onEdit(cat)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium
                               bg-[var(--primary-600)] text-white hover:bg-[var(--primary-700)] transition-colors"
                  >
                    <Pen size={13} /> Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState variant="card" />
      )}
    </div>
  );

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-light)] bg-[var(--bg-tertiary)]">
        <span className="text-xs text-[var(--text-muted)] font-medium">
          {loading
            ? "Loading…"
            : `${categories.length} categor${categories.length !== 1 ? "ies" : "y"}`}
        </span>
        {!loading && categories.length > 0 && (
          <div className="flex bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] overflow-hidden">
            {[
              { mode: "table", Icon: List, label: "Table" },
              { mode: "card", Icon: LayoutGrid, label: "Cards" },
            ].map(({ mode, Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors
                  ${
                    viewMode === mode
                      ? "bg-[var(--primary-600)] text-white"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                  }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="overflow-x-auto" >
        {viewMode === "table" ? renderTable() : renderCards()}
      </div>

      {/* Pagination */}
      {categories.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-color)] bg-[var(--bg-tertiary)]">
          <p className="text-xs text-[var(--text-muted)]">
            Showing{" "}
            <span className="font-medium text-[var(--text-primary)]">
              {currentSkip + 1}
            </span>
            –
            <span className="font-medium text-[var(--text-primary)]">
              {Math.min(currentSkip + limit, categories.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[var(--text-primary)]">
              {categories.length}
            </span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(0, currentSkip - limit))}
              disabled={currentSkip === 0}
              className="p-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-[var(--text-primary)] font-medium px-1">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentSkip + limit)}
              disabled={currentSkip + limit >= categories.length}
              className="p-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
