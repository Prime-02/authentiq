// app/admin/orders/statistics/page.jsx
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useOrderStore } from "@/stores";
import { useAuthStore } from "@/stores";
import {
  BarChart3,
  Loader2,
  ArrowLeft,
  Package,
  DollarSign,
  Users,
  ShoppingBag,
  Truck,
  CreditCard,
  Tag,
  LayoutDashboard,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";

import StatCard from "./components/StatCard";
import RevenueChart from "./components/RevenueChart";
import TopCustomersList from "./components/TopCustomersList";
import PopularProductsList from "./components/PopularProductsList";
import FulfillmentMetrics from "./components/FulfillmentMetrics";
import PaymentAnalysis from "./components/PaymentAnalysis";
import CategoryRevenue from "./components/CategoryRevenue";
import TabButton from "./components/TabButton";
import LoadingScreen from "./components/LoadingScreen";
import SkeletonCard, {
  SkeletonRow,
  SkeletonChart,
} from "./components/SkeletonCard";
import { useRouter } from "next/navigation";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "revenue", label: "Revenue Trend", icon: TrendingUp },
  { id: "customers", label: "Top Customers", icon: Users },
  { id: "products", label: "Popular Products", icon: ShoppingBag },
  { id: "fulfillment", label: "Fulfillment", icon: Truck },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "categories", label: "Categories", icon: Tag },
];

