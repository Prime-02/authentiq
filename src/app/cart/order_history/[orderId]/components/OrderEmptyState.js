import React from "react";
import { Package, ArrowLeft } from "lucide-react";
import Link from "next/link";

const OrderEmptyState = () => {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] py-20">
      <div className="w-[90%] max-w-md mx-auto">
        <div className="text-center p-8 md:p-12 rounded-2xl border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <div className="w-20 h-20 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mx-auto mb-6">
            <Package size={36} className="text-[var(--text-muted)]" />
          </div>
          <h2 className="font-Montserrat font-bold text-xl text-[var(--text-primary)] mb-2">
            Order Not Found
          </h2>
          <p className="font-Poppins text-sm text-[var(--text-secondary)] mb-8">
            The order you're looking for doesn't exist or may have been removed.
          </p>
          <Link
            href="/cart/order_history"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary-600)] text-white rounded-xl hover:bg-[var(--primary-700)] transition-all duration-200 font-Poppins font-medium shadow-lg shadow-[var(--primary-200)] dark:shadow-none active:scale-[0.98]"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OrderEmptyState;
