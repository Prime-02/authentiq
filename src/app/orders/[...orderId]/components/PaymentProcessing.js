// components/PaymentProcessing.jsx
import React from "react";
import { Loader, Loader2 } from "lucide-react";

const PaymentProcessing = () => {
  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="text-center">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
          style={{ backgroundColor: "var(--primary-100)" }}
        >
          <Loader
            size={100}
            className="animate-spin"
          />
        </div>
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Verifying Payment
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Please wait while we confirm your payment...
        </p>
      </div>
    </main>
  );
};

export default PaymentProcessing;
