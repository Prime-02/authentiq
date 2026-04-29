import { useEffect, useState } from "react";
import { useReviewStore } from "@/stores";
import { Star, Loader2, User } from "lucide-react";
import { toast } from "react-toastify";

const ProductReviews = ({ productId }) => {
  const {
    reviews,
    productRating,
    currentReview,
    loading,
    fetchProductReviews,
    fetchProductRatingSummary,
    submitReview,
    deleteMyReview,
    fetchReview,
  } = useReviewStore();

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // Fetch reviews and rating summary on mount
  useEffect(() => {
    if (productId) {
      fetchProductReviews(productId, { page: 1, perPage: 50 });
      fetchProductRatingSummary(productId);
    }
  }, [productId, fetchProductReviews, fetchProductRatingSummary]);

  // Handle submitting a new review or updating existing
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!productId) return;

    setIsSubmitting(true);
    try {
      await submitReview(productId, {
        rating: newRating,
        comment: newComment || undefined,
      });
      // Reset form
      setNewComment("");
      setNewRating(5);
      setShowReviewForm(false);
      setEditingReview(null);

      // Refresh reviews and rating summary
      await fetchProductReviews(productId, { page: 1, perPage: 50 });
      await fetchProductRatingSummary(productId);
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle editing an existing review
  const handleEditReview = (review) => {
    setEditingReview(review);
    setNewRating(review.rating);
    setNewComment(review.comment || "");
    setShowReviewForm(true);
    window.scrollTo({
      top: document.querySelector("form")?.offsetTop - 20,
      behavior: "smooth",
    });
  };

  // Handle deleting a review
  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete your review?")) return;

    try {
      await deleteMyReview(reviewId);
      toast.success("Review deleted successfully");

      // Refresh reviews and rating summary
      await fetchProductReviews(productId, { page: 1, perPage: 50 });
      await fetchProductRatingSummary(productId);
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  // Render stars for rating display
  const renderStars = (rating, size = 16) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={size}
        className={`${
          index < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
        style={{
          color: index < rating ? "var(--warning-500)" : "var(--border-color)",
          fill: index < rating ? "var(--warning-500)" : "none",
        }}
      />
    ));
  };

  // Render clickable stars for rating input
  const renderStarInput = () => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setNewRating(index + 1)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              size={24}
              style={{
                color:
                  index < newRating
                    ? "var(--warning-500)"
                    : "var(--border-color)",
                fill: index < newRating ? "var(--warning-500)" : "none",
              }}
              className="transition-colors hover:text-yellow-400"
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading && reviews.length === 0) {
    return (
      <div
        className="mt-12 p-6 card rounded-2xl"
        style={{
          backgroundColor: "var(--bg-primary)",
          border: "1px solid var(--border-light)",
        }}
      >
        <div
          className="flex items-center justify-center gap-2"
          style={{ color: "var(--text-secondary)" }}
        >
          <Loader2 size={24} className="animate-spin" />
          <span>Loading reviews...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mt-12 p-6 card rounded-2xl"
      style={{
        backgroundColor: "var(--bg-primary)",
        border: "1px solid var(--border-light)",
      }}
    >
      <div className="flex flex-col gap-y-6">
        {/* Reviews Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Customer Reviews
            </h2>
            {productRating && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex gap-1">
                  {renderStars(Math.round(productRating.average))}
                </div>
                <span
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {productRating.average.toFixed(1)}
                </span>
                <span style={{ color: "var(--text-muted)" }}>
                  ({productRating.count}{" "}
                  {productRating.count === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setShowReviewForm(!showReviewForm);
              if (!showReviewForm) {
                setEditingReview(null);
                setNewRating(5);
                setNewComment("");
              }
            }}
            className="btn btn-primary px-4 py-2"
          >
            {showReviewForm
              ? "Cancel"
              : editingReview
                ? "Edit Review"
                : "Write a Review"}
          </button>
        </div>

        {/* Rating Distribution */}
        {productRating?.distribution && (
          <div
            className="grid grid-cols-5 gap-2 p-4 rounded-lg"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="text-center">
                <div className="flex justify-center mb-1">
                  {renderStars(star, 12)}
                </div>
                <div
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {productRating.distribution[star] || 0}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && (
          <form
            onSubmit={handleSubmitReview}
            className="pt-4"
            style={{ borderTop: "1px solid var(--border-light)" }}
          >
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {editingReview ? "Edit Your Review" : "Write Your Review"}
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Rating
                </label>
                {renderStarInput()}
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Comment (optional)
                </label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all resize-none"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-color)",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--primary-500)";
                    e.target.style.boxShadow =
                      "0 0 0 2px rgba(115, 115, 115, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-color)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : editingReview ? (
                  "Update Review"
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div
          className="pt-4"
          style={{ borderTop: "1px solid var(--border-light)" }}
        >
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <p style={{ color: "var(--text-muted)" }}>
                No reviews yet. Be the first to review this product!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 rounded-lg transition-all duration-200 hover:shadow-md"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border-light)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-hover)";
                    e.currentTarget.style.backgroundColor =
                      "var(--bg-tertiary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-light)";
                    e.currentTarget.style.backgroundColor =
                      "var(--bg-secondary)";
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "var(--bg-tertiary)" }}
                      >
                        <User
                          size={20}
                          style={{ color: "var(--text-secondary)" }}
                        />
                      </div>
                      <div>
                        <p
                          className="font-semibold text-sm"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {review.user?.firstname
                            ? `${review.user.firstname} ${review.user.lastname || ""}`
                            : "Anonymous"}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {renderStars(review.rating, 14)}
                    </div>
                  </div>

                  {review.comment && (
                    <p
                      className="text-sm mt-2 leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {review.comment}
                    </p>
                  )}

                  {/* Edit/Delete buttons */}
                  <div
                    className="flex gap-3 mt-3 pt-3"
                    style={{ borderTop: "1px solid var(--border-light)" }}
                  >
                    <button
                      onClick={() => handleEditReview(review)}
                      className="text-xs font-medium transition-colors duration-200"
                      style={{ color: "var(--text-muted)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--primary-600)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--text-muted)")
                      }
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-xs font-medium transition-colors duration-200"
                      style={{ color: "var(--error-500)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--error-600)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--error-500)")
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