const AdminOrderStatisticsPage = () => {
  const {
    loadingStats,
    fetchOrdersSummary,
    fetchRevenueTrend,
    fetchTopCustomers,
    fetchPopularProducts,
    fetchFulfillmentMetrics,
    fetchPaymentAnalysis,
    fetchCategoryRevenue,
  } = useOrderStore();

  const router = useRouter();

  const { isAdmin } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [days, setDays] = useState(30);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Data states
  const [summary, setSummary] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [fulfillmentMetrics, setFulfillmentMetrics] = useState(null);
  const [paymentAnalysis, setPaymentAnalysis] = useState(null);
  const [categoryRevenue, setCategoryRevenue] = useState([]);

  const loadStatistics = useCallback(async () => {
    setError(null);
    try {
      const [
        summaryData,
        revenueData,
        customersData,
        productsData,
        metricsData,
        paymentData,
        categoryData,
      ] = await Promise.all([
        fetchOrdersSummary({ days }).catch((err) => {
          console.error("Error fetching orders summary:", err);
          return null;
        }),
        fetchRevenueTrend({ period: "daily", days }).catch((err) => {
          console.error("Error fetching revenue trend:", err);
          return { trend: [] };
        }),
        fetchTopCustomers({ limit: 10, days }).catch((err) => {
          console.error("Error fetching top customers:", err);
          return { customers: [] };
        }),
        fetchPopularProducts({ limit: 10, days }).catch((err) => {
          console.error("Error fetching popular products:", err);
          return { products: [] };
        }),
        fetchFulfillmentMetrics(days).catch((err) => {
          console.error("Error fetching fulfillment metrics:", err);
          return { metrics: null };
        }),
        fetchPaymentAnalysis(days).catch((err) => {
          console.error("Error fetching payment analysis:", err);
          return null;
        }),
        fetchCategoryRevenue({ days }).catch((err) => {
          console.error("Error fetching category revenue:", err);
          return { revenue_share: [] };
        }),
      ]);

      setSummary(summaryData);
      setRevenueTrend(
        Array.isArray(revenueData?.trend) ? revenueData.trend : [],
      );
      setTopCustomers(
        Array.isArray(customersData?.customers) ? customersData.customers : [],
      );
      setPopularProducts(
        Array.isArray(productsData?.products) ? productsData.products : [],
      );
      setFulfillmentMetrics(metricsData?.metrics || null);
      setPaymentAnalysis(paymentData);
      setCategoryRevenue(
        Array.isArray(categoryData?.revenue_share)
          ? categoryData.revenue_share
          : [],
      );
    } catch (err) {
      console.error("Failed to load statistics:", err);
      setError("Failed to load order statistics. Please try again.");
    } finally {
      setIsInitialLoad(false);
    }
  }, [
    days,
    fetchOrdersSummary,
    fetchRevenueTrend,
    fetchTopCustomers,
    fetchPopularProducts,
    fetchFulfillmentMetrics,
    fetchPaymentAnalysis,
    fetchCategoryRevenue,
  ]);

  useEffect(() => {
    if (isAdmin) {
      loadStatistics();
    }
  }, [isAdmin, days, loadStatistics]);

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "₦0";
    return `₦${Number(value).toLocaleString("en-NG")}`;
  };

  const formatNumber = (value, defaultValue = 0) => {
    if (value === null || value === undefined) return defaultValue;
    return Number(value).toLocaleString();
  };

  if (!isAdmin) {
    return (
      <main className="w-full text-center py-20">
        <Package size={64} className="text-[var(--text-muted)] mx-auto mb-4" />
        <h1 className="text-2xl font-bold font-Montserrat text-[var(--text-primary)] mb-2">
          Access Denied
        </h1>
        <p className="text-[var(--text-secondary)]">
          You don't have permission to access this page.
        </p>
      </main>
    );
  }

  // Full loading screen for initial load
  if (isInitialLoad && loadingStats) {
    return (
      <main className="w-full">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 animate-pulse">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-[var(--bg-tertiary)] rounded" />
            <div className="h-10 w-64 bg-[var(--bg-tertiary)] rounded" />
            <div className="h-4 w-48 bg-[var(--bg-tertiary)] rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-10 bg-[var(--bg-tertiary)] rounded-lg" />
            <div className="h-10 w-32 bg-[var(--bg-tertiary)] rounded-lg" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-2 mb-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-28 bg-[var(--bg-tertiary)] rounded-lg"
            />
          ))}
        </div>

        <LoadingScreen
          message="Loading order statistics"
          submessage={`Fetching data for the last ${days} days...`}
        />
      </main>
    );
  }

  const summaryCards = summary
    ? [
        {
          icon: Package,
          label: "Total Orders",
          value: formatNumber(summary.total_orders),
          color: "text-[var(--primary-600)]",
          bgColor: "bg-[var(--primary-100)]",
        },
        {
          icon: DollarSign,
          label: "Total Revenue",
          value: formatCurrency(summary.financial_metrics?.total_revenue),
          color: "text-[var(--success-600)]",
          bgColor: "bg-[var(--success-100)]",
        },
        {
          icon: DollarSign,
          label: "Avg Order Value",
          value: formatCurrency(summary.financial_metrics?.average_order_value),
          color: "text-[var(--info-600)]",
          bgColor: "bg-[var(--info-100)]",
        },
        {
          icon: ShoppingBag,
          label: "Items Sold",
          value: formatNumber(summary.total_items_sold),
          color: "text-[var(--warning-600)]",
          bgColor: "bg-[var(--warning-100)]",
        },
      ]
    : [];

  const renderTabContent = () => {
    // Show skeletons when refreshing data (not initial load)
    if (loadingStats && !isInitialLoad) {
      switch (activeTab) {
        case "overview":
          return (
            <div className="space-y-6 animate-pulse">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
                  <div className="h-6 w-32 bg-[var(--bg-tertiary)] rounded mb-4" />
                  <SkeletonChart />
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
                  <div className="h-6 w-32 bg-[var(--bg-tertiary)] rounded mb-4" />
                  <SkeletonRow lines={5} />
                </div>
              </div>
            </div>
          );
        case "revenue":
          return (
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
              <SkeletonChart />
            </div>
          );
        case "customers":
        case "products":
          return (
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
              <SkeletonRow lines={8} />
            </div>
          );
        default:
          return (
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6 space-y-4 animate-pulse">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-[var(--bg-tertiary)] rounded-xl"
                  />
                ))}
              </div>
              <div className="h-48 bg-[var(--bg-tertiary)] rounded-xl" />
            </div>
          );
      }
    }

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {summary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {summaryCards.map((card, i) => (
                  <StatCard key={i} {...card} />
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
                <h3 className="text-lg font-bold font-Montserrat text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-[var(--info-600)]" />
                  Revenue Trend
                </h3>
                <RevenueChart data={revenueTrend.slice(-14)} />
              </div>
              <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
                <h3 className="text-lg font-bold font-Montserrat text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <Users size={20} className="text-[var(--primary-600)]" />
                  Top Customers
                </h3>
                <TopCustomersList customers={topCustomers.slice(0, 5)} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
                <h3 className="text-lg font-bold font-Montserrat text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-[var(--success-600)]" />
                  Payment Overview
                </h3>
                <PaymentAnalysis data={paymentAnalysis} />
              </div>
              <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
                <h3 className="text-lg font-bold font-Montserrat text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <Truck size={20} className="text-[var(--warning-600)]" />
                  Fulfillment Overview
                </h3>
                <FulfillmentMetrics metrics={fulfillmentMetrics} />
              </div>
            </div>
          </div>
        );

      case "revenue":
        return (
          <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
            <RevenueChart data={revenueTrend} />
          </div>
        );

      case "customers":
        return (
          <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
            <TopCustomersList customers={topCustomers} />
          </div>
        );

      case "products":
        return (
          <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
            <PopularProductsList products={popularProducts} />
          </div>
        );

      case "fulfillment":
        return (
          <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
            <FulfillmentMetrics metrics={fulfillmentMetrics} />
          </div>
        );

      case "payments":
        return (
          <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
            <PaymentAnalysis data={paymentAnalysis} />
          </div>
        );

      case "categories":
        return (
          <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6">
            <CategoryRevenue data={categoryRevenue} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--primary-600)] mb-2 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </button>
          <h1 className="text-3xl md:text-4xl font-bold font-Montserrat text-[var(--text-primary)]">
            Order Statistics
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Analytics and insights for the last {days} days
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadStatistics}
            className="p-2.5 rounded-lg border border-[var(--border-light)] hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] transition-colors disabled:opacity-50"
            disabled={loadingStats}
            title="Refresh data"
          >
            <Loader2 size={16} className={loadingStats ? "animate-spin" : ""} />
          </button>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-500)]"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-[var(--error-50)] border border-[var(--error-200)] rounded-xl flex items-start gap-3">
          <Loader2
            size={20}
            className="text-[var(--error-600)] flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="text-sm text-[var(--error-800)]">{error}</p>
            <button
              onClick={loadStatistics}
              className="text-sm text-[var(--error-600)] underline mt-1 hover:text-[var(--error-700)]"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {TABS.map((tab) => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            icon={tab.icon}
            label={tab.label}
          />
        ))}
      </div>

      {/* Content */}
      {renderTabContent()}

      {/* Empty State */}
      {!loadingStats && !summary && !error && (
        <div className="text-center py-12">
          <BarChart3
            size={48}
            className="text-[var(--border-color)] mx-auto mb-4"
          />
          <p className="text-[var(--text-secondary)]">
            No statistics available for the selected period.
          </p>
        </div>
      )}
    </main>
  );
};

export default AdminOrderStatisticsPage;
