// components/PaymentFailed.jsx
import React from "react";
import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react";

const PaymentFailed = ({ details }) => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-[90%] max-w-md mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <XCircle size={40} className="text-red-500" />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-3">
          Payment Failed
        </h1>
        <p className="text-secondary mb-6">
          {details?.message || "Your payment could not be processed. Please try again."}
        </p>

        {details?.reference && (
          <p className="text-sm text-muted mb-6">
            Reference: {details.reference}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href="/cart"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold"
          >
            <RefreshCw size={20} />
            Try Again
          </Link>
          
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-border rounded-xl hover:bg-secondary transition-colors font-semibold"
          >
            <HelpCircle size={20} />
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
};

export default PaymentFailed;