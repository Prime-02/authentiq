// pages/admin/reviews/components/ReviewDetailsModal.js
import {
  X,
  Star,
  User,
  Package,
  Calendar,
  MessageSquare,
  Edit,
  Trash2,
} from "lucide-react";

export default function ReviewDetailsModal({
  review,
  onClose,
  onEdit,
  onDelete,
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${index < rating ? "fill-current" : ""}`}
        style={{
          color: index < rating ? "var(--warning-500)" : "var(--border-color)",
        }}
      />
    ));
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
        className="relative w-full max-w-2xl rounded-xl shadow-2xl border overflow-hidden"
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
            Review Details
          </h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-icon">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Rating */}
          <div className="flex items-center gap-3">
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Rating:
            </span>
            <div className="flex items-center gap-1">
              {renderStars(review.rating)}
            </div>
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {review.rating}/5
            </span>
          </div>

          {/* Comment */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare
                className="w-4 h-4"
                style={{ color: "var(--text-muted)" }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Comment
              </span>
            </div>
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-light)",
              }}
            >
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-primary)" }}
              >
                {review.comment || "No comment provided"}
              </p>
            </div>
          </div>

          {/* Product Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Package
                className="w-5 h-5"
                style={{ color: "var(--text-muted)" }}
              />
              <div>
                <p
                  className="text-xs font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  Product
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {review.product?.name || "Unknown Product"}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  ID: {review.product_id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User
                className="w-5 h-5"
                style={{ color: "var(--text-muted)" }}
              />
              <div>
                <p
                  className="text-xs font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  Reviewer
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {review.user?.name || "Unknown User"}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  ID: {review.user_id}
                </p>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-3">
            <Calendar
              className="w-5 h-5"
              style={{ color: "var(--text-muted)" }}
            />
            <div>
              <p
                className="text-xs font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Submitted
              </p>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {formatDate(review.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 p-6 border-t"
          style={{ borderColor: "var(--border-light)" }}
        >
          <button onClick={onDelete} className="btn btn-danger btn-sm">
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button onClick={onEdit} className="btn btn-primary btn-sm">
            <Edit className="w-4 h-4" />
            Edit Review
          </button>
        </div>
      </div>
    </div>
  );
}
