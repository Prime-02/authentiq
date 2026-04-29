// components/OrderItemsCard.jsx
import React, { useState } from "react";
import {
  Package,
  Minus,
  Plus,
  Trash2,
  Tag,
  Truck,
  Receipt,
  ChevronDown,
  ChevronUp,
  ImageOff,
} from "lucide-react";

const OrderItemsCard = ({ order, onUpdateQuantity, onRemoveItem }) => {
  const [imageErrors, setImageErrors] = useState({});
  const [expandedItems, setExpandedItems] = useState({});

  const items = order?.order_items || [];
  const hasEditableItems = !!onUpdateQuantity || !!onRemoveItem;

  const toggleExpand = (itemId) => {
    setExpandedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleImageError = (itemId) => {
    setImageErrors((prev) => ({ ...prev, [itemId]: true }));
  };

  const formatCurrency = (amount) => {
    if (amount == null) return "₦0";
    return `₦${amount.toLocaleString("en-NG")}`;
  };

  const subtotal =
    order?.subtotal ||
    items.reduce((sum, item) => sum + (item.total_price || 0), 0);
  const shipping = order?.shipping_cost || 0;
  const tax = order?.tax || 0;
  const discount = order?.discount || 0;
  const total = order?.total_amount || subtotal + shipping + tax - discount;

  const breakdownItems = [
    { label: "Subtotal", value: subtotal },
    { label: "Shipping", value: shipping },
    ...(tax > 0 ? [{ label: "Tax", value: tax }] : []),
    ...(discount > 0
      ? [{ label: "Discount", value: -discount, isDiscount: true }]
      : []),
  ];

  if (!items.length) {
    return (
      <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-light)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
            <Package size={20} className="text-[var(--text-muted)]" />
          </div>
          <h3 className="text-lg font-bold font-Montserrat text-[var(--text-primary)]">
            Order Items
          </h3>
        </div>
        <div className="p-8 bg-[var(--bg-primary)] rounded-xl border border-dashed border-[var(--border-light)] text-center">
          <Package
            size={32}
            className="mx-auto text-[var(--border-color)] mb-3"
          />
          <p className="text-sm text-[var(--text-muted)]">
            No items in this order
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--info-100)] border border-[var(--info-200)] flex items-center justify-center">
              <Package size={20} className="text-[var(--info-600)]" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-Montserrat text-[var(--text-primary)]">
                Order Items
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                {items.length} item{items.length !== 1 ? "s" : ""} ·{" "}
                {items.reduce((sum, i) => sum + (i.quantity || 0), 0)} total qty
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--info-50)] text-[var(--info-700)] border border-[var(--info-200)] flex-shrink-0">
            <Receipt size={12} />
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Items List */}
      <div className="px-6">
        <div className="space-y-3">
          {items.map((item) => {
            const itemId = item.id || item.product_id;
            const isExpanded = expandedItems[itemId];
            const hasImageError = imageErrors[itemId];
            const canEdit = hasEditableItems && !order?.is_locked;

            return (
              <div
                key={itemId}
                className="group bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)] hover:border-[var(--border-hover)] transition-all duration-200 overflow-hidden"
              >
                {/* Main Row */}
                <div className="flex items-center gap-4 p-4">
                  {/* Product Image */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-light)] overflow-hidden flex items-center justify-center">
                      {!hasImageError && item.product?.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(itemId)}
                          loading="lazy"
                        />
                      ) : (
                        <ImageOff
                          size={20}
                          className="text-[var(--border-color)]"
                        />
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 bg-[var(--primary-800)] text-[var(--text-inverse)] text-xs font-bold rounded-full flex items-center justify-center">
                      {item.quantity}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-[var(--text-primary)] truncate">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-2 flex-wrap">
                          {item.product?.sku && (
                            <span className="inline-flex items-center gap-1">
                              <Tag size={10} />
                              {item.product.sku}
                            </span>
                          )}
                          <span>{formatCurrency(item.unit_price)} each</span>
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm text-[var(--text-primary)]">
                          {formatCurrency(item.total_price)}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {item.quantity} × {formatCurrency(item.unit_price)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expand/Collapse */}
                  {(item.product?.description || item.product?.attributes) && (
                    <button
                      onClick={() => toggleExpand(itemId)}
                      className="flex-shrink-0 p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="pl-20 text-sm text-[var(--text-secondary)] space-y-1">
                      {item.product?.description && (
                        <p className="line-clamp-2">
                          {item.product.description}
                        </p>
                      )}
                      {item.product?.attributes && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.entries(item.product.attributes).map(
                            ([key, value]) => (
                              <span
                                key={key}
                                className="inline-flex items-center px-2 py-0.5 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-light)] text-xs"
                              >
                                <span className="text-[var(--text-muted)] mr-1">
                                  {key}:
                                </span>
                                <span className="font-medium text-[var(--text-primary)]">
                                  {value}
                                </span>
                              </span>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quantity Controls */}
                {canEdit && (
                  <div className="px-4 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 pl-20">
                      <button
                        onClick={() =>
                          onUpdateQuantity?.(
                            itemId,
                            Math.max(1, (item.quantity || 1) - 1),
                          )
                        }
                        className="w-8 h-8 rounded-lg border border-[var(--border-light)] flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold text-[var(--text-primary)]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity?.(itemId, (item.quantity || 1) + 1)
                        }
                        className="w-8 h-8 rounded-lg border border-[var(--border-light)] flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemoveItem?.(itemId)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--error-600)] hover:bg-[var(--error-50)] transition-colors"
                    >
                      <Trash2 size={12} />
                      Remove
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="p-6 pt-4">
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-light)] overflow-hidden">
          <div className="p-4 space-y-2.5">
            {breakdownItems.map((row) => (
              <div
                key={row.label}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-[var(--text-muted)] flex items-center gap-2">
                  {row.label === "Shipping" && (
                    <Truck size={14} className="text-[var(--text-muted)]" />
                  )}
                  {row.label}
                </span>
                <span
                  className={`font-medium ${
                    row.isDiscount
                      ? "text-[var(--success-600)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  {row.value < 0 ? "-" : ""}
                  {formatCurrency(Math.abs(row.value))}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="px-4 py-4 bg-[var(--bg-tertiary)] border-t border-[var(--border-light)]">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-[var(--text-primary)]">
                Total Amount
              </span>
              <span className="text-xl font-bold text-[var(--primary-600)]">
                {formatCurrency(total)}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1 text-right">
              Including VAT where applicable
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItemsCard;
