// components/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  Mail,
  ShoppingBag,
  ArrowRight,
  Calendar,
  CreditCard,
  Hash,
  Clock,
  ChevronDown,
  ChevronUp,
  Copy,
  Shield,
  Truck,
  Package,
  Home,
  Lock,
} from "lucide-react";
import { toast } from "react-toastify";
import Confetti from "./Confetti";

const PaymentSuccess = ({ details }) => {
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  // Show confetti on mount
  useEffect(() => {
    // You can add confetti animation here
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: details?.currency || "NGN",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopyReference = () => {
    navigator.clipboard.writeText(details?.reference);
    setCopied(true);
    toast.success("Reference copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReceipt = () => {
    // Implement receipt download logic
    toast.info("Receipt download started");
  };

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom, var(--success-50), var(--bg-primary))",
      }}
    >
      {/* Confetti Animation */}
      <Confetti />

      <div className="w-[90%] max-w-3xl mx-auto py-16">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 animate-bounce"
            style={{ backgroundColor: "var(--success-100)" }}
          >
            <CheckCircle2 size={48} style={{ color: "var(--success-600)" }} />
          </div>

          <h1
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ color: "var(--success-700)" }}
          >
            Payment Successful!
          </h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Thank you for your purchase. Your payment has been confirmed.
          </p>
        </div>

        {/* Payment Card */}
        <div
          className="rounded-2xl shadow-lg overflow-hidden mb-6"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--success-100)",
          }}
        >
          {/* Amount Section */}
          <div
            className="p-8 text-center"
            style={{
              background:
                "linear-gradient(to right, var(--success-500), var(--success-600))",
              color: "var(--text-inverse)",
            }}
          >
            <p className="text-sm mb-2" style={{ color: "var(--success-100)" }}>
              Amount Paid
            </p>
            <p className="text-4xl md:text-5xl font-bold mb-1">
              {formatCurrency(details?.amount)}
            </p>
            <p className="text-sm" style={{ color: "var(--success-100)" }}>
              via {details?.channel || "Card"}
            </p>
          </div>

          {/* Transaction Details */}
          <div className="p-6" style={{ color: "var(--text-primary)" }}>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <CreditCard size={20} style={{ color: "var(--primary-600)" }} />
              Transaction Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <Hash size={18} style={{ color: "var(--text-muted)" }} />
                <div className="min-w-0">
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Reference
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm font-medium truncate">
                      {details?.reference}
                    </p>
                    <button
                      onClick={handleCopyReference}
                      className="flex-shrink-0 p-1 rounded transition-colors"
                      style={{ backgroundColor: "var(--bg-tertiary)" }}
                      title="Copy reference"
                    >
                      <Copy
                        size={14}
                        style={{
                          color: copied
                            ? "var(--success-500)"
                            : "var(--text-muted)",
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <Calendar size={18} style={{ color: "var(--text-muted)" }} />
                <div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Date
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(details?.transactionDate || details?.paidAt)}
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <Mail size={18} style={{ color: "var(--text-muted)" }} />
                <div className="min-w-0">
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Email
                  </p>
                  <p className="text-sm font-medium truncate">
                    {details?.email}
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <CreditCard size={18} style={{ color: "var(--text-muted)" }} />
                <div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Payment Method
                  </p>
                  <p className="text-sm font-medium capitalize">
                    {details?.channel || "Card"}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Details Toggle */}
            {details?.orderId && (
              <div
                className="mt-4 pt-4"
                style={{ borderTop: "1px solid var(--border-color)" }}
              >
                <button
                  onClick={() => setShowOrderDetails(!showOrderDetails)}
                  className="w-full flex items-center justify-between p-3 rounded-lg transition-colors"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <div className="flex items-center gap-2">
                    <Package
                      size={18}
                      style={{ color: "var(--primary-600)" }}
                    />
                    <span className="font-medium">Order Details</span>
                    <span style={{ color: "var(--text-muted)" }}>
                      (#{details?.orderId})
                    </span>
                  </div>
                  {showOrderDetails ? (
                    <ChevronUp
                      size={20}
                      style={{ color: "var(--text-muted)" }}
                    />
                  ) : (
                    <ChevronDown
                      size={20}
                      style={{ color: "var(--text-muted)" }}
                    />
                  )}
                </button>

                {showOrderDetails && (
                  <div
                    className="mt-3 p-4 rounded-lg space-y-3"
                    style={{ backgroundColor: "var(--bg-secondary)" }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p style={{ color: "var(--text-muted)" }}>Order ID</p>
                        <p className="font-semibold">{details?.orderId}</p>
                      </div>
                      <div>
                        <p style={{ color: "var(--text-muted)" }}>
                          Order Status
                        </p>
                        <span
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: "var(--success-100)",
                            color: "var(--success-700)",
                          }}
                        >
                          <CheckCircle2 size={12} />
                          Confirmed
                        </span>
                      </div>
                      <div>
                        <p style={{ color: "var(--text-muted)" }}>
                          Estimated Delivery
                        </p>
                        <p className="font-semibold">
                          {new Date(
                            Date.now() + 3 * 24 * 60 * 60 * 1000,
                          ).toLocaleDateString("en-NG", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Delivery Information */}
        <div
          className="rounded-2xl shadow-lg p-6 mb-6"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <h2
            className="text-lg font-semibold mb-4 flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}
          >
            <Truck size={20} style={{ color: "var(--primary-600)" }} />
            What's Next?
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--primary-100)" }}
              >
                <Mail size={16} style={{ color: "var(--primary-600)" }} />
              </div>
              <div>
                <p
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Confirmation Email Sent
                </p>
                <p style={{ color: "var(--text-secondary)" }}>
                  We've sent a confirmation email to {details?.email} with your
                  order details and receipt.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--primary-100)" }}
              >
                <Package size={16} style={{ color: "var(--primary-600)" }} />
              </div>
              <div>
                <p
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Order Processing
                </p>
                <p style={{ color: "var(--text-secondary)" }}>
                  Your order is being processed and will be shipped within 1-2
                  business days.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--primary-100)" }}
              >
                <Truck size={16} style={{ color: "var(--primary-600)" }} />
              </div>
              <div>
                <p
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Track Your Order
                </p>
                <p style={{ color: "var(--text-secondary)" }}>
                  Once shipped, you'll receive a tracking number to monitor your
                  delivery status.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownloadReceipt}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-px"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              border: "2px solid var(--border-color)",
            }}
          >
            <Download size={20} />
            Download Receipt
          </button>

          <Link
            href="/orders"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-px hover:shadow-md"
            style={{
              backgroundColor: "var(--primary-600)",
              color: "var(--text-inverse)",
            }}
          >
            <ShoppingBag size={20} />
            View Orders
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-semibold transition-colors"
            style={{ color: "var(--primary-600)" }}
          >
            <Home size={18} />
            Continue Shopping
          </Link>
        </div>

        {/* Security Badge */}
        <div
          className="flex items-center justify-center gap-4 mt-8 pt-8"
          style={{ borderTop: "1px solid var(--border-color)" }}
        >
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            <Shield size={16} style={{ color: "var(--success-500)" }} />
            <span>Secure Payment</span>
          </div>
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            <Lock size={16} style={{ color: "var(--success-500)" }} />
            <span>SSL Encrypted</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentSuccess;
