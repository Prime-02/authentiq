import React from "react";
import { Package, ChevronRight } from "lucide-react";
import DynamicImage from "@/components/reusables/DynamicImage/DynamicImage";
import { useRouter } from "next/navigation";

const OrderItems = ({ orderItems }) => {
  const router = useRouter();
  if (!orderItems || orderItems.length === 0) {
    return null;
  }

  const totalItems = orderItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary-100)] dark:bg-[var(--primary-800)] flex items-center justify-center">
            <Package
              size={20}
              className="text-[var(--primary-600)] dark:text-[var(--primary-400)]"
            />
          </div>
          <div>
            <h3 className="font-Montserrat font-semibold text-lg text-[var(--text-primary)]">
              Order Items
            </h3>
            <p className="font-Poppins text-xs text-[var(--text-muted)]">
              {totalItems} {totalItems === 1 ? "item" : "items"} in this order
            </p>
          </div>
        </div>
        <span className="font-Poppins text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {orderItems.map((item, index) => {
          const itemTotal = (item.quantity || 0) * (item.unit_price || 0);
          const productName =
            item.product?.name || item.product_name || "Product";
          const productImage =
            item.product?.image_url || item.image || "/placeholder.jpg";
          const productSizes = item.product?.sizes;

          return (
            <div
              onClick={() => {
                router.push(`/products/${item.id}`);
              }}
              key={item.id || index}
              className="group flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-all duration-200 cursor-pointer"
            >
              {/* Product Image */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-[var(--border-color)] bg-[var(--bg-primary)]">
                  <DynamicImage
                    prop={productImage}
                    width={500}
                    height={500}
                    alt={productName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--primary-600)] text-white text-xs flex items-center justify-center font-Poppins font-bold shadow-md">
                  {item.quantity}
                </span>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="font-Poppins font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--primary-600)] transition-colors">
                  {productName}
                </p>
                <p className="font-Poppins text-sm text-[var(--text-secondary)] mt-0.5">
                  ₦{item.unit_price?.toLocaleString()} each
                </p>
                {productSizes && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[var(--bg-primary)] text-xs font-medium text-[var(--text-muted)] border border-[var(--border-color)]">
                      {productSizes}
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <p className="font-Poppins font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-600)] transition-colors">
                  ₦{itemTotal.toLocaleString()}
                </p>
                <p className="font-Poppins text-xs text-[var(--text-muted)] mt-0.5">
                  {item.quantity} × ₦{item.unit_price?.toLocaleString()}
                </p>
              </div>

              <ChevronRight
                size={16}
                className="flex-shrink-0 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderItems;
