// components/PaymentFailed.jsx
import React from "react";
import Link from "next/link";
import {
  XCircle,
  ArrowLeft,
  RefreshCw,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";

const PaymentFailed = ({ details }) => {
  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="w-[90%] max-w-md mx-auto text-center">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
          style={{ backgroundColor: "var(--error-100)" }}
        >
          <XCircle size={40} style={{ color: "var(--error-500)" }} />
        </div>

        <h1
          className="text-2xl md:text-3xl font-bold mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          Payment Failed
        </h1>
        <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
          {details?.message ||
            "Your payment could not be processed. Please try again."}
        </p>

        {details?.reference && (
          <div className="mb-6">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Reference: <span className="font-mono">{details.reference}</span>
            </p>
            {details?.status && (
              <p
                className="text-sm mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                Status:{" "}
                <span className="font-medium capitalize">{details.status}</span>
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href="/cart"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-px hover:shadow-md"
            style={{
              backgroundColor: "var(--primary-600)",
              color: "var(--text-inverse)",
            }}
          >
            <RefreshCw size={20} />
            Try Again
          </Link>

          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-px"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              border: "2px solid var(--border-color)",
            }}
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
