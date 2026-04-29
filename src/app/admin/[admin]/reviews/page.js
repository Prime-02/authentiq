"use client";
// pages/admin/reviews/index.js
import { useState, useEffect } from "react";
import { useReviewStore } from "@/stores/useReviewStore";
import ReviewStats from "./components/ReviewStats";
import ReviewFilters from "./components/ReviewFilters";
import ReviewTable from "./components/ReviewTable";
import ReviewDetailsModal from "./components/ReviewDetailsModal";
import EditReviewModal from "./components/EditReviewModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import Pagination from "./components/Pagination";
import LoadingSpinner from "./components/LoadingSpinner";
import EmptyState from "./components/EmptyState";
import Header from "./components/Header";
import {
  Star,
  MessageSquare,
  Users,
  TrendingUp,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function AdminReviewsPage() {
  const {
    reviews,
    totalCount,
    loading,
    error,
    pagination,
    currentReview,
    adminFetchAllReviews,
    adminFetchProductReviews,
    adminFetchUserReviews,
    adminDeleteReview,
    clearCurrentReview,
    resetStore,
  } = useReviewStore();

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [filters, setFilters] = useState({
    productId: "",
    userId: "",
    rating: "",
    searchTerm: "",
  });
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    fiveStarCount: 0,
    totalProducts: 0,
  });

  // Fetch reviews on mount and when filters/pagination change
  useEffect(() => {
    loadReviews();
  }, [currentPage, perPage, filters.productId, filters.userId]);

  // Calculate stats whenever reviews or totalCount changes
  useEffect(() => {
    calculateStats();
  }, [reviews, totalCount]);

  const loadReviews = async () => {
    try {
      if (filters.productId) {
        await adminFetchProductReviews(filters.productId, {
          page: currentPage,
          perPage: perPage,
        });
      } else if (filters.userId) {
        // Note: adminFetchUserReviews doesn't support pagination
        // It returns ALL reviews for that user
        await adminFetchUserReviews(filters.userId);
      } else {
        await adminFetchAllReviews({
          page: currentPage,
          perPage: perPage,
        });
      }
    } catch (error) {
      console.error("Failed to load reviews:", error);
    }
  };

  const calculateStats = () => {
    // FIXED: Use totalCount from store for accurate total
    // For average and 5-star count, we can only calculate from loaded reviews
    // Consider adding a dedicated stats endpoint if you need accurate numbers
    const allReviews = reviews;
    const totalRating = allReviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0,
    );
    const fiveStars = allReviews.filter((review) => review.rating === 5).length;
    const uniqueProducts = new Set(
      allReviews.map((review) => review.product_id),
    ).size;

    setStats({
      totalReviews: totalCount, // Use store's totalCount
      averageRating:
        allReviews.length > 0
          ? (totalRating / allReviews.length).toFixed(1)
          : "0.0",
      fiveStarCount: fiveStars,
      totalProducts: uniqueProducts,
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      productId: "",
      userId: "",
      rating: "",
      searchTerm: "",
    });
    setCurrentPage(1);
  };

  const handleViewDetails = (review) => {
    setSelectedReview(review);
    setShowDetailsModal(true);
  };

  const handleEditReview = (review) => {
    setSelectedReview(review);
    setShowEditModal(true);
  };

  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedReview) {
      const success = await adminDeleteReview(selectedReview.id);
      if (success) {
        setShowDeleteModal(false);
        setSelectedReview(null);
        // Only reload if we're on the first page or it was the last item
        if (currentPage === 1 || reviews.length <= 1) {
          loadReviews();
        }
      }
    }
  };

  const handleRefresh = () => {
    loadReviews();
  };

  // Client-side filtering for rating and searchTerm
  const filteredReviews = reviews.filter((review) => {
    if (filters.rating && review.rating !== parseInt(filters.rating)) {
      return false;
    }
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesComment = review.comment
        ?.toLowerCase()
        .includes(searchLower);
      const matchesUser = review.user?.name
        ?.toLowerCase()
        .includes(searchLower);
      const matchesProduct = review.product?.name
        ?.toLowerCase()
        .includes(searchLower);
      if (!matchesComment && !matchesUser && !matchesProduct) {
        return false;
      }
    }
    return true;
  });

  if (loading && reviews.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header onRefresh={handleRefresh} />

        {/* Error Alert */}
        {error && (
          <div
            className="mb-6 p-4 rounded-lg flex items-center gap-3"
            style={{
              backgroundColor: "var(--error-50)",
              color: "var(--error-700)",
              border: "1px solid var(--error-200)",
            }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <ReviewStats stats={stats} />

        {/* Filters */}
        <ReviewFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Reviews Table */}
        {filteredReviews.length > 0 ? (
          <>
            <ReviewTable
              reviews={filteredReviews}
              onViewDetails={handleViewDetails}
              onEdit={handleEditReview}
              onDelete={handleDeleteClick}
            />

            {/* Pagination - only show for endpoints that support it */}
            {!filters.userId && (
              <Pagination
                currentPage={currentPage}
                totalPages={
                  pagination.totalPages || Math.ceil(totalCount / perPage)
                }
                perPage={perPage}
                totalItems={totalCount}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
              />
            )}
          </>
        ) : (
          !loading && <EmptyState onClearFilters={handleClearFilters} />
        )}

        {/* Modals */}
        {showDetailsModal && selectedReview && (
          <ReviewDetailsModal
            review={selectedReview}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedReview(null);
            }}
            onEdit={() => {
              setShowDetailsModal(false);
              setShowEditModal(true);
            }}
            onDelete={() => {
              setShowDetailsModal(false);
              setShowDeleteModal(true);
            }}
          />
        )}

        {showEditModal && selectedReview && (
          <EditReviewModal
            review={selectedReview}
            onClose={() => {
              setShowEditModal(false);
              setSelectedReview(null);
            }}
            onSuccess={() => {
              setShowEditModal(false);
              setSelectedReview(null);
              loadReviews();
            }}
          />
        )}

        {showDeleteModal && selectedReview && (
          <DeleteConfirmModal
            review={selectedReview}
            onConfirm={handleDeleteConfirm}
            onCancel={() => {
              setShowDeleteModal(false);
              setSelectedReview(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
