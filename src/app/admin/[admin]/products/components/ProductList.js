"use client";
import React, { useState, useRef, useEffect } from "react";
import DynamicImage from "@/components/reusables/DynamicImage/DynamicImage";
import {
  Pen,
  Trash2,
  LayoutGrid,
  List,
  PackageSearch,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
  Boxes,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Loader } from "@/components/Loader/Loader";
import Barcode from "@/components/barcode/BarcodePage";
import Image from "next/image";

const StockBadge = ({ qty }) => {
  const config =
    qty > 10
      ? { cls: "bg-green-100 text-green-700", label: qty }
      : qty > 0
        ? { cls: "bg-amber-100 text-amber-700", label: qty }
        : { cls: "bg-red-100 text-red-700", label: "Out" };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${config.cls}`}
    >
      {config.label}
    </span>
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

/** Dropdown action menu with portal rendering to avoid clipping */
const ActionMenu = ({
  product,
  isAdmin,
  onEdit,
  onAdjustStock,
  onToggleStatus,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({});

  // Close when clicking outside
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

  // Position the menu when opened
  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const menuWidth = 170; // min-w-[170px]
      const menuHeight = 200; // estimated height

      let top = rect.bottom + 4;
      let left = rect.right - menuWidth;

      // Adjust if menu would go off screen
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
              onEdit(product);
              setOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition-colors"
          >
            <Pen size={14} className="text-[var(--primary-600)]" />
            Edit details
          </button>

          {isAdmin && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAdjustStock(product);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition-colors"
              >
                <Boxes size={14} className="text-indigo-500" />
                Adjust stock
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStatus(product);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition-colors"
              >
                {product.is_active !== false ? (
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
                  onDelete(product);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

const TABLE_HEADERS = [
  "",
  "Image",
  "Name",
  "Price",
  "Category",
  "Sizes",
  "Stock",
  "Barcode",
  "Status",
  "",
];

const ProductList = ({
  products,
  loading,
  isAdmin,
  onEdit,
  onAdjustStock,
  onToggleStatus,
  onDelete,
  onPageChange,
  currentSkip,
  limit,
}) => {
  const [viewMode, setViewMode] = useState("card");
  const totalPages = Math.max(1, Math.ceil(products.length / limit));
  const currentPage = Math.floor(currentSkip / limit) + 1;

  const EmptyState = ({ variant = "table" }) => (
    <>
      {variant === "table" ? (
        <tr>
          <td colSpan={TABLE_HEADERS.length} className="py-16 text-center">
            <div className="flex flex-col items-center gap-3 text-[var(--text-muted)]">
              <PackageSearch size={40} strokeWidth={1.5} />
              <p className="text-base font-semibold text-[var(--text-primary)]">
                No products found
              </p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          </td>
        </tr>
      ) : (
        <div className="flex flex-col items-center gap-3 py-16 text-[var(--text-muted)]">
          <PackageSearch size={40} strokeWidth={1.5} />
          <p className="text-base font-semibold text-[var(--text-primary)]">
            No products found
          </p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      )}
    </>
  );

  const renderTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm" style={{ tableLayout: "auto" }}>
        <thead>
          <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-color)]">
            {TABLE_HEADERS.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider whitespace-nowrap"
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
          ) : products.length > 0 ? (
            products.map((p, i) => (
              <tr
                key={p.id}
                className="hover:bg-[var(--bg-hover)] transition-colors group"
              >
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    {i + 1}
                  </span>
                </td>
                <td className="px-4 w-24 h-24 p-0">
                  {" "}
                  {/* Remove py-3 */}
                  <Image
                    src={p.image_url}
                    alt={p.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover rounded-lg border border-[var(--border-light)]"
                  />
                </td>
                <td className="px-4 py-3 max-w-[220px]">
                  <p className="font-medium text-[var(--text-primary)] truncate">
                    {p.name}
                  </p>
                  {p.description && (
                    <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                      {p.description.substring(0, 55)}
                      {p.description.length > 55 ? "…" : ""}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 font-semibold text-[var(--text-primary)] whitespace-nowrap">
                  ${parseFloat(p.price).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)] whitespace-nowrap">
                  {typeof p.category === "object"
                    ? p.category?.name || "—"
                    : p.category || "—"}
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)] whitespace-nowrap">
                  {p.sizes || "—"}
                </td>
                <td className="px-4 py-3">
                  <StockBadge qty={p.stock_quantity || 0} />
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">
                  {p.barcode ? (
                    <Barcode
                      value={p.barcode}
                      width={2.3}
                      height={32}
                      displayValue={true}
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge isActive={p.is_active} />
                </td>
                <td className="px-4 py-3">
                  <ActionMenu
                    product={p}
                    isAdmin={isAdmin}
                    onEdit={onEdit}
                    onAdjustStock={onAdjustStock}
                    onToggleStatus={onToggleStatus}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
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
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p, i) => (
            <div
              key={p.id}
              className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Image */}
              <div className="relative h-40 bg-[var(--bg-tertiary)] rounded-t-xl overflow-hidden shrink-0">
                <DynamicImage
                  className="w-full h-full object-cover"
                  width={400}
                  height={300}
                  prop={p.image_url}
                  prod={p.name}
                />
                <div className="absolute top-2 left-2">
                  <StatusBadge isActive={p.is_active} />
                </div>
                <div className="absolute top-2 right-2">
                  <ActionMenu
                    product={p}
                    isAdmin={isAdmin}
                    onEdit={onEdit}
                    onAdjustStock={onAdjustStock}
                    onToggleStatus={onToggleStatus}
                    onDelete={onDelete}
                  />
                </div>
              </div>

              {/* Body */}
              <div className="p-3.5 flex flex-col gap-2.5 flex-1">
                {/* Name + Price */}
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-snug flex-1">
                    {p.name}
                  </h3>
                  <span className="font-bold text-[var(--text-primary)] text-sm shrink-0">
                    ${parseFloat(p.price).toFixed(2)}
                  </span>
                </div>

                {/* Description */}
                {p.description && (
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                )}

                {/* Detail rows */}
                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs mt-0.5">
                  <span className="text-[var(--text-muted)] font-medium">
                    Stock
                  </span>
                  <span>
                    <StockBadge qty={p.stock_quantity || 0} />
                  </span>

                  <span className="text-[var(--text-muted)] font-medium">
                    Category
                  </span>
                  <span className="text-[var(--text-secondary)] truncate">
                    {typeof p.category === "object"
                      ? p.category?.name || "—"
                      : p.category || "—"}
                  </span>

                  {p.sizes && (
                    <>
                      <span className="text-[var(--text-muted)] font-medium">
                        Sizes
                      </span>
                      <span className="flex flex-wrap gap-1">
                        {p.sizes.split(",").map((size) => (
                          <span
                            key={size}
                            className="inline-flex px-1.5 py-0.5 rounded border border-[var(--border-color)] text-[10px] font-semibold text-[var(--text-secondary)] bg-[var(--bg-tertiary)]"
                          >
                            {size}
                          </span>
                        ))}
                      </span>
                    </>
                  )}

                  <span className="text-[var(--text-muted)] font-medium">
                    Barcode
                  </span>
                  <span className="font-mono text-[var(--text-secondary)] truncate">
                    {p.barcode || "—"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-[var(--border-light)] mt-auto">
                  <button
                    onClick={() => onEdit(p)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium
                               bg-[var(--primary-600)] text-[var(--text-inverse)] hover:bg-[var(--primary-700)] transition-colors"
                  >
                    <Pen size={13} /> Edit
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => onAdjustStock(p)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium
                                 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                    >
                      <Boxes size={13} /> Stock
                    </button>
                  )}
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
            : `${products.length} result${products.length !== 1 ? "s" : ""}`}
        </span>
        {!loading && products.length > 0 && (
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
                      ? "bg-[var(--primary-600)] text-[var(--text-inverse)]"
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
      <div className="overflow-auto">
        {" "}
        {/* Changed from default overflow */}
        {viewMode === "table" ? renderTable() : renderCards()}
      </div>

      {/* Pagination */}
      {products.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-color)] bg-[var(--bg-tertiary)]">
          <p className="text-xs text-[var(--text-muted)]">
            Showing{" "}
            <span className="font-medium text-[var(--text-primary)]">
              {currentSkip + 1}
            </span>
            –
            <span className="font-medium text-[var(--text-primary)]">
              {Math.min(currentSkip + limit, products.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[var(--text-primary)]">
              {products.length}
            </span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(0, currentSkip - limit))}
              disabled={currentSkip === 0}
              className="p-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] disabled:opacity-40
                         disabled:cursor-not-allowed hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-[var(--text-primary)] font-medium px-1">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentSkip + limit)}
              disabled={currentSkip + limit >= products.length}
              className="p-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] disabled:opacity-40
                         disabled:cursor-not-allowed hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
