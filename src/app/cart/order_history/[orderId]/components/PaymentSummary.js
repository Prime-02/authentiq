import React from "react";
import { Receipt, TrendingUp, Truck, Calculator } from "lucide-react";

const PaymentSummary = ({ subtotal, shippingCost, tax, totalAmount }) => {
  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-sm">
          <Receipt size={20} className="text-white" />
        </div>
        <div>
          <h3 className="font-Montserrat font-semibold text-lg text-[var(--text-primary)]">
            Payment Summary
          </h3>
        </div>
      </div>

      {/* Total Amount - Featured */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] dark:from-[var(--primary-900)] dark:to-[var(--primary-800)]">
        <p className="font-Poppins text-xs text-[var(--primary-600)] dark:text-[var(--primary-400)] mb-1">
          Total Amount
        </p>
        <div className="flex items-baseline gap-1">
          <span className="font-Poppins text-sm text-[var(--primary-600)] dark:text-[var(--primary-400)]">
            ₦
          </span>
          <span className="font-Montserrat font-bold text-3xl text-[var(--primary-600)] dark:text-[var(--primary-400)]">
            {totalAmount?.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 rounded-lg bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-2">
            <Calculator size={16} className="text-[var(--text-muted)]" />
            <span className="font-Poppins text-sm text-[var(--text-secondary)]">
              Subtotal
            </span>
          </div>
          <span className="font-Poppins font-medium text-sm text-[var(--text-primary)]">
            ₦{subtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 rounded-lg bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-[var(--text-muted)]" />
            <span className="font-Poppins text-sm text-[var(--text-secondary)]">
              Shipping
            </span>
          </div>
          {shippingCost > 0 ? (
            <span className="font-Poppins font-medium text-sm text-[var(--text-primary)]">
              ₦{shippingCost?.toLocaleString()}
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              Free
            </span>
          )}
        </div>

        {tax > 0 && (
          <div className="flex justify-between items-center p-3 rounded-lg bg-[var(--bg-secondary)]">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[var(--text-muted)]" />
              <span className="font-Poppins text-sm text-[var(--text-secondary)]">
                Tax
              </span>
            </div>
            <span className="font-Poppins font-medium text-sm text-[var(--text-primary)]">
              ₦{tax?.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSummary;