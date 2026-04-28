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
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Confetti Animation */}
      <Confetti />

      <div className="w-[90%] max-w-3xl mx-auto py-16">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce">
            <CheckCircle2 size={48} className="text-green-600" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-3">
            Payment Successful!
          </h1>
          <p className="text-lg text-secondary">
            Thank you for your purchase. Your payment has been confirmed.
          </p>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden mb-6">
          {/* Amount Section */}
          <div className="p-8 bg-gradient-to-r from-green-500 to-green-600 text-white text-center">
            <p className="text-sm text-green-100 mb-2">Amount Paid</p>
            <p className="text-4xl md:text-5xl font-bold mb-1">
              {formatCurrency(details?.amount)}
            </p>
            <p className="text-sm text-green-100">
              via {details?.channel || "Card"}
            </p>
          </div>

          {/* Transaction Details */}
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard size={20} className="text-primary-600" />
              Transaction Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                <Hash size={18} className="text-muted flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted">Reference</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm font-medium truncate">
                      {details?.reference}
                    </p>
                    <button
                      onClick={handleCopyReference}
                      className="flex-shrink-0 p-1 hover:bg-tertiary rounded transition-colors"
                      title="Copy reference"
                    >
                      <Copy
                        size={14}
                        className={copied ? "text-green-500" : "text-muted"}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                <Calendar size={18} className="text-muted flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted">Date</p>
                  <p className="text-sm font-medium">
                    {formatDate(details?.transactionDate || details?.paidAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                <Mail size={18} className="text-muted flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted">Email</p>
                  <p className="text-sm font-medium truncate">
                    {details?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                <CreditCard size={18} className="text-muted flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted">Payment Method</p>
                  <p className="text-sm font-medium capitalize">
                    {details?.channel || "Card"}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Details Toggle */}
            {details?.orderId && (
              <div className="border-t border-border pt-4">
                <button
                  onClick={() => setShowOrderDetails(!showOrderDetails)}
                  className="w-full flex items-center justify-between p-3 hover:bg-secondary rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Package size={18} className="text-primary-600" />
                    <span className="font-medium">Order Details</span>
                    <span className="text-sm text-muted">
                      (#{details?.orderId})
                    </span>
                  </div>
                  {showOrderDetails ? (
                    <ChevronUp size={20} className="text-muted" />
                  ) : (
                    <ChevronDown size={20} className="text-muted" />
                  )}
                </button>

                {showOrderDetails && (
                  <div className="mt-3 p-4 bg-secondary rounded-lg space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted">Order ID</p>
                        <p className="font-semibold">{details?.orderId}</p>
                      </div>
                      <div>
                        <p className="text-muted">Order Status</p>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <CheckCircle2 size={12} />
                          Confirmed
                        </span>
                      </div>
                      <div>
                        <p className="text-muted">Estimated Delivery</p>
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
        <div className="bg-white rounded-2xl shadow-lg border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Truck size={20} className="text-primary-600" />
            What's Next?
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Mail size={16} className="text-primary-600" />
              </div>
              <div>
                <p className="font-medium">Confirmation Email Sent</p>
                <p className="text-sm text-secondary">
                  We've sent a confirmation email to {details?.email} with your
                  order details and receipt.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Package size={16} className="text-primary-600" />
              </div>
              <div>
                <p className="font-medium">Order Processing</p>
                <p className="text-sm text-secondary">
                  Your order is being processed and will be shipped within 1-2
                  business days.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Truck size={16} className="text-primary-600" />
              </div>
              <div>
                <p className="font-medium">Track Your Order</p>
                <p className="text-sm text-secondary">
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
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-border rounded-xl hover:bg-secondary transition-colors font-semibold"
          >
            <Download size={20} />
            Download Receipt
          </button>

          <Link
            href="/orders"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold"
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
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors font-semibold"
          >
            <Home size={18} />
            Continue Shopping
          </Link>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Shield size={16} className="text-green-500" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Lock size={16} className="text-green-500" />
            <span>SSL Encrypted</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentSuccess;
