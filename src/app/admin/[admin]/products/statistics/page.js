"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useProductStore } from "@/stores/useProductStore";
import {
  BarChart3,
  TrendingUp,
  Package,
  Star,
  AlertTriangle,
  DollarSign,
  RefreshCw,
  Filter,
  Search,
  ArrowLeft,
  Loader2,
  Loader,
} from "lucide-react";
import SummaryCards from "./components/SummaryCards";
import LowStockAlert from "./components/LowStockAlert";
import CategoryDistribution from "./components/CategoryDistribution";
import TopRatedProducts from "./components/TopRatedProducts";
import BestSellingProducts from "./components/BestSellingProducts";
import PriceRangeChart from "./components/PriceRangeChart";
import NewArrivals from "./components/NewArrivals";
import ProductPerformanceModal from "./components/ProductPerformanceModal";
import StatsFilterBar from "./components/StatsFilterBar";
import { useRouter } from "next/navigation";

export default function ProductStatisticsPage() {
  const {
    fetchProductsSummary,
    fetchLowStockProducts,
    fetchOutOfStockProducts,
    fetchCategoryDistribution,
    fetchTopRatedProducts,
    fetchProductsWithoutBarcodes,
    fetchPriceRangeDistribution,
    fetchNewProducts,
    fetchProductPerformance,
    fetchBestSellingProducts,
    loadingProducts,
  } = useProductStore();

  const router = useRouter();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category_id: null,
    days: 30,
    threshold: 10,
    min_reviews: 1,
    include_inactive: false,
  });

  // Data states
  const [summaryData, setSummaryData] = useState(null);
  const [lowStockData, setLowStockData] = useState(null);
  const [outOfStockData, setOutOfStockData] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [topRatedData, setTopRatedData] = useState(null);
  const [barcodelessData, setBarcodelessData] = useState(null);
  const [priceRangeData, setPriceRangeData] = useState([]);
  const [newProductsData, setNewProductsData] = useState(null);
  const [bestSellingData, setBestSellingData] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);

  const loadAllStats = useCallback(async () => {
    setLoading(true);
    try {
      const [
        summary,
        lowStock,
        outOfStock,
        categories,
        topRated,
        barcodeless,
        priceRange,
        newProducts,
        bestSelling,
      ] = await Promise.all([
        fetchProductsSummary(filters.category_id),
        fetchLowStockProducts({
          threshold: filters.threshold,
          includeInactive: filters.include_inactive,
          limit: 50,
        }),
        fetchOutOfStockProducts(filters.include_inactive),
        fetchCategoryDistribution(filters.include_inactive),
        fetchTopRatedProducts({
          limit: 10,
          minReviews: filters.min_reviews,
        }),
        fetchProductsWithoutBarcodes(100),
        fetchPriceRangeDistribution(filters.include_inactive),
        fetchNewProducts({ days: filters.days, limit: 50 }),
        fetchBestSellingProducts({
          limit: 10,
          days: filters.days,
          categoryId: filters.category_id,
        }),
      ]);

      setSummaryData(summary);
      setLowStockData(lowStock);
      setOutOfStockData(outOfStock);
      setCategoryData(categories || []);
      setTopRatedData(topRated);
      setBarcodelessData(barcodeless);
      setPriceRangeData(priceRange || []);
      setNewProductsData(newProducts);
      setBestSellingData(bestSelling);
    } catch (error) {
      console.error("Failed to load statistics:", error);
    } finally {
      setLoading(false);
    }
  }, [
    filters,
    fetchProductsSummary,
    fetchLowStockProducts,
    fetchOutOfStockProducts,
    fetchCategoryDistribution,
    fetchTopRatedProducts,
    fetchProductsWithoutBarcodes,
    fetchPriceRangeDistribution,
    fetchNewProducts,
    fetchBestSellingProducts,
  ]);

  useEffect(() => {
    loadAllStats();
  }, [loadAllStats]);

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setShowPerformanceModal(true);
  };

  const handleRefresh = () => {
    loadAllStats();
  };

  const handleBackToProducts = () => {
    router.back();
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "sales", label: "Sales", icon: TrendingUp },
    { id: "ratings", label: "Ratings", icon: Star },
    { id: "insights", label: "Insights", icon: Search },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1
              className="text-3xl font-bold font-Montserrat"
              style={{ color: "var(--text-primary)" }}
            >
              Product Statistics
            </h1>
            <p
              className="mt-2 font-Poppins"
              style={{ color: "var(--text-muted)" }}
            >
              Comprehensive analytics and insights for your product catalog
            </p>
          </div>
          <div className="flex items-center gap-x-3">
            <button
              onClick={handleBackToProducts}
              disabled={loading}
              className="btn btn-link btn-md"
              title="Refresh statistics"
            >
              <ArrowLeft className={`w-4 h-4`} />
              Back To Products
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="btn btn-secondary btn-md"
              title="Refresh statistics"
            >
              <Loader2 className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <StatsFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        loading={loading}
      />

      {/* Tab Navigation */}
      <div
        className="flex gap-1 mb-8 mt-6 p-1 rounded-lg"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-md font-Poppins text-sm font-medium transition-all duration-200 flex-1 justify-center"
              style={{
                backgroundColor:
                  activeTab === tab.id ? "var(--bg-primary)" : "transparent",
                color:
                  activeTab === tab.id
                    ? "var(--text-primary)"
                    : "var(--text-muted)",
                boxShadow:
                  activeTab === tab.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {loading && !summaryData && (
        <div className="flex items-center justify-center py-20">
          <Loader
            size={100}
            className=" animate-spin"
            style={{ color: "var(--primary-500)" }}
          />
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Summary Cards */}
          {summaryData && <SummaryCards summary={summaryData} />}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {lowStockData && (
              <LowStockAlert
                lowStock={lowStockData}
                outOfStock={outOfStockData}
                threshold={filters.threshold}
                onProductClick={handleProductClick}
              />
            )}
            {newProductsData && (
              <NewArrivals
                data={newProductsData}
                onProductClick={handleProductClick}
              />
            )}
          </div>

          {/* Category Distribution - Full Width */}
          {categoryData.length > 0 && (
            <CategoryDistribution data={categoryData} />
          )}
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === "inventory" && (
        <div className="space-y-8">
          {/* Low Stock + Out of Stock */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {lowStockData && (
              <LowStockAlert
                lowStock={lowStockData}
                outOfStock={outOfStockData}
                threshold={filters.threshold}
                onProductClick={handleProductClick}
                detailed
              />
            )}
            {barcodelessData && (
              <div
                className="card rounded-xl p-6 border"
                style={{ borderColor: "var(--border-color)" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: "var(--warning-100)" }}
                  >
                    <AlertTriangle
                      className="w-5 h-5"
                      style={{ color: "var(--warning-600)" }}
                    />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold font-Montserrat"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Missing Barcodes
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {barcodelessData.count} products without barcodes
                    </p>
                  </div>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {barcodelessData.products.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: "var(--bg-secondary)" }}
                      onClick={() => handleProductClick(product.id)}
                    >
                      <span
                        className="text-sm font-medium truncate flex-1"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {product.name}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Stock: {product.stock_quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Price Range Distribution */}
          {priceRangeData.length > 0 && (
            <PriceRangeChart data={priceRangeData} />
          )}
        </div>
      )}

      {/* Sales Tab */}
      {activeTab === "sales" && (
        <div className="space-y-8">
          {bestSellingData && (
            <BestSellingProducts
              data={bestSellingData}
              days={filters.days}
              onProductClick={handleProductClick}
            />
          )}

          {/* Performance Metrics CTA */}
          <div
            className="card rounded-xl p-8 border text-center"
            style={{ borderColor: "var(--primary-200)" }}
          >
            <DollarSign
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "var(--primary-500)" }}
            />
            <h3
              className="text-xl font-semibold mb-2 font-Montserrat"
              style={{ color: "var(--text-primary)" }}
            >
              Product Performance Analysis
            </h3>
            <p className="mb-6" style={{ color: "var(--text-muted)" }}>
              Click on any product to view detailed performance metrics
              including revenue, sales velocity, and customer ratings.
            </p>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ backgroundColor: "var(--primary-100)" }}
            >
              <Search
                className="w-4 h-4"
                style={{ color: "var(--primary-600)" }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: "var(--primary-700)" }}
              >
                Click products in lists to analyze
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Ratings Tab */}
      {activeTab === "ratings" && (
        <div className="space-y-8">
          {topRatedData && (
            <TopRatedProducts
              data={topRatedData}
              minReviews={filters.min_reviews}
              onProductClick={handleProductClick}
            />
          )}
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === "insights" && (
        <div className="space-y-8">
          {/* Combined Insights View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {priceRangeData.length > 0 && (
              <PriceRangeChart data={priceRangeData} />
            )}
            {categoryData.length > 0 && (
              <CategoryDistribution data={categoryData} compact />
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              className="card rounded-xl p-4 border text-center"
              style={{ borderColor: "var(--border-color)" }}
            >
              <p
                className="text-2xl font-bold font-Montserrat"
                style={{ color: "var(--info-600)" }}
              >
                {summaryData?.total_products || 0}
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                Total Products
              </p>
            </div>
            <div
              className="card rounded-xl p-4 border text-center"
              style={{ borderColor: "var(--border-color)" }}
            >
              <p
                className="text-2xl font-bold font-Montserrat"
                style={{ color: "var(--warning-600)" }}
              >
                {lowStockData?.count || 0}
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                Low Stock Items
              </p>
            </div>
            <div
              className="card rounded-xl p-4 border text-center"
              style={{ borderColor: "var(--border-color)" }}
            >
              <p
                className="text-2xl font-bold font-Montserrat"
                style={{ color: "var(--success-600)" }}
              >
                {topRatedData?.products?.length || 0}
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                Top Rated
              </p>
            </div>
            <div
              className="card rounded-xl p-4 border text-center"
              style={{ borderColor: "var(--border-color)" }}
            >
              <p
                className="text-2xl font-bold font-Montserrat"
                style={{ color: "var(--error-600)" }}
              >
                {outOfStockData?.count || 0}
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                Out of Stock
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Product Performance Modal */}
      {showPerformanceModal && selectedProductId && (
        <ProductPerformanceModal
          productId={selectedProductId}
          onClose={() => {
            setShowPerformanceModal(false);
            setSelectedProductId(null);
          }}
          fetchPerformance={fetchProductPerformance}
        />
      )}
    </div>
  );
}
