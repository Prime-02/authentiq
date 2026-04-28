// components/PaymentInvalid.jsx
import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

const PaymentInvalid = () => {
  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="w-[90%] max-w-md mx-auto text-center">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
          style={{ backgroundColor: "var(--warning-100)" }}
        >
          <AlertTriangle size={40} style={{ color: "var(--warning-500)" }} />
        </div>

        <h1
          className="text-2xl md:text-3xl font-bold mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          Invalid Request
        </h1>
        <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
          No payment reference found. Please try your payment again.
        </p>

        <Link
          href="/cart"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-px hover:shadow-md"
          style={{
            backgroundColor: "var(--primary-600)",
            color: "var(--text-inverse)",
          }}
        >
          <ArrowLeft size={20} />
          Back to Cart
        </Link>
      </div>
    </main>
  );
};

export default PaymentInvalid;
