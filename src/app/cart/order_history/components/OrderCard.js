// components/OrderCard.jsx
import React from "react";
import {
  Package,
  MapPin,
  Calendar,
  ChevronRight,
  Loader2,
  XCircle,
} from "lucide-react";
import DynamicImage from "@/components/reusables/DynamicImage/DynamicImage";

const OrderCard = ({
  order,
  onViewOrder,
  onCancelOrder,
  isCancelling,
  loadingMutation,
}) => {
  // Map API field names to what component expects
  const orderStatus = order.order_status || order.status;
  const paymentStatus = order.payment_status;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "⏳";
      case "processing":
        return "🔄";
      case "shipped":
        return "🚚";
      case "delivered":
        return "✅";
      case "cancelled":
        return "❌";
      default:
        return "📦";
    }
  };

  const canCancel = ["pending", "processing"].includes(
    orderStatus?.toLowerCase(),
  );

  // Calculate total items from order_items
  const totalItems =
    order.order_items?.reduce((sum, item) => sum + (item.quantity || 0), 0) ||
    0;

  return (
    <div className="card rounded-2xl border-2 border-border hover:border-primary-200 transition-all overflow-hidden">
      {/* Order Header */}
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Package size={20} className="text-primary-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold">
                  Order #{order.id?.slice(0, 8)}...
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                    orderStatus,
                  )}`}
                >
                  {getStatusIcon(orderStatus)}{" "}
                  {orderStatus?.charAt(0).toUpperCase() + orderStatus?.slice(1)}
                </span>
              </div>
              <p className="text-sm text-muted mt-1">
                {new Date(
                  order.order_date || order.created_at,
                ).toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary-600">
              ₦{order.total_amount?.toLocaleString()}
            </p>
            <p className="text-xs text-muted">
              {totalItems} item{totalItems !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-muted flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-muted text-xs">Shipping Address</p>
              <p className="font-medium truncate">
                {order.shipping_address || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-muted flex-shrink-0" />
            <div>
              <p className="text-muted text-xs">Payment Status</p>
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-0.5 capitalize ${
                  paymentStatus === "paid"
                    ? "bg-green-100 text-green-700"
                    : paymentStatus === "failed"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {paymentStatus || "Pending"}
              </span>
            </div>
          </div>
        </div>

        {/* Items Preview */}
        {order.order_items && order.order_items.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              {order.order_items.slice(0, 4).map((item, index) => {
                // Get product image from nested product object or fallback
                const productImage =
                  item.product?.image_url || "/placeholder.jpg";
                const productName =
                  item.product?.name || item.product_name || "Product";

                return (
                  <DynamicImage
                    key={item.id || index}
                    prop={productImage}
                    alt={productName}
                    className="w-12 h-12 object-cover rounded-lg border border-border"
                    onError={(e) => {
                      e.target.src = "/placeholder.jpg";
                    }}
                    width={500}
                    height={500}
                  />
                );
              })}
              {order.order_items.length > 4 && (
                <span className="text-sm text-muted ml-2">
                  +{order.order_items.length - 4} more items
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div>
            {order.tracking_number && (
              <p className="text-xs text-muted">
                Tracking:{" "}
                <span className="font-mono">{order.tracking_number}</span>
              </p>
            )}
            {/* Show delivery company if available */}
            {order.delivery_company && (
              <p className="text-xs text-muted mt-1">
                Delivery:{" "}
                <span className="font-medium">
                  {order.delivery_company.name}
                </span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {canCancel && (
              <button
                onClick={() => onCancelOrder(order.id)}
                disabled={loadingMutation || isCancelling}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 font-medium"
              >
                {isCancelling ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <XCircle size={14} />
                )}
                Cancel Order
              </button>
            )}
            <button
              onClick={() => onViewOrder(order.id)}
              className="flex items-center gap-1 px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              View Details
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
