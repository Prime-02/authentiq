// app/admin/[...slug]/orders/[orderId]/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrderStore, useAuthStore, useDeliveryCompanyStore } from "@/stores";
import { Package, ArrowLeft, RefreshCw, Loader, Loader2 } from "lucide-react";
import Link from "next/link";
import OrderHeader from "./components/OrderHeader";
import OrderItemsCard from "./components/OrderItemsCard";
import OrderStatusActions from "./components/OrderStatusActions";
import TrackingInfoCard from "./components/TrackingInfoCard";
import DeliveryCompanyCard from "./components/DeliveryCompanyCard";
import PaymentStatusCard from "./components/PaymentStatusCard";
import DangerZoneCard from "./components/DangerZoneCard";
import CustomerInfoCard from "./components/CustomerInfoCard";
import OrderMetaCard from "./components/OrderMetaCard";

const AdminOrderDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId;

  const {
    fetchOrder,
    updateOrderStatus,
    updateTracking,
    updatePaymentStatus,
    assignDeliveryCompany,
    unassignDeliveryCompany,
    deleteOrder,
    loadingMutation,
  } = useOrderStore();

  const { isAdmin, fetchUserData, userFirstName } = useAuthStore();
  const { deliveryCompanies, fetchDeliveryCompanies } =
    useDeliveryCompanyStore();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form visibility states
  const [showTrackingForm, setShowTrackingForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showDeliverySelect, setShowDeliverySelect] = useState(false);

  // Form data states
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (isAdmin && orderId) {
      loadOrder();
      fetchDeliveryCompanies();
    }
  }, [isAdmin, orderId]);

  const loadOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrder(orderId);
      if (data) {
        setOrder(data);
        // ✅ Use correct field names from API response
        setTrackingNumber(data.tracking_number || "");
        setShippingMethod(data.shipping_method || "");
        setPaymentStatus(data.payment_status || "");
        setTransactionId(data.transaction_id || "");
        setSelectedCompanyId(data.delivery_company_id || "");
      } else {
        setError("Order not found");
      }
    } catch (err) {
      setError("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    await loadOrder();
  };

  const handleTrackingUpdate = async () => {
    await updateTracking(orderId, trackingNumber, shippingMethod);
    setShowTrackingForm(false);
    await loadOrder();
  };

  const handlePaymentUpdate = async () => {
    await updatePaymentStatus(orderId, paymentStatus, transactionId);
    setShowPaymentForm(false);
    await loadOrder();
  };

  const handleAssignDelivery = async () => {
    await assignDeliveryCompany(orderId, selectedCompanyId);
    setShowDeliverySelect(false);
    await loadOrder();
  };

  const handleUnassignDelivery = async () => {
    await unassignDeliveryCompany(orderId);
    setShowDeliverySelect(false);
    await loadOrder();
  };

  const handleDeleteOrder = async () => {
    if (
      window.confirm("Delete this order permanently? This cannot be undone.")
    ) {
      await deleteOrder(orderId);
      router.push(`/admin/${userFirstName || "admin"}/orders`);
    }
  };

  const adminOrdersPath = `/admin/${userFirstName || "admin"}/orders`;

  // ── Access denied ──────────────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="p-8 bg-[var(--bg-secondary)] rounded-2xl text-center max-w-md border border-[var(--border-light)]">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--error-100)] flex items-center justify-center">
            <Package size={32} className="text-[var(--error-600)]" />
          </div>
          <h1 className="text-2xl font-bold font-Montserrat text-[var(--text-primary)] mb-2">
            Access Denied
          </h1>
          <p className="text-[var(--text-muted)]">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader className="animate-spin" size={100}/>
        <p className="text-[var(--text-muted)]">Loading order details...</p>
      </div>
    );
  }

  // ── Error / not found ──────────────────────────────────────────────────────
  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="p-8 bg-[var(--bg-secondary)] rounded-2xl text-center max-w-md border border-[var(--border-light)]">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--warning-100)] flex items-center justify-center">
            <Package size={32} className="text-[var(--warning-600)]" />
          </div>
          <h2 className="text-xl font-bold font-Montserrat text-[var(--text-primary)] mb-2">
            Order Not Found
          </h2>
          <p className="text-[var(--text-muted)] mb-6">
            {error || "The requested order could not be found."}
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={loadOrder} className="btn btn-ghost btn-md gap-2">
              <Loader2 size={16} />
              Retry
            </button>
            <Link href={adminOrdersPath} className="btn btn-primary btn-md">
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Use order_status to gate status action bar
  const isTerminal =
    order.order_status === "delivered" || order.order_status === "cancelled";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link
          href={adminOrdersPath}
          className="inline-flex items-center gap-2 px-3 py-2 text-[var(--text-muted)] hover:text-[var(--primary-600)] hover:bg-[var(--bg-secondary)] rounded-lg transition-all duration-200 text-sm"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>
      </nav>

      {/* Order Header — full width summary strip */}
      <OrderHeader order={order} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* ── Left / Main column ─────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order items + price breakdown */}
          <OrderItemsCard order={order} />
          {/* Status transition actions — hidden for terminal statuses */}
          {!isTerminal && (
            <OrderStatusActions
              order={order}
              onStatusUpdate={handleStatusUpdate}
              loading={loadingMutation}
            />
          )}
          {/* Tracking */}
          <TrackingInfoCard
            order={order}
            showForm={showTrackingForm}
            onToggleForm={() => setShowTrackingForm(!showTrackingForm)}
            trackingNumber={trackingNumber}
            onTrackingNumberChange={setTrackingNumber}
            shippingMethod={shippingMethod}
            onShippingMethodChange={setShippingMethod}
            onSave={handleTrackingUpdate}
            loading={loadingMutation}
          />
          {order.delivery_state}
          <DeliveryCompanyCard
            order={order}
            deliveryCompanies={deliveryCompanies}
            showSelect={showDeliverySelect}
            onToggleSelect={() => setShowDeliverySelect(!showDeliverySelect)}
            selectedCompanyId={selectedCompanyId}
            onCompanySelect={setSelectedCompanyId}
            onAssign={handleAssignDelivery}
            onUnassign={handleUnassignDelivery}
            loading={loadingMutation}
            deliveryState={order.delivery_state} // ✅ Pass the delivery state
          />
          {/* Payment */}
          <PaymentStatusCard
            order={order}
            showForm={showPaymentForm}
            onToggleForm={() => setShowPaymentForm(!showPaymentForm)}
            paymentStatus={paymentStatus}
            onPaymentStatusChange={setPaymentStatus}
            transactionId={transactionId}
            onTransactionIdChange={setTransactionId}
            onSave={handlePaymentUpdate}
            loading={loadingMutation}
          />
          {/* Danger zone — bottom of main column */}
          <DangerZoneCard
            onDelete={handleDeleteOrder}
            loading={loadingMutation}
          />
        </div>

        {/* ── Right / Sidebar column ─────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Customer info — uses order.user populated by admin fetch */}
          <CustomerInfoCard
            user={order.user}
            shippingAddress={order.shipping_address}
          />

          {/* Order timeline / meta */}
          <OrderMetaCard order={order} />
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailsPage;
