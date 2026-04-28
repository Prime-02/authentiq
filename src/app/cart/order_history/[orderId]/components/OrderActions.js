import React from "react";
import { XCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const OrderActions = ({
  canCancel,
  onCancelOrder,
  isCancelling,
  loadingMutation,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {canCancel && (
        <button
          onClick={onCancelOrder}
          disabled={loadingMutation || isCancelling}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-Poppins font-semibold text-sm
            bg-[var(--error-50)] dark:bg-[var(--error-900)] 
            text-[var(--error-700)] dark:text-[var(--error-300)]
            border-2 border-[var(--error-200)] dark:border-[var(--error-800)]
            hover:bg-[var(--error-100)] dark:hover:bg-[var(--error-800)]
            active:scale-[0.98]
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {isCancelling ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Cancelling...
            </>
          ) : (
            <>
              <XCircle size={18} />
              Cancel Order
            </>
          )}
        </button>
      )}
      <Link
        href="/cart/order_history"
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-Poppins font-semibold text-sm
          bg-[var(--bg-secondary)]
          text-[var(--text-primary)]
          border-2 border-[var(--border-color)]
          hover:bg-[var(--bg-tertiary)]
          active:scale-[0.98]
          transition-all duration-200"
      >
        <ArrowLeft size={18} />
        Back to Orders
      </Link>
    </div>
  );
};

export default OrderActions;
