// components/OrderDetailsModal.jsx
import React from "react";
import Modal from "@/components/Modal/Modal";
import {
  Package,
  MapPin,
  Calendar,
  Truck,
  CreditCard,
  XCircle,
  Loader2,
  Clock,
  Hash,
  Receipt,
  Building2,
  Phone,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import OrderTimeline from "./OrderTimeline";
import DynamicImage from "@/components/reusables/DynamicImage/DynamicImage";

const OrderDetailsModal = ({
  order,
  onClose,
  onCancelOrder,
  cancellingOrderId,
  loadingMutation,
}) => {
  if (!order) return null;

  // Map API status field names to what component expects
  const orderStatus = order.order_status || order.status;
  const paymentStatus = order.payment_status;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-[var(--warning-100)] text-[var(--warning-700)] border border-[var(--warning-200)]";
      case "processing":
        return "bg-[var(--info-100)] text-[var(--info-700)] border border-[var(--info-200)]";
      case "shipped":
        return "bg-[var(--primary-100)] text-[var(--primary-700)] border border-[var(--primary-200)]";
      case "delivered":
        return "bg-[var(--success-100)] text-[var(--success-700)] border border-[var(--success-200)]";
      case "cancelled":
        return "bg-[var(--error-100)] text-[var(--error-700)] border border-[var(--error-200)]";
      default:
        return "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-color)]";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-[var(--success-100)] text-[var(--success-700)] border border-[var(--success-200)]";
      case "pending":
        return "bg-[var(--warning-100)] text-[var(--warning-700)] border border-[var(--warning-200)]";
      case "failed":
        return "bg-[var(--error-100)] text-[var(--error-700)] border border-[var(--error-200)]";
      default:
        return "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-color)]";
    }
  };

  const canCancel = ["pending", "processing"].includes(
    orderStatus?.toLowerCase(),
  );

  const totalItems =
    order.order_items?.reduce((sum, item) => sum + (item.quantity || 0), 0) ||
    0;

  const subtotal =
    (order.total_amount || 0) - (order.tax || 0) - (order.shipping_cost || 0);

  return (
    <Modal isOpen={true} onClose={onClose} title="Order Details">
      <div className="space-y-5 font-Poppins">
        {/* Order Header - Enhanced Card */}
        <div className=" p-2 ">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[var(--text-primary)] font-Montserrat">
                  #{order.id?.slice(0, 8)}
                </h3>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[var(--text-muted)]" />
                  {new Date(
                    order.order_date || order.created_at,
                  ).toLocaleDateString("en-NG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="text-[var(--border-hover)]">•</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-[var(--text-muted)]" />
                  {new Date(
                    order.order_date || order.created_at,
                  ).toLocaleTimeString("en-NG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(orderStatus)}`}
              >
                {orderStatus?.charAt(0).toUpperCase() + orderStatus?.slice(1)}
              </span>
              {paymentStatus && (
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getPaymentStatusColor(paymentStatus)}`}
                >
                  {paymentStatus?.charAt(0).toUpperCase() +
                    paymentStatus?.slice(1)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status Timeline - Card Wrapped */}
        <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-light)]">
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2 font-Montserrat">
            <Clock size={16} className="text-[var(--primary-600)]" />
            Order Progress
          </h4>
          <OrderTimeline status={orderStatus} />
        </div>

        {/* Order Items - Enhanced Cards */}
        {order.order_items && order.order_items.length > 0 && (
          <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-light)]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 font-Montserrat">
                <Package size={16} className="text-[var(--primary-600)]" />
                Order Items
              </h4>
              <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-2 py-1 rounded-full">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
            <div className="space-y-2">
              {order.order_items.map((item, index) => {
                const itemTotal = (item.quantity || 0) * (item.unit_price || 0);
                // Get product details from the nested product object
                const productName =
                  item.product?.name || item.product_name || "Product";
                const productImage =
                  item.product?.image_url || item.image || "/placeholder.jpg";
                const productSizes = item.product?.sizes;
                console.log("Product info:", item);

                return (
                  <div
                    key={item.id || index}
                    className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-light)] hover:border-[var(--border-hover)] transition-all group"
                  >
                    <div className="relative">
                      <DynamicImage
                        prop={productImage}
                        width={500}
                        height={500}
                        alt={productName}
                        className="w-16 h-16 object-cover rounded-lg border border-[var(--border-light)]"
                      />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--primary-600)] text-[var(--text-inverse)] rounded-full text-xs flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--text-primary)] truncate">
                        {productName}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        ₦{item.unit_price?.toLocaleString()} each
                      </p>
                      {productSizes && (
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                          Sizes: {productSizes}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-600)] transition-colors">
                        ₦{itemTotal.toLocaleString()}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {item.quantity} × ₦{item.unit_price?.toLocaleString()}
                      </p>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Price Breakdown - Better Layout */}
        <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-light)]">
          <h4 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2 font-Montserrat">
            <Receipt size={16} className="text-[var(--primary-600)]" />
            Payment Summary
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-[var(--border-light)]">
              <span className="text-[var(--text-secondary)] text-sm">
                Subtotal
              </span>
              <span className="font-medium text-[var(--text-primary)]">
                ₦{subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[var(--border-light)]">
              <span className="text-[var(--text-secondary)] text-sm">
                Shipping
              </span>
              <span className="font-medium">
                {order.shipping_cost > 0 ? (
                  `₦${order.shipping_cost?.toLocaleString()}`
                ) : (
                  <span className="text-[var(--success-600)] font-semibold">
                    Free
                  </span>
                )}
              </span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-[var(--border-light)]">
                <span className="text-[var(--text-secondary)] text-sm">
                  Tax
                </span>
                <span className="font-medium text-[var(--text-primary)]">
                  ₦{order.tax?.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2">
              <span className="font-semibold text-[var(--text-primary)]">
                Total
              </span>
              <span className="text-xl font-bold text-[var(--primary-600)]">
                ₦{order.total_amount?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Order Information - Card Layout */}
        <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-light)]">
          <h4 className="font-semibold text-[var(--text-primary)] mb-3 font-Montserrat">
            Order Information
          </h4>
          <div className="space-y-3">
            {/* Order ID */}
            <div className="flex gap-3 p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-light)]">
              <Hash
                size={16}
                className="text-[var(--text-muted)] flex-shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--text-muted)] mb-1">
                  Order ID
                </p>
                <p className="font-mono text-sm text-[var(--text-primary)] break-all">
                  {order.id}
                </p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="flex gap-3 p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-light)]">
              <MapPin
                size={16}
                className="text-[var(--error-500)] flex-shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--text-muted)] mb-1">
                  Shipping Address
                </p>
                <p className="font-medium text-[var(--text-primary)]">
                  {order.shipping_address || "N/A"}
                </p>
              </div>
            </div>

            {/* Delivery Company */}
            {order.delivery_company && (
              <div className="flex gap-3 p-3 bg-[var(--primary-50)] rounded-lg border border-[var(--primary-200)]">
                <Building2
                  size={16}
                  className="text-[var(--primary-600)] flex-shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--primary-700)] mb-1">
                    Delivery Partner
                  </p>
                  <p className="font-medium text-[var(--text-primary)]">
                    {order.delivery_company.name}
                  </p>
                  {order.delivery_company.contact_number && (
                    <div className="flex items-center gap-1.5 mt-1 text-sm text-[var(--text-secondary)]">
                      <Phone size={12} />
                      <span>{order.delivery_company.contact_number}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tracking Number */}
            {order.tracking_number && (
              <div className="flex gap-3 p-3 bg-[var(--info-50)] rounded-lg border border-[var(--info-200)]">
                <Package
                  size={16}
                  className="text-[var(--info-600)] flex-shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--info-700)] mb-1">
                    Tracking Number
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm text-[var(--text-primary)]">
                      {order.tracking_number}
                    </p>
                    <button className="text-[var(--info-600)] hover:text-[var(--info-700)] transition-colors">
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Status */}
            <div className="flex gap-3 p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-light)]">
              <CreditCard
                size={16}
                className="text-[var(--success-500)] flex-shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--text-muted)] mb-1">
                  Payment Status
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(paymentStatus)}`}
                  >
                    {paymentStatus?.charAt(0).toUpperCase() +
                      paymentStatus?.slice(1) || "N/A"}
                  </span>
                  {order.payment_method && (
                    <span className="text-sm text-[var(--text-secondary)]">
                      via {order.payment_method}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Transaction Reference (was payment_reference) */}
            {order.transaction_id && (
              <div className="flex gap-3 p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-light)]">
                <Hash
                  size={16}
                  className="text-[var(--text-muted)] flex-shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--text-muted)] mb-1">
                    Transaction Reference
                  </p>
                  <p className="font-mono text-sm text-[var(--text-primary)] break-all">
                    {order.transaction_id}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions - Improved Styling */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {canCancel && (
            <button
              onClick={() => onCancelOrder(order.id)}
              disabled={loadingMutation || cancellingOrderId === order.id}
              className="flex items-center justify-center gap-2 px-6 py-3 text-[var(--error-600)] border-2 border-[var(--error-300)] rounded-xl hover:bg-[var(--error-50)] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {cancellingOrderId === order.id ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <XCircle size={18} />
              )}
              Cancel Order
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-[var(--border-color)] rounded-xl hover:bg-[var(--bg-secondary)] hover:border-[var(--border-hover)] transition-all font-semibold text-[var(--text-primary)] active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;
