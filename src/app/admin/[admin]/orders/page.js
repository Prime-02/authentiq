// app/admin/orders/page.jsx
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useOrderStore } from "@/stores";
import { useAuthStore } from "@/stores";
import AdminOrderList from "./components/AdminOrderList";
import AdminOrderFilters from "./components/AdminOrderFilters";
import AdminOrderPagination from "./components/AdminOrderPagination";
import AdminOrderQuickStats from "./components/AdminOrderQuickStats";
import { AdminOrderSkeletonList } from "./components/AdminOrderSkeleton";
import {
  Package,
  BarChart3,
  Loader2,
  RefreshCw,
  Inbox,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

const AdminOrdersPage = () => {
  const {
    orders,
    adminOrdersPagination,
    adminOrdersFilters,
    loadingOrders,
    loadingMutation,
    fetchOrders,
    fetchOrder,
    updateOrderStatus,
    updateTracking,
    updatePaymentStatus,
    assignDeliveryCompany,
    unassignDeliveryCompany,
    deleteOrder,
    setAdminOrdersPage,
    applyAdminFilters,
    resetAdminFilters,
    fetchQuickStats,
  } = useOrderStore();

  const { isAdmin, fetchUserData, userFirstName } = useAuthStore();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [quickStats, setQuickStats] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (isAdmin) {
      loadOrders();
      loadQuickStats();
    }
  }, [isAdmin]);

  const loadOrders = useCallback(async () => {
    await fetchOrders();
    setIsInitialLoad(false);
  }, [fetchOrders]);

  const loadQuickStats = useCallback(async () => {
    const stats = await fetchQuickStats(30);
    setQuickStats(stats);
  }, [fetchQuickStats]);

  const handleRefresh = async () => {
    setIsInitialLoad(true);
    await Promise.all([loadOrders(), loadQuickStats()]);
  };

  const handleViewOrder = async (orderId) => {
    // Navigate to detail page instead of modal
    window.location.href = `/admin/${userFirstName || "admin"}/orders/${orderId}`;
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    loadQuickStats();
  };

  const handleFilterChange = (filters) => {
    applyAdminFilters(filters);
  };

  const handleResetFilters = () => {
    resetAdminFilters();
  };

  const handlePageChange = (page) => {
    setAdminOrdersPage(page);
  };

  if (!isAdmin) {
    return (
      <main className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-[var(--error-50)] border border-[var(--error-200)] flex items-center justify-center mb-4">
          <AlertTriangle size={32} className="text-[var(--error-600)]" />
        </div>
        <h1 className="text-2xl font-bold font-Montserrat text-[var(--text-primary)] mb-2">
          Access Denied
        </h1>
        <p className="text-[var(--text-secondary)] max-w-md">
          You don't have permission to access this page. Please contact your
          administrator.
        </p>
      </main>
    );
  }

  const hasOrders = orders.length > 0;
  const isLoading = loadingOrders && isInitialLoad;
  const isRefreshing = loadingOrders && !isInitialLoad;

  return (
    <main className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-Montserrat text-[var(--text-primary)]">
            Orders Management
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={loadingOrders}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--border-light)] hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <Loader2
              size={18}
              className={loadingOrders ? "animate-spin" : ""}
            />
          </button>
          <Link
            href={`/admin/${userFirstName || "admin"}/orders/statistics`}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--primary-600)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--primary-700)] transition-colors font-semibold text-sm shadow-sm"
          >
            <BarChart3 size={18} />
            Statistics
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      {quickStats && (
        <div className="mb-8">
          <AdminOrderQuickStats stats={quickStats} />
        </div>
      )}

      {/* Filters */}
      <div className="mb-6">
        <AdminOrderFilters
          currentFilters={adminOrdersFilters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      </div>

      {/* Results Info */}
      {!isLoading && hasOrders && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-[var(--text-muted)]">
            Showing{" "}
            <span className="font-medium text-[var(--text-primary)]">
              {orders.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[var(--text-primary)]">
              {adminOrdersPagination.totalItems?.toLocaleString()}
            </span>{" "}
            orders
          </p>
          {isRefreshing && (
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Loader2 size={12} className="animate-spin" />
              Refreshing...
            </span>
          )}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <AdminOrderSkeletonList count={5} />
      ) : !hasOrders ? (
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mx-auto mb-4">
            <Inbox size={32} className="text-[var(--text-muted)]" />
          </div>
          <h2 className="text-xl font-bold font-Montserrat text-[var(--text-primary)] mb-2">
            No Orders Found
          </h2>
          <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
            {adminOrdersFilters.status ||
            adminOrdersFilters.paymentStatus ||
            adminOrdersFilters.search
              ? "No orders match your current filters. Try adjusting or clearing your filters."
              : "There are no orders in the system yet. Orders will appear here once customers start placing them."}
          </p>
          {(adminOrdersFilters.status ||
            adminOrdersFilters.paymentStatus ||
            adminOrdersFilters.search) && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--primary-600)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--primary-700)] transition-colors font-medium text-sm"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <AdminOrderList
            orders={orders}
            onViewOrder={handleViewOrder}
            onStatusUpdate={handleStatusUpdate}
            loadingMutation={loadingMutation}
          />

          {/* Pagination */}
          {adminOrdersPagination.totalPages > 1 && (
            <div className="mt-6">
              <AdminOrderPagination
                pagination={adminOrdersPagination}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default AdminOrdersPage;
