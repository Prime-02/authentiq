"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrderStore } from "@/stores";
import { Loader2, Package, ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { isAuthenticated } from "../../../../../lib/axiosInstance";
import OrderHeader from "./components/OrderHeader";
import OrderTimeline from "../components/OrderTimeline";
import OrderItems from "./components/OrderItems";
import PaymentSummary from "./components/PaymentSummary";
import OrderInformation from "./components/OrderInformation";
import OrderActions from "./components/OrderActions";
import OrderEmptyState from "./components/OrderEmptyState";
import LoadingState from "./components/LoadingState";

const OrderDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId;

  const { fetchOrder, cancelOrder, loadingMutation } = useOrderStore();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const loadOrder = async () => {
      setLoading(true);
      try {
        const orderData = await fetchOrder(orderId);
        if (orderData) {
          setOrder(orderData);
        } else {
          router.push("/cart/order_history");
        }
      } catch (error) {
        console.error("Failed to load order:", error);
        router.push("/cart/order_history");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId, fetchOrder, router]);

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      await cancelOrder(orderId);
      setIsRefreshing(true);
      const updatedOrder = await fetchOrder(orderId);
      if (updatedOrder) {
        setOrder(updatedOrder);
      }
    } catch (error) {
      console.error("Failed to cancel order:", error);
    } finally {
      setCancelling(false);
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!order) {
    return <OrderEmptyState />;
  }

  const orderStatus = order.order_status || order.status;
  const paymentStatus = order.payment_status;
  const canCancel = ["pending", "processing"].includes(
    orderStatus?.toLowerCase(),
  );
  const subtotal =
    (order.total_amount || 0) - (order.tax || 0) - (order.shipping_cost || 0);

  // Get the hero gradient based on order status
  const getHeroGradient = (status) => {
    const gradients = {
      pending: "from-amber-500 via-orange-500 to-orange-600",
      processing: "from-blue-500 via-cyan-500 to-cyan-600",
      shipped: "from-purple-500 via-pink-500 to-pink-600",
      delivered: "from-emerald-500 via-green-500 to-green-600",
      cancelled: "from-red-500 via-rose-500 to-rose-600",
    };
    return gradients[status?.toLowerCase()] || "from-gray-500 via-gray-600 to-gray-700";
  };

  const heroGradient = getHeroGradient(orderStatus);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/cart/order_history"
              className="text-[var(--text-secondary)] hover:text-[var(--primary-600)] transition-colors"
            >
              Orders
            </Link>
            <ChevronRight size={14} className="text-[var(--text-muted)]" />
            <span className="text-[var(--text-primary)] font-medium">
              Order #{order.id?.slice(0, 8)}
            </span>
          </div>
        </nav>

        {/* Main Content - Two Column Layout */}
        <div className="relative">
          {isRefreshing && (
            <div className="absolute inset-0 bg-[var(--bg-primary)]/60 backdrop-blur-sm z-50 rounded-3xl flex items-center justify-center">
              <div className="bg-[var(--bg-primary)] p-8 rounded-2xl shadow-xl border border-[var(--border-color)] flex flex-col items-center gap-3">
                <Loader2
                  size={40}
                  className="animate-spin text-[var(--primary-600)]"
                />
                <p className="font-Poppins text-sm font-medium text-[var(--text-secondary)]">
                  Updating order details...
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Header with Dynamic Gradient */}
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${heroGradient} p-6 md:p-8 text-white shadow-lg`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative">
                  <OrderHeader order={order} isHero />
                </div>
              </div>

              {/* Order Timeline - Sleek Design */}
              <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                <OrderTimeline status={orderStatus} />
                {canCancel && (
                  <div className="mt-6 pt-6 border-t border-[var(--border-light)]">
                    <OrderActions
                      canCancel={canCancel}
                      onCancelOrder={handleCancelOrder}
                      isCancelling={cancelling}
                      loadingMutation={loadingMutation}
                    />
                  </div>
                )}
              </div>

              {/* Order Items with Modern Card Design */}
              <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-6 md:p-8">
                  <OrderItems orderItems={order.order_items} />
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Payment Summary Card */}
              <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] p-6 shadow-sm hover:shadow-md transition-shadow sticky top-6">
                <PaymentSummary
                  subtotal={subtotal}
                  shippingCost={order.shipping_cost}
                  tax={order.tax}
                  totalAmount={order.total_amount}
                />
              </div>

              {/* Order Information Card */}
              <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] p-6 shadow-sm hover:shadow-md transition-shadow">
                <OrderInformation
                  orderId={order.id}
                  shippingAddress={order.shipping_address}
                  deliveryCompany={order.delivery_company}
                  trackingNumber={order.tracking_number}
                  paymentStatus={paymentStatus}
                  paymentMethod={order.payment_method}
                  transactionId={order.transaction_id}
                />
              </div>

              {/* Quick Actions */}
              {!canCancel && (
                <Link
                  href="/cart/order_history"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl font-Poppins font-semibold text-sm
                    bg-[var(--bg-secondary)]
                    text-[var(--text-primary)]
                    border border-[var(--border-color)]
                    hover:bg-[var(--bg-tertiary)]
                    active:scale-[0.98]
                    transition-all duration-200"
                >
                  <ArrowLeft size={18} />
                  Back to Orders
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetailsPage;