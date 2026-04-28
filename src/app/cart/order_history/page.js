// app/cart/order_history/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Add this import
import { useOrderStore } from "@/stores";
import { useAuthStore } from "@/stores";
import OrderList from "./components/OrderList";
import OrderFilters from "./components/OrderFilters";
import OrderPagination from "./components/OrderPagination";
import {
  ShoppingBag,
  Package,
  Loader2,
  Clock,
  CheckCircle2,
  Truck,
  Loader,
} from "lucide-react";
import Link from "next/link";
import { isAuthenticated } from "../../../../lib/axiosInstance";

const OrderHistoryPage = () => {
  const router = useRouter(); // Add this

  const {
    userOrderHistory,
    userOrdersPagination,
    userOrdersFilters,
    loadingOrders,
    loadingMutation,
    fetchOrderHistory,
    cancelOrder,
    setUserOrdersPage,
    applyUserFilters,
    resetUserFilters,
  } = useOrderStore();

  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchOrderHistory();
    }
  }, []);

  // Update this function
  const handleViewOrder = (orderId) => {
    router.push(`/cart/order_history/${orderId}`);
  };

  const handleCancelOrder = async (orderId) => {
    setCancellingOrderId(orderId);
    try {
      await cancelOrder(orderId);
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handlePageChange = (page) => {
    setUserOrdersPage(page);
  };

  const handleFilterChange = (filters) => {
    applyUserFilters(filters);
  };

  const handleResetFilters = () => {
    resetUserFilters();
  };

  // Order statistics for summary cards (calculated from current page data)
  const orderStats = {
    pending: userOrderHistory.filter((o) => o.status === "pending").length,
    processing: userOrderHistory.filter((o) => o.status === "processing")
      .length,
    shipped: userOrderHistory.filter((o) => o.status === "shipped").length,
    delivered: userOrderHistory.filter((o) => o.status === "delivered").length,
  };

  return (
    <main className="my-32 w-[90%] max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-Montserrat">
            My Orders
          </h1>
          <p className="text-secondary mt-2">Track and manage your orders</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold"
        >
          <ShoppingBag size={20} />
          Continue Shopping
        </Link>
      </div>

      {/* Quick Stats - Only shown when there are orders */}
      {userOrderHistory.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <OrderStatCard
            icon={Clock}
            label="Pending"
            value={orderStats.pending}
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
          <OrderStatCard
            icon={Package}
            label="Processing"
            value={orderStats.processing}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <OrderStatCard
            icon={Truck}
            label="Shipped"
            value={orderStats.shipped}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
          <OrderStatCard
            icon={CheckCircle2}
            label="Delivered"
            value={orderStats.delivered}
            color="text-green-600"
            bgColor="bg-green-50"
          />
        </div>
      )}

      {/* Filters */}
      <div className="mb-6">
        <OrderFilters
          currentFilters={userOrdersFilters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      </div>

      {/* Orders List */}
      {loadingOrders && userOrderHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader size={100} className="text-primary-600 animate-spin mb-4" />
          <p className="text-secondary">Loading your orders...</p>
        </div>
      ) : userOrderHistory.length === 0 ? (
        <div className="card rounded-2xl p-12 text-center">
          <Package size={64} className="text-muted mx-auto mb-4" />
          <h2 className="text-xl font-bold font-Montserrat mb-2">
            No Orders Yet
          </h2>
          <p className="text-secondary mb-6">
            {userOrdersFilters.status
              ? `No ${userOrdersFilters.status} orders found.`
              : "You haven't placed any orders yet. Start shopping to see your orders here."}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold"
          >
            <ShoppingBag size={20} />
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <OrderList
            orders={userOrderHistory}
            onViewOrder={handleViewOrder}
            onCancelOrder={handleCancelOrder}
            cancellingOrderId={cancellingOrderId}
            loadingMutation={loadingMutation}
          />

          {/* Results Summary */}
          <div className="text-sm text-muted mt-4">
            Showing {userOrderHistory.length} of{" "}
            {userOrdersPagination.totalItems} total orders
          </div>

          {/* Pagination */}
          {userOrdersPagination.totalPages > 1 && (
            <div className="mt-6">
              <OrderPagination
                pagination={userOrdersPagination}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </main>
  );
};

// Order Stat Card Component
const OrderStatCard = ({ icon: Icon, label, value, color, bgColor }) => {
  return (
    <div className="card rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon size={20} className={color} />
        </div>
        <div>
          <p className="text-xs text-muted">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
