// components/PaymentInvalid.jsx
import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

const PaymentInvalid = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-[90%] max-w-md mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
          <AlertTriangle size={40} className="text-orange-500" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-3">Invalid Request</h1>
        <p className="text-secondary mb-6">
          No payment reference found. Please try your payment again.
        </p>

        <Link
          href="/cart"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Cart
        </Link>
      </div>
    </main>
  );
};

export default PaymentInvalid;
