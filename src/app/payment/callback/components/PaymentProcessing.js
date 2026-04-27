// components/PaymentProcessing.jsx
import React from "react";
import { Loader2 } from "lucide-react";

const PaymentProcessing = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
          <Loader2 size={40} className="text-primary-600 animate-spin" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Verifying Payment</h1>
        <p className="text-secondary">
          Please wait while we confirm your payment...
        </p>
      </div>
    </main>
  );
};

export default PaymentProcessing;
