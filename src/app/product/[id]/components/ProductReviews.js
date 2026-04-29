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
      // Pass pagination params - default to page 1, 50 per page
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
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
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
            className="focus:outline-none"
          >
            <Star
              size={24}
              className={`transition-colors ${
                index < newRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-yellow-400"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="mt-12 p-6 card rounded-2xl">
        <div className="flex items-center justify-center gap-2">
          <Loader2 size={24} className="animate-spin" />
          <span>Loading reviews...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 p-6 card rounded-2xl">
      <div className="flex flex-col gap-y-6">
        {/* Reviews Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            {productRating && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex gap-1">
                  {renderStars(Math.round(productRating.average))}
                </div>
                <span className="text-lg font-semibold">
                  {productRating.average.toFixed(1)}
                </span>
                <span className="text-gray-500">
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
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
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
          <div className="grid grid-cols-5 gap-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="text-center">
                <div className="flex justify-center mb-1">
                  {renderStars(star, 12)}
                </div>
                <div className="text-sm text-gray-600">
                  {productRating.distribution[star] || 0}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">
              {editingReview ? "Edit Your Review" : "Write Your Review"}
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                {renderStarInput()}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Comment (optional)
                </label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        <div className="border-t pt-4">
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No reviews yet. Be the first to review this product!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {review.user?.firstname
                            ? `${review.user.firstname} ${review.user.lastname || ""}`
                            : "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {renderStars(review.rating, 14)}
                    </div>
                  </div>

                  {review.comment && (
                    <p className="text-gray-600 text-sm mt-2">
                      {review.comment}
                    </p>
                  )}

                  {/* Edit/Delete buttons - Only show for the review owner */}
                  {/* In a real app, you'd compare with current user ID */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors"
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
