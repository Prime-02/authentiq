// pages/admin/reviews/components/EditReviewModal.js
import { useState } from "react";
import { X, Star, Save } from "lucide-react";
import { useReviewStore } from "@/stores/useReviewStore";

export default function EditReviewModal({ review, onClose, onSuccess }) {
  const { adminUpdateReview } = useReviewStore();
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment || "");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await adminUpdateReview(review.id, { rating, comment });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update review");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isFilled = starNumber <= (hoveredStar || rating);

      return (
        <button
          key={index}
          type="button"
          onClick={() => setRating(starNumber)}
          onMouseEnter={() => setHoveredStar(starNumber)}
          onMouseLeave={() => setHoveredStar(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-8 h-8 ${isFilled ? "fill-current" : ""}`}
            style={{
              color: isFilled ? "var(--warning-500)" : "var(--border-color)",
              transition: "color 0.2s",
            }}
          />
        </button>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg rounded-xl shadow-2xl border overflow-hidden"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: "var(--border-light)" }}
        >
          <h2
            className="text-xl font-bold font-Montserrat"
            style={{ color: "var(--text-primary)" }}
          >
            Edit Review
          </h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-icon">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error */}
          {error && (
            <div
              className="p-3 rounded-lg text-sm"
              style={{
                backgroundColor: "var(--error-50)",
                color: "var(--error-700)",
                border: "1px solid var(--error-200)",
              }}
            >
              {error}
            </div>
          )}

          {/* Rating */}
          <div>
            <label
              className="block text-sm font-medium mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Rating
            </label>
            <div className="flex items-center gap-1">{renderStars()}</div>
            <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
              {rating > 0 ? `${rating} out of 5 stars` : "Select a rating"}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Write your review comment..."
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 resize-none transition-all"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            />
            <div className="flex justify-between mt-1">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {comment.length} characters
              </p>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end gap-3 pt-4 border-t"
            style={{ borderColor: "var(--border-light)" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline btn-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="btn btn-primary btn-sm"
            >
              {loading ? (
                <>
                  <span className="btn-loading" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
